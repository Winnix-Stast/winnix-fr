import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import {
  PREDEFINED_THEMES,
  PRIZE_STATUS_OPTIONS,
  PRIZE_SUGGESTIONS,
  getPrizeStatusConfig,
  getPrizeTheme,
} from '@/core/prizes/constants/prize-themes';
import { PrizeStatus } from '@/core/prizes/interface/prize.interface';
import { useAlertStore } from '@/presentation/components/customs';
import { useAdditionalPrizes } from '@/presentation/hooks/prizes/useAdditionalPrizes';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { CustomInput } from '@/presentation/theme/components';

interface PrizesCreateSectionProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
}

export const PrizesCreateSection: React.FC<PrizesCreateSectionProps> = ({
  control,
  setValue,
}) => {
  const { data: catalogItems = [] } = useAdditionalPrizes();
  const { showAlert } = useAlertStore();

  const initialPrizes = useWatch({ control, name: 'initialPrizes' }) || [];

  const [selectedChip, setSelectedChip] = useState<string>('Otro (Personalizado)');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PrizeStatus>('active');
  const [customLabel, setCustomLabel] = useState<string>('');
  const [cashAmountRaw, setCashAmountRaw] = useState<string>('');
  const [positionStr, setPositionStr] = useState<string>('');

  const isTitleEditable = selectedChip === 'Otro (Personalizado)';

  const handleSelectChip = (sug: (typeof PRIZE_SUGGESTIONS)[number]) => {
    setSelectedChip(sug.label);
    if (sug.label === 'Otro (Personalizado)') {
      setCustomLabel('');
      setPositionStr('');
    } else {
      setCustomLabel(sug.label);
      setPositionStr(sug.position !== null ? String(sug.position) : '');
    }
  };

  const handleToggleItem = (itemName: string) => {
    if (selectedItems.includes(itemName)) {
      setSelectedItems(selectedItems.filter((i) => i !== itemName));
    } else {
      setSelectedItems([...selectedItems, itemName]);
    }
  };

  const formatCurrencyCOP = (rawText: string) => {
    const cleanNum = rawText.replace(/\D/g, '');
    if (!cleanNum) return '';
    const num = parseInt(cleanNum, 10);
    return `$ ${num.toLocaleString('es-CO')} COP`;
  };

  const handleAddPrize = () => {
    const labelToSave = (customLabel || '').trim();
    const cashNum = cashAmountRaw ? parseInt(cashAmountRaw.replace(/\D/g, ''), 10) : null;
    const posNum = positionStr ? parseInt(positionStr, 10) : null;

    if (!labelToSave) {
      showAlert({
        title: 'Título Requerido',
        message: 'Por favor ingresa un nombre para el premio (ej. Campeón, Goleador).',
        type: 'warning',
        confirmText: 'ENTENDIDO',
      });
      return;
    }

    if (!cashNum && selectedItems.length === 0) {
      showAlert({
        title: 'Recompensa Requerida',
        message:
          'Ingresa un valor en dinero (COP) o selecciona al menos un premio adicional.',
        type: 'warning',
        confirmText: 'ENTENDIDO',
      });
      return;
    }

    const isMain = posNum !== null && posNum > 0;

    const newPrize = {
      label: labelToSave,
      cashAmount: cashNum,
      currency: 'COP',
      additionalItems: selectedItems,
      position: posNum,
      isMainPrize: isMain,
      order: initialPrizes.length,
      status: selectedStatus || 'active',
    };

    setValue('initialPrizes', [...initialPrizes, newPrize]);

    // Reset local draft fields
    setCustomLabel('');
    setCashAmountRaw('');
    setPositionStr('');
    setSelectedChip('Otro (Personalizado)');
    setSelectedItems([]);
    setSelectedStatus('active');
  };

  const handleRemovePrize = (index: number) => {
    const updated = initialPrizes.filter((_: any, idx: number) => idx !== index);
    setValue('initialPrizes', updated);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.trophyIconBg}>
          <WinnixIcon name='trophy' size={24} color='#FBBF24' />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Bolsa de Premios del Torneo</Text>
          <Text style={styles.sectionSubtitle}>
            Configura las recompensas que se disputarán en esta edición (Opcional).
          </Text>
        </View>
      </View>

      {/* Draft Form Container */}
      <View style={styles.formCard}>
        <Text style={styles.cardHeaderTitle}>Agregar un Premio Inicial</Text>

        {/* Quick Suggestion Chips */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Títulos Sugeridos</Text>
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
                    size={15}
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

        {/* Title Input */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Título del Premio *</Text>
          <CustomInput
            name='draftPrizeLabel'
            control={control}
            value={customLabel}
            onChangeText={(txt) => setCustomLabel(txt)}
            placeholder='Escribe el título o selecciona una opción arriba'
            placeholderTextColor='#9CA3AF'
            editable={isTitleEditable}
            style={[!isTitleEditable && styles.inputDisabled]}
          />
        </View>

        {/* Estado del Premio */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Estado Inicial del Premio</Text>
          <View style={styles.chipsContainer}>
            {PRIZE_STATUS_OPTIONS.map((opt) => {
              const isSelected = selectedStatus === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSelectedStatus(opt.value)}
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor: isSelected ? opt.color : opt.bg,
                      borderColor: opt.borderColor,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <WinnixIcon
                    name={opt.iconName as any}
                    size={14}
                    color={isSelected ? '#000000' : opt.color}
                  />
                  <Text
                    style={[
                      styles.statusChipText,
                      { color: isSelected ? '#000000' : opt.color },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Dinero (COP) */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Premio en Dinero (COP)</Text>
          <CustomInput
            name='draftCashAmount'
            control={control}
            value={cashAmountRaw}
            onChangeText={(txt) => setCashAmountRaw(txt)}
            placeholder='Ej. 2000000'
            placeholderTextColor='#9CA3AF'
            keyboardType='numeric'
          />
          {cashAmountRaw !== '' && (
            <Text style={styles.formattedMoneyText}>
              Formateado: {formatCurrencyCOP(cashAmountRaw)}
            </Text>
          )}
        </View>

        {/* Premios Adicionales Chips */}
        {catalogItems.length > 0 && (
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Premios Adicionales (Opcional)</Text>
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
                      size={18}
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
        )}

        {/* Posición Numérica */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Posición numérica (1, 2, 3... Opcional)</Text>
          <CustomInput
            name='draftPosition'
            control={control}
            value={positionStr}
            onChangeText={(txt) => setPositionStr(txt)}
            placeholder='Ej. 1 para primer lugar (o vacío para reconocimientos)'
            placeholderTextColor='#9CA3AF'
            keyboardType='numeric'
          />
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddPrize}
          activeOpacity={0.8}
        >
          <WinnixIcon name='add-circle' size={18} color='#000000' />
          <Text style={styles.addBtnText}>AGREGAR ESTE PREMIO</Text>
        </TouchableOpacity>
      </View>

      {/* Visual List of Added Prizes */}
      <View style={styles.addedPrizesList}>
        <Text style={styles.addedListTitle}>
          Premios Configurados ({initialPrizes.length})
        </Text>

        {initialPrizes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Aún no has agregado ningún premio. Puedes configurar premios ahora o hacerlo
              después de publicar el torneo.
            </Text>
          </View>
        ) : (
          initialPrizes.map((prize: any, idx: number) => {
            const theme = getPrizeTheme(prize);
            const statusConfig = getPrizeStatusConfig(prize.status);
            return (
              <View
                key={idx}
                style={[styles.prizeItemCard, { borderColor: theme.borderColor }]}
              >
                <View style={styles.prizeItemLeft}>
                  <View
                    style={[styles.prizeIconSquare, { backgroundColor: theme.badgeBg }]}
                  >
                    <WinnixIcon
                      name={theme.iconName as any}
                      size={18}
                      color={theme.badgeText}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleStatusRow}>
                      <Text style={styles.prizeItemLabel}>{prize.label}</Text>
                      <View
                        style={[
                          styles.statusTag,
                          {
                            backgroundColor: statusConfig.bg,
                            borderColor: statusConfig.borderColor,
                          },
                        ]}
                      >
                        <Text
                          style={[styles.statusTagText, { color: statusConfig.color }]}
                        >
                          {statusConfig.label}
                        </Text>
                      </View>
                    </View>
                    {prize.cashAmount ? (
                      <Text
                        style={[styles.prizeRewardText, { color: theme.accentColor }]}
                      >
                        $ {prize.cashAmount.toLocaleString('es-CO')} COP
                      </Text>
                    ) : null}
                    {prize.additionalItems && prize.additionalItems.length > 0 ? (
                      <Text style={styles.itemsSubtext}>
                        + {prize.additionalItems.join(', ')}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleRemovePrize(idx)}
                  style={styles.deleteBtn}
                  hitSlop={8}
                >
                  <WinnixIcon name='trash-outline' size={18} color={Colors.red_400} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface_elevated,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  trophyIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text_primary,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: Colors.text_tertiary,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: Colors.surface_elevated,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.25)',
    gap: 14,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.brand_primary,
    letterSpacing: 0.5,
  },
  formGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text_primary,
  },
  inputDisabled: {
    opacity: 0.65,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: '#9CA3AF',
  },
  formattedMoneyText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.brand_primary,
    marginTop: 2,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  suggestionChipText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '900',
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  chipButtonActive: {
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text_primary,
  },
  chipTextActive: {
    color: '#000000',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FBBF24',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.8,
  },
  addedPrizesList: {
    gap: 10,
    marginTop: 6,
  },
  addedListTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.text_secondary,
    letterSpacing: 0.5,
  },
  emptyBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.text_tertiary,
    lineHeight: 18,
  },
  prizeItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface_elevated,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  prizeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  prizeIconSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prizeItemLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.text_primary,
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  prizeRewardText: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  itemsSubtext: {
    fontSize: 11.5,
    color: '#FBBF24',
    marginTop: 1,
  },
  deleteBtn: {
    padding: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: 8,
  },
});
