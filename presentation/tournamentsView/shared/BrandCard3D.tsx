import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet as StyleSheetImport,
  Text,
  View,
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
// Help Metro resolve absolute stylesheet imports
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/global-styles';
import { styles } from './BrandCard3D.styles';

interface Props {
  id: string;
  name: string;
  logo?: string | ImageSourcePropType;
  isActive: boolean;
  isFavorite?: boolean;
  totalEditions?: number;
  totalMatches?: number;
  averageRating?: number;
  onPress: () => void;
  onToggleFavorite?: (id: string, currentStatus: boolean) => void;
  badgeLabel?: string;
  actionText?: string;
}

export const BrandCard3D = ({
  id,
  name,
  logo,
  isActive,
  isFavorite = false,
  totalEditions = 0,
  totalMatches = 0,
  averageRating = 0,
  onPress,
  onToggleFavorite,
  badgeLabel = 'MARCA REGISTRADA',
  actionText = 'ADMINISTRAR MARCA',
}: Props) => {
  const [favorite, setFavorite] = useState<boolean>(isFavorite);
  const [isToggling, setIsToggling] = useState(false);

  // Animation values
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const scale = useSharedValue(1);
  const shimmerPos = useSharedValue(-250);
  const glowOpacity = useSharedValue(0.25);

  // Holographic shimmer loop
  useEffect(() => {
    shimmerPos.value = withRepeat(
      withSequence(
        withTiming(450, { duration: 2200 }),
        withTiming(-250, { duration: 0 }),
        withTiming(-250, { duration: 2500 }),
      ),
      -1,
      false,
    );

    // Subtle breathing glow animation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 1500 }),
        withTiming(0.2, { duration: 1500 }),
      ),
      -1,
      true,
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
    glowOpacity.value = withSpring(0.45);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18 });
    tiltX.value = withSpring(0);
    tiltY.value = withSpring(0);
    glowOpacity.value = withTiming(0.25, { duration: 500 });
  };

  const handleMouseMove = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const normX = (locationX / 350) * 2 - 1;
    const normY = (locationY / 250) * 2 - 1;

    tiltX.value = withSpring(-normY * 2.5, { damping: 20 });
    tiltY.value = withSpring(normX * 2.5, { damping: 20 });
  };

  const handleFavoritePress = async () => {
    if (isToggling || !onToggleFavorite) return;
    try {
      setIsToggling(true);
      const nextFav = !favorite;
      setFavorite(nextFav);
      await onToggleFavorite(id, favorite);
    } catch (error) {
      setFavorite(favorite);
    } finally {
      setIsToggling(false);
    }
  };

  // 3D Parallax Styles
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: `${tiltX.value}deg` },
      { rotateY: `${tiltY.value}deg` },
      { scale: scale.value },
    ],
  }));

  const logoParallax = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tiltY.value, [-2.5, 2.5], [2, -2]) },
      { translateY: interpolate(tiltX.value, [-2.5, 2.5], [-2, 2]) },
    ],
  }));

  const infoParallax = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tiltY.value, [-2.5, 2.5], [1, -1]) },
      { translateY: interpolate(tiltX.value, [-2.5, 2.5], [-1, 1]) },
    ],
  }));

  const statsParallax = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(tiltY.value, [-2.5, 2.5], [-0.5, 0.5]) },
      { translateY: interpolate(tiltX.value, [-2.5, 2.5], [0.5, -0.5]) },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerPos.value }, { rotate: '20deg' }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // Dynamic status parameters
  const statusColor = isActive ? '#00c897' : '#6E7C96';
  const statusBg = isActive ? 'rgba(0, 200, 151, 0.08)' : 'rgba(110, 124, 150, 0.08)';

  return (
    <Animated.View
      style={[styles.cardContainer, cardAnimatedStyle, { shadowColor: statusColor }]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPointerMove={handleMouseMove}
        style={styles.pressableArea}
      >
        {/* Cyberpunk dark background gradient */}
        <LinearGradient
          colors={['#0F1527', '#060B18', '#02040A']}
          locations={[0, 0.5, 1]}
          style={styles.gradientBg}
        >
          {/* Glowing neon borders */}
          <Animated.View
            pointerEvents='none'
            style={[styles.glowBorder, glowStyle, { borderColor: statusColor }]}
          />

          {/* Holographic sweep light effect */}
          <Animated.View style={[styles.shimmerEffect, shimmerStyle]}>
            <LinearGradient
              colors={[
                'transparent',
                'rgba(40, 209, 195, 0.09)',
                'rgba(99, 102, 241, 0.07)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>

          {/* Futuristic Skewed Badge */}
          {badgeLabel ? (
            <View style={styles.badgeSkew}>
              <Text style={[styles.badgeText, { color: statusColor }]}>
                {badgeLabel.toUpperCase()}
              </Text>
            </View>
          ) : null}

          {/* Main Card Section (Logo, Title, Favorite) */}
          <View style={styles.cardMain}>
            <Animated.View style={[styles.logoFrame, logoParallax]}>
              <Image
                source={
                  logo && typeof logo === 'string'
                    ? { uri: logo }
                    : (logo as ImageSourcePropType) ||
                      require('@/assets/icons/brand/default/escudo2.png')
                }
                style={styles.logoImage}
                resizeMode='cover'
              />
            </Animated.View>

            <Animated.View style={[styles.infoContainer, infoParallax]}>
              <Text style={styles.brandName} numberOfLines={1}>
                {name}
              </Text>

              <View
                style={[
                  styles.statusWrapper,
                  { backgroundColor: statusBg, borderColor: `${statusColor}35` },
                ]}
              >
                <View
                  style={[styles.statusIndicator, { backgroundColor: statusColor }]}
                />
                <Text style={[styles.statusLabel, { color: statusColor }]}>
                  {isActive ? 'ACTIVA' : 'INACTIVA'}
                </Text>
              </View>
            </Animated.View>

            {onToggleFavorite && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  handleFavoritePress();
                }}
                style={styles.favIconContainer}
              >
                <WinnixIcon
                  name={favorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={favorite ? Colors.primary : '#6E7C96'}
                />
              </Pressable>
            )}
          </View>

          {/* Tech ID Panel */}
          <Animated.View style={[styles.techPanel, statsParallax]}>
            <View style={styles.techPanelLeft}>
              <View style={styles.techLabelValue}>
                <Text style={styles.techLabel}>LICENCIA</Text>
                <Text style={styles.techValue}>
                  WX-{String(id).slice(-4).toUpperCase()}
                </Text>
              </View>
              <View style={styles.techLabelValue}>
                <Text style={styles.techLabel}>EDICIONES</Text>
                <Text style={styles.techValue}>{totalEditions}</Text>
              </View>
            </View>

            <View style={styles.techPanelRight}>
              <View style={styles.ratingBadge}>
                <WinnixIcon name='star' size={12} color='#FBBF24' />
                <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
              </View>
              {/* Decorative Cyber Barcode */}
              <View style={styles.barcodeContainer}>
                <View style={[styles.barcodeLine, { width: 3, height: 16 }]} />
                <View style={[styles.barcodeLine, { width: 1.5, height: 16 }]} />
                <View style={[styles.barcodeLine, { width: 4.5, height: 16 }]} />
                <View style={[styles.barcodeLine, { width: 1.5, height: 16 }]} />
                <View style={[styles.barcodeLine, { width: 3, height: 16 }]} />
                <View style={[styles.barcodeLine, { width: 1, height: 16 }]} />
              </View>
            </View>
          </Animated.View>

          {/* Interactive footer line and action */}
          <View style={styles.divider} />

          <View style={styles.actionFooter}>
            <Text style={[styles.actionText, { color: statusColor }]}>
              {actionText.toUpperCase()}
            </Text>
            <WinnixIcon name='chevron-forward' size={16} color={statusColor} />
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const StyleSheet = StyleSheetImport;
