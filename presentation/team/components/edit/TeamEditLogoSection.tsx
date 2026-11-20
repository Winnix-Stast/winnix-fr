import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { TeamFormData } from '@/presentation/schemas/teamSchema';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import { CustomButton, CustomImagePicker } from '@/presentation/theme/components';

interface Props {
  control: Control<TeamFormData>;
  handleSubmit: UseFormHandleSubmit<TeamFormData>;
  errors: FieldErrors<TeamFormData>;
  isSavingVisual: boolean;
  onSubmitVisual: (payload: TeamFormData) => Promise<void>;
}

export const TeamEditLogoSection: React.FC<Props> = ({
  control,
  handleSubmit,
  errors,
  isSavingVisual,
  onSubmitVisual,
}) => {
  return (
    <View style={styles.container}>
      {/* Banner Informativo */}
      <View style={styles.warningBanner}>
        <WinnixIcon
          name='image-outline'
          size={24}
          color={Colors.brand_primary}
        />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.warningTitle}>Escudo Oficial del Equipo</Text>
          <Text style={styles.warningText}>
            Selecciona una imagen en alta definición. Se mostrará con recorte
            circular en clasificaciones, partidos y perfiles oficiales.
          </Text>
        </View>
      </View>

      {/* Selector de Escudo Oficial */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escudo Oficial</Text>
        <CustomImagePicker
          name='logo'
          control={control}
          label='Subir Escudo Oficial (1:1)'
          aspect={[1, 1]}
          isRound={true}
          errorMessage={errors.logo?.message}
        />
      </View>

      {/* Botón de Guardado Directo */}
      <View style={styles.submitContainer}>
        <CustomButton
          label={isSavingVisual ? 'Subiendo Escudo...' : 'GUARDAR ESCUDO'}
          onPress={handleSubmit(onSubmitVisual)}
          disabled={isSavingVisual}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.25)',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.brand_primary,
  },
  warningText: {
    fontSize: 12,
    color: Colors.text_secondary,
    lineHeight: 18,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 6,
    marginBottom: 4,
  },
  submitContainer: {
    marginTop: 10,
  },
});
