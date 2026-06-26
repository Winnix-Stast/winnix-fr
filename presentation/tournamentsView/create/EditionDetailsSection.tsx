import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Control, useWatch } from 'react-hook-form';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { CreateEditionFormData } from '@/presentation/schemas/tournamentSchema';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import {
  CustomDatePicker,
  CustomInput,
  CustomSelect,
} from '@/presentation/theme/components';

interface EditionDetailsSectionProps {
  control: Control<CreateEditionFormData>;
  errors: any;
}

export const EditionDetailsSection = ({
  control,
  errors,
}: EditionDetailsSectionProps) => {
  const status = useWatch({ control, name: 'status', defaultValue: 'DRAFT' });

  const statusOptions = [
    { label: 'Próximamente (Borrador)', value: 'DRAFT' },
    { label: 'Inscripciones Abiertas', value: 'REGISTRATION_OPEN' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Detalles de la Edición</Text>

      <CustomInput
        name='seasonName'
        control={control}
        placeholder='Ej. Apertura 2026'
        label='Nombre de la Temporada *'
        iconRight='calendar-outline'
        errorMessage={errors.seasonName?.message}
      />

      <CustomDatePicker
        name='startDate'
        control={control}
        label='Fecha de Inicio de Inscripciones *'
        placeholder='DD/MM/YYYY'
        modalTitle='Día de Apertura'
        errorMessage={errors.startDate?.message}
        allowFutureDates={true}
        minimumDate={new Date()}
      />

      <CustomDatePicker
        name='endDate'
        control={control}
        label='Fecha de Finalización del Torneo (Opcional)'
        placeholder='DD/MM/YYYY'
        modalTitle='Día de Clausura'
        errorMessage={errors.endDate?.message}
        allowFutureDates={true}
        minimumDate={new Date()}
      />

      <CustomSelect
        name='status'
        control={control}
        options={statusOptions}
        label='Estado Inicial del Torneo *'
        placeholder='Elige el estado del torneo...'
        iconLeft='flag-outline'
        errorMessage={errors.status?.message}
      />

      <View style={styles.statusInfoBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <WinnixIcon
            name={status === 'REGISTRATION_OPEN' ? 'rocket-outline' : 'time-outline'}
            size={18}
            color={Colors.brand_primary}
          />
          <Text style={styles.statusInfoTitle}>
            {status === 'REGISTRATION_OPEN' ? 'Inscripciones Abiertas' : 'Próximamente'}
          </Text>
        </View>
        <Text style={styles.statusInfoText}>
          {status === 'REGISTRATION_OPEN'
            ? 'El torneo queda activo inmediatamente. Los capitanes y equipos podrán iniciar su proceso de inscripción desde la app.'
            : 'El torneo queda guardado como borrador. Se mostrará en la app con la etiqueta "Próximamente", pero los equipos no podrán inscribirse todavía.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: Fonts.normal,
    fontWeight: '600',
    color: Colors.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_focus,
    paddingBottom: 5,
    marginBottom: 5,
  },
  statusInfoBox: {
    backgroundColor: Colors.surface_base,
    borderWidth: 1,
    borderColor: Colors.border_focus,
    borderRadius: 12,
    padding: 14,
    marginTop: 2,
    gap: 8,
  },
  statusInfoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.brand_primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusInfoText: {
    fontSize: 12,
    color: Colors.text_secondary,
    lineHeight: 18,
  },
});
