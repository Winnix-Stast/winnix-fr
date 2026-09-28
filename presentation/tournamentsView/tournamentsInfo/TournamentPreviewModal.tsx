import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getPrizeStatusConfig,
  getPrizeTheme,
} from '@/core/prizes/constants/prize-themes';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useMyBrands } from '@/presentation/hooks/brands/useMyBrands';
import { IconName, WinnixIcon } from '@/presentation/plugins/Icon';
import { CreateEditionFormData } from '@/presentation/schemas/tournamentSchema';
import { Colors, getTournamentStatusConfig } from '@/presentation/styles';
import {
  InformationTournament,
  ResumeLayout,
  TournamentTeamsLayout,
} from '@/presentation/tournamentsView';
import { TournamentHeaderCard } from '@/presentation/tournamentsView/tournamentsInfo/TournamentHeaderCard';
import { TournamentMenu } from '@/presentation/tournamentsView/tournamentsInfo/TournamentMenu';
import { TournamentStatsCards } from '@/presentation/tournamentsView/tournamentsInfo/TournamentStatsCards';

interface PreviewProps {
  visible: boolean;
  onClose: () => void;
  formData: CreateEditionFormData;
}

export const TournamentPreviewModal = ({ visible, onClose, formData }: PreviewProps) => {
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('summary');
  const { user } = useAuthStore();
  const { brands = [] } = useMyBrands();

  const selectedBrandId = formData?.tournament;
  const selectedBrand = Array.isArray(brands)
    ? brands.find((b: any) => b._id === selectedBrandId)
    : null;

  const menuItems = [
    { key: 'summary', label: 'Resumen', icon: 'folder-open-outline' as IconName },
    { key: 'info', label: 'Info', icon: 'information-circle-outline' as IconName },
    { key: 'rewards', label: 'Premios', icon: 'gift-outline' as IconName },
    { key: 'stages', label: 'Etapas', icon: 'flag-outline' as IconName },
    { key: 'teams', label: 'Equipos', icon: 'people-outline' as IconName },
  ];

  const formatDateText = () => {
    if (!formData?.startDate && !formData?.endDate) return '';
    const startObj = formData?.startDate ? new Date(formData.startDate) : null;
    const endObj = formData?.endDate ? new Date(formData.endDate) : null;
    const startStr =
      startObj && !isNaN(startObj.getTime())
        ? `${startObj.getDate()} ${startObj.toLocaleString('es', { month: 'short' })}`
        : '';
    const endStr =
      endObj && !isNaN(endObj.getTime())
        ? `${endObj.getDate()} ${endObj.toLocaleString('es', { month: 'short' })} ${endObj.getFullYear()}`
        : '';
    if (startStr && endStr) return `${startStr} - ${endStr}`;
    return startStr || endStr;
  };

  const statusKey = formData?.status || 'DRAFT';
  const statusConfig = getTournamentStatusConfig(statusKey);

  const initialStages = (formData as any)?.initialStages || [];
  const initialPrizes = (formData as any)?.initialPrizes || [];

  const phoneStr = user?.phoneNumber ? String(user.phoneNumber) : '';
  const organizerUser = {
    username: user?.username || user?.nickname || '',
    email: user?.email || '',
    phoneNumber: phoneStr,
    contact: {
      phone: phoneStr,
    },
  };

  const previewEdition = {
    tournament: {
      name: selectedBrand?.name || formData?.seasonName || '',
      description: selectedBrand?.description || '',
      logo: formData?.logo || selectedBrand?.logo,
      organizer: organizerUser,
      globalStats: {
        totalEditions: 0,
      },
    },
    organizer: organizerUser,
    subOrganizers: [],
    playersPerTeam: formData?.playersPerTeam,
    matchDuration: formData?.matchDuration,
    scoring: formData?.scoring,
    config: formData?.config,
    editionStats: {
      matchesPlayed: 0,
    },
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: Math.max(top, 12) }]}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.previewTag}>
            <WinnixIcon name='eye-outline' size={16} color={Colors.brand_primary} />
            <Text style={styles.previewTagText}>VISTA PREVIA EN VIVO</Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton} hitSlop={10}>
            <WinnixIcon name='close-outline' size={24} color={Colors.text_primary} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.cardWrapper}>
            <TournamentHeaderCard
              title={formData?.seasonName || ''}
              state={statusKey as any}
              statusLabel={statusConfig.label}
              dateText={formatDateText()}
              image={
                formData?.image
                  ? { uri: formData.image }
                  : require('@/assets/images/imgT.jpg')
              }
              titleStyle={{ fontSize: 28 }}
            />
          </View>

          {/* Tournament Stats Cards */}
          <TournamentStatsCards
            inscriptionsCount={0}
            status={statusKey}
            statusLabel={statusConfig.label}
          />

          {/* Tabs Menu */}
          <TournamentMenu
            activeKey={activeTab}
            onSelect={setActiveTab}
            items={menuItems}
          />

          {/* Tab Content */}
          <View style={styles.tabContentContainer}>
            {activeTab === 'summary' && (
              <ResumeLayout
                stats={[
                  { label: 'Encuentros jugados', value: 0 },
                  { label: 'Goles anotados', value: 0 },
                  { label: 'Tarjetas amarillas', value: 0 },
                  { label: 'Tarjetas rojas', value: 0 },
                ]}
                activities={[]}
              />
            )}

            {activeTab === 'stages' && (
              <View style={styles.stagesPreviewContainer}>
                {initialStages.length > 0 ? (
                  initialStages.map((stage: any, idx: number) => {
                    const seriesLengthText =
                      stage.template?.structure?.match_setup?.series_length === 2
                        ? 'Ida y vuelta'
                        : 'Partido único';
                    const thirdPlaceText = stage.template?.structure?.match_setup
                      ?.has_third_place
                      ? ' • Con 3er puesto'
                      : '';

                    return (
                      <View key={idx} style={styles.stageCardPreview}>
                        <View style={styles.stageCardHeader}>
                          <View style={styles.stageIconBox}>
                            <WinnixIcon
                              name='trophy-outline'
                              size={24}
                              color={Colors.brand_primary}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.stageTitle}>
                              {stage.name || `Etapa #${idx + 1}`}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.stageCardFooter}>
                          <Text style={styles.stageMetaText}>
                            {stage.template?.structure?.total_slots || '—'} Equipos •{' '}
                            {seriesLengthText}
                            {thirdPlaceText}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.emptyStagesBox}>
                    <WinnixIcon
                      name='flag-outline'
                      size={54}
                      color={Colors.text_tertiary}
                    />
                    <Text style={styles.emptyStagesTitle}>Sin etapas configuradas</Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'rewards' && (
              <View style={styles.stagesPreviewContainer}>
                {initialPrizes.length > 0 ? (
                  initialPrizes.map((prize: any, idx: number) => {
                    const theme = getPrizeTheme(prize);
                    const prizeStatusConfig = getPrizeStatusConfig(
                      prize.status || 'active',
                    );
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.stageCardPreview,
                          { borderColor: theme.borderColor },
                        ]}
                      >
                        <View style={styles.stageCardHeader}>
                          <View
                            style={[
                              styles.stageIconBox,
                              { backgroundColor: `${theme.accentColor}20` },
                            ]}
                          >
                            <WinnixIcon
                              name={theme.iconName as any}
                              size={24}
                              color={theme.accentColor}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.stageTitle}>{prize.label}</Text>
                            <View
                              style={[
                                styles.draftBadge,
                                {
                                  backgroundColor: prizeStatusConfig.bg,
                                  borderColor: prizeStatusConfig.borderColor,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.draftBadgeText,
                                  { color: prizeStatusConfig.color },
                                ]}
                              >
                                {prizeStatusConfig.label}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.stageCardFooter}>
                          <Text style={styles.stageMetaText}>
                            {prize.cashAmount
                              ? `$ ${prize.cashAmount.toLocaleString('es-CO')} COP`
                              : prize.reward || 'Premio de reconocimiento'}
                            {prize.additionalItems && prize.additionalItems.length > 0
                              ? ` • ${prize.additionalItems.join(', ')}`
                              : ''}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.emptyStagesBox}>
                    <WinnixIcon
                      name='gift-outline'
                      size={54}
                      color={Colors.text_tertiary}
                    />
                    <Text style={styles.emptyStagesTitle}>Sin premios configurados</Text>
                  </View>
                )}
              </View>
            )}

            {activeTab === 'teams' && <TournamentTeamsLayout />}
            {activeTab === 'info' && (
              <InformationTournament edition={previewEdition} isOrganizer={true} />
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface_screen,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: Colors.surface_base,
  },
  previewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.25)',
  },
  previewTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.brand_primary,
    letterSpacing: 0.8,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 60,
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  tabContentContainer: {
    marginTop: 8,
  },
  stagesPreviewContainer: {
    gap: 12,
    paddingVertical: 4,
  },
  stageCardPreview: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    gap: 12,
  },
  stageCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stageIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  draftBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  draftBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  stageCardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 10,
  },
  stageMetaText: {
    fontSize: 13,
    color: Colors.text_secondary,
  },
  emptyStagesBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.surface_elevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    gap: 10,
  },
  emptyStagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text_secondary,
    marginTop: 8,
  },
  emptyStagesSubtitle: {
    fontSize: 13,
    color: Colors.text_tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
