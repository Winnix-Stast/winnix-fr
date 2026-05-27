import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { stagesActions } from '@/core/stages/actions/stages-actions';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { Flex } from '@/presentation/styles/global-styles';
import { CustomButton } from '@/presentation/theme/components/CustomButton';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { GradientContainer } from '@/presentation/theme/components/GradientCard';
import { CreateStageModal } from './CreateStageModal';

interface Props {
  editionId: string;
  isOrganizer: boolean;
}

export const TournamentStagesLayout = ({ editionId, isOrganizer }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      Alert.alert(
        `Etapa: ${stage.name}`,
        `Esta etapa ya ha sido configurada y está activa.\n\nPuedes abrirla, registrar resultados de los enfrentamientos y gestionar las llaves en la pestaña de "Llaves" del torneo.`,
        [{ text: 'Entendido', style: 'default' }],
      );
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
          {isOrganizer && !hasStages && (
            <View style={{ alignItems: 'flex-end', marginBottom: 16 }}>
              <CustomButton
                label='Nueva Etapa'
                onPress={() => setIsModalVisible(true)}
                stylePressable={{ backgroundColor: Colors.surface_elevated }}
                styleText={{ color: Colors.brand_primary }}
              />
            </View>
          )}

          {stages.map((stage: any) => (
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
                borderColor={Colors.brand_primary}
                containerStyle={styles.stageCard}
              >
                <View style={Flex.rowCenter}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <CustomText
                      label={stage.name}
                      size={20}
                      weight='bold'
                      color={Colors.text_primary}
                    />
                    <CustomText
                      label={`Estado: ${stage.status === 'DRAFT' ? 'Borrador' : stage.status === 'ACTIVE' ? 'Activo' : 'Finalizado'}`}
                      size={14}
                      color={Colors.text_brand}
                    />
                    <CustomText
                      label={`Slots: ${stage.structure?.total_slots || 0}`}
                      size={14}
                      color={Colors.text_secondary}
                    />
                  </View>
                  <WinnixIcon
                    name='chevron-forward-outline'
                    size={24}
                    color={Colors.text_secondary}
                  />
                </View>
              </GradientContainer>
            </Pressable>
          ))}
        </View>
      )}

      {isOrganizer && (
        <CreateStageModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
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
    marginBottom: 12,
  },
  stageCard: {
    width: '100%',
  },
});
