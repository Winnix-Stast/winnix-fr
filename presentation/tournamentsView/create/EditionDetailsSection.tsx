import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Control } from 'react-hook-form';
import { CreateEditionFormData } from '@/presentation/schemas/tournamentSchema';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomDatePicker, CustomInput } from '@/presentation/theme/components';

interface EditionDetailsSectionProps {
  control: Control<CreateEditionFormData>;
  errors: any;
}

export const EditionDetailsSection = ({
  control,
  errors,
}: EditionDetailsSectionProps) => {
  return (
    <>
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Detalles de la Edición</Text>

      <CustomInput
        name='seasonName'
        control={control}
        placeholder='Ej. Apertura 2026'
        label='Nombre de la Temporada *'
        iconRight='calendar-outline'
        errorMessage={errors.seasonName?.message}
      />

      <View style={styles.datesContainer}>
        <View style={{ flex: 1 }}>
          <CustomDatePicker
            name='startDate'
            control={control}
            label='Inicio *'
            placeholder='DD/MM/YYYY'
            modalTitle='Día de Apertura'
            errorMessage={errors.startDate?.message}
            allowFutureDates={true}
            minimumDate={new Date()}
          />
        </View>
        <View style={{ width: 15 }} />
        <View style={{ flex: 1 }}>
          <CustomDatePicker
            name='endDate'
            control={control}
            label='Cierre (opcional)'
            placeholder='DD/MM/YYYY'
            modalTitle='Día de Clausura'
            errorMessage={errors.endDate?.message}
            allowFutureDates={true}
            minimumDate={new Date()}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
