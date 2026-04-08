import { useState } from 'react';
import { Alert } from 'react-native';
import { teamsAdapter } from '@/core/teams/teams-adapter';
import {
  QUERY_PRESETS,
  createQueryKeyFactory,
  useMutationAdapter,
  useQueryAdapter,
} from '@/helpers/adapters/queryAdapter';
import { useCustomForm } from '@/hooks/useCustomForm';
import { TeamFormData, teamSchema } from '@/presentation/schemas/teamSchema';
import { teamsKeys } from './useMyTeams';

export const teamKeys = createQueryKeyFactory('team');

export const useTeam = (id: string) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

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

  const team = responseData?.data || null;

  // Custom Form for editing the team
  const form = useCustomForm<TeamFormData>(teamSchema);

  // Mutations
  const updateTeamMutation = useMutationAdapter<
    any,
    Error,
    { id: string; payload: TeamFormData }
  >(({ id, payload }) => teamsAdapter.updateTeam(id, payload), {
    invalidateQueries: [teamKeys.all, teamsKeys.lists()],
    onSuccess: () => {
      Alert.alert('Éxito', 'El equipo ha sido actualizado correctamente');
    },
    onError: (err) => {
      Alert.alert('Error', err?.message || 'Ocurrió un error al actualizar el equipo');
    },
  });

  const deleteTeamMutation = useMutationAdapter<any, Error, string>(
    teamsAdapter.deleteTeam,
    {
      invalidateQueries: [teamsKeys.lists()],
      onSuccess: () => {
        Alert.alert('Equipo Eliminado', 'El equipo ha sido eliminado correctamente');
      },
      onError: (err) => {
        Alert.alert('Error', err?.message || 'Ocurrió un error al eliminar el equipo');
      },
    },
  );

  const toggleFavoriteMutation = useMutationAdapter<
    any,
    Error,
    { id: string; isFavorite: boolean }
  >(({ id, isFavorite }) => teamsAdapter.updateTeam(id, { isFavorite }), {
    invalidateQueries: [teamKeys.all, teamsKeys.lists()],
    onError: (err: any) => {
      Alert.alert('Error', err?.message || 'No se pudo cambiar el estado de favorito');
    },
  });

  // Handlers
  const openEditModal = () => setIsEditModalVisible(true);
  const openDeleteModal = () => setIsDeleteModalVisible(true);

  const handleEditSubmit = (data: TeamFormData) => {
    if (team) {
      const fullUpdatePayload = {
        name: data.name,
        logo: data.logo,
        sport: data.sport,
        players: team.members?.map((p: any) => ({
          player: p.user?._id || p.user,
          joinedAt: p.joinedAt,
          leftAt: p.leftAt,
        })),
      };

      updateTeamMutation.mutate(
        { id: team._id, payload: fullUpdatePayload },
        {
          onSuccess: () => {
            setIsEditModalVisible(false);
          },
        },
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (team) {
      deleteTeamMutation.mutate(team._id, {
        onSuccess: () => {
          setIsDeleteModalVisible(false);
        },
      });
    }
  };

  const handleToggleFavorite = (id: string, currentStatus: boolean) => {
    toggleFavoriteMutation.mutate({ id, isFavorite: !currentStatus });
  };

  return {
    team,
    loading: isLoading,
    error: isError ? error?.message : null,
    refresh: refetch,

    // Management State/Actions
    isEditModalVisible,
    setIsEditModalVisible,
    isDeleteModalVisible,
    setIsDeleteModalVisible,
    openEditModal,
    openDeleteModal,
    handleEditSubmit,
    handleDeleteConfirm,
    handleToggleFavorite,
    isUpdating: updateTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
    isTogglingFavorite: toggleFavoriteMutation.isPending,
  };
};
