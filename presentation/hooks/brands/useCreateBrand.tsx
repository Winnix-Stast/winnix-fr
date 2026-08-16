import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { brandsActions } from '@/core/brands/actions/brands-actions';
import { filesAdapter } from '@/core/files/files-adapter';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import {
  CreateBrandFormData,
  createBrandSchema,
} from '@/presentation/schemas/brandSchema';

export const useCreateBrand = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { control, handleSubmit, errors, isSubmitting, isDisabled, getValues, reset } =
    useCustomForm<CreateBrandFormData>(createBrandSchema);

  // Reset form inputs whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      reset({
        name: '',
        logo: '',
      });
    }, [reset]),
  );

  const onSubmit = async (payload: CreateBrandFormData) => {
    try {
      let logoUrl = payload.logo;

      // If user selected a local file, upload it to the backend first
      if (
        payload.logo &&
        (payload.logo.startsWith('file:') ||
          payload.logo.startsWith('content:') ||
          payload.logo.startsWith('ph:'))
      ) {
        const uploadResult = await filesAdapter.uploadFile(payload.logo, 'brands');
        logoUrl = uploadResult.url;
      }

      const data = await brandsActions.createBrandAction({
        name: payload.name,
        logo: logoUrl,
      });

      if (data) {
        reset({ name: '', logo: '' });
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
    reset({ name: '', logo: '' });
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
