import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/presentation/styles/colors';
import { spacing } from '@/presentation/styles/theme';

interface TeamCard3DProps {
  team: any;
  onPress: () => void;
  onToggleFavorite: (id: string, currentStatus: boolean) => void;
}

export const TeamCard3D = ({ team, onPress, onToggleFavorite }: TeamCard3DProps) => {
  const scale = useSharedValue(1);
  const hasPendingRequests = (team?.pendingRequestsCount || 0) > 0;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const name = () => {
    return team?.captain.nickname || team?.captain.username || '';
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={[styles.cardContainer, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [styles.pressable, pressed ? { opacity: 0.9 } : {}]}
      >
        <LinearGradient
          colors={[Colors.surface_elevated, Colors.surface_base]}
          style={[styles.cardInner, hasPendingRequests && styles.cardInnerPending]}
        >
          {/* Header Ribbon / Rank */}
          <View style={styles.cardRibbon}>
            <Text style={styles.ribbonText}>
              {team.sport?.name?.toUpperCase() || 'RANK S'}
            </Text>
          </View>

          {/* Favorite Toggle (Star) */}
          <View style={styles.favoriteContainer}>
            <TouchableOpacity
              onPress={() => onToggleFavorite(team._id, !!team.isFavorite)}
              style={styles.favoriteBtn}
            >
              <Ionicons
                name={team.isFavorite ? 'star' : 'star-outline'}
                size={22}
                color={team.isFavorite ? Colors.orange_400 : Colors.text_tertiary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.cardContent}>
            {/* Logo Section with Glow */}
            <View style={styles.logoWrapper}>
              <View style={styles.logoGlow} />
              <View style={styles.logoBg}>
                <Image
                  source={team.logo ? { uri: team.logo } : require('./tournament.png')}
                  style={styles.logoImage}
                  resizeMode='cover'
                />
              </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoContainer}>
              <View style={styles.badgeRow}>
                <View style={styles.idBadgeMini}>
                  <Ionicons name='flash' size={10} color={Colors.brand_primary} />
                  <Text style={styles.incrementalText}>#{team.incremental}</Text>
                </View>
                {hasPendingRequests && (
                  <View style={styles.pendingAlertBadge}>
                    <View style={styles.pendingDotSmall} />
                    <Text style={styles.pendingAlertText}>
                      {team.pendingRequestsCount === 1
                        ? '1 solicitud pendiente'
                        : `${team.pendingRequestsCount} solicitudes pendientes`}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.teamName} numberOfLines={1}>
                {team.name}
              </Text>
              <View style={styles.captainInfo}>
                <Ionicons
                  name='person-circle-outline'
                  size={14}
                  color={Colors.text_tertiary}
                />
                <Text style={styles.captainText}>{name()}</Text>
              </View>
            </View>
          </View>

          {/* Gaming Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Jugadores</Text>
              <Text style={styles.statValue}>{team.playersCount || 0}</Text>
            </View>

            <View style={[styles.statBox, styles.statBoxCenter]}>
              <Text style={styles.statLabel}>Goles</Text>
              <Text style={[styles.statValue, { color: Colors.brand_primary }]}>
                {team.globalStats?.totalGoals || 0}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>WIN RATE</Text>
              <Text style={[styles.statValue, { color: Colors.green_400 }]}>
                {team.globalStats?.matchesPlayed > 0
                  ? `${Math.round((team.globalStats?.matchesWon / team.globalStats?.matchesPlayed) * 100)}%`
                  : '0%'}
              </Text>
            </View>
          </View>

          {/* Cyber Edge */}
          <View style={styles.bottomBorder} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: parseInt(spacing.spacing_l),
    borderRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  pressable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardInner: {
    padding: parseInt(spacing.spacing_m),
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.15)',
    borderTopColor: 'rgba(40, 209, 195, 0.4)',
    borderLeftColor: 'rgba(40, 209, 195, 0.4)',
  },
  cardInnerPending: {
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderTopColor: 'rgba(245, 158, 11, 0.45)',
    borderLeftColor: 'rgba(245, 158, 11, 0.45)',
  },
  cardRibbon: {
    position: 'absolute',
    top: 15,
    left: -35,
    backgroundColor: Colors.brand_primary,
    paddingVertical: 2,
    paddingHorizontal: 40,
    transform: [{ rotate: '-45deg' }],
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  ribbonText: {
    color: Colors.on_brand,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  favoriteContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
  },
  favoriteBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoWrapper: {
    position: 'relative',
    marginRight: parseInt(spacing.spacing_m),
  },
  logoGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: Colors.brand_primary,
    opacity: 0.15,
    transform: [{ scale: 1.2 }],
  },
  logoBg: {
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: Colors.surface_elevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(40, 209, 195, 0.3)',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  idBadgeMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  pendingAlertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 5,
  },
  pendingDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  pendingAlertText: {
    color: '#F59E0B',
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  incrementalText: {
    color: Colors.brand_primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  teamName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text_primary,
    letterSpacing: 0.5,
  },
  captainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  captainText: {
    fontSize: 16,
    color: Colors.text_tertiary,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBoxCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    color: Colors.text_primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.text_tertiary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: 3,
    backgroundColor: Colors.brand_primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    opacity: 0.6,
    shadowColor: Colors.brand_primary,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
});
