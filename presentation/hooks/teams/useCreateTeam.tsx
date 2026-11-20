import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { filesAdapter } from '@/core/files/files-adapter';
import { teamsActions } from '@/core/teams/actions/teams-actions';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { TeamFormData, teamSchema } from '@/presentation/schemas/teamSchema';
import { useSports } from '../sports/useSports';

export const useCreateTeam = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { control, handleSubmit, errors, isSubmitting, isDisabled, reset, watch } =
    useCustomForm<TeamFormData>(teamSchema);

  const selectedSportId = watch('sport');

  const { sports, loading: loadingSports } = useSports();

  const sportOptions = useMemo(
    () => sports.map((s: any) => ({ label: s.name, value: s._id })),
    [sports],
  );

  // Reiniciar valores al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      reset({
        name: '',
        logo: '',
        sport: '',
      });
    }, [reset]),
  );

  const onSubmit = async (payload: TeamFormData) => {
    try {
      let logoUrl = payload.logo || '';

      // Si el usuario seleccionó un archivo local, subirlo al backend a la carpeta 'teams'
      if (
        payload.logo &&
        (payload.logo.startsWith('file:') ||
          payload.logo.startsWith('content:') ||
          payload.logo.startsWith('ph:'))
      ) {
        const uploadResult = await filesAdapter.uploadFile(payload.logo, 'teams');
        logoUrl = uploadResult.url;
      }

      const data = await teamsActions.createTeamAction({
        name: payload.name,
        sport: payload.sport,
        logo: logoUrl,
      });

      if (data) {
        reset({ name: '', logo: '', sport: '' });
        queryClient.invalidateQueries({ queryKey: ['my-teams'] });
        queryClient.invalidateQueries({ queryKey: ['teams'] });

        useAlertStore.getState().showAlert({
          title: 'Equipo Creado',
          message: '¡Tu equipo ha sido creado exitosamente!',
          type: 'success',
          confirmText: 'Genial',
          onConfirm: () => router.back(),
        });
      } else {
        throw new Error('Failed to create team');
      }
    } catch (error: any) {
      console.error(error);
      const serverMsg = error?.response?.data?.message;
      const errorMessage = Array.isArray(serverMsg)
        ? serverMsg.join('\n')
        : serverMsg || 'Hubo un problema al crear el equipo. Inténtalo más tarde.';

      useAlertStore.getState().showAlert({
        title: 'Error',
        message: errorMessage,
        type: 'error',
        confirmText: 'Entendido',
      });
    }
  };

  const handleGoBack = () => {
    reset({ name: '', logo: '', sport: '' });
    router.back();
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    handleGoBack,
    sportOptions,
    loadingSports,
    selectedSportId,
  };
};

