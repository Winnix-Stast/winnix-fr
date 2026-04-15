import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { brandsActions } from "@/core/brands/actions/brands-actions";
import { useCustomForm } from "@/hooks/useCustomForm";
import { CreateBrandFormData, createBrandSchema } from "@/presentation/schemas/brandSchema";

export const useCreateBrand = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { control, handleSubmit, errors, isSubmitting, isDisabled, getValues } = useCustomForm<CreateBrandFormData>(createBrandSchema);

  const onSubmit = async (payload: CreateBrandFormData) => {
    try {
      const data = await brandsActions.createBrandAction({
        name: payload.name,
        logo: payload.logo,
      });

      if (data) {
        queryClient.invalidateQueries({ queryKey: ['my-brands'] });
        Alert.alert("Marca Creada", "¡Tu marca ha sido creada exitosamente!", [
          {
            text: "Genial",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message;
      const errorMessage = Array.isArray(serverMsg) ? serverMsg.join('\n') : (serverMsg || "Hubo un problema al crear la marca. Inténtalo más tarde.");
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
    getValues,
    onSubmit,
    handleGoBack,
  };
};
