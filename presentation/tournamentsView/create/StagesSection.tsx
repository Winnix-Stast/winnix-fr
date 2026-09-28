import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Control, useWatch } from 'react-hook-form';
import { stagesActions } from '@/core/stages/actions/stages-actions';
import { StagesTutorialOverlay } from '@/presentation/components/tutorials';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { CreateEditionFormData } from '@/presentation/schemas/tournamentSchema';
import { Colors } from '@/presentation/styles/colors';

interface ConfiguredStage {
  name: string;
  template: any;
  seriesLength: number;
  hasThirdPlace: boolean;
  enforceWinner: boolean;
}

interface StagesSectionProps {
  control: Control<CreateEditionFormData>;
  setValue: (name: any, value: any) => void;
}

export const StagesSection = ({ control, setValue }: StagesSectionProps) => {
  const [showTutorial, setShowTutorial] = useState(false);

  const savedInitialStages = useWatch({
    control,
    name: 'initialStages',
  });

  const [configuredStages, setConfiguredStages] = useState<ConfiguredStage[]>(() =>
    Array.isArray(savedInitialStages) ? savedInitialStages : [],
  );
  const [isSelectingNextStage, setIsSelectingNextStage] = useState(false);

  const selectedStageOption = useWatch({
    control,
    name: 'initialStageTemplate',
    defaultValue: 'LATER',
  });

  const { data: dbTemplates = [], isLoading } = useQuery({
    queryKey: ['stage-templates'],
    queryFn: stagesActions.getStageTemplatesAction,
  });

  // Sync state if form had saved stages
  useEffect(() => {
    if (
      Array.isArray(savedInitialStages) &&
      savedInitialStages.length > 0 &&
      configuredStages.length === 0
    ) {
      setConfiguredStages(savedInitialStages);
    }
  }, [savedInitialStages]);

  // Sync with form state
  useEffect(() => {
    setValue('initialStages', configuredStages);
    if (configuredStages.length > 0) {
      setValue('initialStageTemplate', 'CUSTOM_LIST');
    } else if (!isSelectingNextStage && configuredStages.length === 0) {
      setValue('initialStageTemplate', 'LATER');
    }
  }, [configuredStages, isSelectingNextStage]);

  const handleSelectTemplate = (template: any) => {
    const stageName = `${template.name}`;
    const newStage: ConfiguredStage = {
      name: stageName,
      template: template,
      seriesLength: template.structure?.match_setup?.series_length ?? 1,
      hasThirdPlace: template.structure?.match_setup?.has_third_place ?? false,
      enforceWinner: template.rules_config?.enforce_winner ?? false,
    };

    setConfiguredStages((prev) => [...prev, newStage]);
    setIsSelectingNextStage(false);
  };

  const handleRemoveStage = (index: number) => {
    setConfiguredStages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setValue('initialStageTemplate', 'LATER');
        setIsSelectingNextStage(false);
      }
      return updated;
    });
  };

  const handleRenameStage = (index: number, newName: string) => {
    setConfiguredStages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  };

  const handleToggleSeriesLength = (index: number) => {
    setConfiguredStages((prev) => {
      const updated = [...prev];
      const current = updated[index].seriesLength;
      updated[index] = { ...updated[index], seriesLength: current === 1 ? 2 : 1 };
      return updated;
    });
  };

  const handleToggleThirdPlace = (index: number, value: boolean) => {
    setConfiguredStages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], hasThirdPlace: value };
      return updated;
    });
  };

  const handleToggleEnforceWinner = (index: number, value: boolean) => {
    setConfiguredStages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], enforceWinner: value };
      return updated;
    });
  };

  const handleSelectLater = () => {
    setConfiguredStages([]);
    setIsSelectingNextStage(false);
    setValue('initialStages', []);
    setValue('initialStageTemplate', 'LATER');
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>ETAPAS DEL TORNEO</Text>
        <View style={styles.optionalBadge}>
          <Text style={styles.optionalBadgeText}>PASO OPCIONAL</Text>
        </View>
      </View>

      {/* Tutorial Trigger Card */}
      <TouchableOpacity
        style={styles.guideTriggerCard}
        onPress={() => setShowTutorial(true)}
        activeOpacity={0.8}
      >
        <View style={styles.guideIconCircle}>
          <WinnixIcon name='sparkles-outline' size={22} color={Colors.brand_primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.guideTitle}>¿Cómo funcionan las Etapas?</Text>
          <Text style={styles.guideSubtitle}>
            Ver guía interactiva de automatización ➔
          </Text>
        </View>
        <WinnixIcon name='help-circle-outline' size={24} color={Colors.brand_primary} />
      </TouchableOpacity>

      {/* Execution Sequence Banner */}
      <View style={styles.sequenceNoticeBox}>
        <WinnixIcon name='swap-vertical-outline' size={24} color={Colors.brand_primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.sequenceTitle}>Secuencia de Ejecución</Text>
          <Text style={styles.sequenceText}>
            Las etapas se ejecutarán en el orden en que las agregues (ej. 1ª Fase de
            Grupos ➔ 2ª Cuartos de Final ➔ 3ª Gran Final).
          </Text>
        </View>
      </View>

      {/* LIST OF CONFIGURED STAGES */}
      {configuredStages.length > 0 && (
        <View style={styles.stagesListSection}>
          <Text style={styles.listHeaderTitle}>
            Etapas Agregadas ({configuredStages.length})
          </Text>

          <View style={styles.stagesList}>
            {configuredStages.map((stage, idx) => {
              return (
                <View key={idx} style={styles.configuredStageCard}>
                  {/* Top row: Stage Number, Editable Name, Delete button */}
                  <View style={styles.stageCardTop}>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderBadgeText}>ETAPA #{idx + 1}</Text>
                    </View>

                    <TextInput
                      style={styles.stageNameInput}
                      value={stage.name}
                      onChangeText={(text) => handleRenameStage(idx, text)}
                      placeholder='Nombre de la etapa'
                      placeholderTextColor={Colors.text_tertiary}
                    />

                    <TouchableOpacity
                      onPress={() => handleRemoveStage(idx)}
                      style={styles.deleteBtn}
                      activeOpacity={0.7}
                    >
                      <WinnixIcon name='trash-outline' size={20} color='#FF3B30' />
                    </TouchableOpacity>
                  </View>

                  {/* Format details */}
                  <View style={styles.formatDetailsRow}>
                    <Text style={styles.formatLabel}>
                      Formato Base:{' '}
                      <Text style={styles.formatValue}>{stage.template?.name}</Text>
                    </Text>

                    <View style={styles.metaBadgesRow}>
                      <View style={styles.metaBadge}>
                        <Text style={styles.metaBadgeText}>
                          {stage.template?.structure?.participant_type === 'INDIVIDUAL'
                            ? 'Individual'
                            : 'Equipos'}
                        </Text>
                      </View>
                      <View style={styles.metaBadge}>
                        <Text style={styles.metaBadgeText}>
                          {stage.template?.structure?.total_slots || 'Variable'} Cupos
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Customizable Stage Rules */}
                  <View style={styles.customRulesBox}>
                    <Text style={styles.customRulesHeaderTitle}>
                      Ajustar Reglas de Etapa:
                    </Text>

                    <View style={styles.switchRowItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.switchTitle}>Formato de Partidos</Text>
                        <Text style={styles.switchSub}>
                          {stage.seriesLength === 1
                            ? '1 Partido por llave'
                            : 'Ida y Vuelta (2 Partidos)'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                          styles.segmentBtn,
                          stage.seriesLength === 2 && styles.segmentBtnActive,
                        ]}
                        onPress={() => handleToggleSeriesLength(idx)}
                      >
                        <Text
                          style={[
                            styles.segmentBtnText,
                            stage.seriesLength === 2 && styles.segmentBtnTextActive,
                          ]}
                        >
                          {stage.seriesLength === 1 ? '1 Partido' : 'Ida y Vuelta'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.switchRowItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.switchTitle}>Definir Tercer Puesto</Text>
                        <Text style={styles.switchSub}>
                          Habilita la llave por la medalla de bronce
                        </Text>
                      </View>
                      <Switch
                        value={stage.hasThirdPlace}
                        onValueChange={(val) => handleToggleThirdPlace(idx, val)}
                        trackColor={{ false: '#2C3A5A', true: Colors.brand_primary }}
                        thumbColor={stage.hasThirdPlace ? Colors.on_brand : '#f4f3f4'}
                      />
                    </View>

                    <View style={styles.switchRowItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.switchTitle}>
                          Obligar Ganador (Sin Empates)
                        </Text>
                        <Text style={styles.switchSub}>
                          Habilita definición por penales
                        </Text>
                      </View>
                      <Switch
                        value={stage.enforceWinner}
                        onValueChange={(val) => handleToggleEnforceWinner(idx, val)}
                        trackColor={{ false: '#2C3A5A', true: Colors.brand_primary }}
                        thumbColor={stage.enforceWinner ? Colors.on_brand : '#f4f3f4'}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* INLINE TEMPLATE SELECTION (When user taps "+ AGREGAR ETAPA") */}
      {isSelectingNextStage && (
        <View style={styles.inlineSelectorBox}>
          <View style={styles.inlineSelectorHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inlineSelectorTitle}>
                Selecciona la plantilla para la Etapa #{configuredStages.length + 1}
              </Text>
              <Text style={styles.inlineSelectorSubtitle}>
                Toca la opción deseada para agregarla directamente.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsSelectingNextStage(false)}
              style={styles.cancelInlineBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelInlineBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size='small' color={Colors.brand_primary} />
              <Text style={styles.loadingText}>Cargando opciones...</Text>
            </View>
          ) : (
            <View style={styles.templatesGrid}>
              {dbTemplates.map((template: any) => {
                const seriesLengthText =
                  template.structure?.match_setup?.series_length === 2
                    ? 'Ida y Vuelta'
                    : 'Partido Único';
                const thirdPlaceText = template.structure?.match_setup?.has_third_place
                  ? ' • Con 3er Puesto'
                  : '';

                return (
                  <TouchableOpacity
                    key={template._id}
                    style={styles.templateOptionCard}
                    onPress={() => handleSelectTemplate(template)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.templateOptionHeader}>
                      <View style={styles.templateIconCircle}>
                        <WinnixIcon
                          name='trophy-outline'
                          size={22}
                          color={Colors.brand_primary}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.templateOptionTitle}>{template.name}</Text>
                        <View style={styles.metaBadgesRow}>
                          <View style={styles.metaBadge}>
                            <Text style={styles.metaBadgeText}>
                              {template.structure?.participant_type === 'INDIVIDUAL'
                                ? 'Individual'
                                : 'Equipos'}
                            </Text>
                          </View>
                          <View style={styles.metaBadge}>
                            <Text style={styles.metaBadgeText}>
                              {template.structure?.total_slots || 'Variable'} Cupos
                            </Text>
                          </View>
                          <View style={styles.metaBadge}>
                            <Text style={styles.metaBadgeText}>
                              {seriesLengthText}
                              {thirdPlaceText}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.addInlineBadge}>
                        <WinnixIcon
                          name='add-circle'
                          size={24}
                          color={Colors.brand_primary}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* FULL-WIDTH "+ AGREGAR ETAPA" BUTTON (Placed under the list / options) */}
      {!isSelectingNextStage && (
        <TouchableOpacity
          style={styles.fullWidthAddBtn}
          onPress={() => setIsSelectingNextStage(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.fullWidthAddBtnText}>
            {configuredStages.length === 0 ? '+ AGREGAR ETAPA' : '+ AGREGAR OTRA ETAPA'}
          </Text>
        </TouchableOpacity>
      )}

      {/* "Configurar etapas más adelante" (ONLY VISIBLE WHEN NO STAGES ADDED & NOT SELECTING) */}
      {configuredStages.length === 0 && !isSelectingNextStage && (
        <TouchableOpacity
          style={[
            styles.laterCard,
            selectedStageOption === 'LATER' && styles.laterCardSelected,
          ]}
          onPress={handleSelectLater}
          activeOpacity={0.8}
        >
          <View style={styles.laterHeader}>
            <View style={styles.laterIconCircle}>
              <WinnixIcon name='time-outline' size={22} color={Colors.brand_primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.laterTitle}>Configurar etapas más adelante</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedBadgeText}>Flexible</Text>
                </View>
              </View>
              <Text style={styles.laterSubtitle}>
                Crearás las etapas libremente desde el panel del torneo tras inscribir a
                tus equipos.
              </Text>
            </View>
            {selectedStageOption === 'LATER' && (
              <WinnixIcon
                name='checkmark-circle'
                size={24}
                color={Colors.brand_primary}
              />
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Interactive Tutorial Modal Overlay */}
      <StagesTutorialOverlay
        forceShow={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginTop: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_focus,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionalBadge: {
    backgroundColor: 'rgba(40, 209, 195, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },
  optionalBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.brand_primary,
    letterSpacing: 0.5,
  },
  guideTriggerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
    borderRadius: 14,
    padding: 16,
  },
  guideIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideTitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  guideSubtitle: {
    fontSize: 14.5,
    color: Colors.brand_primary,
    marginTop: 2,
  },
  sequenceNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.surface_elevated,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  sequenceTitle: {
    fontSize: 15.5,
    fontWeight: 'bold',
    color: Colors.text_primary,
    marginBottom: 4,
  },
  sequenceText: {
    fontSize: 14.5,
    color: Colors.text_secondary,
    lineHeight: 21,
  },
  stagesListSection: {
    gap: 12,
  },
  listHeaderTitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  stagesList: {
    gap: 12,
  },
  configuredStageCard: {
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderWidth: 1.5,
    borderColor: Colors.brand_primary,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  stageCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderBadge: {
    backgroundColor: Colors.brand_primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.on_brand,
  },
  stageNameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text_primary,
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    borderRadius: 8,
  },
  formatDetailsRow: {
    gap: 6,
  },
  formatLabel: {
    fontSize: 14.5,
    color: Colors.text_tertiary,
  },
  formatValue: {
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  metaBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  metaBadge: {
    backgroundColor: Colors.surface_elevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 13,
    color: Colors.text_secondary,
    fontWeight: '500',
  },
  inlineSelectorBox: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.brand_primary,
    gap: 14,
  },
  inlineSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  inlineSelectorTitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: Colors.brand_primary,
  },
  inlineSelectorSubtitle: {
    fontSize: 14.5,
    color: Colors.text_secondary,
    marginTop: 2,
  },
  cancelInlineBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
  },
  cancelInlineBtnText: {
    fontSize: 13.5,
    color: Colors.text_secondary,
    fontWeight: '600',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14.5,
    color: Colors.text_secondary,
  },
  templatesGrid: {
    gap: 10,
  },
  templateOptionCard: {
    backgroundColor: Colors.surface_base,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  templateOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  templateIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(40, 209, 195, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateOptionTitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  addInlineBadge: {
    padding: 2,
  },
  fullWidthAddBtn: {
    width: '100%',
    height: 52,
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.brand_primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthAddBtnText: {
    color: Colors.brand_primary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  laterCard: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  laterCardSelected: {
    borderColor: Colors.brand_primary,
    backgroundColor: 'rgba(40, 209, 195, 0.06)',
  },
  laterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  laterIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  laterTitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  recommendedBadge: {
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recommendedBadgeText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: Colors.brand_primary,
  },
  laterSubtitle: {
    fontSize: 14.5,
    color: Colors.text_secondary,
    marginTop: 4,
    lineHeight: 20,
  },
  customRulesBox: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  customRulesHeaderTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: Colors.brand_primary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  switchRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    gap: 10,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text_primary,
  },
  switchSub: {
    fontSize: 12,
    color: Colors.text_tertiary,
    marginTop: 2,
  },
  segmentBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  segmentBtnActive: {
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  segmentBtnText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: Colors.text_secondary,
  },
  segmentBtnTextActive: {
    color: Colors.on_brand,
  },
});
