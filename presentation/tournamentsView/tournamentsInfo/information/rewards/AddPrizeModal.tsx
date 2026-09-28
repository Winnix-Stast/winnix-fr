import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Control } from 'react-hook-form';
import {
  PREDEFINED_THEMES,
  PRIZE_SUGGESTIONS,
} from '@/core/prizes/constants/prize-themes';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { CustomButton, CustomInput } from '@/presentation/theme/components';
import { AppModal as CustomModal } from '@/presentation/theme/components/CustomModal';

interface AddPrizeModalProps {
  visible: boolean;
  onClose: () => void;
  catalogItems: any[];
  selectedChip: string;
  selectedItems: string[];
  control: Control<any>;
  formValues: { cashAmountRaw?: string; [key: string]: any };
  isTitleEditable: boolean;
  isCreating: boolean;
  handleSelectChip: (sug: any) => void;
  handleToggleItem: (itemName: string) => void;
  handleCreate: () => void;
  formatCurrencyCOP: (val: string) => string;
}

export const AddPrizeModal: React.FC<AddPrizeModalProps> = ({
  visible,
  onClose,
  catalogItems,
  selectedChip,
  selectedItems,
  control,
  formValues,
  isTitleEditable,
  isCreating,
  handleSelectChip,
  handleToggleItem,
  handleCreate,
  formatCurrencyCOP,
}) => {
  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      showIcon={true}
      iconColor={Colors.text_primary}
      iconSize={30}
      contentStyle={styles.appModalContent}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ width: '100%' }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={styles.modalScrollBody}
          style={{ maxHeight: 520, width: '100%' }}
        >
          <View style={styles.modalHeaderTitleRow}>
            <View style={styles.modalTrophyBg}>
              <WinnixIcon name='trophy' size={24} color='#FBBF24' />
            </View>
            <Text style={styles.modalTitleText}>Agregar Nuevo Premio</Text>
          </View>

          {/* Quick Suggestion Chips */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabelLarge}>
              Títulos Sugeridos (Toca para autocompletar)
            </Text>
            <Text style={styles.helperText}>
              Toca cualquier título para autocompletar el nombre y la posición
              automáticamente:
            </Text>
            <View style={styles.chipsContainer}>
              {PRIZE_SUGGESTIONS.map((sug) => {
                const theme = PREDEFINED_THEMES[sug.themeKey];
                const isSelected = selectedChip === sug.label;
                return (
                  <TouchableOpacity
                    key={sug.label}
                    onPress={() => handleSelectChip(sug)}
                    style={[
                      styles.suggestionChip,
                      {
                        backgroundColor: isSelected
                          ? theme.accentColor
                          : `${theme.accentColor}1A`,
                        borderColor: isSelected
                          ? theme.accentColor
                          : `${theme.accentColor}66`,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <WinnixIcon
                      name={sug.icon}
                      size={16}
                      color={isSelected ? theme.badgeText : theme.accentColor}
                    />
                    <Text
                      style={[
                        styles.suggestionChipText,
                        { color: isSelected ? theme.badgeText : '#FFFFFF' },
                      ]}
                    >
                      {sug.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Input 1: Title / Label */}
          <View style={styles.formGroup}>
            <View style={styles.labelWithBadgeRow}>
              <Text style={styles.inputLabelLarge}>Nombre o Título del Premio *</Text>
            </View>
            <CustomInput
              name='label'
              control={control}
              placeholder='Escribe un título personalizado o selecciona "Otro"'
              placeholderTextColor='#9CA3AF'
              editable={isTitleEditable}
              style={[!isTitleEditable && styles.inputDisabled]}
            />
          </View>

          {/* Input 2: Cash Amount (COP) */}
          <View style={styles.formGroup}>
            <View style={styles.labelWithBadgeRow}>
              <Text style={styles.inputLabelLarge}>Premio en Dinero (COP)</Text>
              <View style={styles.copBadge}>
                <Text style={styles.copBadgeText}>MONEDA: COP</Text>
              </View>
            </View>
            <CustomInput
              name='cashAmountRaw'
              control={control}
              placeholder='Ej. 2000000'
              placeholderTextColor='#9CA3AF'
              keyboardType='numeric'
            />
            {formValues.cashAmountRaw !== '' &&
              formValues.cashAmountRaw !== undefined && (
                <Text style={styles.formattedMoneyText}>
                  Valor formateado: {formatCurrencyCOP(formValues.cashAmountRaw)}
                </Text>
              )}
          </View>

          {/* Input 3: Additional Non-Monetary Items Selector (Chips) */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabelLarge}>Premios Adicionales</Text>
            <Text style={styles.helperText}>
              Puedes seleccionar una o más opciones para acompañar o entregar como premio:
            </Text>

            <View style={styles.chipsContainer}>
              {catalogItems.map((item: any) => {
                const isSelected = selectedItems.includes(item.name);
                return (
                  <TouchableOpacity
                    key={item._id || item.name}
                    onPress={() => handleToggleItem(item.name)}
                    style={[styles.chipButton, isSelected && styles.chipButtonActive]}
                    activeOpacity={0.8}
                  >
                    <WinnixIcon
                      name={
                        isSelected ? 'checkbox' : (item.icon as any) || 'square-outline'
                      }
                      size={20}
                      color={isSelected ? '#000000' : Colors.brand_primary}
                    />
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Input 4: Position (Optional) */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabelLarge}>
              Posición numérica (1, 2, 3... Opcional)
            </Text>
            <CustomInput
              name='position'
              control={control}
              placeholder='Dejar vacío si es una distinción individual (ej. MVP)'
              placeholderTextColor='#9CA3AF'
              keyboardType='numeric'
            />
          </View>

          {/* Submit Action Button */}
          <View style={styles.modalSubmitContainer}>
            <CustomButton
              label={isCreating ? 'Guardando...' : 'Guardar Premio'}
              onPress={handleCreate}
              disabled={isCreating}
              stylePressable={styles.submitBtnFull}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  appModalContent: {
    backgroundColor: Colors.surface_base,
    borderRadius: 22,
    width: '92%',
    maxWidth: 440,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.35)',
  },
  modalScrollBody: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
    gap: 18,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  modalTrophyBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  modalTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text_primary,
  },
  formGroup: {
    gap: 8,
  },
  labelWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copBadge: {
    backgroundColor: 'rgba(40, 209, 195, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },
  copBadgeText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: Colors.brand_primary,
    letterSpacing: 0.8,
  },
  inputLabelLarge: {
    fontSize: 16.5,
    fontWeight: '900',
    color: Colors.text_primary,
  },
  helperText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#D1D5DB',
    lineHeight: 20,
  },
  inputDisabled: {
    opacity: 0.65,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    color: '#9CA3AF',
  },
  formattedMoneyText: {
    fontSize: 15.5,
    fontWeight: '900',
    color: Colors.brand_primary,
    marginTop: 2,
    paddingLeft: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  chipButtonActive: {
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.text_primary,
  },
  chipTextActive: {
    color: '#000000',
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  suggestionChipText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalSubmitContainer: {
    marginTop: 10,
    width: '100%',
  },
  submitBtnFull: {
    width: '100%',
  },
});
