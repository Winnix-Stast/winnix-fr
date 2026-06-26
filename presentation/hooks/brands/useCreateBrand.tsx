import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { brandsActions } from '@/core/brands/actions/brands-actions';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import {
  CreateBrandFormData,
  createBrandSchema,
} from '@/presentation/schemas/brandSchema';

export const useCreateBrand = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { control, handleSubmit, errors, isSubmitting, isDisabled, getValues } =
    useCustomForm<CreateBrandFormData>(createBrandSchema);

  const onSubmit = async (payload: CreateBrandFormData) => {
    try {
      const data = await brandsActions.createBrandAction({
        name: payload.name,
        logo: payload.logo,
      });

      if (data) {
        queryClient.invalidateQueries({ queryKey: ['my-brands'] });
        useAlertStore.getState().showAlert({
          title: 'Marca Creada',
          message: '¡Tu marca ha sido creada exitosamente!',
          type: 'success',
          confirmText: 'Genial',
          onConfirm: () => router.back(),
        });
      }
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message;
      const errorMessage = Array.isArray(serverMsg)
        ? serverMsg.join('\n')
        : serverMsg || 'Hubo un problema al crear la marca. Inténtalo más tarde.';
      useAlertStore.getState().showAlert({
        title: 'Error',
        message: errorMessage,
        type: 'error',
        confirmText: 'Entendido',
      });
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
    getValues,
    onSubmit,
    handleGoBack,
  };
};
