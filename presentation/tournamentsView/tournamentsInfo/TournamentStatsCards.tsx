import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { GradientContainer } from '@/presentation/theme/components/GradientCard';

interface Props {
  inscriptionsCount: number;
  status: string;
  statusLabel: string;
}

export const TournamentStatsCards = ({
  inscriptionsCount,
  status,
  statusLabel,
}: Props) => {
  return (
    <View style={styles.container}>
      {/* Card 1: Equipos */}
      <GradientContainer
        colors={[Colors.surface_elevated, Colors.surface_pressed]}
        borderColor={Colors.border_subtitle}
        containerStyle={styles.card}
      >
        <View style={styles.iconWrapper}>
          <WinnixIcon name='people-outline' size={22} color={Colors.brand_primary} />
        </View>
        <View style={styles.textContainer}>
          <CustomText
            label='Equipos'
            size={13}
            color={Colors.text_tertiary}
            weight='600'
            style={styles.cardLabel}
          />
          <CustomText
            label={String(inscriptionsCount)}
            size={20}
            color={Colors.text_brand}
            weight='bold'
          />
        </View>
      </GradientContainer>

      {/* Card 2: Estado */}
      <GradientContainer
        colors={[Colors.surface_elevated, Colors.surface_pressed]}
        borderColor={Colors.border_focus}
        containerStyle={styles.card}
      >
        <View style={styles.iconWrapper}>
          <WinnixIcon name='hourglass-outline' size={22} color={Colors.brand_secondary} />
        </View>
        <View style={styles.textContainer}>
          <CustomText
            label='Estado'
            size={13}
            color={Colors.text_tertiary}
            weight='600'
            style={styles.cardLabel}
          />
          <CustomText
            label={statusLabel}
            size={16}
            color={Colors.text_brand}
            weight='bold'
          />
        </View>
      </GradientContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 24,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconWrapper: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  cardLabel: {},
});
