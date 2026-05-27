import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconName, WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

type MenuItem = {
  key: string;
  label: string;
  icon: IconName;
};

type Props = {
  items: MenuItem[];
  activeKey: string;
  onSelect: (key: string) => void;
};

const TabItem = ({
  item,
  isActive,
  onPress,
}: {
  item: MenuItem;
  isActive: boolean;
  onPress: () => void;
}) => {
  const bracketScale = useRef(new Animated.Value(isActive ? 1 : 1.25)).current;
  const bracketOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseTimer = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(bracketScale, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(bracketOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        pulseTimer.current = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 0.95,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
        );
        pulseTimer.current.start();
      });
    } else {
      // Detener bucles de palpitación y desvanecer mira
      if (pulseTimer.current) {
        pulseTimer.current.stop();
      }
      pulseAnim.setValue(1);
      Animated.parallel([
        Animated.timing(bracketScale, {
          toValue: 1.25,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bracketOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      if (pulseTimer.current) {
        pulseTimer.current.stop();
      }
    };
  }, [isActive]);

  const combinedScale = Animated.multiply(bracketScale, pulseAnim);

  return (
    <Pressable onPress={onPress} style={styles.itemWrapper}>
      <Animated.View
        style={[
          styles.bracketsContainer,
          {
            opacity: bracketOpacity,
            transform: [{ scale: combinedScale }],
          },
        ]}
      >
        <View style={styles.bracketTL} />
        <View style={styles.bracketTR} />
        <View style={styles.bracketBL} />
        <View style={styles.bracketBR} />
      </Animated.View>

      {/* Contenido (Icono y Texto) */}
      <View style={[styles.content, isActive && styles.contentActive]}>
        <WinnixIcon
          name={item.icon}
          size={20}
          color={isActive ? Colors.brand_primary : Colors.text_tertiary}
        />
        <Text
          style={[
            styles.label,
            { color: isActive ? Colors.text_brand : Colors.text_tertiary },
          ]}
        >
          {item.label}
        </Text>
      </View>
    </Pressable>
  );
};

export const TournamentMenu = ({ items, activeKey, onSelect }: Props) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const bounceAnim = useRef(new Animated.Value(0)).current;
  const leftOpacity = useRef(new Animated.Value(0)).current;
  const rightOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 4,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const canScroll = contentWidth > containerWidth;
  const showLeft = canScroll && scrollOffset > 15;
  const showRight = canScroll && scrollOffset < contentWidth - containerWidth - 15;

  useEffect(() => {
    Animated.timing(leftOpacity, {
      toValue: showLeft ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showLeft]);

  useEffect(() => {
    Animated.timing(rightOpacity, {
      toValue: showRight ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showRight]);

  return (
    <View style={styles.outerContainer}>
      {canScroll && (
        <Animated.View
          pointerEvents='none'
          style={[styles.indicatorLeft, { opacity: leftOpacity }]}
        >
          <LinearGradient
            colors={['#030819', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientMask}
          >
            <Animated.View
              style={{ transform: [{ translateX: Animated.multiply(bounceAnim, -1) }] }}
            >
              <WinnixIcon
                name='chevron-back-outline'
                size={20}
                color={Colors.brand_primary}
              />
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={(e) => setScrollOffset(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
        onContentSizeChange={(w) => setContentWidth(w)}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        <View style={styles.row}>
          {items.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <TabItem
                key={item.key}
                item={item}
                isActive={isActive}
                onPress={() => onSelect(item.key)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Indicador de Scroll Derecho (Fading Mask + Flecha Pulsante) */}
      {canScroll && (
        <Animated.View
          pointerEvents='none'
          style={[styles.indicatorRight, { opacity: rightOpacity }]}
        >
          <LinearGradient
            colors={['transparent', '#030819']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientMask}
          >
            <Animated.View style={{ transform: [{ translateX: bounceAnim }] }}>
              <WinnixIcon
                name='chevron-forward-outline'
                size={20}
                color={Colors.brand_primary}
              />
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginVertical: 12,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemWrapper: {
    width: 110,
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    zIndex: 10,
  },
  contentActive: {
    transform: [{ scale: 1.05 }],
  },
  label: {
    fontSize: 10.5,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Miras tácticas (Brackets)
  bracketsContainer: {
    ...StyleSheet.absoluteFillObject,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  bracketTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 14,
    height: 14,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: Colors.brand_primary,
    borderTopLeftRadius: 3,
  },
  bracketTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: Colors.brand_primary,
    borderTopRightRadius: 3,
  },
  bracketBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 14,
    height: 14,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: Colors.brand_primary,
    borderBottomLeftRadius: 3,
  },
  bracketBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: Colors.brand_primary,
    borderBottomRightRadius: 3,
  },

  // Indicadores de scroll
  indicatorLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 45,
    zIndex: 20,
  },
  indicatorRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 45,
    zIndex: 20,
  },
  gradientMask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
