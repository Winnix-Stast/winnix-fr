import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { inscriptionsActions } from '@/core/inscriptions/actions/inscriptions-actions';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { usePermission } from '@/presentation/hooks/auth/usePermission';
import { useMyTeams } from '@/presentation/hooks/teams/useMyTeams';
import { useTeam } from '@/presentation/hooks/teams/useTeam';

export const useTournamentDetails = (id: string, router: any) => {
  const { activeRole, user } = useAuthStore();
  const { can } = usePermission();
  const { teams } = useMyTeams();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('summary');
  const [favorite, setFavorite] = useState<boolean>(false);
  const [hasSetDefaultTab, setHasSetDefaultTab] = useState(false);

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [jerseyNumbers, setJerseyNumbers] = useState<Record<string, string>>({});
  const [hasSyncPlayers, setHasSyncPlayers] = useState(false);
  const [isSavingRoster, setIsSavingRoster] = useState(false);

  const { data: edition, isLoading } = useQuery({
    queryKey: ['edition', id],
    queryFn: () => tournamentsActions.getEditionByIdAction(id),
    enabled: !!id,
  });

  const { data: inscriptions } = useQuery({
    queryKey: ['inscriptions-by-edition', id],
    queryFn: () => inscriptionsActions.getByEditionAction(id),
    enabled: !!id,
  });

  // Check if any of the user's teams is already inscribed in this edition
  const inscribedTeam = teams?.find((myTeam: any) =>
    inscriptions?.some((ins: any) => {
      const insTeamId = typeof ins.team === 'object' ? ins.team?._id : ins.team;
      return insTeamId === myTeam._id;
    }),
  );
  const inscribedTeamId = inscribedTeam?._id;
  const isAlreadyInscribed = !!inscribedTeamId;

  const { members, loadingMembers } = useTeam(inscribedTeamId || '');

  const myInscription = inscriptions?.find((ins: any) => {
    const insTeamId = typeof ins.team === 'object' ? ins.team?._id : ins.team;
    return insTeamId === inscribedTeamId;
  });

  const isCaptain = activeRole === 'captain';
  const isOrganizer =
    user &&
    edition?.tournament &&
    (edition.tournament.organizer === user.id ||
      (edition.subOrganizers && edition.subOrganizers.includes(user.id)));

  // Permission checks for scalability
  const canDirectInscribe = can('create:inscription');
  const canRequestInscribe = can('request:inscription');
  const canSponsor = can('sponsor:tournament');

  // Only show participation card if the tournament/edition status is REGISTRATION_OPEN,
  // the user is not already inscribed, and has one of the allowed participation permissions
  const showParticipation =
    !isOrganizer &&
    edition?.status === 'REGISTRATION_OPEN' &&
    !isAlreadyInscribed &&
    (canDirectInscribe || canRequestInscribe || canSponsor);

  // Synchronize default tab for captain
  useEffect(() => {
    if (isCaptain && isAlreadyInscribed && !hasSetDefaultTab) {
      setActiveTab('my_team');
      setHasSetDefaultTab(true);
    } else if (inscriptions && !hasSetDefaultTab) {
      setHasSetDefaultTab(true);
    }
  }, [isCaptain, isAlreadyInscribed, inscriptions, hasSetDefaultTab]);

  // Synchronize players already enrolled in the inscription
  useEffect(() => {
    if (myInscription?.players && !hasSyncPlayers) {
      const playerIds = myInscription.players
        .map((p: any) => {
          const tm = p.teamMembership;
          return typeof tm === 'object' ? tm?._id : tm;
        })
        .filter(Boolean);
      setSelectedPlayers(playerIds);
      setHasSyncPlayers(true);
    }
  }, [myInscription, hasSyncPlayers]);

  const handleTogglePlayer = (membershipId: string) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(membershipId)) {
        return prev.filter((id) => id !== membershipId);
      } else {
        const maxPlayers = edition?.playersPerTeam || 99;
        if (prev.length >= maxPlayers) {
          Alert.alert(
            'Límite de jugadores',
            `Este torneo permite un máximo de ${maxPlayers} jugadores por equipo.`,
          );
          return prev;
        }
        return [...prev, membershipId];
      }
    });
  };

  const handleJerseyNumberChange = (membershipId: string, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '').slice(0, 3);
    setJerseyNumbers((prev) => ({ ...prev, [membershipId]: cleanVal }));
  };

  const handleSaveRoster = async () => {
    if (!myInscription) return;
    setIsSavingRoster(true);
    try {
      const updatedInscription = await inscriptionsActions.updateInscriptionAction(
        myInscription._id,
        {
          players: selectedPlayers,
        },
      );
      Alert.alert(
        'Plantilla Guardada',
        'Los jugadores participantes han sido confirmados exitosamente.',
      );

      if (updatedInscription?.players) {
        const playerIds = updatedInscription.players
          .map((p: any) => {
            const tm = p.teamMembership;
            return typeof tm === 'object' ? tm?._id : tm;
          })
          .filter(Boolean);
        setSelectedPlayers(playerIds);
      }

      await queryClient.invalidateQueries({ queryKey: ['inscriptions-by-edition', id] });
      await queryClient.invalidateQueries({ queryKey: ['edition', id] });
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'No se pudo guardar la plantilla de jugadores.',
      );
    } finally {
      setIsSavingRoster(false);
    }
  };

  const inscribeTeam = async (team: any) => {
    try {
      await inscriptionsActions.createInscriptionAction({
        team: team._id,
        tournamentEdition: id,
      });
      Alert.alert(
        '¡Inscripción exitosa!',
        `Tu equipo ${team.name} ha sido inscrito exitosamente. Recuerda inscribir a los jugadores que participarán desde la pestaña "Mi Equipo".`,
      );
      queryClient.invalidateQueries({ queryKey: ['edition', id] });
      queryClient.invalidateQueries({ queryKey: ['inscriptions-by-edition', id] });
      queryClient.invalidateQueries({ queryKey: ['my-inscriptions'] });
    } catch (error: any) {
      Alert.alert(
        'Error de inscripción',
        error?.response?.data?.message || 'Ocurrió un problema, intenta más tarde.',
      );
    }
  };

  const handleSaveFavorite = () => {
    setFavorite(!favorite);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleChangeView = (view: string) => {
    setActiveTab(view);
  };

  const handleDirectInscribe = () => {
    if (!teams || teams.length === 0) {
      Alert.alert(
        'Sin equipos',
        'No tienes equipos creados. Por favor, crea un equipo primero.',
      );
      return;
    }

    if (teams.length === 1) {
      Alert.alert(
        'Confirmar Inscripción',
        `¿Deseas inscribir al equipo ${teams[0].name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => inscribeTeam(teams[0]) },
        ],
      );
    } else {
      const buttons = teams.slice(0, 3).map((t: any) => ({
        text: t.name,
        onPress: () => inscribeTeam(t),
      }));
      buttons.push({ text: 'Cancelar', style: 'cancel' } as any);

      Alert.alert('Seleccionar equipo', '¿Con qué equipo deseas inscribirte?', buttons);
    }
  };

  const handleRequestInscribe = () => {
    Alert.alert(
      'Solicitar inscripción',
      'Función de solicitud para jugadores próximamente disponible.',
    );
  };

  const handleSponsorAction = () => {
    Alert.alert('Patrocinar Torneo', 'Función de patrocinio próximamente disponible.');
  };

  const handleParticipationAction = () => {
    if (canDirectInscribe) {
      handleDirectInscribe();
    } else if (canRequestInscribe) {
      handleRequestInscribe();
    } else if (canSponsor) {
      handleSponsorAction();
    }
  };

  const getParticipationProps = () => {
    if (canDirectInscribe) {
      return {
        title: '¡ÚNETE AL TORNEO!',
        subtitle: 'Las inscripciones se encuentran abiertas por tiempo limitado.',
        buttonText: 'INSCRIBIRSE AHORA',
        iconName: 'person-add-outline' as const,
      };
    }
    if (canRequestInscribe) {
      return {
        title: 'SOLICITAR INSCRIBIRSE',
        subtitle: 'Elige un equipo para enviar la solicitud de inscripción a su capitán.',
        buttonText: 'ENVIAR SOLICITUD',
        iconName: 'mail-outline' as const,
      };
    }
    if (canSponsor) {
      return {
        title: 'PATROCINAR TORNEO',
        subtitle: 'Apoya el torneo y destaca tu marca ante los competidores.',
        buttonText: 'PATROCINAR',
        iconName: 'ribbon-outline' as const,
      };
    }
    return {};
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const startDate = edition ? formatDate(edition.startDate) : '';
  const endDate = edition
    ? edition.endDate
      ? formatDate(edition.endDate)
      : 'Sin definir'
    : '';

  const statusMap: Record<string, string> = {
    DRAFT: 'Borrador',
    REGISTRATION_OPEN: 'Inscripciones Abiertas',
    ACTIVE: 'En curso',
    FINISHED: 'Finalizado',
  };

  const tournamentData = edition
    ? {
        id: edition._id,
        title: edition.seasonName || 'Edición',
        state: edition.status || 'DRAFT',
        dateText: `${startDate} — ${endDate}`,
        image: edition.tournament?.logo
          ? { uri: edition.tournament.logo }
          : edition.image
            ? { uri: edition.image }
            : require('@/assets/images/imgT.jpg'),
      }
    : null;

  const statsData = [
    { label: 'Encuentros jugados', value: '12 / 63' },
    { label: 'Goles anotados', value: 120 },
    { label: 'Jugador destacado', value: 'Juan Pérez' },
    { label: 'Avance del torneo', value: '20%' },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'match' as const,
      title: 'Thunder vs Ciber',
      subtitle: 'Partida finalizada',
    },
    {
      id: '2',
      type: 'team' as const,
      title: 'Nuevo equipo registrado: Phoenix Rising',
      subtitle: 'Hace 1 hora',
    },
    {
      id: '3',
      type: 'player' as const,
      title: 'Jugador agregado: Juan Pérez',
      subtitle: 'Hace 30 min',
    },
  ];

  const matches = [
    {
      id: 1,
      teamA: 'Storm Raiders',
      teamB: 'Crimson Wolves',
      scoreA: 2,
      scoreB: 1,
      status: 'Finalizado',
    },
    {
      id: 2,
      teamA: 'Blue Hawks',
      teamB: 'Iron Titans',
      scoreA: 1,
      scoreB: 3,
      status: 'En curso',
    },
    {
      id: 3,
      teamA: 'Shadow Lynx',
      teamB: 'Golden Bulls',
      scoreA: 0,
      scoreB: 0,
      status: 'Pendiente',
    },
  ];

  const upcomingMatches = [
    {
      id: 1,
      teamA: 'Storm Raiders',
      teamB: 'Ice Breakers',
      date: 'Hoy 16:00',
      stage: 'Semifinal',
    },
    {
      id: 2,
      teamA: 'Thunder Wolves',
      teamB: 'Crimson Hawks',
      date: 'Hoy 18:00',
      stage: 'Semifinal',
    },
    {
      id: 3,
      teamA: 'Shadow Titans',
      teamB: 'Golden Foxes',
      date: 'Mañana 14:30',
      stage: 'Final',
    },
  ];

  return {
    activeRole,
    user,
    can,
    teams,
    activeTab,
    favorite,
    selectedPlayers,
    jerseyNumbers,
    isSavingRoster,
    edition,
    isLoading,
    inscriptions,
    isAlreadyInscribed,
    inscribedTeam,
    members,
    loadingMembers,
    myInscription,
    isCaptain,
    isOrganizer,
    showParticipation,
    handleTogglePlayer,
    handleJerseyNumberChange,
    handleSaveRoster,
    inscribeTeam,
    handleSaveFavorite,
    handleGoBack,
    handleChangeView,
    handleParticipationAction,
    getParticipationProps,
    tournamentData,
    statsData,
    recentActivities,
    matches,
    upcomingMatches,
    statusMap,
  };
};
