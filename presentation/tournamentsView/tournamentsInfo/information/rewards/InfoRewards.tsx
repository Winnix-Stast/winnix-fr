import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getPrizeStatusConfig,
  getPrizeTheme,
} from '@/core/prizes/constants/prize-themes';
import { usePrizes } from '@/presentation/hooks/prizes/usePrizes';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { AddPrizeModal } from './AddPrizeModal';

interface Props {
  editionId: string;
  isOrganizer: boolean;
}

export const InfoRewards: React.FC<Props> = ({ editionId, isOrganizer }) => {
  const {
    prizes,
    isLoading,
    isCreating,
    catalogItems,
    showModal,
    setShowModal,
    selectedChip,
    selectedItems,
    selectedStatus,
    setSelectedStatus,
    control,
    formValues,
    isTitleEditable,
    sortedMainPrizes,
    specialPrizes,
    handleSelectChip,
    handleToggleItem,
    handleCreate,
    handleDelete,
    formatCurrencyCOP,
  } = usePrizes(editionId);

  return (
    <View style={styles.container}>
      {/* Top Header Bar when prizes exist vs Full Hero Card when empty */}
      {prizes.length === 0 && !isLoading && (
        <View style={styles.heroCard}>
          <LinearGradient
            colors={[
              'rgba(251, 191, 36, 0.18)',
              'rgba(40, 209, 195, 0.08)',
              'rgba(14, 21, 41, 0.98)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroHeader}>
              <View style={styles.heroTitleRow}>
                <View style={styles.trophyIconBg}>
                  <WinnixIcon name='trophy' size={28} color='#FBBF24' />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTag}>SALA DE PREMIOS</Text>
                  <Text style={styles.heroTitle}>Bolsa Oficial de Recompensas</Text>
                </View>
              </View>

              {isOrganizer && (
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  style={styles.addPrizeBtnHero}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addPrizeBtnText}>CONFIGURAR PRIMER PREMIO</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Compact Top Bar when prizes exist */}
      {prizes.length > 0 && (
        <View style={styles.compactTopBar}>
          <View style={styles.compactTopLeft}>
            <View style={styles.compactTrophyIcon}>
              <WinnixIcon name='trophy' size={18} color='#FBBF24' />
            </View>
            <View style={styles.compactTitleGroup}>
              <Text style={styles.compactTitle} numberOfLines={1}>
                Bolsa de Premios
              </Text>
              <Text style={styles.compactSubtitle} numberOfLines={1}>
                {prizes.length} PREMIOS PUBLICADOS
              </Text>
            </View>
          </View>

          {isOrganizer && (
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.addPrizeBtnCompact}
              activeOpacity={0.8}
            >
              <WinnixIcon name='add-circle' size={16} color='#000000' />
              <Text style={styles.addPrizeBtnTextCompact}>AGREGAR</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Content Body */}
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size='large' color={Colors.brand_primary} />
          <Text style={styles.loadingText}>Cargando sala de premios...</Text>
        </View>
      ) : prizes.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconBg}>
            <WinnixIcon name='trophy-outline' size={54} color={Colors.text_tertiary} />
          </View>
          <Text style={styles.emptyTitle}>Aún no se han publicado los premios</Text>
          <Text style={styles.emptySubtitle}>
            El organizador aún no ha configurado los premios o reconocimientos para esta
            edición.
          </Text>
        </View>
      ) : (
        <View style={styles.prizesList}>
          {/* Main Podium Prizes */}
          {sortedMainPrizes.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>PODIO Y POSICIONES OFICIALES</Text>
              </View>

              <View style={styles.cardsGap}>
                {sortedMainPrizes.map((prize: any) => {
                  const theme = getPrizeTheme(prize);
                  const statusConfig = getPrizeStatusConfig(prize.status);
                  return (
                    <View
                      key={prize._id}
                      style={[styles.podiumCard, { borderColor: theme.borderColor }]}
                    >
                      <LinearGradient
                        colors={theme.gradColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.podiumGradient}
                      >
                        {/* Header Row: Badge + Position Tag & Status Badge + Title + Delete Button */}
                        <View style={styles.cardHeaderRow}>
                          <View style={styles.cardBadgeTitleGroup}>
                            <View
                              style={[
                                styles.positionBadgeSquare,
                                { backgroundColor: theme.badgeBg },
                              ]}
                            >
                              <WinnixIcon
                                name={theme.iconName as any}
                                size={22}
                                color={theme.badgeText}
                              />
                            </View>

                            <View style={styles.cardTitleBox}>
                              <View style={styles.titleWithStatusRow}>
                                <Text
                                  style={[
                                    styles.positionTagText,
                                    { color: theme.accentColor },
                                  ]}
                                >
                                  {prize.position
                                    ? `${prize.position}° LUGAR`
                                    : theme.tagTitle}
                                </Text>
                                <View
                                  style={[
                                    styles.statusBadgePill,
                                    {
                                      backgroundColor: statusConfig.bg,
                                      borderColor: statusConfig.borderColor,
                                    },
                                  ]}
                                >
                                  <WinnixIcon
                                    name={statusConfig.iconName as any}
                                    size={11}
                                    color={statusConfig.color}
                                  />
                                  <Text
                                    style={[
                                      styles.statusBadgeText,
                                      { color: statusConfig.color },
                                    ]}
                                  >
                                    {statusConfig.label}
                                  </Text>
                                </View>
                              </View>
                              <Text style={styles.prizeTitleText} numberOfLines={1}>
                                {prize.label}
                              </Text>
                            </View>
                          </View>

                          {isOrganizer && (
                            <TouchableOpacity
                              onPress={() => handleDelete(prize._id, prize.label)}
                              style={styles.deleteIconButtonSquare}
                              hitSlop={8}
                            >
                              <WinnixIcon
                                name='trash-outline'
                                size={18}
                                color={Colors.red_400}
                              />
                            </TouchableOpacity>
                          )}
                        </View>

                        {/* Divider Line */}
                        <View style={styles.cardDivider} />

                        {/* Rewards Content Row */}
                        <View style={styles.rewardContentRow}>
                          {prize.cashAmount ? (
                            <View
                              style={[
                                styles.cashBadgePill,
                                {
                                  backgroundColor: `${theme.accentColor}1A`,
                                  borderColor: `${theme.accentColor}50`,
                                },
                              ]}
                            >
                              <WinnixIcon
                                name='cash-outline'
                                size={16}
                                color={theme.accentColor}
                              />
                              <Text style={styles.cashAmountValue}>
                                $ {prize.cashAmount.toLocaleString('es-CO')} COP
                              </Text>
                            </View>
                          ) : null}

                          {prize.reward && !prize.cashAmount ? (
                            <View
                              style={[
                                styles.cashBadgePill,
                                {
                                  backgroundColor: `${theme.accentColor}1A`,
                                  borderColor: `${theme.accentColor}50`,
                                },
                              ]}
                            >
                              <WinnixIcon
                                name='gift-outline'
                                size={16}
                                color={theme.accentColor}
                              />
                              <Text style={styles.cashAmountValue}>{prize.reward}</Text>
                            </View>
                          ) : null}

                          {prize.additionalItems && prize.additionalItems.length > 0 ? (
                            <View style={styles.itemsBadgeRow}>
                              {prize.additionalItems.map((item: string, idx: number) => (
                                <View key={idx} style={styles.itemBadgePill}>
                                  <WinnixIcon
                                    name={
                                      item.toLowerCase().includes('uniform')
                                        ? 'shirt-outline'
                                        : 'trophy-outline'
                                    }
                                    size={14}
                                    color='#FBBF24'
                                  />
                                  <Text style={styles.itemBadgeText}>{item}</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}
                        </View>
                      </LinearGradient>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Special Distinctions */}
          {specialPrizes.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <WinnixIcon name='sparkles' size={18} color={Colors.brand_primary} />
                <Text style={styles.sectionTitle}>
                  DISTINCIONES INDIVIDUALES Y ESPECIALES
                </Text>
              </View>

              <View style={styles.cardsGap}>
                {specialPrizes.map((prize: any) => {
                  const theme = getPrizeTheme(prize);
                  const statusConfig = getPrizeStatusConfig(prize.status);
                  return (
                    <View
                      key={prize._id}
                      style={[styles.specialCard, { borderColor: theme.borderColor }]}
                    >
                      <View style={styles.specialLeft}>
                        <View
                          style={[
                            styles.specialIconBg,
                            {
                              backgroundColor: `${theme.accentColor}20`,
                              borderColor: `${theme.accentColor}50`,
                            },
                          ]}
                        >
                          <WinnixIcon
                            name={theme.iconName as any}
                            size={20}
                            color={theme.accentColor}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.titleWithStatusRow}>
                            <Text style={styles.specialLabel}>{prize.label}</Text>
                            <View
                              style={[
                                styles.statusBadgePill,
                                {
                                  backgroundColor: statusConfig.bg,
                                  borderColor: statusConfig.borderColor,
                                },
                              ]}
                            >
                              <WinnixIcon
                                name={statusConfig.iconName as any}
                                size={11}
                                color={statusConfig.color}
                              />
                              <Text
                                style={[
                                  styles.statusBadgeText,
                                  { color: statusConfig.color },
                                ]}
                              >
                                {statusConfig.label}
                              </Text>
                            </View>
                          </View>

                          {prize.cashAmount ? (
                            <Text
                              style={[styles.specialReward, { color: theme.accentColor }]}
                            >
                              $ {prize.cashAmount.toLocaleString('es-CO')} COP
                            </Text>
                          ) : prize.reward ? (
                            <Text
                              style={[styles.specialReward, { color: theme.accentColor }]}
                            >
                              {prize.reward}
                            </Text>
                          ) : null}

                          {prize.additionalItems && prize.additionalItems.length > 0 ? (
                            <View style={[styles.itemsBadgeRow, { marginTop: 6 }]}>
                              {prize.additionalItems.map((item: string, idx: number) => (
                                <View key={idx} style={styles.itemBadgePill}>
                                  <WinnixIcon
                                    name={
                                      item.toLowerCase().includes('uniform')
                                        ? 'shirt-outline'
                                        : 'trophy-outline'
                                    }
                                    size={13}
                                    color='#FBBF24'
                                  />
                                  <Text style={styles.itemBadgeText}>{item}</Text>
                                </View>
                              ))}
                            </View>
                          ) : null}
                        </View>
                      </View>

                      {isOrganizer && (
                        <TouchableOpacity
                          onPress={() => handleDelete(prize._id, prize.label)}
                          style={styles.deleteIconButtonSquare}
                          hitSlop={8}
                        >
                          <WinnixIcon
                            name='trash-outline'
                            size={18}
                            color={Colors.red_400}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Submódulo Modal para Agregar Premio */}
      <AddPrizeModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        catalogItems={catalogItems}
        selectedChip={selectedChip}
        selectedItems={selectedItems}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        control={control}
        formValues={formValues}
        isTitleEditable={isTitleEditable}
        isCreating={isCreating}
        handleSelectChip={handleSelectChip}
        handleToggleItem={handleToggleItem}
        handleCreate={handleCreate}
        formatCurrencyCOP={formatCurrencyCOP}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
    marginTop: 10,
  },

  // Compact Top Bar (Shown when prizes exist)
  compactTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface_elevated,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    overflow: 'hidden',
  },
  compactTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
    marginRight: 6,
  },
  compactTrophyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    flexShrink: 0,
  },
  compactTitleGroup: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.text_primary,
  },
  compactSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.brand_primary,
    letterSpacing: 0.5,
  },
  addPrizeBtnCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FBBF24',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 9,
    flexShrink: 0,
  },
  addPrizeBtnTextCompact: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.5,
  },

  // Full Hero Card (Shown only when 0 prizes)
  heroCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  heroGradient: {
    padding: 18,
  },
  heroHeader: {
    gap: 14,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  trophyIconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  heroTag: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  addPrizeBtnHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FBBF24',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  addPrizeBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: Colors.text_tertiary,
    fontSize: 14,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface_elevated,
    padding: 28,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text_primary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text_tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  prizesList: {
    gap: 20,
  },
  sectionBlock: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 4,
  },
  sectionDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.brand_primary,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.text_secondary,
    letterSpacing: 1.2,
  },
  cardsGap: {
    gap: 14,
  },

  // Redesigned Podium Card Layout
  podiumCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  podiumGradient: {
    padding: 16,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardBadgeTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  positionBadgeSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitleBox: {
    flex: 1,
    gap: 2,
  },
  titleWithStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  positionTagText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  prizeTitleText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  deleteIconButtonSquare: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
  },
  rewardContentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  cashBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(40, 209, 195, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },
  cashAmountValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  itemsBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)',
  },
  itemBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FBBF24',
  },

  specialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface_elevated,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.25)',
  },
  specialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  specialIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(40, 209, 195, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },
  specialLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text_primary,
  },
  specialReward: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.brand_primary,
    marginTop: 2,
  },
});
