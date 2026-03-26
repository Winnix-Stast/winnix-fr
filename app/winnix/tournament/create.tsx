import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { WinnixIcon } from "@/presentation/plugins/Icon";
import { Colors } from "@/presentation/styles/colors";
import { useCreateTournament } from "@/presentation/hooks/tournaments/useCreateTournament";
import { useQueryClient } from "@tanstack/react-query";
import { Fonts } from "@/presentation/styles/global-styles";
import { CustomButton, CustomDatePicker, CustomFormView, CustomImagePicker, CustomInput, DocumentUploader, SponsorInput } from "@/presentation/theme/components/";
import { TournamentPreviewModal } from "@/presentation/tournamentsView/tournamentsInfo/TournamentPreviewModal";

export default function CreateTournamentScreen() {
  const [previewVisible, setPreviewVisible] = useState(false);
  const { control, handleSubmit, errors, isSubmitting, isDisabled, getValues, watch, onSubmit, handleGoBack } = useCreateTournament();
  const queryClient = useQueryClient();

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  return (
    <CustomFormView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header con botón de regresar */}
        <View style={[styles.header, { paddingTop: 20 }]}>
          <Pressable onPress={handleGoBack} style={styles.backButton}>
            <WinnixIcon name='chevron-back-outline' size={30} color={Colors.text_primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Crear Torneo</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Ajustes Generales</Text>

          <View style={styles.datesContainer}>
            <View style={{ flex: 1 }}>
              <CustomImagePicker name='image' control={control} label='Póster' errorMessage={errors.image?.message} aspect={[16, 9]} />
            </View>
            <View style={{ width: 15 }} />
            <View style={{ flex: 0.8 }}>
              <CustomImagePicker name='logo' control={control} label='Logo' errorMessage={errors.logo?.message} isRound={true} aspect={[1, 1]} />
            </View>
          </View>

          <CustomInput name='name' control={control} placeholder='Ej. Copa Élite Nacional' label='Nombre del Evento *' iconRight='trophy-outline' errorMessage={errors.name?.message} />

          <View style={styles.datesContainer}>
            <View style={{ flex: 1 }}>
              <CustomDatePicker name='start_date' control={control} label='Inicio *' placeholder='DD/MM/YYYY' modalTitle='Día de Apertura' errorMessage={errors.start_date?.message} allowFutureDates={true} minimumDate={new Date()} />
            </View>
            <View style={{ width: 15 }} />
            <View style={{ flex: 1 }}>
              <CustomDatePicker name='end_date' control={control} label='Cierre *' placeholder='DD/MM/YYYY' modalTitle='Día de Clausura' errorMessage={errors.end_date?.message} allowFutureDates={true} minimumDate={new Date()} />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Reglas y Participación</Text>

          <SponsorInput name='sponsors' control={control} label='Patrocinadores' errorMessage={errors.sponsors?.message} />

          <View style={styles.datesContainer}>
            <View style={{ flex: 1 }}>
              <CustomInput name='max_teams' control={control} placeholder='Ej. 16' label='Límite Equipos *' keyboardType='numeric' iconRight='people-outline' errorMessage={errors.max_teams?.message} />
            </View>
            <View style={{ width: 15 }} />
            <View style={{ flex: 1 }}>
              <CustomInput name='incremental' control={control} placeholder='Ej. 5000' label='Premio/Costo *' keyboardType='numeric' iconRight='cash-outline' errorMessage={errors.incremental?.message} />
            </View>
          </View>

          <View style={styles.rulesToggleContainer}>
            <Pressable style={[styles.rulesToggleBtn, watch("rulesType") === "text" && styles.rulesToggleActive]} onPress={() => control._defaultValues.rulesType !== "text" && control._formValues.rulesType !== "text" && (control._formValues.rulesType = "text")}>
              <Text style={[styles.rulesToggleText, watch("rulesType") === "text" && styles.rulesToggleTextActive]}>Escribir</Text>
            </Pressable>
            <Pressable style={[styles.rulesToggleBtn, watch("rulesType") === "document" && styles.rulesToggleActive]} onPress={() => control._defaultValues.rulesType !== "document" && control._formValues.rulesType !== "document" && (control._formValues.rulesType = "document")}>
              <Text style={[styles.rulesToggleText, watch("rulesType") === "document" && styles.rulesToggleTextActive]}>Subir PDF</Text>
            </Pressable>
          </View>

          {watch("rulesType") === "text" ? <CustomInput name='rules' control={control} placeholder='Define las reglas, links o información extra...' label='Reglamento (Opcional)' multiline iconRight='document-text-outline' errorMessage={errors.rules?.message} /> : <DocumentUploader name='rulesDocument' control={control} label='Archivo de Reglas Oficiales' errorMessage={errors.rulesDocument?.message} />}

          <View style={styles.submitContainer}>
            <CustomButton label='VISTA PREVIA PÚBLICO' onPress={handlePreview} icon='eye-outline' stylePressable={{ backgroundColor: Colors.surface_pressed, borderWidth: 1, borderColor: Colors.border_focus }} styleText={{ color: Colors.text_primary }} styleIcon={{ color: Colors.text_primary }} />
            <View style={{ height: 15 }} />
            <CustomButton label={isSubmitting ? "Creando..." : "CREAR TORNEO"} onPress={handleSubmit(onSubmit)} icon='flash-outline' disabled={isDisabled || isSubmitting} />
          </View>
        </View>
      </ScrollView>

      <TournamentPreviewModal visible={previewVisible} onClose={() => setPreviewVisible(false)} formData={getValues()} />
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
  sectionTitle: {
    fontSize: Fonts.normal,
    fontWeight: "600",
    color: Colors.text_secondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_focus,
    paddingBottom: 5,
    marginBottom: -5,
  },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitContainer: {
    marginTop: 20,
  },
  rulesToggleContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surface_base,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border_focus,
    overflow: "hidden",
    marginBottom: 5,
  },
  rulesToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  rulesToggleActive: {
    backgroundColor: Colors.surface_pressed,
  },
  rulesToggleText: {
    color: Colors.neutral_500,
    fontWeight: "bold",
    fontSize: Fonts.small,
  },
  rulesToggleTextActive: {
    color: Colors.text_brand,
  },
});
