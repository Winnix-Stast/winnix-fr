import { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
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
  isFavorite?: boolean;
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
  isFavorite = false,
  stats,
}: Props) => {
  const [favorite, setFavorite] = useState<boolean>(isFavorite);
  const [isToggling, setIsToggling] = useState(false);

  // Reanimated values for 3D Tilt & Parallax

  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const scale = useSharedValue(1);
  const shimmerPos = useSharedValue(-200);

  // Periodic Shimmer Effect
  useEffect(() => {
    shimmerPos.value = withRepeat(
      withSequence(
        withTiming(400, { duration: 2500 }),
        withTiming(-400, { duration: 0 }),
        withTiming(-400, { duration: 3000 }),
      ),
      -1,
      false,
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    tiltX.value = withSpring(0);
    tiltY.value = withSpring(0);
  };

  const handleMouseMove = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    // Normalized coords (-1 to 1) for a standard card size
    const normX = (locationX / 350) * 2 - 1;
    const normY = (locationY / 200) * 2 - 1;

    tiltX.value = withSpring(-normY * 12);
    tiltY.value = withSpring(normX * 12);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateX: `${tiltX.value}deg` },
      { rotateY: `${tiltY.value}deg` },
      { scale: scale.value },
    ],
  }));

  // Parallax effect for internal layers
  const logoParallax = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tiltY.value, [-15, 15], [5, -5]) },
      { translateY: interpolate(tiltX.value, [-15, 15], [-5, 5]) },
    ],
  }));

  const statsParallax = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(tiltY.value, [-15, 15], [-3, 3]) }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerPos.value }, { rotate: '25deg' }],
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

  const statusLabel = isActive ? 'ACTIVO' : 'INACTIVO';
  const statusColor = isActive ? '#28D1C3' : '#9CA3AF';
  const glowColor = isActive ? '#28D1C3' : '#374151';

  return (
    <Animated.View
      style={[
        styles.TournamentTeamItem__container,
        animatedStyle,
        { shadowColor: glowColor },
      ]}
    >
      <Pressable
        onPress={onPressCard}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPointerMove={handleMouseMove}
        style={styles.pressableArea}
      >
        <LinearGradient
          colors={['#1E293B', '#0F172A', '#020617']}
          locations={[0, 0.4, 1]}
          style={styles.gradientContainer}
        >
          {/* Shimmer Light Sweep */}
          <Animated.View style={[styles.shimmerEffect, shimmerStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.08)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Glowing Border Background */}
          <View
            pointerEvents='none'
            style={[styles.neonBorder, { borderColor: statusColor }]}
          />

          <View style={styles.details}>
            <Animated.View style={[styles.imageWrapper, logoParallax]}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'transparent']}
                style={styles.imageOverlay}
              />
              <Image
                source={
                  img && typeof img === 'string'
                    ? { uri: img }
                    : (img as ImageSourcePropType)
                }
                style={styles.tournamentImage}
                resizeMode='contain'
              />
            </Animated.View>

            <View style={styles.contentInfo}>
              <CustomText
                label={label}
                numberOfLines={1}
                ellipsizeMode='tail'
                style={[styles.label, styleText]}
              />

              <View
                style={[
                  styles.stateBadge,
                  {
                    backgroundColor: `${statusColor}10`,
                    borderColor: `${statusColor}40`,
                  },
                ]}
              >
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <CustomText
                  size={9}
                  weight={'bold'}
                  label={statusLabel}
                  color={statusColor}
                  style={{ letterSpacing: 2 }}
                />
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
                  size={24}
                  color={favorite ? Colors.primary : Colors.gray}
                />
              </View>
            </Pressable>
          </View>

          {stats && stats.length > 0 && (
            <Animated.View style={[styles.statsGrid, statsParallax]}>
              {stats.map((stat, index) => (
                <View
                  key={stat._id}
                  style={[
                    styles.statGridItem,
                    index < stats.length - 1 && styles.statBorderRight,
                  ]}
                >
                  <View
                    style={[
                      styles.statIconCircle,
                      { backgroundColor: `${stat.iconColor || Colors.primary}15` },
                    ]}
                  >
                    <WinnixIcon
                      name={stat.iconName}
                      size={16}
                      color={stat.iconColor || Colors.primary}
                    />
                  </View>
                  <View style={[styles.statContent, stat.flexText ? { flex: 1 } : null]}>
                    <CustomText
                      label={stat.value}
                      size={stat.flexText ? 13 : 16}
                      weight='900'
                      color={Colors.light}
                      singleLine={stat.flexText}
                      style={{ textAlign: stat.flexText ? 'left' : 'center' }}
                    />
                    <CustomText
                      label={stat.title.toUpperCase()}
                      size={9}
                      weight='bold'
                      color={Colors.gray}
                      style={{
                        letterSpacing: 1,
                        textAlign: stat.flexText ? 'left' : 'center',
                      }}
                    />
                  </View>
                </View>
              ))}
            </Animated.View>
          )}

          <View style={styles.footer}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.05)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.footerLine}
            />
            <View style={styles.moreAction}>
              <CustomText
                label='ABRIR TORNEO'
                size={11}
                weight='900'
                color={Colors.primary}
                style={{ letterSpacing: 2 }}
              />
              <WinnixIcon name='chevron-forward' size={14} color={Colors.primary} />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  TournamentTeamItem__container: {
    marginVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'visible',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  pressableArea: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: 18,
  },
  shimmerEffect: {
    position: 'absolute',
    top: -100,
    left: 0,
    width: 200,
    height: 500,
    zIndex: 1,
    opacity: 0.6,
  },
  neonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 2,
    opacity: 0.15,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 2,
  },
  imageWrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    zIndex: 1,
  },
  tournamentImage: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  contentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 22,
    fontWeight: '900',
    color: 'white',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  stateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 30,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    zIndex: 2,
  },
  statGridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 6,
  },
  statBorderRight: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    justifyContent: 'center',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    zIndex: 2,
  },
  footerLine: {
    width: '80%',
    height: 1,
    marginBottom: 16,
  },
  moreAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
