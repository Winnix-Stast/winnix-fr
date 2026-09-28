import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenHeader } from '@/presentation/components/customs';
import { useAlertStore } from '@/presentation/components/customs/useAlertStore';
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
import { PrizesCreateSection } from '@/presentation/tournamentsView/create/PrizesCreateSection';
import { SportSection } from '@/presentation/tournamentsView/create/SportSection';
import { StagesSection } from '@/presentation/tournamentsView/create/StagesSection';
import { TemplateDetailsModal } from '@/presentation/tournamentsView/create/TemplateDetailsModal';
import { TournamentPreviewModal } from '@/presentation/tournamentsView/tournamentsInfo/TournamentPreviewModal';

const TOTAL_STEPS = 5;

export default function CreateTournamentScreen() {
  const router = useRouter();
  const { brandId } = useLocalSearchParams<{ brandId?: string }>();
  const [step, setStep] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Reset step and clear form state whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setStep(0);
      reset({
        tournament: brandId || (brands.length === 1 ? brands[0]._id : ''),
        seasonName: '',
        sport: '',
        sportCategory: '',
        sportTemplate: '',
        startDate: undefined,
        endDate: undefined,
        image: '',
        logo: '',
        playersPerTeam: undefined,
        matchDuration: undefined,
        scoring: undefined,
        config: undefined,
        initialStageTemplate: undefined,
        initialStages: [],
        initialPrizes: [],
        status: 'DRAFT',
      });
    }, [brandId, brands]),
  );

  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
    onSubmit,
    handleGoBack,
  } = useCreateTournament();

  const { brands, loading: loadingBrands } = useMyBrands();
  const { sports, loading: loadingSports } = useSports();

  const selectedSport = watch('sport');
  const { categories, loadingCategories } = useSportCategories(selectedSport);
  const { templates, loadingTemplates } = useSportTemplates(selectedSport);

  const selectedTemplateId = watch('sportTemplate');
  const selectedBrandId = watch('tournament');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const selectedTemplate = templates.find((t: any) => t._id === selectedTemplateId);
  const selectedBrand = brands.find((b: any) => b._id === selectedBrandId);
  const selectedSportObj = sports.find((s: any) => s._id === selectedSport);
  const initialPrizes = watch('initialPrizes') || [];

  // Auto-select brand if there is only 1 brand available or if brandId was passed
  useEffect(() => {
    if (brands.length === 1 && !watch('tournament')) {
      setValue('tournament', brands[0]._id);
    } else if (brandId && !watch('tournament')) {
      setValue('tournament', brandId);
    }
  }, [brands, brandId]);

  // Clean form state on unmount
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

  const handleBackAction = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else {
      handleGoBack();
    }
  };

  const handleNextToStep2 = async () => {
    const isValid = await trigger(['tournament', 'seasonName']);
    if (isValid) {
      setStep(1);
    }
  };

  const handleNextToStep3 = async () => {
    const isValid = await trigger(['sport', 'sportTemplate']);
    if (isValid) {
      setStep(2);
    }
  };

  const handleNextToStep4 = () => {
    setStep(3);
  };

  const handleNextToStep5 = () => {
    setStep(4);
  };

  const handleJumpToStep = async (targetStep: number) => {
    if (targetStep === step) return;

    if (targetStep < step) {
      setStep(targetStep);
      return;
    }

    if (targetStep >= 1 && step < 1) {
      const isStep0Valid = await trigger(['tournament', 'seasonName']);
      if (!isStep0Valid) return;
    }

    if (targetStep >= 2 && step < 2) {
      const isStep1Valid = await trigger(['sport', 'sportTemplate']);
      if (!isStep1Valid) return;
    }

    setStep(targetStep);
  };

  if (loadingBrands || loadingSports) {
    return (
      <CustomFormView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.brand_primary} />
        </View>
      </CustomFormView>
    );
  }

  if (brands.length === 0) {
    return (
      <CustomFormView>
        <ScreenHeader title='Crear Torneo' onBack={handleGoBack} />
        <View style={styles.emptyStateContent}>
          <WinnixIcon name='trophy-outline' size={60} color={Colors.brand_primary} />
          <Text style={styles.emptyTitle}>¡Necesitas una Marca primero!</Text>
          <Text style={styles.emptySubtitle}>
            Para crear un torneo debes registrar la marca oficial de tu liga. Es un
            proceso rápido de 1 minuto.
          </Text>
          <TouchableOpacity
            style={styles.createBrandButton}
            onPress={() => router.replace('/winnix/brand/create')}
            activeOpacity={0.8}
          >
            <WinnixIcon name='add-circle-outline' size={20} color={Colors.on_brand} />
            <Text style={styles.createBrandButtonText}>CREAR MI PRIMERA MARCA</Text>
          </TouchableOpacity>
        </View>
      </CustomFormView>
    );
  }

  const stepTitles = [
    'Identidad y Marca',
    'Deporte y Reglas',
    'Etapas del Torneo',
    'Bolsa de Premios',
    'Fechas y Publicación',
  ];

  const stepShortTitles = ['Marca', 'Reglas', 'Etapas', 'Premios', 'Fechas'];

  return (
    <CustomFormView>
      <ScreenHeader title='Crear Torneo' onBack={handleBackAction} />

      {/* Multi-Step Indicator Header */}
      <View style={styles.stepperWrapper}>
        <View style={styles.stepperTopRow}>
          <View>
            <Text style={styles.stepCounterText}>
              PASO {step + 1} DE {TOTAL_STEPS}
            </Text>
            <Text style={styles.stepTitleText}>{stepTitles[step]}</Text>
          </View>

          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => setShowPreviewModal(true)}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <WinnixIcon name='eye-outline' size={22} color={Colors.brand_primary} />
          </TouchableOpacity>
        </View>

        {/* Interactive Step Numbers & Horizontal Scroll Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.interactiveStepsRow}
        >
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
            const isActive = idx === step;
            const isCompleted = idx < step;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.stepPill,
                  isActive
                    ? styles.stepPillActive
                    : isCompleted
                      ? styles.stepPillCompleted
                      : styles.stepPillInactive,
                ]}
                onPress={() => handleJumpToStep(idx)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                <View
                  style={[
                    styles.stepBadgeCircle,
                    isActive
                      ? styles.stepBadgeActive
                      : isCompleted
                        ? styles.stepBadgeCompleted
                        : styles.stepBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepBadgeNumber,
                      (isActive || isCompleted) && { color: Colors.on_brand },
                    ]}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepPillLabel,
                    isActive && styles.stepPillLabelActive,
                    isCompleted && styles.stepPillLabelCompleted,
                  ]}
                  numberOfLines={1}
                >
                  {stepShortTitles[idx]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.formContainer}>
        {/* STEP 1: Brand & Tournament Identity */}
        <View style={[styles.stepContent, step !== 0 && { display: 'none' }]}>
          <BrandSection
            control={control}
            brands={brands}
            error={errors.tournament?.message}
          />

          <PersonalizationSection control={control} errors={errors} />

          <View style={styles.buttonMarginTop}>
            <CustomButton label='Siguiente' onPress={handleNextToStep2} />
          </View>
        </View>

        {/* STEP 2: Sport & Game Rules */}
        <View style={[styles.stepContent, step !== 1 && { display: 'none' }]}>
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

          <View style={styles.buttonMarginTop}>
            <CustomButton label='Siguiente' onPress={handleNextToStep3} />
          </View>
        </View>

        {/* STEP 3: Tournament Stages (Optional) */}
        <View style={[styles.stepContent, step !== 2 && { display: 'none' }]}>
          <StagesSection control={control} setValue={setValue} />

          <View style={styles.buttonMarginTop}>
            <CustomButton label='Siguiente' onPress={handleNextToStep4} />
          </View>
        </View>

        {/* STEP 4: Tournament Prizes (Rewards) */}
        <View style={[styles.stepContent, step !== 3 && { display: 'none' }]}>
          <PrizesCreateSection control={control} setValue={setValue} />

          <View style={styles.buttonMarginTop}>
            <CustomButton label='Siguiente' onPress={handleNextToStep5} />
          </View>
        </View>

        {/* STEP 5: Dates & Publication */}
        <View style={[styles.stepContent, step !== 4 && { display: 'none' }]}>
          <EditionDetailsSection control={control} errors={errors} />

          {/* Tournament Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen del Torneo</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Marca:</Text>
              <Text style={styles.summaryValue}>
                {selectedBrand?.name || 'No seleccionada'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Nombre del torneo:</Text>
              <Text style={styles.summaryValue}>
                {watch('seasonName') || 'Sin nombre'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Deporte:</Text>
              <Text style={styles.summaryValue}>
                {selectedSportObj?.name || 'No seleccionado'}
              </Text>
            </View>
            {selectedTemplate && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Plantilla:</Text>
                <Text style={styles.summaryValue}>{selectedTemplate.name}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Premios configurados:</Text>
              <Text style={styles.summaryValue}>
                {initialPrizes.length > 0
                  ? `${initialPrizes.length} premios`
                  : 'Sin premios iniciales'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonMarginTop}>
            <CustomButton
              label={isSubmitting ? 'Creando...' : 'CREAR TORNEO'}
              onPress={handleSubmit(onSubmit, (formErrors) => {
                const firstErrKey = Object.keys(formErrors)[0];
                const firstErrMsg =
                  formErrors[firstErrKey as keyof typeof formErrors]?.message;
                useAlertStore.getState().showAlert({
                  title: 'Datos Incompletos',
                  message: firstErrMsg
                    ? String(firstErrMsg)
                    : 'Por favor completa todos los campos requeridos.',
                  type: 'error',
                  confirmText: 'Entendido',
                });
              })}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>

      <TemplateDetailsModal
        visible={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        selectedTemplate={selectedTemplate}
      />

      <TournamentPreviewModal
        visible={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        formData={getValues() as any}
      />
    </CustomFormView>
  );
}

const styles = StyleSheet.create({
  previewBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.25)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyStateContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text_primary,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Fonts.normal,
    color: Colors.text_tertiary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  createBrandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.actions_primary_bg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 8,
  },
  createBrandButtonText: {
    color: Colors.on_brand,
    fontSize: Fonts.normal,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  stepperWrapper: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  stepperTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCounterText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: Colors.brand_primary,
    letterSpacing: 1,
  },
  stepTitleText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  interactiveStepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingRight: 10,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  stepPillActive: {
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    borderColor: Colors.brand_primary,
  },
  stepPillCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },
  stepPillInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  stepBadgeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeActive: {
    backgroundColor: Colors.brand_primary,
  },
  stepBadgeCompleted: {
    backgroundColor: Colors.brand_primary,
  },
  stepBadgeInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepBadgeNumber: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: Colors.text_tertiary,
  },
  stepPillLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text_tertiary,
  },
  stepPillLabelActive: {
    color: Colors.brand_primary,
    fontWeight: 'bold',
  },
  stepPillLabelCompleted: {
    color: Colors.text_secondary,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stepContent: {
    gap: 16,
  },
  buttonMarginTop: {
    marginTop: 20,
  },
  summaryCard: {
    backgroundColor: Colors.surface_pressed || 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border_focus || 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    gap: 10,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.brand_primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.text_tertiary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
});
