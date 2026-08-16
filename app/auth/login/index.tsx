import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLogin } from '@/presentation/hooks/auth/login/useLogin';
import { Colors } from '@/presentation/styles';
import {
  CustomButton,
  CustomFormView,
  CustomInput,
  CustomLink,
  CustomText,
} from '@/presentation/theme/components';

const Login = () => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onLogin,
    onGoogleLogin,
  } = useLogin();

  const phrases = ['Crea', 'Analiza', 'Juega', 'Winnix'];
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
        <Image
          source={require('@/assets/icons/brand/ellipse.png')}
          style={styles.backgroundImage}
          resizeMode='contain'
        />

        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/icons/brand/logoName.png')}
            style={styles.brand}
            resizeMode='contain'
          />
          <Animated.Text style={[styles.animatedText, { opacity: fadeAnim }]}>
            {phrases[index]}
          </Animated.Text>
        </View>

        {/* FORM CONTAINER */}
        <View style={styles.content}>
          <CustomInput
            name='email'
            control={control}
            placeholder='Ingresa tu correo'
            label='Correo electrónico'
            iconRight='mail-outline'
            keyboardType='email-address'
            errorMessage={errors.email?.message}
          />

          <CustomInput
            name='password'
            control={control}
            placeholder='Ingresa tu contraseña'
            label='Contraseña'
            iconRight='eye-off-outline'
            isPassword
            errorMessage={errors.password?.message}
          />

          <CustomLink
            label='¿Olvidaste tu contraseña?'
            href='/auth/forgot-password'
            style={styles.rememberPassword}
          />

          <CustomButton
            label={isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
            onPress={handleSubmit(onLogin)}
            icon='football-outline'
            disabled={isDisabled || isSubmitting}
          />

          {/* DIVIDER */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continúa con</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* GOOGLE BUTTON */}
          <Pressable
            style={({ pressed }) => [
              styles.googleBtnClean,
              pressed && styles.googleBtnPressed,
            ]}
            onPress={onGoogleLogin}
          >
            <View style={styles.googleIconBox}>
              <Ionicons
                name='logo-google'
                size={18}
                color={Colors.brand_primary || '#28D1C3'}
              />
            </View>
            <Text style={styles.googleBtnText}>Continuar con Google</Text>
          </Pressable>

          {/* FOOTER SIGN UP */}
          <View style={styles.signUpContainer}>
            <CustomText style={styles.signUpText} label='¿No tienes cuenta?' />
            <CustomLink label='Regístrate' href='/auth/register' />
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
    flex: 0.35,
    top: '2%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  brand: {
    width: 180,
    height: 55,
  },

  animatedText: {
    marginTop: '6%',
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text_brand,
    letterSpacing: 2,
  },

  backgroundImage: {
    position: 'absolute',
    width: '120%',
    aspectRatio: 1,
    bottom: '-20%',
    left: '-10%',
    opacity: 0.5,
    transform: [{ rotate: '100deg' }],
    zIndex: 0,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 22,
    width: '100%',
    zIndex: 1,
  },

  rememberPassword: {
    width: 'auto',
    alignSelf: 'flex-end',
    marginTop: -4,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  dividerText: {
    color: Colors.text_tertiary,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '500',
  },

  googleBtnClean: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(40, 209, 195, 0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },

  googleBtnPressed: {
    opacity: 0.8,
    backgroundColor: 'rgba(40, 209, 195, 0.18)',
    borderColor: Colors.brand_primary,
  },

  googleIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  googleBtnText: {
    color: Colors.text_primary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 15,
  },

  signUpText: {
    color: Colors.text_primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
