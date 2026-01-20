import React from "react";
import { StyleSheet, View } from "react-native";

import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useLogin } from "@/presentation/hooks/auth/login/useLogin";
import { CustomButton } from "@/presentation/theme/components/CustomButton";
import { CustomFormView } from "@/presentation/theme/components/CustomFormView";
import { CustomInput } from "@/presentation/theme/components/CustomInput";
import { CustomLink } from "@/presentation/theme/components/CustomLink";
import { CustomText } from "@/presentation/theme/components/CustomText";
import { colors, spacing, typography } from "@styles";

const Login = () => {
  const { t } = useTranslation("auth");
  const { control, handleSubmit, errors, isSubmitting, isDisabled, onLogin } = useLogin();

  return (
    <CustomFormView>
      <View style={styles.view}>
        <CustomText style={styles.title} label={t("login.title")} />

        <CustomInput name='email' control={control} placeholder={t("login.emailPlaceholder")} label={t("login.emailLabel")} iconRight='mail-outline' keyboardType='email-address' errorMessage={errors.email?.message} />

        <CustomInput name='password' control={control} placeholder={t("login.passwordPlaceholder")} label={t("login.passwordLabel")} iconRight='eye-off-outline' isPassword errorMessage={errors.password?.message} />

        <CustomLink label={t("login.rememberPassword")} href='/' style={styles.rememberPassword} />

        <CustomButton label={isSubmitting ? t("login.submitting") : t("login.submitButton")} onPress={handleSubmit(onLogin)} icon='football-outline' disabled={isDisabled || isSubmitting} />

        <View style={styles.signUpContainer}>
          <CustomText style={styles.signUpText} label={t("login.noAccount")} />
          <CustomLink label={t("login.signUp")} href='/auth/register' />
        </View>
      </View>
    </CustomFormView>
  );
};

export default Login;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface_screen,
    gap: spacing.spacing_l,
    padding: spacing.spacing_l,
    minHeight: "100%",
  },
  title: {
    fontSize: typography.h1_bold.size,
    fontWeight: typography.h1_bold.weight.toLowerCase() as "bold",
    color: colors.brand_primary,
    paddingTop: spacing.spacing_l,
  },
  rememberPassword: {
    width: "auto",
    alignSelf: "flex-end",
  },
  signUpContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.spacing_s,
    marginTop: spacing.spacing_2xl,
  },
  signUpText: {
    color: colors.text_primary,
    fontWeight: typography.body_m_bold.weight.toLowerCase() as "bold",
    fontSize: typography.body_m_bold.size,
  },
});
