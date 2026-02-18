import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";

import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useLogin } from "@/presentation/hooks/auth/login/useLogin";
import { Colors } from "@/presentation/styles";
import { Fonts } from "@/presentation/styles/global-styles";
import { CustomButton, CustomFormView, CustomInput, CustomLink, CustomText } from "@/presentation/theme/components";

const Login = () => {
  const { t } = useTranslation("auth");
  const { control, handleSubmit, errors, isSubmitting, isDisabled, onLogin } = useLogin();

  const phrases = ["Crea", "Analiza", "Juega", "Winnix"];
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    };

    animate();

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
      animate();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CustomFormView>
      <View style={styles.view}>
        <Image source={require("@/assets/icons/brand/ellipse.png")} style={styles.backgroundImage} resizeMode='contain' />

        {/* HEADER */}
        <View style={styles.header}>
          <Image source={require("@/assets/icons/brand/logoName.png")} style={styles.brand} resizeMode='contain' />

          <Animated.Text style={[styles.animatedText, { opacity: fadeAnim }]}>{phrases[index]}</Animated.Text>
        </View>

        {/* FORM */}
        <View style={styles.content}>
          <CustomInput name='email' control={control} placeholder={t("login.emailPlaceholder")} label={t("login.emailLabel")} iconRight='mail-outline' keyboardType='email-address' errorMessage={errors.email?.message} />

          <CustomInput name='password' control={control} placeholder={t("login.passwordPlaceholder")} label={t("login.passwordLabel")} iconRight='eye-off-outline' isPassword errorMessage={errors.password?.message} />

          <CustomLink label={t("login.rememberPassword")} href='/' style={styles.rememberPassword} />

          <CustomButton label={isSubmitting ? t("login.submitting") : t("login.submitButton")} onPress={handleSubmit(onLogin)} icon='football-outline' disabled={isDisabled || isSubmitting} />

          <View style={styles.signUpContainer}>
            <CustomText style={styles.signUpText} label={t("login.noAccount")} />
            <CustomLink label={t("login.signUp")} href='/auth/register' />
          </View>
        </View>
      </View>
    </CustomFormView>
  );
};

export default Login;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: Colors.surface_base,
    gap: 10,
  },

  header: {
    flex: 0.4,
    top: "2%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  brand: {
    width: 180,
    height: 60,
  },

  animatedText: {
    marginTop: "10%",
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text_brand,
    letterSpacing: 2,
  },

  backgroundImage: {
    position: "absolute",
    width: "120%",
    aspectRatio: 1,
    bottom: "-20%",
    left: "-10%",
    opacity: 0.8,
    transform: [{ rotate: "100deg" }],
    zIndex: 0,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 20,
    width: "100%",
    zIndex: 1,
    marginTop: 10,
  },

  title: {
    fontSize: Fonts.extraLarge,
    fontWeight: "bold",
    color: Colors.primary_100,
    paddingTop: 20,
  },

  rememberPassword: {
    width: "auto",
    alignSelf: "flex-end",
  },

  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 30,
  },

  signUpText: {
    color: Colors.text_primary,
    fontWeight: "bold",
    fontSize: 20,
  },
});
