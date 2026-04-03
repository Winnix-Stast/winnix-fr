import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCreateTeam } from "@/presentation/hooks/teams/useCreateTeam";
import { WinnixIcon } from "@/presentation/plugins/Icon";
import { Colors } from "@/presentation/styles/colors";
import { Fonts } from "@/presentation/styles/global-styles";
import { CustomButton, CustomFormView, CustomInput, CustomSelect } from "@/presentation/theme/components";

const CreateTeamScreen = () => {
  const { top } = useSafeAreaInsets();
  const { control, handleSubmit, onSubmit, isSubmitting, errors, handleGoBack, sportOptions } = useCreateTeam();

  return (
    <CustomFormView>
      <ScrollView contentContainerStyle={[styles.scrollContent]} showsVerticalScrollIndicator={false}>
        {/* Header con botón de regresar */}
        <View style={[styles.header, { paddingTop: top - 30 }]}>
          <Pressable onPress={handleGoBack} style={styles.backButton}>
            <WinnixIcon name='chevron-back-outline' size={30} color={Colors.text_primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Crear Equipo</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.formContainer}>
          <CustomInput name='name' control={control} label='Nombre del Equipo *' placeholder='Ej: Los Galácticos FC' iconRight='people-outline' errorMessage={errors.name?.message} />

          <CustomSelect name='sport' control={control} label='Deporte *' placeholder='Selecciona un deporte' iconLeft='football-outline' options={sportOptions} errorMessage={errors.sport?.message} />

          {/* TODO: Implement Image Picker for Logo like in tournament create */}
          <CustomInput name='logo' control={control} label='Logo (URL)' placeholder='URL de la imagen del logo' iconRight='image-outline' errorMessage={errors.logo?.message} />

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Como capitán, serás responsable de inscribir a tu equipo en torneos y gestionar a tus jugadores.</Text>
          </View>

          <CustomButton label={isSubmitting ? "CREANDO..." : "CREAR EQUIPO"} onPress={handleSubmit(onSubmit)} icon='flash-outline' disabled={isSubmitting} />
        </View>
      </ScrollView>
    </CustomFormView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
    borderRadius: 12,
    backgroundColor: Colors.surface_pressed,
  },
  headerTitle: {
    fontSize: Fonts.extraLarge,
    fontWeight: "bold",
    color: Colors.text_brand,
    textTransform: "uppercase",
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  infoBox: {
    backgroundColor: Colors.surface_elevated,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.brand_primary,
    marginTop: 10,
  },
  infoText: {
    color: Colors.text_secondary,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CreateTeamScreen;
