import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/presentation/components/customs';
import { useCreateTeam } from '@/presentation/hooks/teams/useCreateTeam';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import {
  CustomButton,
  CustomFormView,
  CustomImagePicker,
  CustomInput,
  CustomSelect,
} from '@/presentation/theme/components';

const CreateTeamScreen = () => {
  const {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    isDisabled,
    errors,
    handleGoBack,
    sportOptions,
  } = useCreateTeam();

  return (
    <CustomFormView>
      <ScrollView
        contentContainerStyle={[styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera reutilizable de la aplicación */}
        <ScreenHeader title='Crear Equipo' onBack={handleGoBack} />

        <View style={styles.formContainer}>
          <View style={styles.infoBox}>
            <WinnixIcon
              name='information-circle-outline'
              size={20}
              color={Colors.brand_primary}
            />
            <Text style={styles.infoText}>
              Como capitán, serás responsable de inscribir a tu equipo en torneos y
              gestionar a tus jugadores.
            </Text>
          </View>

          {/* Carga de escudo / logo de equipo */}
          <View style={styles.logoWrapper}>
            <CustomImagePicker
              name='logo'
              control={control}
              label='Escudo / Logo del Equipo'
              errorMessage={errors.logo?.message}
              isRound={true}
              aspect={[1, 1]}
            />
          </View>

          <CustomInput
            name='name'
            control={control}
            label='Nombre del Equipo *'
            placeholder='Ej: Los Galácticos FC'
            iconRight='people-outline'
            errorMessage={errors.name?.message}
          />

          <CustomSelect
            name='sport'
            control={control}
            label='Deporte *'
            placeholder='Selecciona un deporte'
            iconLeft='football-outline'
            options={sportOptions}
            errorMessage={errors.sport?.message}
          />

          <View style={styles.submitContainer}>
            <CustomButton
              label={isSubmitting ? 'CREANDO...' : 'CREAR EQUIPO'}
              onPress={handleSubmit(onSubmit)}
              icon='flash-outline'
              disabled={isDisabled || isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </CustomFormView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 18,
  },
  infoBox: {
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
  logoWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  submitContainer: {
    marginTop: 10,
  },
});

export default CreateTeamScreen;

