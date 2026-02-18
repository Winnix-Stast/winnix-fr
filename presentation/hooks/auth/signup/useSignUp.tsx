import * as Haptics from "expo-haptics";
import { router, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Linking } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { authActions } from "@/core/auth/actions/auth-actions";
import { useCustomForm } from "@/hooks/useCustomForm";
import { signUpSchema } from "@/presentation/schemas/signUpSchema";
import { SignUpFormData } from "@/presentation/types/SignUpData";

export const UseSignUp = () => {
  const navigate = useRouter();
  const { top } = useSafeAreaInsets();
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);

  const { control, handleSubmit, errors, isSubmitting, isDisabled } = useCustomForm<SignUpFormData>(signUpSchema);

  const onSignUp = async (payload: SignUpFormData) => {
    const wasSuccessful = await authActions.signUp(payload);

    if (wasSuccessful) {
      setShowCompleteProfileModal(true);
      return;
    }
    Alert.alert("Error", "credenciales no validas");
  };

  const handleCompleteProfile = () => {
    setShowCompleteProfileModal(false);
    router.replace("/winnix/tabs/dashboard");
  };

  const handleTermsClick = () => {
    Linking.openURL("https://example.com/terms");
  };

  const roles = [
    { label: "Organizador", value: "organizer" },
    { label: "Capitán", value: "captain" },
  ];

  return {
    //Props
    top,
    showCompleteProfileModal,
    roles,

    //Methods
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSignUp,
    handleCompleteProfile,
    navigate,
    Haptics,
    handleTermsClick,
  };
};
