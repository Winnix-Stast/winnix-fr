import { useRouter } from "expo-router";
import { Alert } from "react-native";

import { tournamentsActions } from "@/core/tournaments/actions/tournaments-actions";
import { useCustomForm } from "@/hooks/useCustomForm";
import { CreateTournamentFormData, createTournamentSchema } from "@/presentation/schemas/tournamentSchema";

export const useCreateTournament = () => {
  const router = useRouter();

  const { control, handleSubmit, errors, isSubmitting, isDisabled, watch, getValues } = useCustomForm<CreateTournamentFormData>(createTournamentSchema);

  const onSubmit = async (payload: CreateTournamentFormData) => {
    try {
      const { incremental, ...rest } = payload;
      const createPayload = {
        ...rest,
        prize: incremental,
      };

      const data = await tournamentsActions.createTournamentAction(createPayload as any);

      if (data) {
        Alert.alert("Torneo Creado", "¡El torneo ha sido creado exitosamente!", [
          {
            text: "Genial",
            onPress: () => router.back(),
          },
        ]);
      } else {
        throw new Error("Failed to create tournament");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al crear el torneo. Inténtalo más tarde.");
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
    isDisabled,
    watch,
    getValues,
    onSubmit,
    handleGoBack,
  };
};
