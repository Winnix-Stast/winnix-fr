import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Control } from 'react-hook-form';
import { CreateEditionFormData } from '@/presentation/schemas/tournamentSchema';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomImagePicker } from '@/presentation/theme/components';

interface PersonalizationSectionProps {
  control: Control<CreateEditionFormData>;
  errors: any;
}

export const PersonalizationSection = ({
  control,
  errors,
}: PersonalizationSectionProps) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Identidad Visual</Text>
      <Text style={styles.sectionSubtitle}>
        Dale vida a tu torneo. Una buena imagen atrae más equipos.
      </Text>

      <View style={styles.datesContainer}>
        <View style={{ flex: 1 }}>
          <CustomImagePicker
            name='image'
            control={control}
            label='📸 Póster del Torneo'
            errorMessage={errors.image?.message}
            aspect={[16, 9]}
          />
        </View>
        <View style={{ width: 15 }} />
        <View style={{ flex: 0.8 }}>
          <CustomImagePicker
            name='logo'
            control={control}
            label='🏆 Logo'
            errorMessage={errors.logo?.message}
            isRound={true}
            aspect={[1, 1]}
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
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.text_tertiary,
    fontStyle: 'italic',
    marginBottom: 4,
    marginTop: -2,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
