import { User } from '@/core/auth/interface/user';
import { UserProfile } from '@/core/profile/interface/profile.interface';
import { CustomModal } from '@/presentation/components/customs';
import { ProfileRoleTab } from '@/presentation/hooks/profile/useProfile';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { ProfileFormValues } from '@/presentation/schemas/profileSchema';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomButton, CustomInput, CustomSelect } from '@/presentation/theme/components';
import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
      showCloseButton={true}
      header={
        <View style={styles.modalHeaderRow}>
          <WinnixIcon name='person-outline' size={18} color={Colors.brand_primary} />
          <Text style={styles.modalTitle}>ACTUALIZAR PERFIL</Text>
        </View>
      }
      footer={
        <CustomButton
          label={isSubmitting ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
          onPress={handleSubmit(onSave)}
          disabled={isSubmitting}
          icon='checkmark-outline'
          iconColor='#030819'
          iconSize={16}
        />
      }
      scrollable={true}
    >
      <View style={styles.bodyContent}>
        {/* Avatar Image / Fallback Initials */}
        <View style={styles.avatarSection}>
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
              <WinnixIcon name='camera' size={15} color={Colors.surface_base} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Toca la foto para cambiarla</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Personal Info */}
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <CustomInput
            name='username'
            control={control}
            placeholder='Tu nombre completo de usuario'
            label='Nombre de Usuario'
            iconRight='person-outline'
            autoCapitalize='words'
            errorMessage={errors.username?.message}
          />

          <CustomInput
            name='nickname'
            control={control}
            placeholder='Cómo te gusta que te llamen'
            label='Apodo (Identidad en la App)'
            iconRight='game-controller-outline'
            autoCapitalize='words'
            errorMessage={errors.nickname?.message}
          />

          {/* Read-Only BirthDate Input Box */}
          <View style={styles.disabledInputWrapper}>
            <Text style={styles.disabledLabel}>Fecha de Nacimiento (No editable)</Text>
            <View style={styles.disabledInputBox}>
              <WinnixIcon
                name='calendar-outline'
                size={20}
                color={Colors.brand_primary}
              />
              <Text style={styles.disabledInputText}>
                {formattedBirthDateDisplay}
              </Text>
              <WinnixIcon
                name='lock-closed-outline'
                size={16}
                color={Colors.neutral_500}
              />
            </View>
          </View>

          {/* Contact Data & Privacy Consent */}
          <Text style={styles.sectionTitle}>Datos de Contacto & Privacidad</Text>
          <CustomInput
            name='email'
            control={control}
            placeholder='correo@ejemplo.com'
            label='Correo Electrónico'
            iconRight='mail-outline'
            keyboardType='email-address'
            autoCapitalize='none'
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

          {/* Checkbox de Consentimiento Legal de Visibilidad Pública */}
          <Controller
            control={control}
            name='isContactInfoPublic'
            render={({ field: { value, onChange } }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onChange(!value);
                }}
                style={[
                  styles.consentCard,
                  value ? styles.consentCardActive : styles.consentCardInactive,
                ]}
              >
                <View style={styles.consentHeaderRow}>
                  {/* Checkbox interactivo estilo Winnix */}
                  <View
                    style={[
                      styles.checkboxBase,
                      value && styles.checkboxActive,
                    ]}
                  >
                    {Boolean(value) && (
                      <WinnixIcon name='checkmark' size={16} color='#030819' />
                    )}
                  </View>

                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={styles.consentTitleRow}>
                      <Text style={styles.consentTitle}>
                        Hacer pública mi información de contacto
                      </Text>
                      <View
                        style={[
                          styles.consentBadge,
                          value ? styles.consentBadgePublic : styles.consentBadgePrivate,
                        ]}
                      >
                        <Text
                          style={[
                            styles.consentBadgeText,
                            value ? styles.consentBadgeTextPublic : styles.consentBadgeTextPrivate,
                          ]}
                        >
                          {value ? 'PÚBLICO' : 'PRIVADO'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.consentSub}>
                      Permite que capitanes y reclutadores vean tu correo y teléfono para convocatorias deportivas.
                    </Text>
                  </View>
                </View>

                <View style={styles.consentFooterNote}>
                  <WinnixIcon
                    name='shield-checkmark-outline'
                    size={14}
                    color={value ? Colors.brand_primary : Colors.text_tertiary}
                  />
                  <Text style={styles.consentFooterText}>
                    Consentimiento informado: Podrás cambiar esta preferencia cuando quieras. Se registrará la fecha y hora de la modificación.
                  </Text>
                </View>
              </TouchableOpacity>
            )}
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
            autoCapitalize='words'
            errorMessage={errors.city?.message}
          />
          <CustomInput
            name='neighborhood'
            control={control}
            placeholder='Ej. Poblado, Laureles...'
            label='Barrio / Sector'
            iconRight='home-outline'
            autoCapitalize='words'
            errorMessage={errors.neighborhood?.message}
          />
        </View>
      </View>
    </CustomModal>
  );
};

export const EditProfileModal = React.memo(EditProfileModalComponent);

const styles = StyleSheet.create({
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text_primary,
    letterSpacing: 0.8,
  },
  bodyContent: {
    paddingBottom: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: Colors.brand_primary,
  },
  avatarFallback: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.surface_base,
    borderWidth: 2,
    borderColor: Colors.brand_primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 26,
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
    marginTop: 6,
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
  consentCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    gap: 12,
    marginVertical: 6,
  },
  consentCardActive: {
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderColor: 'rgba(40, 209, 195, 0.4)',
  },
  consentCardInactive: {
    backgroundColor: 'rgba(14, 21, 41, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  consentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.neutral_500,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  consentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  consentTitle: {
    color: Colors.text_primary,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  consentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  consentBadgePublic: {
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    borderWidth: 1,
    borderColor: Colors.brand_primary,
  },
  consentBadgePrivate: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  consentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  consentBadgeTextPublic: {
    color: Colors.brand_primary,
  },
  consentBadgeTextPrivate: {
    color: Colors.text_tertiary,
  },
  consentSub: {
    color: Colors.text_secondary,
    fontSize: 13,
    lineHeight: 18,
  },
  consentFooterNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.07)',
  },
  consentFooterText: {
    flex: 1,
    color: Colors.text_tertiary,
    fontSize: 11,
    lineHeight: 16,
  },
});
