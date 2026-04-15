import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { WinnixIcon } from "@/presentation/plugins/Icon";
import { Colors } from "@/presentation/styles/colors";
import { Fonts } from "@/presentation/styles/global-styles";
import { useCreateTournament } from "@/presentation/hooks/tournaments/useCreateTournament";
import { useMyBrands } from "@/presentation/hooks/brands/useMyBrands";
import { useSports, useSportCategories } from "@/presentation/hooks/sports/useSports";
import { CustomButton, CustomDatePicker, CustomFormView, CustomImagePicker, CustomInput, CustomSelect } from "@/presentation/theme/components/";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CreateTournamentScreen() {
  const router = useRouter();
  const { brandId } = useLocalSearchParams<{ brandId?: string }>();
  const { control, handleSubmit, errors, isSubmitting, isDisabled, watch, setValue, onSubmit, handleGoBack } = useCreateTournament();
  const { brands, loading: loadingBrands } = useMyBrands();
  const { sports, loading: loadingSports } = useSports();

  const selectedSport = watch("sport");
  const { categories, loadingCategories } = useSportCategories(selectedSport);

  // Preselect brand if coming from brand detail
  useEffect(() => {
    if (brandId && !watch("tournament")) {
      setValue("tournament", brandId);
    }
  }, [brandId]);

  // Reset sportCategory when sport changes
  useEffect(() => {
    setValue("sportCategory", "");
  }, [selectedSport]);

  const brandOptions = brands.map((b: any) => ({
    label: b.name,
    value: b._id,
  }));

  const sportOptions = sports.map((s: any) => ({
    label: s.name,
    value: s._id,
  }));

  const categoryOptions = categories.map((c: any) => ({
    label: c.name,
    value: c._id,
  }));

  // No brands — show empty state
  if (!loadingBrands && brands.length === 0) {
    return (
      <CustomFormView>
        <View style={styles.emptyContainer}>
          <View style={[styles.header, { paddingTop: 20 }]}>
            <Pressable onPress={handleGoBack} style={styles.backButton}>
              <WinnixIcon name='chevron-back-outline' size={30} color={Colors.text_primary} />
            </Pressable>
            <Text style={styles.headerTitle}>Crear Torneo</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.emptyStateContent}>
            <WinnixIcon name='trophy-outline' size={80} color={Colors.brand_primary} />
            <Text style={styles.emptyTitle}>Primero necesitas una marca</Text>
            <Text style={styles.emptySubtitle}>
              Una marca es la identidad de tus torneos (ej: "Liga Capitalina"). Crea tu primera marca para empezar a organizar ediciones.
            </Text>
            <TouchableOpacity
              style={styles.createBrandButton}
              activeOpacity={0.8}
              onPress={() => router.push("/winnix/brand/create")}
            >
              <WinnixIcon name='add-outline' size={22} color={Colors.on_brand} />
              <Text style={styles.createBrandButtonText}>CREAR MI PRIMERA MARCA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomFormView>
    );
  }

  if (loadingBrands || loadingSports) {
    return (
      <CustomFormView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.brand_primary} />
        </View>
      </CustomFormView>
    );
  }

  return (
    <CustomFormView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { paddingTop: 20 }]}>
          <Pressable onPress={handleGoBack} style={styles.backButton}>
            <WinnixIcon name='chevron-back-outline' size={30} color={Colors.text_primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Crear Torneo</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.formContainer}>
          {/* Brand Selection */}
          <Text style={styles.sectionTitle}>Marca del Torneo</Text>

          <CustomSelect
            name='tournament'
            control={control}
            options={brandOptions}
            label='Selecciona tu marca *'
            placeholder='Elige una marca...'
            iconLeft='shield-outline'
            errorMessage={errors.tournament?.message}
          />

          <TouchableOpacity
            style={styles.newBrandLink}
            onPress={() => router.push("/winnix/brand/create")}
          >
            <WinnixIcon name='add-circle-outline' size={18} color={Colors.brand_primary} />
            <Text style={styles.newBrandLinkText}>Crear nueva marca</Text>
          </TouchableOpacity>

          {/* Sport Selection */}
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Deporte</Text>

          <CustomSelect
            name='sport'
            control={control}
            options={sportOptions}
            label='Deporte *'
            placeholder='Elige un deporte...'
            iconLeft='football-outline'
            errorMessage={errors.sport?.message}
          />

          {selectedSport && categoryOptions.length > 0 && (
            <CustomSelect
              name='sportCategory'
              control={control}
              options={categoryOptions}
              label='Modalidad (opcional)'
              placeholder={loadingCategories ? 'Cargando...' : 'Elige modalidad...'}
              iconLeft='layers-outline'
              disabled={loadingCategories}
            />
          )}

          {/* Edition Details */}
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

          {/* Images */}
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Personalización</Text>

          <View style={styles.datesContainer}>
            <View style={{ flex: 1 }}>
              <CustomImagePicker name='image' control={control} label='Póster' errorMessage={errors.image?.message} aspect={[16, 9]} />
            </View>
            <View style={{ width: 15 }} />
            <View style={{ flex: 0.8 }}>
              <CustomImagePicker name='logo' control={control} label='Logo' errorMessage={errors.logo?.message} isRound={true} aspect={[1, 1]} />
            </View>
          </View>

          {/* Submit */}
          <View style={styles.submitContainer}>
            <CustomButton
              label={isSubmitting ? "Creando..." : "CREAR TORNEO"}
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
    gap: 14,
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
  newBrandLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -4,
  },
  newBrandLinkText: {
    fontSize: Fonts.small,
    color: Colors.brand_primary,
    fontWeight: "600",
  },
  // Empty state
  emptyContainer: {
    flex: 1,
  },
  emptyStateContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    marginTop: -40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text_brand,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: Fonts.normal,
    color: Colors.text_tertiary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  createBrandButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.actions_primary_bg,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  createBrandButtonText: {
    color: Colors.on_brand,
    fontSize: Fonts.normal,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
