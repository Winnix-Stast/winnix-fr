import { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { brandsActions } from '@/core/brands/actions/brands-actions';
import { IconName, WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/global-styles';
import { CustomText } from '@/presentation/theme/components/CustomText';

interface Props {
  id: string;
  label: string;
  img?: ImageSourcePropType | string;
  isActive: boolean;
  isInscribed?: boolean;
  isFavorite?: boolean;
  statusLabelText?: string;
  statusColorCode?: string;
  stats: {
    _id: string;
    iconName: IconName;
    title: string;
    value: string;
    iconColor?: string;
    flexText?: boolean;
  }[];
  onPressCard: () => void;
  stylePressable?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
}

export const TournamentTeamItem = ({
  id,
  label,
  onPressCard,
  styleText,
  img,
  isActive,
  isInscribed = false,
  isFavorite = false,
  statusLabelText,
  statusColorCode,
  stats,
}: Props) => {
  const [favorite, setFavorite] = useState<boolean>(isFavorite);
  const [isToggling, setIsToggling] = useState(false);

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleToggleFavorite = async () => {
    if (isToggling) return;
    try {
      setIsToggling(true);
      setFavorite(!favorite);
      await brandsActions.toggleFavoriteAction(id);
    } catch (error) {
      setFavorite(favorite);
    } finally {
      setIsToggling(false);
    }
  };

  const statusLabel = statusLabelText || (isActive ? 'ACTIVO' : 'INACTIVO') || 'TORNEO';

  // High-end sports color palette
  const getStatusTheme = (label: string, defaultColor?: string) => {
    const norm = label.toUpperCase();
    if (
      norm.includes('PROXIMAMENTE') ||
      norm.includes('PRÓXIMAMENTE') ||
      norm.includes('DRAFT')
    ) {
      return {
        text: '#FBBF24',
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.35)',
        dot: '#F59E0B',
      };
    }
    if (norm.includes('ABIERTA') || norm.includes('REGISTRATION')) {
      return {
        text: '#34D399',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.35)',
        dot: '#10B981',
      };
    }
    if (norm.includes('CURSO') || norm.includes('ACTIVE')) {
      return {
        text: '#A5B4FC',
        bg: 'rgba(99, 102, 241, 0.12)',
        border: 'rgba(99, 102, 241, 0.35)',
        dot: '#6366F1',
      };
    }
    const color = defaultColor || '#60A5FA';
    return { text: color, bg: `${color}18`, border: `${color}40`, dot: color };
  };

  const statusTheme = getStatusTheme(statusLabel, statusColorCode);

  return (
    <Animated.View style={[styles.TournamentTeamItem__container, animatedStyle]}>
      <Pressable
        onPress={onPressCard}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.pressableArea,
          {
            borderColor: isInscribed
              ? 'rgba(40, 209, 195, 0.45)'
              : 'rgba(255, 255, 255, 0.12)',
          },
        ]}
      >
        <LinearGradient
          colors={isInscribed ? ['#162B40', '#0E1D2E'] : ['#18233C', '#11192C']}
          locations={[0, 1]}
          style={styles.gradientContainer}
        >
          <View style={styles.details}>
            <View style={[styles.imageWrapper, { borderColor: statusTheme.border }]}>
              <LinearGradient
                colors={['rgba(255,255,255,0.12)', 'transparent']}
                style={styles.imageOverlay}
              />
              <Image
                source={
                  img && typeof img === 'string'
                    ? { uri: img }
                    : (img as ImageSourcePropType)
                }
                style={styles.tournamentImage}
                resizeMode='cover'
              />
            </View>

            <View style={styles.contentInfo}>
              <View style={styles.titleRow}>
                <CustomText
                  label={label || 'TORNEO'}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={[styles.label, styleText]}
                />
              </View>

              <View style={styles.badgesRow}>
                <View
                  style={[
                    styles.stateBadge,
                    {
                      backgroundColor: statusTheme.bg,
                      borderColor: statusTheme.border,
                    },
                  ]}
                >
                  <View
                    style={[styles.statusDot, { backgroundColor: statusTheme.dot }]}
                  />
                  <CustomText
                    size={10}
                    weight={'bold'}
                    label={statusLabel.toUpperCase()}
                    color={statusTheme.text}
                    style={{ letterSpacing: 0.8 }}
                  />
                </View>

                {isInscribed && (
                  <View style={styles.inscribedBadgeContainer}>
                    <LinearGradient
                      colors={['#1E3A8A', '#2563EB']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.inscribedBadgeGradient}
                    >
                      <WinnixIcon name='shield-checkmark' size={11} color='#93C5FD' />
                      <Text style={styles.inscribedBadgeText}>INSCRITO</Text>
                    </LinearGradient>
                  </View>
                )}
              </View>
            </View>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
              style={styles.favoriteButton}
            >
              <View style={styles.favoriteIconBg}>
                <WinnixIcon
                  name={favorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={favorite ? Colors.primary : '#6E7C96'}
                />
              </View>
            </Pressable>
          </View>

          {stats && stats.length > 0 && (
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View
                  key={stat._id || `stat-${index}`}
                  style={[
                    styles.statGridItem,
                    index < stats.length - 1 && styles.statBorderRight,
                  ]}
                >
                  <View
                    style={[
                      styles.statIconCircle,
                      { backgroundColor: `${stat.iconColor || Colors.primary}18` },
                    ]}
                  >
                    <WinnixIcon
                      name={stat.iconName || 'flag-outline'}
                      size={14}
                      color={stat.iconColor || Colors.primary}
                    />
                  </View>
                  <View style={[styles.statContent, stat.flexText ? { flex: 1 } : null]}>
                    <CustomText
                      label={stat.title ? String(stat.title).toUpperCase() : ''}
                      size={8}
                      weight='bold'
                      color='#6E7C96'
                      style={{
                        letterSpacing: 0.8,
                        textAlign: stat.flexText ? 'left' : 'center',
                      }}
                    />
                    <CustomText
                      label={stat.value ? String(stat.value) : '—'}
                      size={12}
                      weight='900'
                      color={Colors.light}
                      singleLine={stat.flexText}
                      style={{ textAlign: stat.flexText ? 'left' : 'center' }}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>ABRIR TORNEO</Text>
            <View
              style={[styles.chevronCircle, { backgroundColor: `${statusTheme.text}18` }]}
            >
              <WinnixIcon
                name='chevron-forward-outline'
                size={14}
                color={statusTheme.text}
              />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  TournamentTeamItem__container: {
    marginVertical: 6,
    borderRadius: 20,
    overflow: 'visible',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  inscribedBadgeContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.35)',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  inscribedBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    gap: 4,
  },
  inscribedBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  pressableArea: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.2,
  },
  gradientContainer: {
    padding: 16,
    gap: 12,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    gap: 12,
  },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070a1e',
    borderWidth: 1.5,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    zIndex: 1,
  },
  tournamentImage: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  contentInfo: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  stateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  favoriteButton: {
    padding: 2,
  },
  favoriteIconBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    zIndex: 2,
    alignItems: 'center',
  },
  statGridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    gap: 8,
  },
  statBorderRight: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    paddingRight: 8,
  },
  statIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
    marginTop: 2,
    zIndex: 2,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#9EADCE',
    letterSpacing: 1.5,
  },
  chevronCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
