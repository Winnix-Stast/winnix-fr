import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TermsAndConditions } from '@/presentation/auth/components/TermsAndConditions/TermsAndConditions';
import { UseSignUp } from '@/presentation/hooks/auth/signup/useSignUp';
import { Colors } from '@/presentation/styles';
import { Fonts } from '@/presentation/styles/global-styles';
import {
  CustomButton,
  CustomDatePicker,
  CustomFormView,
  CustomInput,
  CustomLink,
  CustomSelect,
} from '@/presentation/theme/components/';

const { width } = Dimensions.get('window');

const SignUp = () => {
  const {
    top,
    step,
    roles,
    birthDate,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    handleNextStep,
    handlePrevStep,
    onGoogleSignUp,
    handleTermsClick,
    onFinalSubmit,
    Haptics,
  } = UseSignUp();

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: step === 0 ? 0 : -width,
      useNativeDriver: true,
      bounciness: 6,
      speed: 14,
    }).start();
  }, [step]);

  const isRoleDisabled = !birthDate;

  return (
    <CustomFormView>
      <View style={styles.view}>
        <Image
          source={require('@/assets/icons/brand/ellipse.png')}
          style={styles.backgroundImage}
          resizeMode='contain'
        />

        {/* HEADER */}
        <View style={[styles.header, { marginTop: Math.max(top, 15) }]}>
          <Image
            source={require('@/assets/icons/brand/logoName.png')}
            style={styles.brand}
            resizeMode='contain'
          />
        </View>

        <View style={styles.content}>
          {/* Stepper Indicator */}
          <View style={styles.stepperContainer}>
            <View style={[styles.stepDot, step >= 0 && styles.stepDotActive]}>
              <Ionicons
                name='lock-closed-outline'
                size={16}
                color={step >= 0 ? Colors.surface_base : Colors.neutral_500}
              />
            </View>
            <View style={[styles.stepLine, step >= 1 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
              <Ionicons
                name='person-outline'
                size={16}
                color={step >= 1 ? Colors.surface_base : Colors.neutral_500}
              />
            </View>
          </View>

          <Text style={styles.title}>
            {step === 0 ? 'Credenciales' : 'Perfil Deportivo'}
          </Text>

          {/* Form container with sliding animation */}
          <View style={styles.viewport}>
            <Animated.View
              style={[styles.sliderContainer, { transform: [{ translateX }] }]}
            >
              {/* Step 1: Credentials */}
              <View style={styles.stepPane}>
                <View style={styles.containerInformation}>
                  <CustomInput
                    name='email'
                    control={control}
                    placeholder='Ingresa tu correo electrónico'
                    label='Correo electrónico'
                    iconRight='mail-outline'
                    keyboardType='email-address'
                    errorMessage={errors.email?.message}
                  />

                  <CustomInput
                    name='username'
                    control={control}
                    placeholder='Ej. usuario123'
                    label='Nombre de usuario'
                    iconRight='person-outline'
                    keyboardType='name-phone-pad'
                    errorMessage={errors.username?.message}
                  />

                  <CustomInput
                    name='password'
                    control={control}
                    placeholder='Ingresa tu contraseña'
                    label='Contraseña'
                    isPassword
                    keyboardType='visible-password'
                    errorMessage={errors.password?.message}
                  />

                  <CustomInput
                    name='confirmPassword'
                    control={control}
                    placeholder='Confirma tu contraseña'
                    label='Confirmar contraseña'
                    isPassword
                    keyboardType='default'
                    errorMessage={errors.confirmPassword?.message}
                  />

                  <TermsAndConditions
                    control={control as any}
                    Haptics={Haptics}
                    handleTermsClick={handleTermsClick}
                    errors={errors as any}
                  />

                  <CustomButton
                    label='Siguiente'
                    onPress={handleNextStep}
                    icon='arrow-forward-outline'
                  />

                  {/* DIVIDER */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>o regístrate con</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* SINGLE GOOGLE BUTTON WITH WINNIX BRAND COLOR */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.googleBtnClean,
                      pressed && styles.googleBtnPressed,
                    ]}
                    onPress={onGoogleSignUp}
                  >
                    <View style={styles.googleIconBox}>
                      <Ionicons
                        name='logo-google'
                        size={18}
                        color={Colors.brand_primary}
                      />
                    </View>
                    <Text style={styles.googleBtnText}>Registrarse con Google</Text>
                  </Pressable>

                  <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>¿Ya tienes cuenta?</Text>
                    <CustomLink label='Inicia sesión' href='/auth/login' />
                  </View>
                </View>
              </View>

              {/* Step 2: Profile */}
              <View style={styles.stepPane}>
                <View style={styles.containerInformation}>
                  <CustomDatePicker
                    name='birthDate'
                    control={control}
                    placeholder='YYYY-MM-DD'
                    label='Fecha de Nacimiento'
                    modalTitle='Selecciona tu fecha de nacimiento'
                    errorMessage={errors.birthDate?.message}
                  />

                  <CustomInput
                    name='phone'
                    control={control}
                    placeholder='3001234567'
                    label='Número de teléfono'
                    iconRight='call-outline'
                    keyboardType='phone-pad'
                    errorMessage={errors.phone?.message}
                  />

                  <CustomSelect
                    name='roleType'
                    disabled={isRoleDisabled}
                    control={control}
                    label='Rol en la cancha'
                    placeholder='Selecciona un rol'
                    options={roles}
                    iconLeft='person-outline'
                    errorMessage={errors.roleType?.message}
                  />

                  <View style={styles.buttonsRow}>
                    <CustomButton
                      label='Atrás'
                      onPress={handlePrevStep}
                      outline={true}
                      stylePressable={{ flex: 1 }}
                    />
                    <CustomButton
                      label={isSubmitting ? 'Guardando...' : 'Crear cuenta'}
                      onPress={handleSubmit(onFinalSubmit)}
                      icon='football-outline'
                      disabled={isDisabled || isSubmitting}
                      stylePressable={{ flex: 1.5 }}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </CustomFormView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Colors.surface_base,
    minHeight: '100%',
    position: 'relative',
  },
  header: {
    flex: 0.18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    width: 180,
    height: 55,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
    zIndex: 0,
    top: '-20%',
    transform: [{ rotate: '200deg' }],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    zIndex: 1,
    paddingTop: 10,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: Colors.neutral_500,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepDotActive: {
    backgroundColor: Colors.actions_primary_bg,
    borderColor: Colors.actions_primary_bg,
    shadowColor: Colors.actions_primary_bg,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  stepLine: {
    width: 60,
    height: 3,
    backgroundColor: Colors.neutral_500,
    marginHorizontal: -5,
    zIndex: 1,
  },
  stepLineActive: {
    backgroundColor: Colors.actions_primary_bg,
    shadowColor: Colors.actions_primary_bg,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontSize: Fonts.extraLarge,
    fontWeight: 'bold',
    color: Colors.text_brand,
    marginBottom: 15,
  },
  viewport: {
    width: width,
    overflow: 'hidden',
    flex: 1,
  },
  sliderContainer: {
    flexDirection: 'row',
    width: width * 2,
    flex: 1,
  },
  stepPane: {
    width: width,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  containerInformation: {
    display: 'flex',
    gap: 14,
    width: '100%',
    paddingBottom: 40,
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
    color: Colors.text_tertiary || '#6E7C96',
    paddingHorizontal: 10,
    fontSize: 12,
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
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    borderColor: Colors.brand_primary || '#28D1C3',
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
    color: Colors.text_primary || '#F5F7FA',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  signUpText: {
    color: Colors.text_primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
