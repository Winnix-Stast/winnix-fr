import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { filesAdapter } from '@/core/files/files-adapter';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
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
    return new Promise<void>((resolve, reject) => {
      useAlertStore.getState().showAlert({
        title: 'Confirmación',
        message:
          '¿Estás seguro de que deseas armar este torneo con los datos ingresados?',
        type: 'info',
        showCancel: true,
        confirmText: 'Sí, crear',
        cancelText: 'Volver',
        onCancel: () => {
          resolve();
        },
        onConfirm: async () => {
          try {
            let imageUrl = payload.image;
            let logoUrl = payload.logo;

            if (
              payload.image &&
              (payload.image.startsWith('file:') ||
                payload.image.startsWith('content:') ||
                payload.image.startsWith('ph:'))
            ) {
              const res = await filesAdapter.uploadFile(payload.image, 'tournaments');
              imageUrl = res.url;
            }

            if (
              payload.logo &&
              (payload.logo.startsWith('file:') ||
                payload.logo.startsWith('content:') ||
                payload.logo.startsWith('ph:'))
            ) {
              const res = await filesAdapter.uploadFile(payload.logo, 'tournaments');
              logoUrl = res.url;
            }

            const createPayload = {
              tournament: payload.tournament,
              seasonName: payload.seasonName,
              startDate: payload.startDate?.toISOString(),
              endDate: payload.endDate?.toISOString(),
              sport: payload.sport,
              sportCategory: payload.sportCategory || undefined,
              sportTemplate: payload.sportTemplate,
              image: imageUrl || undefined,
              logo: logoUrl || undefined,
              playersPerTeam: payload.playersPerTeam,
              matchDuration: payload.matchDuration,
              scoring: payload.scoring,
              config: payload.config,
              status: payload.status || 'DRAFT',
            };

            const data = await tournamentsActions.createEditionAction(
              createPayload as any,
            );

            if (data) {
              queryClient.invalidateQueries({ queryKey: ['my-brands'] });
              queryClient.invalidateQueries({
                queryKey: ['editions-by-brand', payload.tournament],
              });

              useAlertStore.getState().showAlert({
                title: 'Torneo Creado',
                message: '¡El torneo ha sido armado y guardado exitosamente!',
                type: 'success',
                confirmText: 'Genial',
                onConfirm: () => {
                  reset();
                  const brandId = payload.tournament;
                  resolve();
                  if (router.canGoBack()) {
                    router.back();
                  } else if (brandId) {
                    router.replace(`/winnix/brand/${brandId}`);
                  } else {
                    router.back();
                  }
                },
              });
            }
          } catch (error: any) {
            const serverMsg = error?.response?.data?.message;
            const errorMessage = Array.isArray(serverMsg)
              ? serverMsg.join('\n')
              : serverMsg || 'Hubo un problema al crear el torneo. Inténtalo más tarde.';

            useAlertStore.getState().showAlert({
              title: 'Error',
              message: errorMessage,
              type: 'error',
              confirmText: 'Entendido',
              onConfirm: () => {
                reject(new Error(errorMessage));
              },
            });
          }
        },
      });
    });
  };

  const handleGoBack = () => {
    const brandId = getValues('tournament');
    if (brandId) {
      router.replace(`/winnix/brand/${brandId}`);
    } else {
      router.back();
    }
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
