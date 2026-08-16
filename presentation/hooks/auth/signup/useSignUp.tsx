import { useMemo, useState } from 'react';
import { Linking, NativeModules } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { router, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Role } from '@/core/auth/auth.adapter';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { useRoles } from '@/presentation/hooks/roles/useRoles';
import {
  SignUpWizardData,
  signUpWizardSchema,
} from '@/presentation/schemas/signUpWizardSchema';

WebBrowser.maybeCompleteAuthSession();

export const UseSignUp = () => {
  const navigate = useRouter();
  const { top } = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const { showAlert } = useAlertStore();

  const { control, handleSubmit, errors, isSubmitting, isDisabled, trigger, watch } =
    useCustomForm<SignUpWizardData>(signUpWizardSchema);

  const { signup, loginWithGoogle } = useAuthStore();
  const { data: apiRoles = [], isLoading: isLoadingRoles } = useRoles();

  const birthDate = watch('birthDate');

  const roles = useMemo(() => {
    if (isLoadingRoles || !apiRoles.length) return [];

    const formatRoleName = (name: string) => {
      switch (name.toLowerCase()) {
        case 'organizer':
          return 'Organizador';
        case 'tournament manager':
          return 'Co-Organizador';
        case 'captain':
          return 'Capitán';
        case 'player':
          return 'Jugador';
        case 'judge':
          return 'Árbitro';
        default:
          return name.charAt(0).toUpperCase() + name.slice(1);
      }
    };

    const formattedRoles = apiRoles.map((role: Role) => ({
      label: formatRoleName(role.name),
      value: role._id as string,
      name: role.name.toLowerCase(),
    }));

    if (!birthDate) {
      return formattedRoles
        .filter((r: any) => r.name === 'captain' || r.name === 'player')
        .map(({ label, value }: any) => ({ label, value }));
    }

    const calculateAge = (dateString: Date) => {
      const today = new Date();
      const dob = new Date(dateString);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age;
    };

    const userAge = calculateAge(birthDate as Date);

    if (userAge >= 18) {
      return formattedRoles.map(({ label, value }: any) => ({ label, value }));
    } else {
      return formattedRoles
        .filter((r: any) => r.name === 'captain' || r.name === 'player')
        .map(({ label, value }: any) => ({ label, value }));
    }
  }, [apiRoles, isLoadingRoles, birthDate]);

  const handleNextStep = async () => {
    const isStep1Valid = await trigger([
      'email',
      'username',
      'password',
      'confirmPassword',
      'isChecked',
    ]);

    if (isStep1Valid) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(1);
    }
  };

  const handlePrevStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(0);
  };

  const onGoogleSignUp = async () => {
    // 1. Si estamos en Expo Go, usamos el flujo WebBrowser real de Google OAuth
    if (!NativeModules.RNGoogleSignin) {
      try {
        const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
        // Coincidencia exacta con la URI 1 registrada en Google Cloud Console: https://auth.expo.io
        const redirectUri = 'https://auth.expo.io';

        console.log('==========================================');
        console.log('[EXPO OAUTH REDIRECT URI] 👉 ', redirectUri);
        console.log('==========================================');

        const nonce = Math.random().toString(36).substring(2);

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
          clientId || '',
        )}&redirect_uri=${encodeURIComponent(
          redirectUri,
        )}&response_type=id_token&scope=${encodeURIComponent(
          'openid email profile',
        )}&nonce=${nonce}`;

        const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

        if (result.type === 'success' && result.url) {
          const match = result.url.match(/id_token=([^&]+)/);
          const realIdToken = match ? decodeURIComponent(match[1]) : null;

          if (realIdToken) {
            const res = await loginWithGoogle(realIdToken);
            if (res.success) {
              if (res.isProfileComplete === false) {
                router.replace('/auth/complete-profile');
              } else {
                router.replace('/winnix/tabs/dashboard');
              }
            } else {
              showAlert({
                title: 'Error de autenticación',
                message: 'No se pudo registrar tu cuenta de Google en el servidor.',
                type: 'error',
                confirmText: 'Entendido',
              });
            }
            return;
          }
        }
      } catch (webErr) {
        console.error('WebBrowser Google Auth error :>> ', webErr);
      }
      return;
    }

    // 2. Si estamos en un Build Nativo compilado, usamos el SDK nativo oficial
    let GoogleSigninModule: any;
    let statusCodes: any;

    try {
      const GoogleModule = require('@react-native-google-signin/google-signin');
      GoogleSigninModule = GoogleModule.GoogleSignin;
      statusCodes = GoogleModule.statusCodes;
    } catch (e) {
      showAlert({
        title: 'Error de Módulo',
        message: 'No se pudo cargar la librería nativa de Google.',
        type: 'error',
        confirmText: 'Entendido',
      });
      return;
    }

    try {
      await GoogleSigninModule.hasPlayServices();
      GoogleSigninModule.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      });
      const response = await GoogleSigninModule.signIn();

      const idToken = response.data?.idToken || response.idToken;
      if (!idToken) {
        showAlert({
          title: 'Error de registro',
          message: 'No se pudo obtener el token de autenticación de Google.',
          type: 'error',
          confirmText: 'Entendido',
        });
        return;
      }

      const res = await loginWithGoogle(idToken);
      if (res.success) {
        if (res.isProfileComplete === false) {
          router.replace('/auth/complete-profile');
        } else {
          router.replace('/winnix/tabs/dashboard');
        }
      } else {
        showAlert({
          title: 'Error de autenticación',
          message: 'No se pudo registrar con tu cuenta de Google.',
          type: 'error',
          confirmText: 'Entendido',
        });
      }
    } catch (error: any) {
      if (statusCodes && error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      } else if (statusCodes && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showAlert({
          title: 'Servicios no disponibles',
          message: 'Google Play Services no está disponible en este dispositivo.',
          type: 'error',
          confirmText: 'Entendido',
        });
      }
    }
  };

  const onFinalSubmit = async (payload: SignUpWizardData) => {
    try {
      const wasSuccessful = await signup({
        email: payload.email,
        username: payload.username,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
        isChecked: payload.isChecked,
        phone: parseInt(payload.phone, 10),
        birthDate: payload.birthDate?.toISOString() as string,
        roleType: payload.roleType,
      });

      if (!wasSuccessful.success) {
        showAlert({
          title: 'Error de registro',
          message: 'No se pudo registrar el usuario. Es posible que el correo ya exista.',
          type: 'error',
          confirmText: 'Entendido',
        });
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/winnix/tabs/dashboard');
    } catch (error) {
      console.error('Error completando perfil:', error);
      showAlert({
        title: 'Error al completar perfil',
        message:
          'Tu cuenta fue creada pero hubo un error al guardar tu información adicional.',
        type: 'warning',
        confirmText: 'Continuar',
        onConfirm: () => router.replace('/winnix/tabs/dashboard'),
      });
    }
  };

  const handleTermsClick = () => {
    Linking.openURL('https://example.com/terms');
  };

  return {
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
    onFinalSubmit,
    navigate,
    Haptics,
    handleTermsClick,
  };
};
