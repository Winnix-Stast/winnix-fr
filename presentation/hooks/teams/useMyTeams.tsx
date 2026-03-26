import { teamsAdapter } from "@/core/teams/teams-adapter";
import { createQueryKeyFactory, QUERY_PRESETS, useMutationAdapter, useQueryAdapter } from "@/helpers/adapters/queryAdapter";
import { useCustomForm } from "@/hooks/useCustomForm";
import { TeamFormData, teamSchema } from "@/presentation/schemas/teamSchema";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const teamsKeys = createQueryKeyFactory("teams");

export const useMyTeams = (query: any = {}) => {
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Query for fetching teams
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQueryAdapter<any, Error>(teamsKeys.list(query), () => teamsAdapter.getOwnTeams(query), {
    ...QUERY_PRESETS.SEMI_STATIC,
  });

  const teams = responseData?.data || [];

  // Force refetch on screen focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Custom Form for creating/editing a team
  const form = useCustomForm<TeamFormData>(teamSchema);

  // Mutation for creating a team
  const createTeamMutation = useMutationAdapter<any, Error, TeamFormData>(teamsAdapter.createTeam, {
    invalidateQueries: [teamsKeys.lists()],
    onSuccess: () => {
      Alert.alert("Éxito", "El equipo ha sido creado correctamente");
      form.reset();
    },
    onError: (err) => {
      Alert.alert("Error", err?.message || "Ocurrió un error al crear el equipo");
    },
  });

  const updateTeamMutation = useMutationAdapter<any, Error, { id: string; payload: TeamFormData }>(({ id, payload }) => teamsAdapter.updateTeam(id, payload), {
    invalidateQueries: [teamsKeys.lists()],
    onSuccess: () => {
      Alert.alert("Éxito", "El equipo ha sido actualizado correctamente");
      form.reset();
    },
    onError: (err) => {
      Alert.alert("Error", err?.message || "Ocurrió un error al actualizar el equipo");
    },
  });

  const deleteTeamMutation = useMutationAdapter<any, Error, string>(teamsAdapter.deleteTeam, {
    invalidateQueries: [teamsKeys.lists()],
    onSuccess: () => {
      Alert.alert("Equipo Eliminado", "El equipo ha sido eliminado correctamente");
    },
    onError: (err) => {
      Alert.alert("Error", err?.message || "Ocurrió un error al eliminar el equipo");
    },
  });

  const onSubmitCreate = form.handleSubmit((data) => {
    createTeamMutation.mutate(data);
  });

  const openEditModal = (team: any) => {
    setSelectedTeam(team);
    setIsEditModalVisible(true);
  };

  const openDeleteModal = (team: any) => {
    setSelectedTeam(team);
    setIsDeleteModalVisible(true);
  };

  const handleEditSubmit = (data: TeamFormData) => {
    if (selectedTeam) {
      const fullUpdatePayload = {
        name: data.name,
        logo: data.logo,
        players: selectedTeam.players?.map((p: any) => ({
          player: p.player?._id || p.player,
          joinedAt: p.joinedAt,
          leftAt: p.leftAt,
        })),
        tournaments: selectedTeam.tournaments?.map((t: any) => ({
          tournament: t.tournament?._id || t.tournament,
          stages: t.stages?.map((s: any) => ({
            stage: s.stage?._id || s.stage,
            points: s.points,
            goals_scored: s.goals_scored,
            goals_conceded: s.goals_conceded,
            matches_played: s.matches_played,
            matches_won: s.matches_won,
            matches_drawn: s.matches_drawn,
            matches_lost: s.matches_lost,
          })),
        })),
      };

      updateTeamMutation.mutate(
        { id: selectedTeam._id, payload: fullUpdatePayload },
        {
          onSuccess: () => {
            setIsEditModalVisible(false);
          },
        },
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedTeam) {
      deleteTeamMutation.mutate(selectedTeam._id, {
        onSuccess: () => {
          setIsDeleteModalVisible(false);
        },
      });
    }
  };

  return {
    teams,
    loading: isLoading,
    error: isError ? error?.message : null,
    refresh: refetch,
    form,
    isCreating: createTeamMutation.isPending,
    createError: createTeamMutation.error,
    onSubmitCreate,
    updateTeamMutation,
    deleteTeamMutation,
    selectedTeam,
    setSelectedTeam,
    isEditModalVisible,
    setIsEditModalVisible,
    isDeleteModalVisible,
    setIsDeleteModalVisible,
    openEditModal,
    openDeleteModal,
    handleEditSubmit,
    handleDeleteConfirm,
  };
};
