import { useCallback, useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { teamsAdapter } from '@/core/teams/teams-adapter';
import {
  QUERY_PRESETS,
  createQueryKeyFactory,
  useInfiniteQueryAdapter,
  useMutationAdapter,
  useQueryAdapter,
} from '@/helpers/adapters/queryAdapter';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { TeamFormData } from '@/presentation/schemas/teamSchema';
import { teamsKeys } from './useMyTeams';

export const teamKeys = {
  ...createQueryKeyFactory('team'),
  members: (id: string) => [...createQueryKeyFactory('team').detail(id), 'infinite-members'],
};

export const useTeam = (id: string) => {
  const { user } = useAuthStore();

  // Modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Screen UI states
  const [activeTab, setActiveTab] = useState('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [hasRequestedJoin, setHasRequestedJoin] = useState(false);
  const [isSubmittingJoin, setIsSubmittingJoin] = useState(false);

  // Query: Team Detail
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQueryAdapter<any, Error>(
    teamKeys.detail(id),
    () => teamsAdapter.getTeamById(id),
    {
      ...QUERY_PRESETS.SEMI_STATIC,
      enabled: !!id,
    },
  );

  const team = responseData?.data || responseData || null;

  // Infinite Query: Team Members
  const {
    data: membersData,
    fetchNextPage: fetchNextMembersPage,
    hasNextPage: hasNextMembersPage,
    isFetchingNextPage: isFetchingNextMembersPage,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useInfiniteQueryAdapter(
    teamKeys.members(id),
    (pageParam) => teamsAdapter.getTeamMembers(id, { page: pageParam, limit: 20 }),
    {
      enabled: !!id,
      staleTime: 0,
      refetchOnMount: true,
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

  // Computed Roles & Membership Status
  const isCaptain = Boolean(
    user?.id && team?.captain?._id && user.id === team.captain._id,
  );

  const myMembership = (members || []).find(
    (m: any) => m.player?._id === user?.id,
  );

  // El atleta recibió una invitación del capitán y debe responder (Aceptar / Rechazar)
  const isPendingInvitation = Boolean(
    !isCaptain &&
      myMembership &&
      myMembership.state === 'pending' &&
      myMembership.invitationType !== 'JOIN_REQUEST',
  );

  // El atleta solicitó unirse al equipo y está esperando que el capitán lo acepte
  const isPendingJoinRequest = Boolean(
    !isCaptain &&
      myMembership &&
      myMembership.state === 'pending' &&
      myMembership.invitationType === 'JOIN_REQUEST',
  );

  const isMember = Boolean(
    isCaptain ||
      (myMembership && myMembership.isActive && myMembership.state === 'accepted'),
  );

  // Reset states on team ID change or blur
  useEffect(() => {
    setIsEditing(false);
    setActiveTab('stats');
    setHasRequestedJoin(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchMembers();
      return () => {
        setIsEditing(false);
      };
    }, [id]),
  );

  // Tab & Edit Actions
  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Mutation: Update Team
  const updateTeamMutation = useMutationAdapter<
    any,
    Error,
    { id: string; payload: TeamFormData }
  >(({ id, payload }) => teamsAdapter.updateTeam(id, payload), {
    invalidateQueries: [teamKeys.all, teamsKeys.lists()],
    onSuccess: () => {
      useAlertStore.getState().showAlert({
        title: 'Equipo Actualizado',
        message: 'Los cambios se han guardado exitosamente.',
        type: 'success',
      });
      setIsEditModalVisible(false);
      refetch();
    },
    onError: (error: any) => {
      useAlertStore.getState().showAlert({
        title: 'Error de Actualización',
        message: error?.message || 'No se pudo actualizar el equipo.',
        type: 'error',
      });
    },
  });

  // Mutation: Delete Team
  const deleteTeamMutation = useMutationAdapter<any, Error, string>(
    (teamId) => teamsAdapter.deleteTeam(teamId),
    {
      invalidateQueries: [teamKeys.all, teamsKeys.lists()],
      onSuccess: () => {
        setIsDeleteModalVisible(false);
      },
      onError: (error: any) => {
        useAlertStore.getState().showAlert({
          title: 'Error de Eliminación',
          message: error?.message || 'No se pudo eliminar el equipo.',
          type: 'error',
        });
      },
    },
  );

  // Mutation: Toggle Member Status
  const toggleMemberMutation = useMutationAdapter<
    any,
    Error,
    { playerId: string; currentActive: boolean }
  >(
    ({ playerId, currentActive }) =>
      currentActive
        ? teamsAdapter.deactivateMember(id, playerId)
        : teamsAdapter.activateMember(id, playerId),
    {
      invalidateQueries: [teamKeys.members(id)],
      onSuccess: () => {
        refetchMembers();
      },
      onError: (error: any) => {
        useAlertStore.getState().showAlert({
          title: 'Error de Estado',
          message: error?.message || 'No se pudo cambiar el estado del miembro.',
          type: 'error',
        });
      },
    },
  );

  // Mutation: Respond Team Invitation
  const respondInvitationMutation = useMutationAdapter<
    any,
    Error,
    'ACCEPT' | 'REJECT'
  >((action) => teamsAdapter.respondInvitation(id, action), {
    invalidateQueries: [teamKeys.all, teamsKeys.lists(), ['notifications']],
    onSuccess: (_, action) => {
      useAlertStore.getState().showAlert({
        title: action === 'ACCEPT' ? '¡Invitación Aceptada!' : 'Invitación Rechazada',
        message:
          action === 'ACCEPT'
            ? 'Te has sumado exitosamente a la plantilla oficial.'
            : 'Has declinado la invitación a la escuadra.',
        type: 'success',
      });
      refetch();
      refetchMembers();
    },
    onError: (err) => {
      useAlertStore.getState().showAlert({
        title: 'Error al Responder',
        message: err?.message || 'No se pudo procesar la respuesta a la invitación.',
        type: 'error',
      });
    },
  });

  // Action: Join Team Request
  const handleRequestJoin = async () => {
    if (!user?.id || !team?._id || isSubmittingJoin || hasRequestedJoin) {
      return;
    }
    try {
      setIsSubmittingJoin(true);
      await teamsAdapter.requestJoinTeam(team._id, user.id);
      setHasRequestedJoin(true);
      refetch();
      refetchMembers();
      useAlertStore.getState().showAlert({
        title: '¡Solicitud Enviada!',
        message: `Tu solicitud para unirte a ${team.name} ha sido enviada al capitán. Podrás seguir el estado en 'Mis Equipos'.`,
        type: 'success',
        confirmText: 'Entendido',
      });
    } catch (err: any) {
      setHasRequestedJoin(true);
      refetchMembers();
      useAlertStore.getState().showAlert({
        title: 'Solicitud de Ingreso',
        message:
          err?.message ||
          'Ya tienes una solicitud pendiente para esta escuadra.',
        type: 'info',
        confirmText: 'Entendido',
      });
    } finally {
      setIsSubmittingJoin(false);
    }
  };

  // Mutation: Leave Team
  const leaveTeamMutation = useMutationAdapter<any, Error, void>(
    () => teamsAdapter.leaveTeam(id),
    {
      invalidateQueries: [teamKeys.all, teamsKeys.lists(), ['my-teams']],
      onSuccess: () => {
        setHasRequestedJoin(false);
        refetch();
        refetchMembers();
        useAlertStore.getState().showAlert({
          title: 'Equipo Abandonado',
          message: `Has salido de ${team?.name || 'la escuadra'} exitosamente.`,
          type: 'info',
          confirmText: 'Entendido',
        });
      },
      onError: (err: any) => {
        useAlertStore.getState().showAlert({
          title: 'Error de Desvinculación',
          message:
            err?.response?.data?.message ||
            err?.message ||
            'No se pudo salir del equipo.',
          type: 'error',
        });
      },
    },
  );

  // Action: Leave Team
  const handleLeaveTeam = () => {
    if (!user?.id || !team?._id || leaveTeamMutation.isPending) return;

    useAlertStore.getState().showAlert({
      title: '¿Abandonar Equipo?',
      message: `¿Estás seguro de que deseas salir de ${team.name}?`,
      type: 'warning',
      confirmText: 'Sí, Salir',
      onConfirm: () => {
        leaveTeamMutation.mutate();
      },
    });
  };

  // Action: Toggle Favorite
  const handleToggleFavorite = async (teamId: string, currentFav: boolean) => {
    try {
      await teamsAdapter.updateTeam(teamId, { isFavorite: !currentFav });
      refetch();
    } catch (e) {
      console.log('Error toggling favorite:', e);
    }
  };

  return {
    team,
    loading: isLoading,
    error: error?.message || null,
    refresh: () => {
      refetch();
      refetchMembers();
    },
    refetchMembers,

    // Role state
    isCaptain,
    isMember,
    isPendingInvitation,
    isPendingJoinRequest,

    // Tabs & UI Mode
    activeTab,
    setActiveTab,
    handleTabPress,
    isEditing,
    setIsEditing,
    toggleEditing,

    // Join / Leave / Invitation Actions
    hasRequestedJoin,
    isSubmittingJoin,
    isSubmittingLeave: leaveTeamMutation.isPending,
    handleRequestJoin,
    handleLeaveTeam,
    handleToggleFavorite,
    handleRespondInvitation: (action: 'ACCEPT' | 'REJECT') =>
      respondInvitationMutation.mutate(action),
    isRespondingInvitation: respondInvitationMutation.isPending,

    // Edit Modal logic (Typed directly with TeamFormData)
    isEditModalVisible,
    setIsEditModalVisible,
    openEditModal: () => setIsEditModalVisible(true),
    handleEditSubmit: (data: TeamFormData) =>
      updateTeamMutation.mutate({ id, payload: data }),
    isUpdating: updateTeamMutation.isPending,

    // Delete Modal logic
    isDeleteModalVisible,
    setIsDeleteModalVisible,
    openDeleteModal: () => setIsDeleteModalVisible(true),
    handleDeleteConfirm: () => deleteTeamMutation.mutate(id),
    isDeleting: deleteTeamMutation.isPending,

    // Members Pagination & Actions
    members,
    loadingMembers: isLoadingMembers,
    fetchNextMembersPage,
    hasNextMembersPage,
    isFetchingNextMembersPage,
    toggleMemberStatus: (playerId: string, currentActive: boolean) =>
      toggleMemberMutation.mutate({ playerId, currentActive }),
    isTogglingMember: toggleMemberMutation.isPending,
  };
};
