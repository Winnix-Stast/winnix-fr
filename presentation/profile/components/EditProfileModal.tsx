import React, { useMemo } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { User } from '@/core/auth/interface/user';
import { UserProfile } from '@/core/profile/interface/profile.interface';
import { ProfileRoleTab } from '@/presentation/hooks/profile/useProfile';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { ProfileFormValues } from '@/presentation/schemas/profileSchema';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomButton, CustomInput, CustomSelect } from '@/presentation/theme/components';
import { AppModal as CustomModal } from '@/presentation/theme/components/CustomModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  user: User | UserProfile | null | undefined;
  activeRoleTab?: ProfileRoleTab;
  control: any;
  handleSubmit: any;
  errors: any;
  avatarUri: string | null;
  onPickAvatar: () => void;
  onSave: (data: ProfileFormValues) => void;
  isSubmitting: boolean;
  onModalHide?: () => void;
}

const DOCUMENT_TYPES = [
  { label: 'Cédula de Ciudadanía', value: 'CC' },
  { label: 'Tarjeta de Identidad', value: 'TI' },
  { label: 'Pasaporte', value: 'PA' },
  { label: 'Cédula de Extranjería', value: 'CE' },
];

const getInitials = (user: User | UserProfile | null | undefined): string => {
  if (!user) return 'WX';
  if (user.nickname) {
    const parts = user.nickname.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return user.nickname.substring(0, 2).toUpperCase();
  }
  if (user.username) {
    const parts = user.username.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return user.username.substring(0, 2).toUpperCase();
  }
  if (user.email) return user.email.substring(0, 2).toUpperCase();
  return 'WX';
};

const EditProfileModalComponent: React.FC<Props> = ({
  visible,
  onClose,
  user,
  control,
  handleSubmit,
  errors,
  avatarUri,
  onPickAvatar,
  onSave,
  isSubmitting,
  onModalHide,
}) => {
  const currentAvatarUri = avatarUri || user?.avatar;

  const initials = useMemo(
    () => getInitials(user),
    [user?.nickname, user?.username, user?.email],
  );

  const formattedBirthDateDisplay = useMemo(() => {
    const rawUserBirthDate = (user as any)?.birthDate;
    if (!rawUserBirthDate) return 'No registrada';
    const birth = new Date(rawUserBirthDate);
    if (isNaN(birth.getTime())) return 'No registrada';
    const dateStr = birth.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return `${dateStr}`;
  }, [(user as any)?.birthDate]);

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      onModalHide={onModalHide}
      showIcon={true}
      iconColor={Colors.text_primary}
      iconSize={24}
      contentStyle={styles.modalContent}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ width: '100%' }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps='handled'
          >
            {/* Modal Header */}
            <View style={styles.header}>
              <Text style={styles.title}>ACTUALIZAR PERFIL</Text>

              {/* Avatar Image / Fallback Initials */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPickAvatar}
                style={styles.avatarWrapper}
              >
                {currentAvatarUri ? (
                  <Image source={{ uri: currentAvatarUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitialsText}>{initials}</Text>
                  </View>
                )}
                <View style={styles.cameraIconBadge}>
                  <WinnixIcon name='camera' size={16} color={Colors.surface_base} />
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarHint}>Toca la foto para cambiarla</Text>
            </View>

            {/* Editable Form */}
            <View style={styles.form}>
              {/* Personal Info */}
              <Text style={styles.sectionTitle}>Información Personal</Text>
              <CustomInput
                name='username'
                control={control}
                placeholder='Tu nombre completo de usuario'
                label='Nombre de Usuario'
                iconRight='person-outline'
                errorMessage={errors.username?.message}
              />

              <CustomInput
                name='nickname'
                control={control}
                placeholder='Cómo te gusta que te llamen'
                label='Apodo (Identidad en la App)'
                iconRight='game-controller-outline'
                errorMessage={errors.nickname?.message}
              />

              {/* Read-Only BirthDate Input Box */}
              <View style={styles.disabledInputWrapper}>
                <Text style={styles.disabledLabel}>
                  Fecha de Nacimiento (No editable)
                </Text>
                <View style={styles.disabledInputBox}>
                  <WinnixIcon
                    name='calendar-outline'
                    size={22}
                    color={Colors.brand_primary}
                  />
                  <Text style={styles.disabledInputText}>
                    {formattedBirthDateDisplay}
                  </Text>
                  <WinnixIcon
                    name='lock-closed-outline'
                    size={18}
                    color={Colors.neutral_500}
                  />
                </View>
              </View>

              {/* Contact Data */}
              <Text style={styles.sectionTitle}>Datos de Contacto</Text>
              <CustomInput
                name='email'
                control={control}
                placeholder='correo@ejemplo.com'
                label='Correo Electrónico'
                iconRight='mail-outline'
                keyboardType='email-address'
                errorMessage={errors.email?.message}
              />

              <CustomInput
                name='phoneNumber'
                control={control}
                placeholder='Nº de teléfono móvil'
                label='Teléfono Móvil'
                iconRight='call-outline'
                keyboardType='phone-pad'
                errorMessage={errors.phoneNumber?.message}
              />

              {/* Official Identity */}
              <Text style={styles.sectionTitle}>Identificación Oficial</Text>
              <CustomSelect
                name='documentType'
                control={control}
                label='Tipo de Documento'
                placeholder='Seleccionar tipo'
                options={DOCUMENT_TYPES}
                iconLeft='card-outline'
                errorMessage={errors.documentType?.message}
              />
              <CustomInput
                name='idNumber'
                control={control}
                placeholder='Número de documento de identidad'
                label='Número de Documento'
                iconRight='finger-print-outline'
                errorMessage={errors.idNumber?.message}
                keyboardType='number-pad'
              />

              {/* Location */}
              <Text style={styles.sectionTitle}>Ubicación</Text>
              <CustomInput
                name='city'
                control={control}
                placeholder='Ej. Medellín, Bogotá...'
                label='Ciudad'
                iconRight='location-outline'
                errorMessage={errors.city?.message}
              />
              <CustomInput
                name='neighborhood'
                control={control}
                placeholder='Ej. Poblado, Laureles...'
                label='Barrio / Sector'
                iconRight='home-outline'
                errorMessage={errors.neighborhood?.message}
              />

              {/* Actions */}
              <View style={styles.actions}>
                <CustomButton
                  label={isSubmitting ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                  onPress={handleSubmit(onSave)}
                  disabled={isSubmitting}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </CustomModal>
  );
};

export const EditProfileModal = React.memo(EditProfileModalComponent);

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 24,
    width: '92%',
    maxHeight: '88%',
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.brand_primary + '50',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text_primary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: Colors.brand_primary,
  },
  avatarFallback: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface_base,
    borderWidth: 2,
    borderColor: Colors.brand_primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.brand_primary,
    letterSpacing: 1,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.brand_primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface_elevated,
  },
  avatarHint: {
    fontSize: 11,
    color: Colors.brand_primary,
    fontWeight: '700',
  },
  form: {
    gap: 12,
  },
  sectionTitle: {
    color: Colors.text_brand,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface_pressed,
    paddingBottom: 4,
  },
  disabledInputWrapper: {
    gap: 5,
  },
  disabledLabel: {
    fontSize: Fonts.normal,
    color: Colors.primary_50,
    fontWeight: 'bold',
  },
  disabledInputBox: {
    borderWidth: 1,
    borderColor: Colors.neutral_500,
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 12 : 12,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface_base + '80',
  },
  disabledInputText: {
    flex: 1,
    fontSize: Fonts.normal,
    fontWeight: '500',
    color: Colors.primary_50,
  },
  actions: {
    marginTop: 14,
    gap: 10,
  },
});
