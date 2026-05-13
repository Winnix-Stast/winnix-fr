import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMyBrands } from '@/presentation/hooks/brands/useMyBrands';
import {
  useSportCategories,
  useSportTemplates,
  useSports,
} from '@/presentation/hooks/sports/useSports';
import { useCreateTournament } from '@/presentation/hooks/tournaments/useCreateTournament';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomButton, CustomFormView } from '@/presentation/theme/components/';
import { BrandSection } from '@/presentation/tournamentsView/create/BrandSection';
import { ConfigSection } from '@/presentation/tournamentsView/create/ConfigSection';
import { EditionDetailsSection } from '@/presentation/tournamentsView/create/EditionDetailsSection';
import { PersonalizationSection } from '@/presentation/tournamentsView/create/PersonalizationSection';
import { SportSection } from '@/presentation/tournamentsView/create/SportSection';
import { TemplateDetailsModal } from '@/presentation/tournamentsView/create/TemplateDetailsModal';

export default function CreateTournamentScreen() {
  const router = useRouter();
  const { brandId } = useLocalSearchParams<{ brandId?: string }>();

  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    watch,
    setValue,
    reset,
    onSubmit,
    handleGoBack,
  } = useCreateTournament();

  const { brands, loading: loadingBrands } = useMyBrands();
  const { sports, loading: loadingSports } = useSports();

  const selectedSport = watch('sport');
  const { categories, loadingCategories } = useSportCategories(selectedSport);
  const { templates, loadingTemplates } = useSportTemplates(selectedSport);

  const selectedTemplateId = watch('sportTemplate');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const selectedTemplate = templates.find((t: any) => t._id === selectedTemplateId);

  // Preselect brand if coming from brand detail
  useEffect(() => {
    if (brandId && !watch('tournament')) {
      setValue('tournament', brandId);
    }
  }, [brandId]);

  // Limpiar el estado al salir de la vista
  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  // Reset sportCategory and sportTemplate when sport changes
  useEffect(() => {
    setValue('sportCategory', '');
    setValue('sportTemplate', '');
  }, [selectedSport]);

  // Empty state handling
  if (!loadingBrands && brands.length === 0) {
    return (
      <CustomFormView>
        <View style={styles.emptyContainer}>
          <View style={[styles.header, { paddingTop: 20 }]}>
            <Pressable onPress={handleGoBack} style={styles.backButton}>
              <WinnixIcon
                name='chevron-back-outline'
                size={30}
                color={Colors.text_primary}
              />
            </Pressable>
            <Text style={styles.headerTitle}>Crear Torneo</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.emptyStateContent}>
            <WinnixIcon name='trophy-outline' size={80} color={Colors.brand_primary} />
            <Text style={styles.emptyTitle}>Primero necesitas una marca</Text>
            <Text style={styles.emptySubtitle}>
              Una marca es la identidad de tus torneos (ej: Liga Capitalina). Crea tu
              primera marca para empezar a organizar ediciones.
            </Text>
            <TouchableOpacity
              style={styles.createBrandButton}
              onPress={() => router.push('/winnix/brand/create')}
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
      <View style={[styles.header, { paddingTop: 20 }]}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <WinnixIcon name='chevron-back-outline' size={30} color={Colors.text_primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Crear Torneo</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formContainer}>
        <PersonalizationSection control={control} errors={errors} />

        <BrandSection
          control={control}
          brands={brands}
          error={errors.tournament?.message}
        />

        <SportSection
          control={control}
          sports={sports}
          categories={categories}
          templates={templates}
          loadingCategories={loadingCategories}
          loadingTemplates={loadingTemplates}
          selectedSport={selectedSport}
          selectedTemplateId={selectedTemplateId}
          onShowTemplateDetails={() => setShowTemplateModal(true)}
          errors={errors}
        />

        <ConfigSection
          control={control}
          selectedTemplate={selectedTemplate}
          setValue={setValue}
          errors={errors}
        />

        <EditionDetailsSection control={control} errors={errors} />

        <View style={styles.submitContainer}>
          <CustomButton
            label={isSubmitting ? 'Creando...' : 'CREAR TORNEO'}
            onPress={handleSubmit(onSubmit)}
            icon='flash-outline'
            disabled={isDisabled || isSubmitting}
          />
        </View>
      </View>

      <TemplateDetailsModal
        visible={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        selectedTemplate={selectedTemplate}
      />
    </CustomFormView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: Fonts.large,
    fontWeight: 'bold',
    color: Colors.text_brand,
    textTransform: 'uppercase',
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  submitContainer: {
    marginTop: 20,
  },
  // Empty state & Loading
  emptyContainer: { flex: 1 },
  emptyStateContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: -40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text_brand,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Fonts.normal,
    color: Colors.text_tertiary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  createBrandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.actions_primary_bg,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 8,
  },
  createBrandButtonText: {
    color: Colors.on_brand,
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
