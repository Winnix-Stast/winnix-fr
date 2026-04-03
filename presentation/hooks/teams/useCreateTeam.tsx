import { teamsActions } from "@/core/teams/actions/teams-actions";
import { useCustomForm } from "@/hooks/useCustomForm";
import { TeamFormData, teamSchema } from "@/presentation/schemas/teamSchema";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Alert } from "react-native";
import { useSports } from "../sports/useSports";

export const useCreateTeam = () => {
  const router = useRouter();

  const { control, handleSubmit, errors, isSubmitting, watch } = useCustomForm<TeamFormData>(teamSchema);

  const selectedSportId = watch("sport");

  const { sports, loading: loadingSports } = useSports();

  const sportOptions = useMemo(() => sports.map((s: any) => ({ label: s.name, value: s._id })), [sports]);

  const onSubmit = async (payload: TeamFormData) => {
    try {
      const data = await teamsActions.createTeamAction(payload);

      if (data) {
        Alert.alert("Equipo Creado", "¡Tu equipo ha sido creado exitosamente!", [
          {
            text: "Genial",
            onPress: () => router.back(),
          },
        ]);
      } else {
        throw new Error("Failed to create team");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al crear el equipo. Inténtalo más tarde.");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    handleGoBack,
    sportOptions,
    loadingSports,
    selectedSportId,
  };
};
