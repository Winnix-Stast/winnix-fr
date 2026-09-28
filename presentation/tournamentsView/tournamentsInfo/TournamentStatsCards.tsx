import { StyleSheet, View } from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { GradientContainer } from '@/presentation/theme/components/GradientCard';

interface Props {
  inscriptionsCount: number;
  playersCount?: number;
  status?: string;
  statusLabel?: string;
}

export const TournamentStatsCards = ({ inscriptionsCount, playersCount = 0 }: Props) => {
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

      {/* Card 2: Jugadores */}
      <GradientContainer
        colors={['rgba(40, 209, 195, 0.12)', 'rgba(40, 209, 195, 0.03)']}
        borderColor='rgba(40, 209, 195, 0.25)'
        containerStyle={styles.card}
      >
        <View style={[styles.iconWrapper, styles.iconWrapperPlayers]}>
          <WinnixIcon name='person-outline' size={20} color='#28D1C3' />
        </View>
        <View style={styles.textContainer}>
          <CustomText
            label='Jugadores'
            size={12}
            color={Colors.text_tertiary}
            weight='600'
            style={styles.cardLabel}
          />
          <CustomText
            label={String(playersCount)}
            size={18}
            color={Colors.text_primary}
            weight='bold'
            style={styles.cardValue}
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
  iconWrapperPlayers: {
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
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
});
