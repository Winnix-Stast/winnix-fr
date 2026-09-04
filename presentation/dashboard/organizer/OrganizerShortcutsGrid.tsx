import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';

interface OrganizerShortcutsGridProps {
  onCreateTournament: () => void;
  onCreateBrand: () => void;
  onNavigateToBrands: () => void;
  onNavigateToCalendar: () => void;
}

export const OrganizerShortcutsGrid = ({
  onCreateTournament,
  onCreateBrand,
  onNavigateToBrands,
  onNavigateToCalendar,
}: OrganizerShortcutsGridProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalScrollContent}
    >
      <TouchableOpacity
        style={styles.shortcutCard}
        onPress={onCreateTournament}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['rgba(40, 209, 195, 0.15)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.shortcutGradient}
        >
          <View
            style={[
              styles.shortcutIconBg,
              { backgroundColor: 'rgba(40, 209, 195, 0.15)' },
            ]}
          >
            <WinnixIcon
              name='trophy-outline'
              size={24}
              color={Colors.brand_primary}
            />
          </View>
          <View style={styles.shortcutTextCol}>
            <Text style={styles.shortcutTitle} numberOfLines={1}>Crear Torneo</Text>
            <Text style={styles.shortcutSubtitle} numberOfLines={1}>Nueva edición</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shortcutCard}
        onPress={onCreateBrand}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.12)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.shortcutGradient}
        >
          <View
            style={[
              styles.shortcutIconBg,
              { backgroundColor: 'rgba(99, 102, 241, 0.12)' },
            ]}
          >
            <WinnixIcon
              name='add-circle-outline'
              size={24}
              color='#6366F1'
            />
          </View>
          <View style={styles.shortcutTextCol}>
            <Text style={styles.shortcutTitle} numberOfLines={1}>Crear Marca</Text>
            <Text style={styles.shortcutSubtitle} numberOfLines={1}>Nueva marca</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shortcutCard}
        onPress={onNavigateToBrands}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.12)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.shortcutGradient}
        >
          <View
            style={[
              styles.shortcutIconBg,
              { backgroundColor: 'rgba(16, 185, 129, 0.12)' },
            ]}
          >
            <WinnixIcon name='folder-open-outline' size={24} color='#10B981' />
          </View>
          <View style={styles.shortcutTextCol}>
            <Text style={styles.shortcutTitle} numberOfLines={1}>Mis Marcas</Text>
            <Text style={styles.shortcutSubtitle} numberOfLines={1}>Ver mis marcas</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shortcutCard}
        onPress={onNavigateToCalendar}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['rgba(251, 191, 36, 0.12)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.shortcutGradient}
        >
          <View
            style={[
              styles.shortcutIconBg,
              { backgroundColor: 'rgba(251, 191, 36, 0.12)' },
            ]}
          >
            <WinnixIcon name='calendar-outline' size={24} color='#FBBF24' />
          </View>
          <View style={styles.shortcutTextCol}>
            <Text style={styles.shortcutTitle} numberOfLines={1}>Calendario</Text>
            <Text style={styles.shortcutSubtitle} numberOfLines={1}>Fechas y fixture</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  shortcutCard: {
    width: 190,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  shortcutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  shortcutIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
  },
  shortcutTextCol: {
    flex: 1,
  },
  shortcutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  shortcutSubtitle: {
    fontSize: 13,
    color: Colors.text_tertiary,
    marginTop: 2,
  },
});
