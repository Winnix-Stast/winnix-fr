import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { authActions } from '@/core/auth/actions/auth-actions';
import { AuthAdapter, Role } from '@/core/auth/auth.adapter';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
import { Colors } from '@/presentation/styles';
import { Fonts } from '@/presentation/styles/global-styles';
import {
  CustomButton,
  CustomDatePicker,
  CustomFormView,
  CustomInput,
  CustomSelect,
} from '@/presentation/theme/components';

const schema = yup.object().shape({
  birthDate: yup.string().required('La fecha de nacimiento es obligatoria'),
  phone: yup
    .number()
    .typeError('El teléfono debe ser un número')
    .required('El teléfono es obligatorio'),
  roleType: yup.string().required('Selecciona un rol en la cancha'),
});

const CompleteProfile = () => {
  const router = useRouter();
  const { showAlert } = useAlertStore();
  const { checkStatus } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [availableRoles, setAvailableRoles] = useState<
    { label: string; value: string }[]
  >([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      birthDate: '',
      phone: undefined as any,
      roleType: '',
    },
  });

  const selectedBirthDate = useWatch({ control, name: 'birthDate' });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await AuthAdapter.getRoles();
        setAllRoles(roles);
      } catch (err) {
        console.error('Error fetching roles :>> ', err);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!selectedBirthDate || allRoles.length === 0) return;

    const birth = new Date(selectedBirthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    const isMinor = age < 18;

    const filtered = allRoles
      .filter((r) => {
        if (isMinor && r.name.toLowerCase() === 'organizer') {
          return false;
        }
        return true;
      })
      .map((r) => ({
        label: r.label || r.name.charAt(0).toUpperCase() + r.name.slice(1),
        value: r._id,
      }));

    setAvailableRoles(filtered);
  }, [selectedBirthDate, allRoles]);

  const onSubmit = async (data: { birthDate: any; phone: any; roleType: string }) => {
    try {
      setLoading(true);
      const formattedBirthDate = data.birthDate
        ? new Date(data.birthDate).toISOString()
        : new Date().toISOString();

      await authActions.completeProfile({
        birthDate: formattedBirthDate,
        phone: Number(data.phone),
        role: data.roleType,
      });

      await checkStatus();

      showAlert({
        title: '¡Perfil completado! ⚽',
        message: 'Tus datos se han guardado con éxito. ¡Bienvenido a Winnix!',
        type: 'success',
        confirmText: 'Ir al Dashboard',
      });

      router.replace('/winnix/tabs/dashboard');
    } catch (error: any) {
      const errorMsg = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message.join(', ')
        : error.response?.data?.message ||
          'No se pudieron actualizar tus datos. Intenta de nuevo.';

      showAlert({
        title: 'Error al guardar',
        message: errorMsg,
        type: 'error',
        confirmText: 'Entendido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomFormView>
      <View style={styles.view}>
        <Image
          source={require('@/assets/icons/brand/ellipse.png')}
          style={styles.backgroundImage}
          resizeMode='contain'
        />

        <View style={styles.header}>
          <Image
            source={require('@/assets/icons/brand/logoName.png')}
            style={styles.brand}
            resizeMode='contain'
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Completa tu perfil deportivo</Text>
          <Text style={styles.subtitle}>
            Para preparar tu experiencia en la cancha, selecciona tu fecha de nacimiento y
            rol.
          </Text>

          <CustomDatePicker
            name='birthDate'
            control={control}
            label='Fecha de nacimiento'
            placeholder='YYYY-MM-DD'
            modalTitle='Selecciona tu fecha de nacimiento'
            errorMessage={errors.birthDate?.message}
          />

          <CustomInput
            name='phone'
            control={control}
            label='Número de teléfono'
            placeholder='Ej. 3001234567'
            iconRight='call-outline'
            keyboardType='phone-pad'
            errorMessage={errors.phone?.message}
          />

          <CustomSelect
            name='roleType'
            control={control}
            label='Rol en la cancha'
            placeholder='Selecciona un rol'
            options={availableRoles}
            disabled={!selectedBirthDate}
            iconLeft='person-outline'
            errorMessage={errors.roleType?.message}
          />

          <CustomButton
            label={loading ? 'Guardando...' : 'Completar mi perfil'}
            onPress={handleSubmit(onSubmit)}
            icon='football-outline'
            disabled={loading || !selectedBirthDate}
          />
        </View>
      </View>
    </CustomFormView>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: Colors.surface_base,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  brand: {
    width: 180,
    height: 60,
  },
  backgroundImage: {
    position: 'absolute',
    width: '120%',
    aspectRatio: 1,
    bottom: '-20%',
    left: '-10%',
    opacity: 0.8,
    transform: [{ rotate: '100deg' }],
    zIndex: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    zIndex: 1,
  },
  title: {
    fontSize: Fonts.extraLarge,
    fontWeight: 'bold',
    color: Colors.text_brand,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Fonts.normal,
    color: Colors.text_secondary || '#C2CAD6',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
});
