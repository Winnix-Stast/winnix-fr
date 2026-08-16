import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/presentation/components/customs';
import { useCreateBrand } from '@/presentation/hooks/brands/useCreateBrand';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import {
  CustomButton,
  CustomFormView,
  CustomImagePicker,
  CustomInput,
} from '@/presentation/theme/components/';

export default function CreateBrandScreen() {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    handleGoBack,
  } = useCreateBrand();

  return (
    <CustomFormView>
      <View style={styles.scrollContent}>
        <ScreenHeader title='Nueva Marca' onBack={handleGoBack} />

        <View style={styles.formContainer}>
          <View style={styles.infoCard}>
            <WinnixIcon
              name='information-circle-outline'
              size={20}
              color={Colors.brand_primary}
            />
            <Text style={styles.infoText}>
              Define el nombre y logo oficial con el que se identificará tu liga de
              torneos.
            </Text>
          </View>

          <View style={styles.logoContainer}>
            <CustomImagePicker
              name='logo'
              control={control}
              label='Logo de la Marca'
              errorMessage={errors.logo?.message}
              isRound={true}
              aspect={[1, 1]}
            />
          </View>

          <CustomInput
            name='name'
            control={control}
            placeholder='Ej. Copa Élite Nacional'
            label='Nombre de la Marca *'
            iconRight='trophy-outline'
            errorMessage={errors.name?.message}
          />

          <View style={styles.submitContainer}>
            <CustomButton
              label={isSubmitting ? 'Creando...' : 'CREAR MARCA'}
              onPress={handleSubmit(onSubmit)}
              icon='flash-outline'
              disabled={isDisabled || isSubmitting}
            />
          </View>
        </View>
      </View>
    </CustomFormView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },

  formContainer: {
    paddingHorizontal: 20,
    gap: 18,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.surface_pressed,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border_focus,
  },
  infoText: {
    flex: 1,
    fontSize: Fonts.small,
    color: Colors.text_secondary,
    lineHeight: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  submitContainer: {
    marginTop: 20,
  },
});
