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
        colors={['rgba(59, 130, 246, 0.12)', 'rgba(37, 99, 235, 0.03)']}
        borderColor='rgba(59, 130, 246, 0.25)'
        containerStyle={styles.card}
      >
        <View style={[styles.iconWrapper, styles.iconWrapperTeams]}>
          <WinnixIcon name='people-outline' size={20} color='#3B82F6' />
        </View>
        <View style={styles.textContainer}>
          <CustomText
            label='Equipos'
            size={12}
            color={Colors.text_tertiary}
            weight='600'
            style={styles.cardLabel}
          />
          <CustomText
            label={String(inscriptionsCount)}
            size={18}
            color={Colors.text_primary}
            weight='bold'
            style={styles.cardValue}
          />
        </View>
      </GradientContainer>

      {/* Card 2: Estado */}
      <GradientContainer
        colors={['rgba(245, 158, 11, 0.12)', 'rgba(217, 119, 6, 0.03)']}
        borderColor='rgba(245, 158, 11, 0.25)'
        containerStyle={styles.card}
      >
        <View style={[styles.iconWrapper, styles.iconWrapperStatus]}>
          <WinnixIcon name='hourglass-outline' size={20} color='#F59E0B' />
        </View>
        <View style={styles.textContainer}>
          <CustomText
            label='Estado'
            size={12}
            color={Colors.text_tertiary}
            weight='600'
            style={styles.cardLabel}
          />
          <CustomText
            label={statusLabel.toUpperCase()}
            size={11}
            color='#F59E0B'
            weight='bold'
            style={styles.statusValue}
            numberOfLines={2}
            ellipsizeMode='tail'
          />
        </View>
      </GradientContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 18,
    width: '100%',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 74,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperTeams: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  iconWrapperStatus: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardLabel: {
    textAlign: 'left',
  },
  cardValue: {
    textAlign: 'left',
    marginTop: 2,
  },
  statusValue: {
    textAlign: 'left',
    marginTop: 2,
    lineHeight: 14,
  },
});
