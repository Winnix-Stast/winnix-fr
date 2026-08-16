import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { filesAdapter } from '@/core/files/files-adapter';
import { inscriptionsActions } from '@/core/inscriptions/actions/inscriptions-actions';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { useSportTemplates, useSports } from '@/presentation/hooks/sports/useSports';
import {
  EditEditionFormData,
  editEditionSchema,
} from '@/presentation/schemas/tournamentSchema';

export const useEditTournament = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Fetch tournament edition data
  const {
    data: edition,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['edition', id],
    queryFn: () => tournamentsActions.getEditionByIdAction(id),
    enabled: !!id,
  });

  // 1.5 Fetch inscriptions
  const { data: inscriptions, isLoading: isLoadingInscriptions } = useQuery({
    queryKey: ['inscriptions-by-edition', id],
    queryFn: () => inscriptionsActions.getByEditionAction(id),
    enabled: !!id,
  });

  // 2. Initialize custom form
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
  } = useCustomForm<EditEditionFormData>(editEditionSchema);

  // 3. Populate form once data is loaded
  useEffect(() => {
    if (edition) {
      reset({
        tournament:
          typeof edition.tournament === 'object'
            ? edition.tournament?._id
            : edition.tournament,
        seasonName: edition.seasonName,
        startDate: edition.startDate ? new Date(edition.startDate) : undefined,
        endDate: edition.endDate ? new Date(edition.endDate) : undefined,
        sport: typeof edition.sport === 'object' ? edition.sport?._id : edition.sport,
        sportTemplate:
          typeof edition.sportTemplate === 'object'
            ? edition.sportTemplate?._id
            : edition.sportTemplate,
        playersPerTeam: edition.playersPerTeam,
        matchDuration: edition.matchDuration,
        scoring: {
          win: edition.scoring?.win ?? 3,
          draw: edition.scoring?.draw ?? 1,
          loss: edition.scoring?.loss ?? 0,
        },
        image: edition.image,
        logo: edition.logo,
        status: edition.status || 'DRAFT',
      });
    }
  }, [edition, reset]);

  // 4. Determine status constraints
  const isDraft = edition?.status === 'DRAFT';
  const selectedSport = watch('sport');

  // 5. Fetch sports and templates for dropdowns
  const { sports, loading: loadingSports } = useSports();
  const { templates, loadingTemplates } = useSportTemplates(selectedSport);

  // 6. Submit logic - General Info (Settings)
  const onSubmit = async (payload: EditEditionFormData) => {
    return new Promise<void>((resolve, reject) => {
      useAlertStore.getState().showAlert({
        title: 'Confirmar Cambios',
        message:
          '¿Estás seguro de que deseas guardar las modificaciones de configuración del torneo?',
        type: 'info',
        showCancel: true,
        confirmText: 'Sí, guardar',
        cancelText: 'Cancelar',
        onCancel: () => {
          resolve();
        },
        onConfirm: async () => {
          try {
            const updatePayload = {
              seasonName: payload.seasonName,
              // Only send editable fields if it's draft, to avoid backend warnings or inconsistencies
              ...(isDraft
                ? {
                    startDate: payload.startDate?.toISOString(),
                    endDate: payload.endDate?.toISOString(),
                    sportTemplate: payload.sportTemplate,
                    playersPerTeam: payload.playersPerTeam,
                    matchDuration: payload.matchDuration,
                    scoring: payload.scoring,
                  }
                : {}),
            };

            await tournamentsActions.updateEditionAction(id, updatePayload);

            // Invalidate queries to refresh detail and lists
            await queryClient.invalidateQueries({ queryKey: ['edition', id] });
            await queryClient.invalidateQueries({ queryKey: ['editions-by-brand'] });
            await queryClient.invalidateQueries({ queryKey: ['my-brands'] });

            useAlertStore.getState().showAlert({
              title: 'Torneo Actualizado',
              message: '¡Los cambios de configuración se han guardado exitosamente!',
              type: 'success',
              confirmText: 'Entendido',
              onConfirm: () => {
                resolve();
                router.replace(`/winnix/tournament/${id}`);
              },
            });
          } catch (error: any) {
            const serverMsg = error?.response?.data?.message;
            const errorMessage = Array.isArray(serverMsg)
              ? serverMsg.join('\n')
              : serverMsg || 'No se pudo guardar la información. Inténtalo de nuevo.';

            useAlertStore.getState().showAlert({
              title: 'Error al actualizar',
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

  // 7. Submit logic - Visual Identity (Poster & Logo)
  const onSubmitVisual = async (payload: EditEditionFormData) => {
    return new Promise<void>((resolve, reject) => {
      useAlertStore.getState().showAlert({
        title: 'Guardar Identidad Visual',
        message: '¿Estás seguro de que deseas actualizar el póster y logo del torneo?',
        type: 'info',
        showCancel: true,
        confirmText: 'Guardar',
        cancelText: 'Cancelar',
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

            await tournamentsActions.updateEditionAction(id, {
              image: imageUrl,
              logo: logoUrl,
            });

            // Invalidate queries to refresh detail and lists
            await queryClient.invalidateQueries({ queryKey: ['edition', id] });
            await queryClient.invalidateQueries({ queryKey: ['editions-by-brand'] });
            await queryClient.invalidateQueries({ queryKey: ['my-brands'] });

            useAlertStore.getState().showAlert({
              title: 'Imágenes Guardadas',
              message: '¡La identidad visual ha sido actualizada exitosamente!',
              type: 'success',
              confirmText: 'Entendido',
              onConfirm: () => {
                resolve();
                router.replace(`/winnix/tournament/${id}`);
              },
            });
          } catch (error: any) {
            const serverMsg = error?.response?.data?.message;
            const errorMessage = Array.isArray(serverMsg)
              ? serverMsg.join('\n')
              : serverMsg || 'No se pudieron guardar las imágenes. Inténtalo de nuevo.';

            useAlertStore.getState().showAlert({
              title: 'Error al guardar imágenes',
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

  // 8. Delete / Deactivate inscription action (retirar equipo)
  const deleteInscription = async (inscriptionId: string, teamName: string) => {
    return new Promise<void>((resolve, reject) => {
      useAlertStore.getState().showAlert({
        title: 'Dar de baja Equipo',
        message: `¿Estás seguro de que deseas retirar a "${teamName}" de este torneo? Esta acción es irreversible.`,
        type: 'warning',
        showCancel: true,
        confirmText: 'Sí, retirar',
        cancelText: 'Cancelar',
        onCancel: () => {
          resolve();
        },
        onConfirm: async () => {
          try {
            await inscriptionsActions.deleteInscriptionAction(inscriptionId);

            // Invalidate queries
            await queryClient.invalidateQueries({
              queryKey: ['inscriptions-by-edition', id],
            });
            await queryClient.invalidateQueries({ queryKey: ['edition', id] });

            useAlertStore.getState().showAlert({
              title: 'Equipo Retirado',
              message: `El equipo "${teamName}" ha sido dado de baja exitosamente del torneo.`,
              type: 'success',
              confirmText: 'Entendido',
              onConfirm: () => {
                resolve();
              },
            });
          } catch (error: any) {
            const serverMsg = error?.response?.data?.message;
            const errorMessage =
              serverMsg || 'No se pudo retirar al equipo. Inténtalo de nuevo.';

            useAlertStore.getState().showAlert({
              title: 'Error al retirar',
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
    router.replace(`/winnix/tournament/${id}`);
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    watch,
    setValue,
    onSubmit,
    onSubmitVisual,
    deleteInscription,
    handleGoBack,
    edition,
    inscriptions,
    isDraft,
    sports,
    templates,
    loadingSports,
    loadingTemplates,
    isLoading: isLoading || loadingSports || isLoadingInscriptions,
    errorMsg: isError ? error?.message : null,
  };
};
