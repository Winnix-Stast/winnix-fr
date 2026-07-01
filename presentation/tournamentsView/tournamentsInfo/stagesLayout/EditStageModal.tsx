import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Pressable, ActivityIndicator, Alert, ScrollView, TextInput, KeyboardAvoidingView, Platform, Switch, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import { stagesActions } from '@/core/stages/actions/stages-actions';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { Colors } from '@/presentation/styles/colors';
import { CustomButton } from '@/presentation/theme/components/CustomButton';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Flex } from '@/presentation/styles/global-styles';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  stage: any;
  editionId: string;
}

export const EditStageModal = ({ isVisible, onClose, stage, editionId }: Props) => {
  const queryClient = useQueryClient();
  const [stageName, setStageName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Status State
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE' | 'FINISHED'>('DRAFT');

  // Raw Dates State
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Override States
  const [seriesLength, setSeriesLength] = useState(1);
  const [hasThirdPlace, setHasThirdPlace] = useState(false);
  const [enforceWinner, setEnforceWinner] = useState(false);

  // Load defaults from selected stage
  useEffect(() => {
    if (stage) {
      setStageName(stage.name || '');
      setStartDate(stage.startDate ? new Date(stage.startDate) : new Date());
      setEndDate(stage.endDate ? new Date(stage.endDate) : null);
      setStatus(stage.status || 'DRAFT');
      setSeriesLength(stage.structure?.match_setup?.series_length ?? 1);
      setHasThirdPlace(stage.structure?.match_setup?.has_third_place ?? false);
      setEnforceWinner(stage.rules_config?.enforce_winner ?? false);
    }
  }, [stage]);

  const isStageActive = stage?.status === 'ACTIVE';

  const handleUpdate = async () => {
    if (!stageName.trim()) {
      Alert.alert('Error', 'El nombre de la etapa es obligatorio.');
      return;
    }

    setIsUpdating(true);
    try {
      await stagesActions.updateStageAction(stage._id, {
        name: stageName,
        startDate: startDate.toISOString(),
        endDate: endDate ? endDate.toISOString() : null,
        status: status,
        structure: {
          ...stage.structure,
          match_setup: {
            series_length: seriesLength,
            has_third_place: hasThirdPlace,
          },
        },
        rules_config: {
          ...stage.rules_config,
          enforce_winner: enforceWinner,
        },
      });
      
      Alert.alert('Éxito', 'Etapa actualizada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['stages', editionId] });
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Ocurrió un error al actualizar la etapa.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Etapa',
      `¿Estás seguro de que deseas eliminar la etapa "${stageName}"? Esta acción eliminará todos los emparejamientos y no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await stagesActions.deleteStageAction(stage._id);
              queryClient.invalidateQueries({ queryKey: ['stages', editionId] });
              Alert.alert('Éxito', 'La etapa ha sido eliminada.');
              onClose();
            } catch (error: any) {
              Alert.alert('Error', 'No se pudo eliminar la etapa.');
            }
          },
        },
      ]
    );
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

  if (!stage) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <CustomText label={`Editar: ${stageName}`} size={20} weight="bold" color={Colors.text_primary} />
                <CustomText label={`Plantilla: ${stage.template?.name || 'Manual'}`} size={12} color={Colors.text_tertiary} />
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <WinnixIcon name="close-outline" size={24} color={Colors.text_secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
              <View style={styles.form}>
                
                {/* 1. Nombre */}
                <View style={styles.formGroup}>
                  <CustomText label="Nombre de la Etapa *" size={14} weight="600" color={Colors.text_secondary} />
                  <TextInput
                    placeholder="Nombre (ej. Semifinal)"
                    placeholderTextColor={Colors.text_tertiary}
                    value={stageName}
                    onChangeText={setStageName}
                    style={styles.textInput}
                  />
                </View>

                {/* 2. Estado */}
                <View style={styles.formGroup}>
                  <CustomText label="Estado de la Etapa" size={14} weight="600" color={Colors.text_secondary} />
                  <View style={styles.row}>
                    {(['DRAFT', 'ACTIVE', 'FINISHED'] as const).map((s) => {
                      const isActive = status === s;
                      const labels: Record<string, string> = {
                        DRAFT: 'Próximamente',
                        ACTIVE: 'Activa',
                        FINISHED: 'Finalizada',
                      };
                      return (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          key={s}
                          style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                          onPress={() => setStatus(s)}
                        >
                          <CustomText
                            label={labels[s]}
                            size={12}
                            weight="bold"
                            color={isActive ? Colors.on_brand : Colors.text_primary}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 3. Fechas */}
                <CustomText label="Configurar Fechas" size={15} weight="600" color={Colors.text_primary} style={{ marginTop: 12 }} />
                
                {/* Stacked dates for accessibility */}
                <View style={styles.verticalFormGroup}>
                  <CustomText label="Fecha de Inicio *" size={12} weight="600" color={Colors.text_secondary} style={{ marginBottom: 6 }} />
                  <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
                    <WinnixIcon name="calendar-outline" size={20} color={Colors.text_primary} />
                    <CustomText label={startDate.toLocaleDateString('es-ES')} size={14} color={Colors.text_primary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.verticalFormGroup}>
                  <CustomText label="Fecha de Fin" size={12} weight="600" color={Colors.text_secondary} style={{ marginBottom: 6 }} />
                  <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
                    <WinnixIcon name="calendar-outline" size={20} color={Colors.text_primary} />
                    <CustomText label={endDate ? endDate.toLocaleDateString('es-ES') : 'Sin definir'} size={14} color={Colors.text_primary} />
                  </TouchableOpacity>
                </View>

                {renderDatePicker('start')}
                {renderDatePicker('end')}

                {/* 4. Reglas */}
                <CustomText label="Configuración Técnica de Etapa" size={15} weight="600" color={Colors.text_primary} style={{ marginTop: 12 }} />
                
                {isStageActive && (
                  <View style={styles.warningBanner}>
                    <WinnixIcon name="information-circle-outline" size={20} color={Colors.status_draft} />
                    <CustomText
                      label="Las reglas técnicas están bloqueadas porque la etapa se encuentra ACTIVA. Pásala a Próximamente para editarlas."
                      size={11}
                      color={Colors.text_secondary}
                      style={{ flex: 1 }}
                    />
                  </View>
                )}

                <View style={[styles.rulesContainer, isStageActive && { opacity: 0.6 }]}>
                  <View style={styles.switchRow}>
                    <View style={{ flex: 1 }}>
                      <CustomText label="Ida y Vuelta (Longitud)" size={14} color={Colors.text_primary} />
                      <CustomText label="Si es activo, se juegan 2 partidos" size={11} color={Colors.text_tertiary} />
                    </View>
                    <TouchableOpacity
                      disabled={isStageActive}
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
                      disabled={isStageActive}
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
                      disabled={isStageActive}
                      value={enforceWinner}
                      onValueChange={setEnforceWinner}
                      trackColor={{ false: '#2C3A5A', true: Colors.brand_primary }}
                      thumbColor={enforceWinner ? Colors.on_brand : '#f4f3f4'}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.footerRow}>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
                  <WinnixIcon name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <CustomButton
                    label={isUpdating ? "Guardando..." : "Guardar Cambios"}
                    onPress={handleUpdate}
                    stylePressable={{ backgroundColor: Colors.brand_primary }}
                    styleText={{ color: Colors.on_brand }}
                  />
                </View>
              </View>
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
  formGroup: {
    gap: 8,
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
  row: {
    flexDirection: 'row',
    gap: 12,
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
  rulesContainer: {
    gap: 16,
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
    flex: 1,
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.surface_pressed,
    backgroundColor: Colors.surface_base,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deleteBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
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
