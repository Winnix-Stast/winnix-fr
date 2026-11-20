import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { filesAdapter } from '@/core/files/files-adapter';
import { teamsActions } from '@/core/teams/actions/teams-actions';
import { teamsAdapter } from '@/core/teams/teams-adapter';
import {
  QUERY_PRESETS,
  useInfiniteQueryAdapter,
  useQueryAdapter,
} from '@/helpers/adapters/queryAdapter';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { TeamFormData, teamSchema } from '@/presentation/schemas/teamSchema';
import { teamKeys } from './useTeam';
import { teamsKeys } from './useMyTeams';

export type TeamEditTabType = 'ajustes' | 'multimedia' | 'jugadores' | 'info';

export const useEditTeam = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TeamEditTabType>('ajustes');
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isSavingVisual, setIsSavingVisual] = useState(false);
  const [isTogglingMember, setIsTogglingMember] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);

  // Search & Recruit state
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchingPlayer, setIsSearchingPlayer] = useState(false);
  const [searchedPlayer, setSearchedPlayer] = useState<any>(null);
  const [hasSearchedPlayer, setHasSearchedPlayer] = useState(false);
  const [isRecruiting, setIsRecruiting] = useState(false);

  // 1. Fetch team details
  const {
    data: responseData,
    isLoading: isLoadingTeam,
    error: teamError,
    refetch: refetchTeam,
  } = useQueryAdapter<any, Error>(
    teamKeys.detail(id),
    () => teamsAdapter.getTeamById(id),
    {
      ...QUERY_PRESETS.SEMI_STATIC,
      enabled: !!id,
    },
  );

  const team = responseData?.data || responseData || null;

  // 2. Fetch team members (paginación infinita con queryKey aislada)
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useInfiniteQueryAdapter(
    teamKeys.members(id),
    (pageParam) => teamsAdapter.getTeamMembers(id, { page: pageParam, limit: 50 }),
    {
      enabled: !!id,
    },
  );

  const members =
    membersData?.pages?.flatMap(
      (page: any) =>
        page?.memberships ||
        page?.data?.memberships ||
        (Array.isArray(page?.data) ? page.data : []) ||
        (Array.isArray(page) ? page : []),
    ) || [];

  // 3. Form handling con validación Yup
  const {
    control,
    handleSubmit,
    errors,
    reset,
  } = useCustomForm<TeamFormData>(teamSchema);

  // 4. Poblar formulario al cargar datos
  useEffect(() => {
    if (team) {
      reset({
        name: team.name || '',
        logo: team.logo || '',
        sport: team.sport?._id || team.sport || '',
      });
    }
  }, [team, reset]);

  // Propiedades calculadas derivadas
  const captainName =
    team?.captain?.nickname || team?.captain?.username || 'Sin Capitán Asignado';
  const sportName = team?.sport?.name || 'Fútbol';
  const incrementalId = String(team?.incremental || 0).padStart(3, '0');
  const stats = team?.teamGlobalStats || {};
  const goalDifference = (stats.goalsFor || 0) - (stats.goalsAgainst || 0);

  // 5. Guardar Ajustes Generales (Guardado directo sin modal redundante)
  const onSubmitGeneral = async (payload: TeamFormData) => {
    try {
      setIsSavingGeneral(true);
      await teamsAdapter.updateTeam(id, {
        name: payload.name.trim(),
      });

      await queryClient.invalidateQueries({ queryKey: teamKeys.all });
      await queryClient.invalidateQueries({ queryKey: teamsKeys.lists() });
      refetchTeam();

      useAlertStore.getState().showAlert({
        title: 'Equipo Actualizado',
        message: 'El nombre del equipo ha sido guardado exitosamente.',
        type: 'success',
        confirmText: 'Entendido',
      });
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message;
      const errorMessage = Array.isArray(serverMsg)
        ? serverMsg.join('\n')
        : serverMsg || error?.message || 'No se pudo actualizar el equipo.';

      useAlertStore.getState().showAlert({
        title: 'Error de Actualización',
        message: errorMessage,
        type: 'error',
        confirmText: 'Entendido',
      });
    } finally {
      setIsSavingGeneral(false);
    }
  };

  // 6. Guardar Identidad Visual / Escudo (Guardado directo)
  const onSubmitVisual = async (payload: TeamFormData) => {
    try {
      setIsSavingVisual(true);
      let logoUrl = payload.logo || '';

      if (
        logoUrl &&
        (logoUrl.startsWith('file:') ||
          logoUrl.startsWith('content:') ||
          logoUrl.startsWith('ph:'))
      ) {
        const uploadRes = await filesAdapter.uploadFile(logoUrl, 'teams');
        logoUrl = uploadRes.url;
      }

      await teamsAdapter.updateTeam(id, {
        logo: logoUrl,
      });

      await queryClient.invalidateQueries({ queryKey: teamKeys.all });
      await queryClient.invalidateQueries({ queryKey: teamsKeys.lists() });
      refetchTeam();

      useAlertStore.getState().showAlert({
        title: 'Escudo Guardado',
        message: 'El nuevo escudo oficial ha sido guardado exitosamente.',
        type: 'success',
        confirmText: 'Entendido',
      });
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message;
      const errorMessage = Array.isArray(serverMsg)
        ? serverMsg.join('\n')
        : serverMsg || error?.message || 'No se pudo subir el escudo.';

      useAlertStore.getState().showAlert({
        title: 'Error de Carga',
        message: errorMessage,
        type: 'error',
        confirmText: 'Entendido',
      });
    } finally {
      setIsSavingVisual(false);
    }
  };

  // 7. Inactivar y reactivar miembro
  const handleDeactivateMember = (playerId: string, playerName?: string) => {
    useAlertStore.getState().showAlert({
      title: '¿Inactivar Jugador?',
      message: `¿Deseas inactivar a ${playerName || 'este jugador'} temporalmente? No computará en la plantilla activa hasta que sea reactivado.`,
      type: 'warning',
      showCancel: true,
      confirmText: 'Sí, Inactivar',
      cancelText: 'Volver',
      onConfirm: async () => {
        try {
          setIsTogglingMember(true);
          await teamsAdapter.deactivateMember(id, playerId);
          refetchMembers();
          refetchTeam();
          await queryClient.invalidateQueries({ queryKey: teamKeys.members(id) });
        } catch (err: any) {
          useAlertStore.getState().showAlert({
            title: 'Error de Estado',
            message: err?.message || 'No se pudo inactivar al jugador.',
            type: 'error',
          });
        } finally {
          setIsTogglingMember(false);
        }
      },
    });
  };

  const handleReactivateMember = async (playerId: string) => {
    try {
      setIsTogglingMember(true);
      await teamsAdapter.activateMember(id, playerId);
      refetchMembers();
      refetchTeam();
      await queryClient.invalidateQueries({ queryKey: teamKeys.members(id) });
    } catch (err: any) {
      useAlertStore.getState().showAlert({
        title: 'Error de Estado',
        message: err?.message || 'No se pudo reactivar al jugador.',
        type: 'error',
      });
    } finally {
      setIsTogglingMember(false);
    }
  };

  // 8. Confirmar desvinculación definitiva o cancelación de invitación
  const handleRemoveMember = (playerId: string, playerName: string, isPending: boolean = false) => {
    useAlertStore.getState().showAlert({
      title: isPending ? '¿Cancelar Invitación?' : '¿Desvincular Jugador?',
      message: isPending
        ? `¿Estás seguro de que deseas cancelar la invitación enviada a ${playerName}?`
        : `¿Estás seguro de que deseas desvincular definitivamente a ${playerName} del equipo?`,
      type: 'warning',
      showCancel: true,
      confirmText: isPending ? 'Sí, Cancelar' : 'Sí, Desvincular',
      cancelText: 'Volver',
      onConfirm: async () => {
        try {
          setIsRemovingMember(true);
          await teamsAdapter.removeMember(id, playerId);
          refetchMembers();
          refetchTeam();
          await queryClient.invalidateQueries({ queryKey: teamKeys.all });
          await queryClient.invalidateQueries({ queryKey: teamKeys.members(id) });
          await queryClient.invalidateQueries({ queryKey: teamsKeys.lists() });
          useAlertStore.getState().showAlert({
            title: isPending ? 'Invitación Cancelada' : 'Jugador Desvinculado',
            message: isPending
              ? 'La invitación ha sido cancelada.'
              : 'El jugador ha sido desvinculado exitosamente.',
            type: 'success',
          });
        } catch (err: any) {
          useAlertStore.getState().showAlert({
            title: 'Error de Desvinculación',
            message: err?.response?.data?.message || err?.message || 'No se pudo desvincular al jugador.',
            type: 'error',
          });
        } finally {
          setIsRemovingMember(false);
        }
      },
    });
  };

  // 9. Búsqueda de jugador por Nickname, ID, Email o Teléfono
  const handleSearchPlayer = async () => {
    const cleanTerm = searchTerm.trim().replace(/^@/, '');
    if (!cleanTerm) return;

    setIsSearchingPlayer(true);
    setHasSearchedPlayer(false);
    setSearchedPlayer(null);

    try {
      const user = await teamsActions.searchUserByTermAction(cleanTerm);
      setSearchedPlayer(user);
    } catch (error) {
      setSearchedPlayer(null);
    } finally {
      setIsSearchingPlayer(false);
      setHasSearchedPlayer(true);
    }
  };

  // 10. Reclutar jugador encontrado
  const handleRecruitPlayer = async (userId: string) => {
    if (!id || !userId || isRecruiting) return;

    try {
      setIsRecruiting(true);
      await teamsActions.addMemberAction(id, userId);

      useAlertStore.getState().showAlert({
        title: '¡Invitación Enviada!',
        message:
          'Se ha enviado la invitación al jugador. Aparecerá en tu plantilla como pendiente hasta que la acepte.',
        type: 'success',
        confirmText: 'Excelente',
      });

      setSearchTerm('');
      setSearchedPlayer(null);
      setHasSearchedPlayer(false);
      refetchMembers();
      await queryClient.invalidateQueries({ queryKey: teamKeys.members(id) });
    } catch (error: any) {
      const isConflict =
        error?.statusCode === 409 ||
        error?.status === 409 ||
        error?.response?.status === 409;

      if (isConflict) {
        useAlertStore.getState().showAlert({
          title: 'Jugador Ya Vinculado',
          message: 'Este atleta ya forma parte del equipo o tiene una solicitud pendiente.',
          type: 'warning',
          confirmText: 'Entendido',
        });
      } else {
        const serverMsg = error?.response?.data?.message || error?.message;
        useAlertStore.getState().showAlert({
          title: 'Error de Reclutamiento',
          message:
            Array.isArray(serverMsg)
              ? serverMsg.join('\n')
              : serverMsg || 'No se pudo vincular al jugador.',
          type: 'error',
          confirmText: 'Entendido',
        });
      }
    } finally {
      setIsRecruiting(false);
    }
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setSearchedPlayer(null);
    setHasSearchedPlayer(false);
  };

  // 11. Retorno determinístico a la escuadra
  const handleGoBack = () => {
    if (id) {
      router.replace(`/winnix/team/${id}`);
    } else {
      router.replace('/winnix/tabs');
    }
  };

  return {
    activeTab,
    setActiveTab,
    team,
    members,
    isLoading: isLoadingTeam || (isLoadingMembers && members.length === 0),
    errorMsg: teamError ? (teamError as Error).message : null,
    control,
    handleSubmit,
    errors,
    isSavingGeneral,
    isSavingVisual,
    isTogglingMember,
    isRemovingMember,
    onSubmitGeneral,
    onSubmitVisual,
    handleToggleMember: (playerId: string, currentActive: boolean) =>
      currentActive ? handleDeactivateMember(playerId) : handleReactivateMember(playerId),
    handleDeactivateMember,
    handleReactivateMember,
    handleRemoveMember,
    handleGoBack,
    captainName,
    sportName,
    incrementalId,
    stats,
    goalDifference,

    // Búsqueda y reclutamiento
    searchTerm,
    setSearchTerm,
    isSearchingPlayer,
    searchedPlayer,
    hasSearchedPlayer,
    isRecruiting,
    handleSearchPlayer,
    handleRecruitPlayer,
    handleResetSearch,
  };
};
