import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { stagesActions } from '@/core/stages/actions/stages-actions';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { Flex } from '@/presentation/styles/global-styles';
import { CustomButton } from '@/presentation/theme/components/CustomButton';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { GradientContainer } from '@/presentation/theme/components/GradientCard';
import { CreateStageModal } from './CreateStageModal';
import { EditStageModal } from './EditStageModal';

interface Props {
  editionId: string;
  isOrganizer: boolean;
}

export const TournamentStagesLayout = ({ editionId, isOrganizer }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStage, setSelectedStage] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { data: stages, isLoading } = useQuery({
    queryKey: ['stages', editionId],
    queryFn: () => stagesActions.getStagesByEditionAction(editionId),
    enabled: !!editionId,
  });

  if (isLoading) {
    return <ActivityIndicator size='large' color={Colors.brand_primary} />;
  }

  const hasStages = stages && stages.length > 0;

  const handleOpenStage = (stage: any) => {
    if (isOrganizer) {
      setSelectedStage(stage);
      setIsEditModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {!hasStages ? (
        <View style={styles.emptyState}>
          <WinnixIcon name='flag-outline' size={64} color={Colors.text_tertiary} />
          <CustomText
            label='Aún no hay etapas configuradas'
            color={Colors.text_secondary}
            size={18}
            weight='600'
            style={{ marginTop: 16 }}
          />
          {isOrganizer ? (
            <>
              <CustomText
                label='Crea la primera etapa para dar inicio al torneo.'
                color={Colors.text_tertiary}
                size={14}
                style={{ textAlign: 'center', marginVertical: 12 }}
              />
              <CustomButton
                label='Crear Etapa Inicial'
                onPress={() => setIsModalVisible(true)}
                stylePressable={{ backgroundColor: Colors.brand_primary }}
                styleText={{ color: Colors.on_brand }}
              />
            </>
          ) : (
            <CustomText
              label='El organizador aún no ha configurado las llaves o grupos.'
              color={Colors.text_tertiary}
              size={14}
              style={{ textAlign: 'center', marginTop: 8 }}
            />
          )}
        </View>
      ) : (
        <View style={styles.stagesList}>
          {isOrganizer && hasStages && (
            <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
              <CustomButton
                label='Nueva Etapa'
                onPress={() => setIsModalVisible(true)}
                stylePressable={{ backgroundColor: Colors.surface_elevated }}
                styleText={{ color: Colors.brand_primary }}
              />
            </View>
          )}

          {stages.map((stage: any) => {
            // Determine structure type icons
            const isGroup = stage.structure?.seeding_logic === 'RANDOM' || stage.structure?.participant_type === 'TEAM';
            const iconName = isGroup ? 'grid-outline' : 'trophy-outline';
            
            // Status badge configs
            let statusText = 'Próximamente';
            let statusBg = 'rgba(245, 158, 11, 0.12)';
            let statusColor = '#F59E0B';
            
            if (stage.status === 'ACTIVE') {
              statusText = 'Activa';
              statusBg = 'rgba(40, 209, 195, 0.12)';
              statusColor = Colors.brand_primary;
            } else if (stage.status === 'FINISHED') {
              statusText = 'Finalizada';
              statusBg = 'rgba(99, 115, 150, 0.12)';
              statusColor = Colors.text_secondary;
            }

            const startDateStr = stage.startDate ? new Date(stage.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '';
            const endDateStr = stage.endDate ? new Date(stage.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '';

            const matchDetails = stage.structure?.match_setup?.series_length === 2 ? 'Ida y vuelta' : 'Partido único';
            const thirdPlaceText = stage.structure?.match_setup?.has_third_place ? ' • Con 3er puesto' : '';

            return (
              <Pressable
                key={stage._id}
                onPress={() => handleOpenStage(stage)}
                style={({ pressed }) => [
                  styles.stageCardPressable,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
                ]}
              >
                <GradientContainer
                  colors={[Colors.surface_elevated, Colors.surface_pressed]}
                  borderColor={stage.status === 'ACTIVE' ? Colors.brand_primary : 'transparent'}
                  containerStyle={styles.stageCard}
                >
                  <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={styles.iconContainer}>
                        <WinnixIcon name={iconName} size={24} color={Colors.brand_primary} />
                      </View>
                      <View>
                        <CustomText label={stage.name} size={18} weight='bold' color={Colors.text_primary} />
                        <View style={[styles.statusBadge, { backgroundColor: statusBg, alignSelf: 'flex-start', marginTop: 4 }]}>
                          <CustomText label={statusText} size={10} weight="bold" color={statusColor} />
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <WinnixIcon name="people-outline" size={14} color={Colors.text_secondary} />
                        <CustomText label={`${stage.structure?.total_slots || 0} Equipos`} size={12} color={Colors.text_secondary} />
                      </View>
                      <View style={styles.metaItem}>
                        <WinnixIcon name="options-outline" size={14} color={Colors.text_secondary} />
                        <CustomText label={`${matchDetails}${thirdPlaceText}`} size={12} color={Colors.text_secondary} />
                      </View>
                      <View style={styles.metaItem}>
                        <WinnixIcon name="calendar-outline" size={14} color={Colors.text_secondary} />
                        <CustomText 
                          label={startDateStr ? `${startDateStr}${endDateStr ? ` - ${endDateStr}` : ''}` : 'Sin fecha definida'} 
                          size={12} 
                          color={Colors.text_secondary} 
                        />
                      </View>
                    </View>
                    <WinnixIcon
                      name='chevron-forward-outline'
                      size={18}
                      color={Colors.text_tertiary}
                    />
                  </View>
                </GradientContainer>
              </Pressable>
            );
          })}
        </View>
      )}

      {isOrganizer && (
        <CreateStageModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          editionId={editionId}
        />
      )}

      {isOrganizer && selectedStage && (
        <EditStageModal
          isVisible={isEditModalVisible}
          onClose={() => {
            setIsEditModalVisible(false);
            setSelectedStage(null);
          }}
          stage={selectedStage}
          editionId={editionId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.surface_elevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  stagesList: {
    gap: 16,
  },
  stageCardPressable: {
    width: '100%',
    marginBottom: 8,
  },
  stageCard: {
    width: '100%',
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: 12,
  },
});
