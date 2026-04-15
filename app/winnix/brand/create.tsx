import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { WinnixIcon } from "@/presentation/plugins/Icon";
import { Colors } from "@/presentation/styles/colors";
import { Fonts } from "@/presentation/styles/global-styles";
import { useCreateBrand } from "@/presentation/hooks/brands/useCreateBrand";
import { CustomButton, CustomFormView, CustomImagePicker, CustomInput } from "@/presentation/theme/components/";

export default function CreateBrandScreen() {
  const { control, handleSubmit, errors, isSubmitting, isDisabled, onSubmit, handleGoBack } = useCreateBrand();

  return (
    <CustomFormView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { paddingTop: 20 }]}>
          <Pressable onPress={handleGoBack} style={styles.backButton}>
            <WinnixIcon name='chevron-back-outline' size={30} color={Colors.text_primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Nueva Marca</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.infoCard}>
            <WinnixIcon name='information-circle-outline' size={24} color={Colors.brand_primary} />
            <Text style={styles.infoText}>
              Una marca es la identidad de tus torneos. Crea tu marca primero y luego podrás organizar ediciones bajo ella.
            </Text>
          </View>

          <View style={styles.logoContainer}>
            <CustomImagePicker name='logo' control={control} label='Logo de la Marca' errorMessage={errors.logo?.message} isRound={true} aspect={[1, 1]} />
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
              label={isSubmitting ? "Creando..." : "CREAR MARCA"}
              onPress={handleSubmit(onSubmit)}
              icon='flash-outline'
              disabled={isDisabled || isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </CustomFormView>
  );
}

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
    fontSize: Fonts.large,
    fontWeight: "bold",
    color: Colors.text_brand,
    textTransform: "uppercase",
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 18,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
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
    alignItems: "center",
  },
  submitContainer: {
    marginTop: 20,
  },
});
