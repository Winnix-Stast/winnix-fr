import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { useCustomForm } from '@/hooks/useCustomForm';
import {
  CreateEditionFormData,
  createEditionSchema,
} from '@/presentation/schemas/tournamentSchema';

export const useCreateTournament = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    watch,
    getValues,
    setValue,
    reset,
  } = useCustomForm<CreateEditionFormData>(createEditionSchema);

  const onSubmit = async (payload: CreateEditionFormData) => {
    try {
      const createPayload = {
        tournament: payload.tournament,
        seasonName: payload.seasonName,
        startDate: payload.startDate?.toISOString(),
        endDate: payload.endDate?.toISOString(),
        sport: payload.sport,
        sportCategory: payload.sportCategory || undefined,
        sportTemplate: payload.sportTemplate,
        image: payload.image,
        logo: payload.logo,
        playersPerTeam: payload.playersPerTeam,
        matchDuration: payload.matchDuration,
        scoring: payload.scoring,
        config: payload.config,
      };

      const data = await tournamentsActions.createEditionAction(createPayload as any);

      if (data) {
        queryClient.invalidateQueries({ queryKey: ['my-brands'] });
        queryClient.invalidateQueries({
          queryKey: ['editions-by-brand', payload.tournament],
        });
        Alert.alert(
          'Torneo Creado',
          '¡La edición del torneo ha sido creada exitosamente!',
          [
            {
              text: 'Genial',
              onPress: () => {
                reset();
                router.back();
              },
            },
          ],
        );
      }
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message;
      const errorMessage = Array.isArray(serverMsg)
        ? serverMsg.join('\n')
        : serverMsg || 'Hubo un problema al crear el torneo. Inténtalo más tarde.';
      Alert.alert('Error', errorMessage);
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
    setValue,
    reset,
    onSubmit,
    handleGoBack,
  };
};
