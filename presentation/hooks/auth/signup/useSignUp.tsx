import * as Haptics from "expo-haptics";
import { router, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("auth");

  const { control, handleSubmit, errors, isSubmitting, isDisabled, watch, setValue } = useCustomForm<SignUpFormData>(signUpSchema);

  const birthDate = watch("birthDate");
  const currentRole = watch("role");

  const roles = useMemo(() => {
    const allRoles = [
      { label: t("roles.organizer", { defaultValue: "Organizador" }), value: "organizer" },
      { label: t("roles.captain", { defaultValue: "Capitán" }), value: "captain" },
      { label: t("roles.player", { defaultValue: "Jugador" }), value: "player" },
      { label: t("roles.referee", { defaultValue: "Árbitro" }), value: "referee" },
    ];

    if (!birthDate) {
      return [
        { label: t("roles.captain", { defaultValue: "Capitán" }), value: "captain" },
        { label: t("roles.player", { defaultValue: "Jugador" }), value: "player" },
      ];
    }

    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age >= 18) {
      return allRoles;
    }
    return [
      { label: t("roles.captain", { defaultValue: "Capitán" }), value: "captain" },
      { label: t("roles.player", { defaultValue: "Jugador" }), value: "player" },
    ];
  }, [birthDate, t]);

  useEffect(() => {
    if (currentRole) {
      const isValidRole = roles.find((r) => r.value === currentRole);
      if (!isValidRole && setValue) {
        setValue("role", "");
      }
    }
  }, [roles, currentRole, setValue]);

  const isRoleDisabled = !birthDate;

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

  return {
    //Props
    top,
    showCompleteProfileModal,
    roles,
    isRoleDisabled,

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
