import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Control, UseFormSetValue } from 'react-hook-form';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { CreateEditionFormData } from '@/presentation/schemas/tournamentSchema';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomInput } from '@/presentation/theme/components';

interface ConfigSectionProps {
  control: Control<CreateEditionFormData>;
  selectedTemplate: any;
  setValue: UseFormSetValue<CreateEditionFormData>;
  errors: any;
}

export const ConfigSection = ({
  control,
  selectedTemplate,
  setValue,
  errors,
}: ConfigSectionProps) => {
  // Cuando cambia la plantilla, rellenamos los campos de configuración por defecto
  useEffect(() => {
    if (selectedTemplate) {
      setValue('playersPerTeam', selectedTemplate.playersPerTeam);
      setValue('matchDuration', selectedTemplate.matchDuration);
      setValue('scoring.win', selectedTemplate.scoring?.win ?? 3);
      setValue('scoring.draw', selectedTemplate.scoring?.draw ?? 1);
      setValue('scoring.loss', selectedTemplate.scoring?.loss ?? 0);
      setValue('config', selectedTemplate.config || {});
    }
  }, [selectedTemplate, setValue]);

  if (!selectedTemplate) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Personalizar Reglas de Juego</Text>
      <Text style={styles.sectionSubtitle}>
        Hemos cargado los valores por defecto de la plantilla, pero puedes ajustarlos para
        este torneo específico.
      </Text>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <CustomInput
            name='playersPerTeam'
            control={control}
            label='Jugadores por equipo'
            styleLabel={{ minHeight: 35 }}
            placeholder='Ej: 5'
            keyboardType='numeric'
            iconRight='people-outline'
            errorMessage={errors.playersPerTeam?.message}
          />
        </View>
        <View style={{ width: 15 }} />
        <View style={{ flex: 1 }}>
          <CustomInput
            name='matchDuration'
            control={control}
            label='Duración (min)'
            styleLabel={{ minHeight: 35 }}
            placeholder='Ej: 40'
            keyboardType='numeric'
            iconRight='time-outline'
            errorMessage={errors.matchDuration?.message}
          />
        </View>
      </View>

      <Text style={styles.subTitle}>Sistema de Puntuación</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <CustomInput
            name='scoring.win'
            control={control}
            label='Victoria'
            styleLabel={{ minHeight: 20 }}
            placeholder='3'
            keyboardType='numeric'
          />
        </View>
        <View style={{ width: 10 }} />
        <View style={{ flex: 1 }}>
          <CustomInput
            name='scoring.draw'
            control={control}
            label='Empate'
            styleLabel={{ minHeight: 20 }}
            placeholder='1'
            keyboardType='numeric'
          />
        </View>
        <View style={{ width: 10 }} />
        <View style={{ flex: 1 }}>
          <CustomInput
            name='scoring.loss'
            control={control}
            label='Derrota'
            styleLabel={{ minHeight: 20 }}
            placeholder='0'
            keyboardType='numeric'
          />
        </View>
      </View>

      {selectedTemplate.config?.rules && (
        <View style={styles.infoBox}>
          <WinnixIcon
            name='information-circle-outline'
            size={20}
            color={Colors.text_secondary}
          />
          <Text style={styles.infoText}>
            Otras reglas específicas de {selectedTemplate.name} se aplicarán
            automáticamente.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    gap: 12,
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
    marginBottom: 0,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.text_tertiary,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text_secondary,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surface_pressed,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text_secondary,
    flex: 1,
  },
});
