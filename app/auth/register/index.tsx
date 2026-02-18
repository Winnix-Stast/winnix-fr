import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Image, StyleSheet, Text, View } from "react-native";

import { TermsAndConditions } from "@/presentation/auth/components/TermsAndConditions/TermsAndConditions";
import { CompleteProfileModal } from "@/presentation/components/CompleteProfileModal";
import { UseSignUp } from "@/presentation/hooks/auth/signup/useSignUp";
import { Colors } from "@/presentation/styles";
import { Fonts } from "@/presentation/styles/global-styles";
import { CustomButton } from "@/presentation/theme/components/CustomButton";
import { CustomFormView } from "@/presentation/theme/components/CustomFormView";
import { CustomInput } from "@/presentation/theme/components/CustomInput";
import { CustomSelect } from "@/presentation/theme/components/CustomSelect";

const SignUp = () => {
  const { t } = useTranslation("auth");

  const {
    // Props
    showCompleteProfileModal,
    roles,

    // Methods
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    handleTermsClick,
    handleCompleteProfile,
    Haptics,
    onSignUp,
  } = UseSignUp();

  return (
    <CustomFormView>
      <View style={styles.view}>
        <Image source={require("@/assets/icons/brand/ellipse.png")} style={styles.backgroundImage} resizeMode='contain' />

        <View style={styles.header}>
          <Image source={require("@/assets/icons/brand/logoName.png")} style={styles.brand} resizeMode='contain' />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t("register.title")}</Text>

          <View style={styles.containerInformation}>
            <CustomInput name='email' control={control} placeholder={t("register.emailPlaceholder")} label={t("register.emailLabel")} iconRight='mail-outline' keyboardType='email-address' errorMessage={errors.email?.message} />

            <CustomInput name='username' control={control} placeholder={t("register.usernamePlaceholder")} label={t("register.usernameLabel")} iconRight='person-outline' keyboardType='name-phone-pad' errorMessage={errors.username?.message} />

            <CustomInput name='password' control={control} placeholder={t("register.passwordPlaceholder")} label={t("register.passwordLabel")} iconRight='eye-off-outline' keyboardType='visible-password' secureTextEntry errorMessage={errors.password?.message} />

            <CustomInput name='confirmPassword' control={control} placeholder={t("register.confirmPasswordPlaceholder")} label={t("register.confirmPasswordLabel")} iconRight='eye-off-outline' keyboardType='default' secureTextEntry errorMessage={errors.confirmPassword?.message} />

            <CustomSelect name='role' control={control} label={t("register.roleLabel", { defaultValue: "Rol" })} placeholder={t("register.rolePlaceholder", { defaultValue: "Selecciona un rol" })} options={roles} iconLeft='person-outline' errorMessage={errors.roles?.message} />

            <TermsAndConditions control={control} Haptics={Haptics} handleTermsClick={handleTermsClick} errors={errors} />

            <CustomButton label={isSubmitting ? t("register.submitting") : t("register.submitButton")} onPress={handleSubmit(onSignUp)} icon='football-outline' disabled={isDisabled || isSubmitting} />
          </View>
        </View>
      </View>

      <CompleteProfileModal visible={showCompleteProfileModal} onComplete={handleCompleteProfile} />
    </CustomFormView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: Colors.surface_base,
    minHeight: "100%",
    position: "relative",
  },
  header: {
    flex: 0.5,
    top: "2%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  brand: {
    width: 180,
    height: 60,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.3,
    zIndex: 0,
    top: "-20%",
    transform: [{ rotate: "200deg" }],
  },
  containerInformation: {
    display: "flex",
    gap: 25,
    width: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 20,
    padding: 20,
    width: "100%",
    zIndex: 1,
  },
  title: {
    fontSize: Fonts.extraLarge,
    fontWeight: "bold",
    color: Colors.text_brand,
  },
});
