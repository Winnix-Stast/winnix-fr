import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';

interface OrganizerShortcutsGridProps {
  onCreateBrand: () => void;
  onNavigateToBrands: () => void;
  onNavigateToCalendar: () => void;
}

export const OrganizerShortcutsGrid = ({
  onCreateBrand,
  onNavigateToBrands,
  onNavigateToCalendar,
}: OrganizerShortcutsGridProps) => {
  return (
    <View style={styles.shortcutsGrid}>
      <TouchableOpacity
        style={styles.shortcutCard}
        onPress={onCreateBrand}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['rgba(40, 209, 195, 0.05)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.shortcutGradient}
        >
          <View
            style={[
              styles.shortcutIconBg,
              { backgroundColor: 'rgba(40, 209, 195, 0.08)' },
            ]}
          >
            <WinnixIcon
              name='add-circle-outline'
              size={22}
              color={Colors.brand_primary}
            />
          </View>
          <Text style={styles.shortcutTitle}>Crear Liga</Text>
          <Text style={styles.shortcutSubtitle}>Registra una nueva liga</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shortcutCard}
        onPress={onNavigateToBrands}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.05)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.shortcutGradient}
        >
          <View
            style={[
              styles.shortcutIconBg,
              { backgroundColor: 'rgba(99, 102, 241, 0.08)' },
            ]}
          >
            <WinnixIcon name='folder-open-outline' size={22} color='#6366F1' />
          </View>
          <Text style={styles.shortcutTitle}>Mis Ligas</Text>
          <Text style={styles.shortcutSubtitle}>Ver todas mis ligas</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shortcutCard}
        onPress={onNavigateToCalendar}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['rgba(251, 191, 36, 0.05)', 'rgba(255, 255, 255, 0.01)']}
          style={styles.shortcutGradient}
        >
          <View
            style={[
              styles.shortcutIconBg,
              { backgroundColor: 'rgba(251, 191, 36, 0.08)' },
            ]}
          >
            <WinnixIcon name='calendar-outline' size={22} color='#FBBF24' />
          </View>
          <Text style={styles.shortcutTitle}>Calendario</Text>
          <Text style={styles.shortcutSubtitle}>Fechas y fixture</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shortcutsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 10,
  },
  shortcutCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  shortcutGradient: {
    alignItems: 'center',
    gap: 6,
    minHeight: 110,
    justifyContent: 'center',
    padding: 12,
  },
  shortcutIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  shortcutTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text_primary,
    textAlign: 'center',
  },
  shortcutSubtitle: {
    fontSize: 9,
    color: Colors.text_tertiary,
    textAlign: 'center',
  },
});
