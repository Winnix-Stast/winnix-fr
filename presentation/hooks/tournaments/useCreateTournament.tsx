import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { filesAdapter } from '@/core/files/files-adapter';
import { prizesActions } from '@/core/prizes/actions/prizes-actions';
import { stagesActions } from '@/core/stages/actions/stages-actions';
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
    trigger,
  } = useCustomForm<CreateEditionFormData>(createEditionSchema);

  const onSubmit = async (payload: CreateEditionFormData) => {
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

      let rulesDocUrl = payload.config?.rulesDocument;
      if (
        rulesDocUrl &&
        (rulesDocUrl.startsWith('file:') ||
          rulesDocUrl.startsWith('content:') ||
          rulesDocUrl.startsWith('ph:'))
      ) {
        const res = await filesAdapter.uploadFile(rulesDocUrl, 'tournaments');
        rulesDocUrl = res.url;
      }

      const finalConfig = {
        ...(payload.config || {}),
        ...(rulesDocUrl ? { rulesDocument: rulesDocUrl } : {}),
      };

      const validStatuses = ['DRAFT', 'REGISTRATION_OPEN', 'ACTIVE', 'FINISHED'];
      const editionStatus = validStatuses.includes(payload.status || '')
        ? payload.status
        : 'DRAFT';

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
        config: finalConfig,
        status: editionStatus,
      };

      // 1. Crear primero la edición del torneo en el servidor
      const response = await tournamentsActions.createEditionAction(createPayload as any);
      const createdEdition = response?.data || response;
      const editionId = createdEdition?._id || createdEdition?.id;

      if (!editionId) {
        throw new Error(
          'No se pudo obtener el ID del torneo creado desde la respuesta del servidor.',
        );
      }

      // Helper para creación de etapas
      const formatIsoDate = (dateVal: any): string | undefined => {
        if (!dateVal) return undefined;
        if (typeof dateVal === 'string' && dateVal.trim()) {
          const parsed = new Date(dateVal);
          return isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
        }
        if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
          return dateVal.toISOString();
        }
        return undefined;
      };

      const createSingleStage = async (
        editionIdStr: string,
        stageItem: any,
        startDateStr: string,
        endDateStr?: string,
      ) => {
        const tmpl = stageItem.template || stageItem;
        if (!tmpl) return;

        const rawTemplateId = String(tmpl._id || tmpl.id || '').trim();
        const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(rawTemplateId);
        const templateId = isValidMongoId ? rawTemplateId : undefined;

        const seriesLen = Number(
          stageItem.seriesLength ?? tmpl.structure?.match_setup?.series_length ?? 1,
        );
        const thirdPlace = Boolean(
          stageItem.hasThirdPlace ??
          tmpl.structure?.match_setup?.has_third_place ??
          false,
        );
        const enfWinner = Boolean(
          stageItem.enforceWinner ?? tmpl.rules_config?.enforce_winner ?? false,
        );

        const structurePayload = {
          participant_type: tmpl.structure?.participant_type || 'TEAM',
          total_slots: Number(tmpl.structure?.total_slots || 8),
          seeding_logic: tmpl.structure?.seeding_logic || 'MANUAL',
          match_setup: {
            series_length: seriesLen,
            has_third_place: thirdPlace,
          },
        };

        const rulesConfigPayload = {
          enforce_winner: enfWinner,
          points_allocation: {
            win: Number(tmpl.rules_config?.points_allocation?.win ?? 3),
            draw: Number(tmpl.rules_config?.points_allocation?.draw ?? 1),
            loss: Number(tmpl.rules_config?.points_allocation?.loss ?? 0),
          },
          advancement: {
            qualified_per_match: Number(
              tmpl.rules_config?.advancement?.qualified_per_match ?? 1,
            ),
            tie_breakers: Array.isArray(tmpl.rules_config?.advancement?.tie_breakers)
              ? tmpl.rules_config.advancement.tie_breakers
              : ['GOAL_DIFFERENCE'],
          },
        };

        const computedStageName =
          String(stageItem.name || tmpl.name || '').trim() || 'Etapa 1';

        const stagePayload: Record<string, any> = {
          name: computedStageName,
          tournamentEdition: editionIdStr,
          structure: structurePayload,
          rules_config: rulesConfigPayload,
          startDate: startDateStr,
          status: 'DRAFT',
        };

        if (templateId) {
          stagePayload.template = templateId;
        }

        if (endDateStr) {
          stagePayload.endDate = endDateStr;
        }

        const res = await stagesActions.createStageAction(stagePayload);
        return res;
      };

      // 2. Crear las etapas iniciales asociadas al torneo creado
      const startDateIso = formatIsoDate(payload.startDate) || new Date().toISOString();
      const endDateIso = formatIsoDate(payload.endDate);
      const stagesToCreate = payload.initialStages || [];

      if (stagesToCreate.length > 0) {
        const stagePromises = stagesToCreate.map(async (item: any, idx: number) => {
          try {
            return await createSingleStage(editionId, item, startDateIso, endDateIso);
          } catch (stageErr: any) {
            console.error(
              `❌ [useCreateTournament] Error creando etapa #${idx + 1}:`,
              stageErr?.response?.data || stageErr,
            );
          }
        });
        await Promise.allSettled(stagePromises);
      } else if (
        payload.initialStageTemplate &&
        payload.initialStageTemplate !== 'LATER' &&
        payload.initialStageTemplate !== 'CUSTOM_LIST'
      ) {
        try {
          const dbTemplates = await stagesActions.getStageTemplatesAction();
          const selectedTemplate = Array.isArray(dbTemplates)
            ? dbTemplates.find((t: any) => t._id === payload.initialStageTemplate)
            : null;

          if (selectedTemplate) {
            await createSingleStage(
              editionId,
              { name: selectedTemplate.name, template: selectedTemplate },
              startDateIso,
              endDateIso,
            );
          }
        } catch (stageErr: any) {
          console.error(
            '❌ [useCreateTournament] Error auto-creando etapa inicial:',
            stageErr?.response?.data || stageErr,
          );
        }
      }

      // 3. Crear los premios iniciales asociados al torneo creado
      const initialPrizes = (payload as any).initialPrizes || [];
      if (initialPrizes.length > 0) {
        const prizePromises = initialPrizes.map(async (prizeItem: any, idx: number) => {
          const prizePayload = {
            tournamentEdition: editionId,
            label: prizeItem.label,
            cashAmount: prizeItem.cashAmount,
            currency: prizeItem.currency || 'COP',
            additionalItems: prizeItem.additionalItems,
            position: prizeItem.position,
            isMainPrize: prizeItem.isMainPrize,
            order: prizeItem.order ?? idx,
            status: prizeItem.status || 'active',
          };
          try {
            const res = await prizesActions.createPrizeAction(prizePayload);
            return res;
          } catch (prizeErr: any) {
            console.error(
              `❌ [useCreateTournament] Error creando premio inicial #${idx + 1}:`,
              prizeErr?.response?.data || prizeErr,
            );
          }
        });
        await Promise.allSettled(prizePromises);
      } else {
        console.log(
          'ℹ️ [useCreateTournament] No initial prizes configured for this tournament.',
        );
      }

      // 4. Invalidar cachés de React Query
      queryClient.invalidateQueries({ queryKey: ['my-brands'] });
      queryClient.invalidateQueries({ queryKey: ['my-editions'] });
      queryClient.invalidateQueries({ queryKey: ['editions-by-brand'] });
      queryClient.invalidateQueries({ queryKey: ['all-editions'] });
      queryClient.invalidateQueries({ queryKey: ['stages'] });
      queryClient.invalidateQueries({ queryKey: ['stages', editionId] });
      queryClient.invalidateQueries({ queryKey: ['prizes', editionId] });

      // 5. Feedback de éxito y redirección directa
      useAlertStore.getState().showAlert({
        title: 'Torneo Creado',
        message: '¡El torneo ha sido creado exitosamente con sus fases y premios!',
        type: 'success',
        confirmText: 'Ver Torneo',
        onConfirm: () => {
          reset({
            tournament: '',
            seasonName: '',
            sport: '',
            sportCategory: '',
            sportTemplate: '',
            startDate: null,
            endDate: null,
            image: '',
            logo: '',
            playersPerTeam: undefined,
            matchDuration: undefined,
            scoring: undefined,
            config: undefined,
            initialStageTemplate: undefined,
            initialStages: [],
            initialPrizes: [],
            status: 'DRAFT',
          });
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace(`/winnix/tournament/${editionId}`);
          }
        },
      });
    } catch (error: any) {
      console.error(
        '❌ [useCreateTournament] Global Exception during tournament creation:',
        error?.response?.data || error,
      );
      const serverMsg = error?.response?.data?.message;
      const errorMessage = Array.isArray(serverMsg)
        ? serverMsg.join('\n')
        : serverMsg || 'Hubo un problema al crear el torneo. Inténtalo más tarde.';

      useAlertStore.getState().showAlert({
        title: 'Error al Crear',
        message: errorMessage,
        type: 'error',
        confirmText: 'Entendido',
      });
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/winnix/tabs');
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
    trigger,
    onSubmit,
    handleGoBack,
  };
};
