import { Image, StyleSheet, Text, View } from "react-native";

import { TermsAndConditions } from "@/presentation/auth/components/TermsAndConditions/TermsAndConditions";
import { CompleteProfileModal } from "@/presentation/components/CompleteProfileModal";
import { UseSignUp } from "@/presentation/hooks/auth/signup/useSignUp";
import { CustomButton } from "@/presentation/theme/components/CustomButton";
import { CustomFormView } from "@/presentation/theme/components/CustomFormView";
import { CustomInput } from "@/presentation/theme/components/CustomInput";
import { colors, spacing, typography } from "@styles";

const logoSource = require("@/assets/icons/logotipo/logo.png");

const SingUp = () => {
  const { top, showCompleteProfileModal, control, handleSubmit, errors, isSubmitting, isDisabled, handleTermsClick, handleCompleteProfile, Haptics, onSignUp } = UseSignUp();

  return (
    <CustomFormView>
      <View
        style={[
          styles.view,
          {
            paddingTop: top + 10,
          },
        ]}>
        <Image source={logoSource} style={styles.logo} resizeMode='contain' />
        <Text style={styles.title}> Crear cuenta</Text>

        <View style={styles.containerInformation}>
          <CustomInput name='email' control={control} placeholder='ejemplo@google.com' label='Correo electrónico' iconRight='mail-outline' keyboardType='email-address' errorMessage={errors.email?.message} />
          <CustomInput name='username' control={control} placeholder='Sam Smith' label='Nombre de usuario' iconRight='person-outline' keyboardType='name-phone-pad' errorMessage={errors.username?.message} />

          <CustomInput name='password' control={control} placeholder='*********' label='Contraseña' iconRight='eye-off-outline' keyboardType='visible-password' secureTextEntry={true} errorMessage={errors.password?.message} />

          <CustomInput name='confirmPassword' control={control} placeholder='*********' label='Repertir contraseña' iconRight='eye-off-outline' keyboardType='default' secureTextEntry={true} errorMessage={errors.confirmPassword?.message} />
          <TermsAndConditions control={control} Haptics={Haptics} handleTermsClick={handleTermsClick} errors={errors} />

          <CustomButton label={isSubmitting ? "Ingresando..." : "Registrar"} onPress={handleSubmit(onSignUp)} icon='football-outline' disabled={isDisabled || isSubmitting} />
        </View>
      </View>

      <CompleteProfileModal visible={showCompleteProfileModal} onComplete={handleCompleteProfile} />
    </CustomFormView>
  );
};

export default SingUp;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: colors.surface_screen,
    gap: spacing.spacing_l,
    padding: spacing.spacing_l,
    minHeight: "100%",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.spacing_m,
  },
  title: {
    fontSize: typography.h1_bold.size,
    fontWeight: typography.h1_bold.weight.toLowerCase() as "bold",
    color: colors.brand_primary,
  },

  containerInformation: {
    display: "flex",
    gap: spacing.spacing_2xl,
    width: "100%",
  },

  rememberPassword: {
    width: "100%",
    textAlign: "right",
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
