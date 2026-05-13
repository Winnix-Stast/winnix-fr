import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Control } from 'react-hook-form';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { CreateEditionFormData } from '@/presentation/schemas/tournamentSchema';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomSelect } from '@/presentation/theme/components';

interface BrandSectionProps {
  control: Control<CreateEditionFormData>;
  brands: any[];
  error?: string;
}

export const BrandSection = ({ control, brands, error }: BrandSectionProps) => {
  const router = useRouter();

  const brandOptions = brands.map((b) => ({
    label: b.name,
    value: b._id,
  }));

  return (
    <>
      <Text style={styles.sectionTitle}>Marca del Torneo</Text>
      <CustomSelect
        name='tournament'
        control={control}
        options={brandOptions}
        label='Selecciona tu marca *'
        placeholder='Elige una marca...'
        iconLeft='shield-outline'
        errorMessage={error}
      />
      <TouchableOpacity
        style={styles.newBrandLink}
        onPress={() => router.push('/winnix/brand/create')}
      >
        <WinnixIcon name='add-circle-outline' size={18} color={Colors.brand_primary} />
        <Text style={styles.newBrandLinkText}>Crear nueva marca</Text>
      </TouchableOpacity>
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
  newBrandLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  newBrandLinkText: {
    fontSize: Fonts.small,
    color: Colors.brand_primary,
    fontWeight: '600',
  },
});
