import { teamsActions } from "@/core/teams/actions/teams-actions";
import { useCustomForm } from "@/hooks/useCustomForm";
import { TeamFormData, teamSchema } from "@/presentation/schemas/teamSchema";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useCreateTeam = () => {
  const router = useRouter();

  const { control, handleSubmit, errors, isSubmitting } = useCustomForm(teamSchema);

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
    router.push("/winnix/tabs/dashboard");
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    handleGoBack,
  };
};
