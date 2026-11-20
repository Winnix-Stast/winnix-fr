import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { teamsAdapter } from '@/core/teams/teams-adapter';
import {
  QUERY_PRESETS,
  createQueryKeyFactory,
  useInfiniteQueryAdapter,
  useMutationAdapter,
} from '@/helpers/adapters/queryAdapter';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { TeamFormData, teamSchema } from '@/presentation/schemas/teamSchema';

export const teamsKeys = createQueryKeyFactory('teams');

export const useMyTeams = (query: any = {}) => {
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Infinite Query for fetching user's own teams (REALTIME update)
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQueryAdapter(
    teamsKeys.list(query),
    (pageParam) => teamsAdapter.getMyTeams({ ...query, page: pageParam, limit: 20 }),
    {
      staleTime: 0,
      refetchOnMount: true,
    },
  );

  const extractTeamsFromPage = (page: any) => {
    if (!page) return [];
    if (Array.isArray(page)) return page;
    if (Array.isArray(page.teams)) return page.teams;
    if (Array.isArray(page.data?.teams)) return page.data.teams;
    if (Array.isArray(page.data?.data?.teams)) return page.data.data.teams;
    if (Array.isArray(page.data)) return page.data;
    return [];
  };

  const teams =
    responseData?.pages
      .flatMap((page: any) => extractTeamsFromPage(page))
      .filter((t: any) => t && t._id) || [];

  console.log('teams extraídos en useMyTeams :>> ', teams);

  // Force refetch on screen focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Smart Real-time sync: Si el jugador tiene solicitudes pendientes de aprobación,
  // consulta en segundo plano cada 8 segundos mientras la vista está activa,
  // apagándose automáticamente cuando el capitán acepta la solicitud o al salir de la pantalla.
  const hasPendingRequests = useMemo(() => {
    return teams.some((t: any) => t.membershipStatus === 'pending');
  }, [teams]);

  useEffect(() => {
    if (!hasPendingRequests) return;
    const interval = setInterval(() => {
      refetch();
    }, 8000);
    return () => clearInterval(interval);
  }, [hasPendingRequests, refetch]);

  // Custom Form for creating/editing a team
  const form = useCustomForm<TeamFormData>(teamSchema);

  // Mutation for creating a team
  const createTeamMutation = useMutationAdapter<any, Error, TeamFormData>(
    teamsAdapter.createTeam,
    {
      invalidateQueries: [teamsKeys.lists()],
      onSuccess: () => {
        useAlertStore.getState().showAlert({
          title: '¡Equipo Creado!',
          message: 'Tu nuevo equipo ha sido registrado exitosamente.',
          type: 'success',
          confirmText: '¡Excelente!',
        });
        form.reset();
        refetch();
      },
      onError: (err) => {
        useAlertStore.getState().showAlert({
          title: 'Error al Crear Equipo',
          message: err?.message || 'Ocurrió un error al crear el equipo.',
          type: 'error',
          confirmText: 'Entendido',
        });
      },
    },
  );

  // Mutation for updating a team
  const updateTeamMutation = useMutationAdapter<
    any,
    Error,
    { id: string; payload: TeamFormData }
  >(({ id, payload }) => teamsAdapter.updateTeam(id, payload), {
    invalidateQueries: [teamsKeys.lists()],
    onSuccess: () => {
      useAlertStore.getState().showAlert({
        title: 'Equipo Actualizado',
        message: 'Los cambios se han guardado exitosamente.',
        type: 'success',
      });
      setIsEditModalVisible(false);
      setSelectedTeam(null);
      refetch();
    },
    onError: (err) => {
      useAlertStore.getState().showAlert({
        title: 'Error de Actualización',
        message: err?.message || 'No se pudo actualizar el equipo.',
        type: 'error',
      });
    },
  });

  // Mutation for deleting a team
  const deleteTeamMutation = useMutationAdapter<any, Error, string>(
    (id) => teamsAdapter.deleteTeam(id),
    {
      invalidateQueries: [teamsKeys.lists()],
      onSuccess: () => {
        useAlertStore.getState().showAlert({
          title: 'Equipo Eliminado',
          message: 'El equipo ha sido eliminado permanentemente.',
          type: 'success',
        });
        setIsDeleteModalVisible(false);
        setSelectedTeam(null);
        refetch();
      },
      onError: (err) => {
        useAlertStore.getState().showAlert({
          title: 'Error de Eliminación',
          message: err?.message || 'No se pudo eliminar el equipo.',
          type: 'error',
        });
      },
    },
  );

  // Mutation for responding to team invitations directly from card
  const respondInvitationMutation = useMutationAdapter<
    any,
    Error,
    { teamId: string; action: 'ACCEPT' | 'REJECT' }
  >(({ teamId, action }) => teamsAdapter.respondInvitation(teamId, action), {
    invalidateQueries: [teamsKeys.lists(), ['team'], ['notifications']],
    onSuccess: (_, variables) => {
      useAlertStore.getState().showAlert({
        title: variables.action === 'ACCEPT' ? '¡Invitación Aceptada!' : 'Invitación Rechazada',
        message:
          variables.action === 'ACCEPT'
            ? 'Te has sumado exitosamente a la escuadra.'
            : 'Has declinado la invitación a la escuadra.',
        type: 'success',
      });
      refetch();
    },
    onError: (err) => {
      useAlertStore.getState().showAlert({
        title: 'Error al Responder',
        message: err?.message || 'No se pudo procesar la respuesta a la invitación.',
        type: 'error',
      });
    },
  });

  // Helper functions to open modals
  const openEditModal = (team: any) => {
    setSelectedTeam(team);
    form.setValue('name', team.name);
    form.setValue('logo', team.logo || '');
    form.setValue(
      'sport',
      typeof team.sport === 'object' ? team.sport?._id : team.sport,
    );
    setIsEditModalVisible(true);
  };

  const openDeleteModal = (team: any) => {
    setSelectedTeam(team);
    setIsDeleteModalVisible(true);
  };

  const handleToggleFavorite = async (teamId: string, currentFav: boolean) => {
    try {
      await teamsAdapter.updateTeam(teamId, { isFavorite: !currentFav });
      refetch();
    } catch (e) {
      console.log('Error toggling favorite:', e);
    }
  };

  return {
    teams,
    loading: isLoading,
    error: isError ? error?.message || 'Error de conexión' : null,
    refetch,
    refresh: refetch,
    // Mutations & Actions
    createTeamMutation,
    updateTeamMutation,
    deleteTeamMutation,
    // Form logic
    form,
    // Modal states & helpers
    selectedTeam,
    isEditModalVisible,
    setIsEditModalVisible,
    isDeleteModalVisible,
    setIsDeleteModalVisible,
    openEditModal,
    openDeleteModal,
    handleEditSubmit: form.handleSubmit((data) => {
      if (selectedTeam) {
        updateTeamMutation.mutate({ id: selectedTeam._id, payload: data });
      }
    }),
    handleDeleteConfirm: () => {
      if (selectedTeam) {
        deleteTeamMutation.mutate(selectedTeam._id);
      }
    },
    handleToggleFavorite,
    handleRespondInvitation: (teamId: string, action: 'ACCEPT' | 'REJECT') =>
      respondInvitationMutation.mutate({ teamId, action }),
    isRespondingInvitation: respondInvitationMutation.isPending,
    // Pagination
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
