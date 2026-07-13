import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';

interface OrganizerKPIsGridProps {
  totalBrands: number;
  totalTournaments: number;
  totalMatches: number;
  totalGoals: number;
}

export const OrganizerKPIsGrid = ({
  totalBrands,
  totalTournaments,
  totalMatches,
  totalGoals,
}: OrganizerKPIsGridProps) => {
  return (
    <View style={styles.kpiGrid}>
      {/* Ligas Card */}
      <LinearGradient
        colors={['rgba(40, 209, 195, 0.12)', 'rgba(3, 8, 25, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.kpiCard, { borderColor: 'rgba(40, 209, 195, 0.25)' }]}
      >
        <View style={styles.kpiHeaderRow}>
          <WinnixIcon name='trophy-outline' size={20} color={Colors.brand_primary} />
          <Text style={[styles.kpiLabel, { color: Colors.brand_primary }]}>Ligas</Text>
        </View>
        <Text style={styles.kpiValue}>{totalBrands}</Text>
      </LinearGradient>

      {/* Torneos Card */}
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.12)', 'rgba(3, 8, 25, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.kpiCard, { borderColor: 'rgba(99, 102, 241, 0.25)' }]}
      >
        <View style={styles.kpiHeaderRow}>
          <WinnixIcon name='layers-outline' size={20} color='#6366F1' />
          <Text style={[styles.kpiLabel, { color: '#6366F1' }]}>Torneos</Text>
        </View>
        <Text style={styles.kpiValue}>{totalTournaments}</Text>
      </LinearGradient>

      {/* Partidos Card */}
      <LinearGradient
        colors={['rgba(16, 185, 129, 0.12)', 'rgba(3, 8, 25, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.kpiCard, { borderColor: 'rgba(16, 185, 129, 0.25)' }]}
      >
        <View style={styles.kpiHeaderRow}>
          <WinnixIcon name='game-controller-outline' size={20} color='#10B981' />
          <Text style={[styles.kpiLabel, { color: '#10B981' }]}>Partidos</Text>
        </View>
        <Text style={styles.kpiValue}>{totalMatches}</Text>
      </LinearGradient>

      {/* Goles Card */}
      <LinearGradient
        colors={['rgba(251, 191, 36, 0.12)', 'rgba(3, 8, 25, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.kpiCard, { borderColor: 'rgba(251, 191, 36, 0.25)' }]}
      >
        <View style={styles.kpiHeaderRow}>
          <WinnixIcon name='flame-outline' size={20} color='#FBBF24' />
          <Text style={[styles.kpiLabel, { color: '#FBBF24' }]}>Goles</Text>
        </View>
        <Text style={styles.kpiValue}>{totalGoals}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  kpiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text_primary,
    marginTop: 4,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
