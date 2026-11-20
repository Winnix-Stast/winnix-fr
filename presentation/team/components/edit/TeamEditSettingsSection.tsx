import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { TeamFormData } from '@/presentation/schemas/teamSchema';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import { CustomButton, CustomInput } from '@/presentation/theme/components';

interface Props {
  control: Control<TeamFormData>;
  handleSubmit: UseFormHandleSubmit<TeamFormData>;
  errors: FieldErrors<TeamFormData>;
  isSavingGeneral: boolean;
  onSubmitGeneral: (payload: TeamFormData) => Promise<void>;
  sportName: string;
  captainName: string;
  incrementalId: string;
}

export const TeamEditSettingsSection: React.FC<Props> = ({
  control,
  handleSubmit,
  errors,
  isSavingGeneral,
  onSubmitGeneral,
  sportName,
  captainName,
  incrementalId,
}) => {
  return (
    <View style={styles.container}>
      {/* Banner Informativo */}
      <View style={styles.warningBanner}>
        <WinnixIcon
          name='information-circle-outline'
          size={24}
          color={Colors.brand_primary}
        />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.warningTitle}>Configuración de la Escuadra</Text>
          <Text style={styles.warningText}>
            Puedes actualizar el nombre oficial de tu equipo. El deporte y la
            titularidad del capitán son campos fijados para asegurar la
            trazabilidad en los torneos oficiales.
          </Text>
        </View>
      </View>

      {/* Información Modificable */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Modificable</Text>
        <CustomInput
          name='name'
          control={control}
          label='Nombre del Equipo *'
          placeholder='Ej. Los Galácticos FC'
          iconRight='pencil-outline'
          errorMessage={errors.name?.message}
        />
      </View>

      {/* Datos Fijos de la Escuadra */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos Fijos del Equipo</Text>

        {/* Deporte */}
        <View style={styles.readOnlyCard}>
          <View style={styles.readOnlyIconBox}>
            <WinnixIcon name='football-outline' size={20} color={Colors.brand_primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.readOnlyLabel}>Deporte (No modificable)</Text>
            <Text style={styles.readOnlyValue}>{sportName.toUpperCase()}</Text>
          </View>
          <View style={styles.lockedBadge}>
            <WinnixIcon name='lock-closed-outline' size={12} color={Colors.text_tertiary} />
            <Text style={styles.lockedBadgeText}>Fijo</Text>
          </View>
        </View>

        {/* Capitán Titular */}
        <View style={styles.readOnlyCard}>
          <View style={styles.readOnlyIconBox}>
            <WinnixIcon name='star-outline' size={20} color='#F59E0B' />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.readOnlyLabel}>Capitán Titular</Text>
            <Text style={styles.readOnlyValue}>{captainName.toUpperCase()}</Text>
          </View>
          <View style={styles.ownerBadge}>
            <Text style={styles.ownerBadgeText}>DUEÑO</Text>
          </View>
        </View>

        {/* Identificador Oficial */}
        <View style={styles.readOnlyCard}>
          <View style={styles.readOnlyIconBox}>
            <WinnixIcon name='barcode-outline' size={20} color={Colors.text_secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.readOnlyLabel}>Identificador Oficial de Escuadra</Text>
            <Text style={styles.readOnlyValue}>#{incrementalId}</Text>
          </View>
        </View>
      </View>

      {/* Guardado Directo */}
      <View style={styles.submitContainer}>
        <CustomButton
          label={isSavingGeneral ? 'Guardando...' : 'GUARDAR CAMBIOS'}
          onPress={handleSubmit(onSubmitGeneral)}
          disabled={isSavingGeneral}
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
  readOnlyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  readOnlyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readOnlyLabel: {
    fontSize: 11,
    color: Colors.text_tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readOnlyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text_primary,
    marginTop: 2,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  lockedBadgeText: {
    fontSize: 10,
    color: Colors.text_tertiary,
    fontWeight: '600',
  },
  ownerBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ownerBadgeText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  submitContainer: {
    marginTop: 10,
  },
});
