import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Pressable, ActivityIndicator, Alert, ScrollView, TextInput, KeyboardAvoidingView, Platform, Switch, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { stagesActions } from '@/core/stages/actions/stages-actions';
import { tournamentsActions } from '@/core/tournaments/actions/tournaments-actions';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { Colors } from '@/presentation/styles/colors';
import { CustomButton } from '@/presentation/theme/components/CustomButton';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Flex } from '@/presentation/styles/global-styles';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  editionId: string;
}

export const CreateStageModal = ({ isVisible, onClose, editionId }: Props) => {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [stageName, setStageName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Raw Dates State
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Override States
  const [seriesLength, setSeriesLength] = useState(1);
  const [hasThirdPlace, setHasThirdPlace] = useState(false);
  const [enforceWinner, setEnforceWinner] = useState(false);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['stage-templates'],
    queryFn: stagesActions.getStageTemplatesAction,
  });

  const { data: edition } = useQuery({
    queryKey: ['edition', editionId],
    queryFn: () => tournamentsActions.getEditionByIdAction(editionId),
    enabled: !!editionId,
  });

  // Load defaults from selected template
  useEffect(() => {
    if (selectedTemplate) {
      setSeriesLength(selectedTemplate.structure?.match_setup?.series_length ?? 1);
      setHasThirdPlace(selectedTemplate.structure?.match_setup?.has_third_place ?? false);
      setEnforceWinner(selectedTemplate.rules_config?.enforce_winner ?? false);
    }
  }, [selectedTemplate]);

  // Adjust startDate if edition has started, but must be at least today
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (edition?.startDate) {
      const edStart = new Date(edition.startDate);
      setStartDate(edStart > today ? edStart : today);
    } else {
      setStartDate(today);
    }
  }, [edition]);

  const handleCreate = async () => {
    if (!selectedTemplate) {
      Alert.alert('Error', 'Debes seleccionar una plantilla.');
      return;
    }
    if (!stageName.trim()) {
      Alert.alert('Error', 'El nombre de la etapa es obligatorio.');
      return;
    }

    setIsCreating(true);
    try {
      await stagesActions.createStageAction({
        name: stageName,
        tournamentEdition: editionId,
        template: selectedTemplate._id,
        structure: {
          ...selectedTemplate.structure,
          match_setup: {
            series_length: seriesLength,
            has_third_place: hasThirdPlace,
          },
        },
        rules_config: {
          ...selectedTemplate.rules_config,
          enforce_winner: enforceWinner,
        },
        startDate: startDate.toISOString(),
        endDate: endDate ? endDate.toISOString() : undefined,
        status: 'DRAFT',
      });
      
      Alert.alert('Éxito', 'Etapa creada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['stages', editionId] });
      // Reset form
      setStageName('');
      setSelectedTemplate(null);
      setEndDate(null);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Ocurrió un error al crear la etapa.');
    } finally {
      setIsCreating(false);
    }
  };

  // Render Date Pickers helper for iOS Modal and Android default
  const renderDatePicker = (type: 'start' | 'end') => {
    const isStart = type === 'start';
    const isOpen = isStart ? showStartPicker : showEndPicker;
    const dateValue = isStart ? startDate : (endDate || new Date());
    const setIsOpen = isStart ? setShowStartPicker : setShowEndPicker;
    const setDateValue = isStart ? setStartDate : ((date: Date | null) => setEndDate(date));

    if (!isOpen) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = isStart ? today : startDate;

    if (Platform.OS === 'android') {
      return (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          minimumDate={minDate}
          onChange={(event, date) => {
            setIsOpen(false);
            if (event.type === 'set' && date) {
              setDateValue(date);
            }
          }}
        />
      );
    }

    // iOS Picker Modal Overlay
    return (
      <Modal transparent={true} animationType="slide" visible={isOpen}>
        <TouchableOpacity style={styles.iosOverlay} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.iosContent}>
            <View style={styles.iosHeader}>
              <CustomText label={isStart ? "Fecha de Inicio" : "Fecha de Fin"} size={16} weight="bold" color={Colors.text_primary} />
            </View>
            <View style={styles.iosPickerContainer}>
              <DateTimePicker
                value={dateValue}
                mode="date"
                display="spinner"
                locale="es-ES"
                textColor={Colors.text_primary}
                minimumDate={minDate}
                onChange={(event, date) => {
                  if (date) setDateValue(date);
                }}
              />
            </View>
            <View style={styles.iosFooter}>
              <TouchableOpacity style={styles.iosCancelBtn} onPress={() => setIsOpen(false)}>
                <CustomText label="Cancelar" size={14} color={Colors.text_secondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iosConfirmBtn}
                onPress={() => {
                  if (!isStart && !endDate) {
                    setEndDate(new Date());
                  }
                  setIsOpen(false);
                }}
              >
                <CustomText label="Confirmar" size={14} weight="bold" color={Colors.brand_primary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <CustomText label="Crear Etapa" size={24} weight="bold" color={Colors.text_primary} />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <WinnixIcon name="close-outline" size={24} color={Colors.text_secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
              {isLoading ? (
                <ActivityIndicator size="large" color={Colors.brand_primary} style={{ marginTop: 40 }} />
              ) : (
                <View style={styles.form}>
                  <CustomText label="1. Selecciona una Plantilla" size={16} weight="600" color={Colors.text_primary} />
                  
                  <View style={styles.templatesContainer}>
                    {templates?.map((template: any) => {
                      const isSelected = selectedTemplate?._id === template._id;
                      return (
                        <Pressable
                          key={template._id}
                          style={[styles.templateCard, isSelected && styles.templateCardSelected]}
                          onPress={() => setSelectedTemplate(template)}
                        >
                          <CustomText
                            label={template.name}
                            size={16}
                            weight="bold"
                            color={isSelected ? Colors.on_brand : Colors.text_primary}
                          />
                          <View style={{ marginTop: 8 }}>
                            <CustomText label={`Participantes: ${template.structure.participant_type}`} size={12} color={isSelected ? Colors.surface_base : Colors.text_secondary} />
                            <CustomText label={`Cupos: ${template.structure.total_slots}`} size={12} color={isSelected ? Colors.surface_base : Colors.text_secondary} />
                            <CustomText label={`Siembra: ${template.structure.seeding_logic}`} size={12} color={isSelected ? Colors.surface_base : Colors.text_secondary} />
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>

                  {selectedTemplate && (
                    <View style={{ marginTop: 24, gap: 16 }}>
                      <CustomText label="2. Configurar Fechas de la Etapa" size={16} weight="600" color={Colors.text_primary} />
                      
                      {/* Stacked dates for better accessibility */}
                      <View style={styles.verticalFormGroup}>
                        <CustomText label="Fecha de Inicio *" size={12} weight="600" color={Colors.text_secondary} style={{ marginBottom: 6 }} />
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
                          <WinnixIcon name="calendar-outline" size={20} color={Colors.text_primary} />
                          <CustomText label={startDate.toLocaleDateString('es-ES')} size={14} color={Colors.text_primary} />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.verticalFormGroup}>
                        <CustomText label="Fecha de Fin (Opcional)" size={12} weight="600" color={Colors.text_secondary} style={{ marginBottom: 6 }} />
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
                          <WinnixIcon name="calendar-outline" size={20} color={Colors.text_primary} />
                          <CustomText label={endDate ? endDate.toLocaleDateString('es-ES') : 'Sin definir'} size={14} color={Colors.text_primary} />
                        </TouchableOpacity>
                      </View>

                      {renderDatePicker('start')}
                      {renderDatePicker('end')}

                      <CustomText label="3. Personalizar Nombre" size={16} weight="600" color={Colors.text_primary} style={{ marginTop: 12 }} />
                      <TextInput
                        placeholder="Nombre (ej. Semifinal Apertura)"
                        placeholderTextColor={Colors.text_tertiary}
                        value={stageName}
                        onChangeText={setStageName}
                        style={styles.textInput}
                      />

                      <CustomText label="4. Ajustar Reglas de Etapa" size={16} weight="600" color={Colors.text_primary} style={{ marginTop: 12 }} />
                      
                      <View style={styles.switchRow}>
                        <View style={{ flex: 1 }}>
                          <CustomText label="Ida y Vuelta (Longitud)" size={14} color={Colors.text_primary} />
                          <CustomText label="Si es activo, se juegan 2 partidos" size={11} color={Colors.text_tertiary} />
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={[styles.segmentBtn, seriesLength === 2 && styles.segmentBtnActive]}
                          onPress={() => setSeriesLength(seriesLength === 1 ? 2 : 1)}
                        >
                          <CustomText label={seriesLength === 1 ? '1 Partido' : 'Ida y Vuelta'} size={12} color={seriesLength === 2 ? Colors.on_brand : Colors.text_primary} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.switchRow}>
                        <View style={{ flex: 1 }}>
                          <CustomText label="Definir Tercer Puesto" size={14} color={Colors.text_primary} />
                          <CustomText label="Habilita la llave por el bronce" size={11} color={Colors.text_tertiary} />
                        </View>
                        <Switch
                          value={hasThirdPlace}
                          onValueChange={setHasThirdPlace}
                          trackColor={{ false: '#2C3A5A', true: Colors.brand_primary }}
                          thumbColor={hasThirdPlace ? Colors.on_brand : '#f4f3f4'}
                        />
                      </View>

                      <View style={styles.switchRow}>
                        <View style={{ flex: 1 }}>
                          <CustomText label="Obligar Ganador (Sin Empates)" size={14} color={Colors.text_primary} />
                          <CustomText label="Habilita definición por penales" size={11} color={Colors.text_tertiary} />
                        </View>
                        <Switch
                          value={enforceWinner}
                          onValueChange={setEnforceWinner}
                          trackColor={{ false: '#2C3A5A', true: Colors.brand_primary }}
                          thumbColor={enforceWinner ? Colors.on_brand : '#f4f3f4'}
                        />
                      </View>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <CustomButton
                label={isCreating ? "Creando..." : "Crear Etapa"}
                onPress={handleCreate}
                stylePressable={{ backgroundColor: Colors.brand_primary }}
                styleText={{ color: Colors.on_brand }}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 8, 25, 0.8)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.surface_base,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    borderBottomWidth: 0,
  },
  header: {
    ...Flex.rowCenter,
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface_pressed,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: Colors.surface_elevated,
    borderRadius: 50,
  },
  form: {
    padding: 24,
    gap: 16,
  },
  templatesContainer: {
    gap: 12,
    marginTop: 8,
  },
  templateCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  templateCardSelected: {
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.surface_pressed,
    backgroundColor: Colors.surface_base,
  },
  textInput: {
    height: 50,
    backgroundColor: Colors.surface_elevated,
    borderColor: Colors.surface_pressed,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.text_primary,
    fontSize: 16,
  },
  verticalFormGroup: {
    width: '100%',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: Colors.surface_elevated,
    borderColor: Colors.surface_pressed,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  segmentBtn: {
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  segmentBtnActive: {
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  iosOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 8, 25, 0.8)',
  },
  iosContent: {
    backgroundColor: Colors.surface_base,
    borderRadius: 20,
    width: '85%',
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    overflow: 'hidden',
  },
  iosHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface_pressed,
    alignItems: 'center',
  },
  iosPickerContainer: {
    paddingVertical: 10,
  },
  iosFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.surface_pressed,
  },
  iosCancelBtn: {
    padding: 8,
  },
  iosConfirmBtn: {
    padding: 8,
  },
});
