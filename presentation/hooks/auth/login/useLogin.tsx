import { NativeModules } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlertStore } from '@/presentation/components/customs';
import { loginSchema } from '@/presentation/schemas/loginSchema';
import { LoginFormData } from '@/presentation/types/LoginFormData';

WebBrowser.maybeCompleteAuthSession();
WebBrowser.maybeCompleteAuthSession();
export const useLogin = () => {
  const { login, loginWithGoogle } = useAuthStore();
  const navigate = useRouter();
  const { showAlert } = useAlertStore();
  const { control, handleSubmit, errors, isSubmitting, isDisabled } =
    useCustomForm<LoginFormData>(loginSchema);

  const onLogin = async (payload: LoginFormData) => {
    const { email, password } = payload;
    const res = await login(email, password);

    if (res.success) {
      if (res.isProfileComplete === false) {
        router.replace('/auth/complete-profile');
      } else {
        router.replace('/winnix/tabs/dashboard');
      }
      return;
    }

    showAlert({
      title: 'Credenciales inválidas',
      message:
        'El correo electrónico o la contraseña son incorrectos. Por favor, intenta de nuevo.',
      type: 'error',
      confirmText: 'Entendido',
    });
  };

  const onGoogleLogin = async () => {
    // 1. Si estamos en Expo Go (sin compilación nativa de GoogleSignin)
    if (!NativeModules.RNGoogleSignin) {
      try {
        const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
        // Coincidencia exacta con la URI 1 registrada en Google Cloud Console: https://auth.expo.io
        const redirectUri = 'https://auth.expo.io';
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
                message: 'No se pudo validar el token real de Google en el servidor.',
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

    // 2. Si estamos en un Build Nativo compilado, usa el SDK nativo oficial
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
          title: 'Error de inicio de sesión',
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
          message: 'No se pudo iniciar sesión con tu cuenta de Google en el servidor.',
          type: 'error',
          confirmText: 'Entendido',
        });
      }
    } catch (error: any) {
      if (statusCodes && error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      } else if (statusCodes && error.code === statusCodes.IN_PROGRESS) {
        return;
      } else if (statusCodes && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showAlert({
          title: 'Servicios de Google no disponibles',
          message: 'Google Play Services no está disponible en este dispositivo.',
          type: 'error',
          confirmText: 'Entendido',
        });
      } else {
        showAlert({
          title: 'Configuración de Google',
          message:
            error.message || 'Asegúrate de haber configurado tu Web Client ID de Google.',
          type: 'info',
          confirmText: 'Entendido',
        });
      }
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onLogin,
    onGoogleLogin,
    navigate,
    Haptics,
  };
};
