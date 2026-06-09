import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/presentation/styles/colors';
import { CustomText } from '@/presentation/theme/components/CustomText';

interface TournamentTeamsLayoutProps {
  inscriptions?: any[];
  playersPerTeam?: number;
}

// Gradient palette for each status — full card feel
const cardTheme: Record<
  string,
  {
    gradientColors: [string, string, string];
    glowColor: string;
    statusLabel: string;
    statusBg: string;
    statusText: string;
    accentColor: string;
  }
> = {
  REGISTERED: {
    gradientColors: ['#1A233B', '#0E1529', '#030819'],
    glowColor: 'rgba(99,115,150,0.5)',
    statusLabel: 'INSCRITO',
    statusBg: 'rgba(99,115,150,0.18)',
    statusText: Colors.text_secondary,
    accentColor: Colors.text_tertiary,
  },
  ACTIVE: {
    gradientColors: ['#0E2A3B', '#0A1E2E', '#030819'],
    glowColor: 'rgba(40,209,195,0.55)',
    statusLabel: 'EN JUEGO',
    statusBg: 'rgba(40,209,195,0.15)',
    statusText: Colors.brand_primary,
    accentColor: Colors.brand_primary,
  },
  ELIMINATED: {
    gradientColors: ['#2D1018', '#1A0810', '#030819'],
    glowColor: 'rgba(239,68,68,0.5)',
    statusLabel: 'ELIMINADO',
    statusBg: 'rgba(239,68,68,0.15)',
    statusText: '#EF4444',
    accentColor: '#EF4444',
  },
  DISQUALIFIED: {
    gradientColors: ['#1A1A2E', '#111122', '#030819'],
    glowColor: 'rgba(100,100,120,0.4)',
    statusLabel: 'DESCAL.',
    statusBg: 'rgba(100,100,120,0.15)',
    statusText: '#9CA3AF',
    accentColor: '#9CA3AF',
  },
  WINNER: {
    gradientColors: ['#2A1E06', '#1A1200', '#030819'],
    glowColor: 'rgba(245,158,11,0.6)',
    statusLabel: 'CAMPEÓN',
    statusBg: 'rgba(245,158,11,0.15)',
    statusText: '#F59E0B',
    accentColor: '#F59E0B',
  },
};

export const TournamentTeamsLayout = ({
  inscriptions = [],
}: TournamentTeamsLayoutProps) => {
  if (!inscriptions || inscriptions.length === 0) {
    return (
      <LinearGradient
        colors={['#0E1529', '#030819']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emptyContainer}
      >
        {/* Glow ring behind icon */}
        <View style={styles.emptyIconRing}>
          <LinearGradient
            colors={['rgba(40,209,195,0.15)', 'rgba(40,209,195,0.03)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyIconGlow}
          >
            <MaterialCommunityIcons
              name='shield-off-outline'
              size={52}
              color={'rgba(40,209,195,0.5)'}
            />
          </LinearGradient>
        </View>

        {/* Text */}
        <View style={styles.emptyTextBlock}>
          <CustomText
            label='ARENA VACÍA'
            size={16}
            weight='bold'
            color={Colors.text_primary}
            style={styles.emptyTitle}
          />
          <CustomText
            label='Ningún equipo se ha inscrito en esta edición todavía.'
            size={12}
            color={Colors.text_tertiary}
            style={styles.emptySubtitle}
          />
        </View>

        {/* Bottom hint row */}
        <View style={styles.emptyHintRow}>
          <Ionicons name='time-outline' size={13} color={'rgba(40,209,195,0.45)'} />
          <CustomText
            label='Las inscripciones aparecerán aquí cuando estén abiertas'
            size={10}
            color={'rgba(40,209,195,0.45)'}
            style={{ flex: 1 }}
          />
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.outerContainer}>
      {/* Section label */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionPip} />
        <CustomText
          label='EQUIPOS PARTICIPANTES'
          size={10}
          weight='bold'
          color={Colors.text_tertiary}
          style={{ letterSpacing: 2, flex: 1 }}
        />
        <CustomText
          label={String(inscriptions.length)}
          size={13}
          weight='bold'
          color={Colors.text_brand}
        />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {inscriptions.map((ins: any, index: number) => {
            const team = ins.team;
            if (!team) return null;

            const captainName = team.captain?.nickname || team.captain?.username || '—';
            const stats = ins.stats || {};
            const won = stats.matchesWon ?? 0;
            const lost = stats.matchesLost ?? 0;
            const goals = stats.goalsScored ?? 0;
            const status = ins.status || 'REGISTERED';
            const theme = cardTheme[status] || cardTheme.REGISTERED;

            return (
              <View key={ins._id || index} style={styles.cardWrapper}>
                {/* ─── Full-card diagonal gradient ─────── */}
                <LinearGradient
                  colors={theme.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  {/* Top section — logo, info, badge */}
                  <View style={styles.topSection}>
                    {/* LOGO with accent ring */}
                    <View style={styles.logoArea}>
                      <View
                        style={[
                          styles.logoGlowRing,
                          {
                            borderColor: theme.glowColor,
                            shadowColor: theme.accentColor,
                          },
                        ]}
                      >
                        <Image
                          source={
                            team.logo
                              ? { uri: team.logo }
                              : require('@/assets/icons/brand/default/default2.png')
                          }
                          style={styles.teamLogo}
                        />
                      </View>
                    </View>

                    {/* Team info */}
                    <View style={styles.infoArea}>
                      <CustomText
                        label={team.name.toUpperCase()}
                        size={17}
                        weight='bold'
                        color={Colors.text_primary}
                        style={styles.teamName}
                        singleLine
                      />
                      <View style={styles.captainRow}>
                        <Ionicons
                          name='person-circle-outline'
                          size={14}
                          color={theme.accentColor}
                        />
                        <CustomText
                          label={captainName}
                          size={13}
                          color={Colors.text_secondary}
                          singleLine
                        />
                      </View>
                    </View>

                    {/* Status badge — floating top right */}
                    <View
                      style={[styles.statusBadge, { backgroundColor: theme.statusBg }]}
                    >
                      <View
                        style={[styles.statusDot, { backgroundColor: theme.accentColor }]}
                      />
                      <CustomText
                        label={theme.statusLabel}
                        size={9}
                        weight='bold'
                        color={theme.statusText}
                        style={{ letterSpacing: 0.6 }}
                      />
                    </View>
                  </View>

                  {/* ─── Bottom stats strip ─────────────── */}
                  <View style={styles.statsStrip}>
                    {/* Diagonal slash accent */}
                    <LinearGradient
                      colors={[theme.accentColor + '30', 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFillObject}
                    />

                    {/* Won */}
                    <View style={styles.statCell}>
                      <CustomText
                        label={String(won)}
                        size={28}
                        weight='bold'
                        color={Colors.green_400}
                        style={styles.statNumber}
                      />
                      <CustomText
                        label='VICTORIAS'
                        size={8}
                        weight='bold'
                        color={Colors.green_700}
                        style={styles.statLegend}
                      />
                    </View>

                    {/* Separator */}
                    <View
                      style={[
                        styles.statSep,
                        { backgroundColor: theme.accentColor + '40' },
                      ]}
                    />

                    {/* Lost */}
                    <View style={styles.statCell}>
                      <CustomText
                        label={String(lost)}
                        size={28}
                        weight='bold'
                        color={Colors.red_400}
                        style={styles.statNumber}
                      />
                      <CustomText
                        label='DERROTAS'
                        size={8}
                        weight='bold'
                        color={Colors.red_700}
                        style={styles.statLegend}
                      />
                    </View>

                    {/* Separator */}
                    <View
                      style={[
                        styles.statSep,
                        { backgroundColor: theme.accentColor + '40' },
                      ]}
                    />

                    {/* Goals */}
                    <View style={styles.statCell}>
                      <CustomText
                        label={String(goals)}
                        size={28}
                        weight='bold'
                        color={Colors.text_brand}
                        style={styles.statNumber}
                      />
                      <CustomText
                        label='GOLES'
                        size={8}
                        weight='bold'
                        color={Colors.primary_600}
                        style={styles.statLegend}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  sectionPip: {
    width: 3,
    height: 13,
    borderRadius: 2,
    backgroundColor: Colors.brand_primary,
  },
  scrollContainer: {
    maxHeight: 480,
  },
  listContainer: {
    gap: 14,
    paddingBottom: 14,
  },
  emptyContainer: {
    borderRadius: 22,
    overflow: 'hidden',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 18,
  },
  emptyIconRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(40,209,195,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
  },
  emptyTextBlock: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  emptyTitle: {
    letterSpacing: 2,
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(40,209,195,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(40,209,195,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  /* Card shell — no external border */
  cardWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  cardGradient: {
    borderRadius: 22,
  },

  /* Top: logo + info + badge */
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 14,
    gap: 14,
  },
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlowRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    padding: 3,
    backgroundColor: 'rgba(3,8,25,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    // iOS glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  teamLogo: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  infoArea: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  teamName: {
    letterSpacing: 0.8,
  },
  captainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  /* Stats strip */
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(3,8,25,0.55)',
    paddingVertical: 14,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statNumber: {
    lineHeight: 32,
  },
  statLegend: {
    letterSpacing: 1,
  },
  statSep: {
    width: 1,
    height: 40,
    borderRadius: 1,
  },
});
