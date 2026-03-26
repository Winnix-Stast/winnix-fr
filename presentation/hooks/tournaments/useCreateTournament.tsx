import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

import { tournamentsActions } from "@/core/tournaments/actions/tournaments-actions";
import { useCustomForm } from "@/hooks/useCustomForm";
import { CreateTournamentFormData, createTournamentSchema } from "@/presentation/schemas/tournamentSchema";

export const useCreateTournament = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { control, handleSubmit, errors, isSubmitting, isDisabled, watch, getValues } = useCustomForm<CreateTournamentFormData>(createTournamentSchema);

  const onSubmit = async (payload: CreateTournamentFormData) => {
    try {
      if (!user?.id) {
        Alert.alert("Error", "No se encontró el ID de usuario. Por favor, inicia sesión nuevamente.");
        return;
      }

      const createPayload: any = {
        name: payload.name,
        organizer: user.id,
        start_date: payload.start_date?.toISOString(),
        end_date: payload.end_date?.toISOString(),
        config: {
          max_teams: payload.max_teams,
        },
        agreement: {
          accepted: true,
          acceptedAt: new Date().toISOString(),
        },
      };

      if (payload.rules) createPayload.description = payload.rules;
      if (payload.image) createPayload.image = payload.image;
      if (payload.logo) createPayload.logo = payload.logo;

      const data = await tournamentsActions.createTournamentAction(createPayload as any);

      if (data) {
        queryClient.invalidateQueries({ queryKey: ['own-tournaments'] });
        Alert.alert("Torneo Creado", "¡El torneo ha sido creado exitosamente!", [
          {
            text: "Genial",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error: any) {
      console.error(error?.response?.data || error);
      const serverMsg = error?.response?.data?.message;
      const errorMessage = Array.isArray(serverMsg) ? serverMsg.join('\n') : (serverMsg || "Hubo un problema al crear el torneo. Inténtalo más tarde.");
      Alert.alert("Error", errorMessage);
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
