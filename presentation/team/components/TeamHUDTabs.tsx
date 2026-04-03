import { Colors } from "@/presentation/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

export const TABS = [
  { id: "stats", label: "Estadís...", icon: "analytics" },
  { id: "players", label: "Jugadores", icon: "people" },
  { id: "tournaments", label: "Torneos", icon: "trophy" },
  { id: "matches", label: "Partidos", icon: "calendar" },
  { id: "sponsors", label: "Sponsors", icon: "business" },
];

interface GameTabProps {
  tab: { id: string; label: string; icon: string };
  isActive: boolean;
  onPress: () => void;
}

const GameTab = ({ tab, isActive, onPress }: GameTabProps) => {
  const glowValue = useSharedValue(0.4);

  useEffect(() => {
    if (isActive) {
      glowValue.value = withRepeat(withSequence(withTiming(1, { duration: 1000 }), withTiming(0.4, { duration: 1000 })), -1, true);
    } else {
      glowValue.value = 0.4;
    }
  }, [isActive]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowValue.value,
    shadowOpacity: glowValue.value * 0.5,
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.gameTabContainer as ViewStyle}>
      <Animated.View style={[styles.gameTabBackground as ViewStyle, isActive && styles.gameTabActiveBackground, isActive && glowStyle]}>
        <LinearGradient colors={isActive ? ["rgba(40, 209, 195, 0.3)", "rgba(40, 209, 195, 0.05)"] : ["rgba(255,255,255,0.03)", "transparent"]} style={StyleSheet.absoluteFill} />
        <Ionicons name={tab.icon as any} size={18} color={isActive ? Colors.brand_primary : Colors.text_tertiary} />
      </Animated.View>
      <Text style={[styles.gameTabLabel as TextStyle, isActive && styles.gameTabActiveLabel]}>{tab.label.toUpperCase()}</Text>
      {isActive && <View style={styles.activeMarker as ViewStyle} />}
    </TouchableOpacity>
  );
};

interface TeamHUDTabsProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export const TeamHUDTabs = ({ activeTab, onTabPress }: TeamHUDTabsProps) => {
  return (
    <View style={styles.tabBarContainer as ViewStyle}>
      <View style={styles.gridLine as ViewStyle} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarScroll}>
        {TABS.map((tab) => (
          <GameTab key={tab.id} tab={tab} isActive={activeTab === tab.id} onPress={() => onTabPress(tab.id)} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: "#050c26",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(40, 209, 195, 0.1)",
  },
  gridLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(40, 209, 195, 0.05)",
  },
  tabBarScroll: {
    paddingHorizontal: 15,
    gap: 12,
  },
  gameTabContainer: {
    alignItems: "center",
    width: 90,
  },
  gameTabBackground: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    transform: [{ skewX: "-15deg" }],
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  gameTabActiveBackground: {
    borderColor: Colors.brand_primary,
    backgroundColor: "rgba(40, 209, 195, 0.1)",
    shadowColor: Colors.brand_primary,
  },
  gameTabLabel: {
    color: Colors.text_tertiary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    transform: [{ skewX: "-5deg" }],
  },
  gameTabActiveLabel: {
    color: Colors.brand_primary,
  },
  activeMarker: {
    width: 15,
    height: 2,
    backgroundColor: Colors.brand_primary,
    marginTop: 4,
  },
});
