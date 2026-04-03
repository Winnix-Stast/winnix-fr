import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, FadeIn } from "react-native-reanimated";

import { useMyTeams } from "@/presentation/hooks/teams/useMyTeams";
import { useTeam } from "@/presentation/hooks/teams/useTeam";
import { Colors } from "@/presentation/styles/colors";
import { CustomButton } from "@/presentation/theme/components/CustomButton";

// Modular Components
import { TeamHero } from "@/presentation/team/components/TeamHero";
import { TeamHUDTabs } from "@/presentation/team/components/TeamHUDTabs";
import { TeamContent } from "@/presentation/team/components/TeamContent";

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { team, loading, error } = useTeam(id as string);
  const { handleToggleFavorite, openEditModal, openDeleteModal } = useMyTeams();
  const [activeTab, setActiveTab] = useState("stats");

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 80], [0, 1]),
      transform: [{ translateY: interpolate(scrollY.value, [0, 80], [10, 1]) }],
    };
  });

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.brand_primary} />
        <Text style={styles.loadingText}>INICIALIZANDO SISTEMAS...</Text>
      </View>
    );
  }

  if (error || !team) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name='warning' size={64} color={Colors.text_error} />
        <Text style={styles.errorText}>{error || "Error de conexión con el núcleo"}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>REINTENTAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dynamic Header */}
      <Animated.View style={[styles.stickyHeader as ViewStyle, headerStyle]}>
        <BlurHeader name={team.name} />
      </Animated.View>

      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TeamHero team={team} onToggleFavorite={handleToggleFavorite} />

        <TeamHUDTabs activeTab={activeTab} onTabPress={handleTabPress} />

        <TeamContent team={team} activeTab={activeTab} router={router} />

        {/* Management Zone */}
        <View style={styles.actionsContainer as ViewStyle}>
          <CustomButton label='MODIFICAR REGISTRO' onPress={() => openEditModal(team)} icon='create' stylePressable={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          <View style={{ height: 12 }} />
          <CustomButton label='BORRADO SEGURO' onPress={() => openDeleteModal(team)} icon='trash' stylePressable={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: Colors.red_900, borderWidth: 1 }} />
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* FAB BACK */}
      <TouchableOpacity style={styles.fabBack as ViewStyle} onPress={() => router.back()}>
        <Ionicons name='chevron-back' size={24} color={Colors.brand_primary} />
      </TouchableOpacity>
    </View>
  );
}

const BlurHeader = ({ name }: { name: string }) => (
  <View style={styles.blurInner as ViewStyle}>
    <Text style={styles.headerTitle as TextStyle}>{name.toUpperCase()}</Text>
    <View style={styles.headerLine as ViewStyle} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030819",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#030819",
  },
  loadingText: {
    marginTop: 20,
    color: Colors.brand_primary,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    zIndex: 100,
    paddingTop: 35,
    backgroundColor: "rgba(3, 8, 25, 0.98)",
    borderBottomWidth: 2,
    borderBottomColor: Colors.brand_primary,
  },
  blurInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: Colors.brand_primary,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
  headerLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.brand_primary,
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  fabBack: {
    position: "absolute",
    top: 45,
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
    borderWidth: 1,
    borderColor: Colors.brand_primary,
  },
  backBtn: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: Colors.brand_primary,
  },
  backBtnText: {
    color: "#000",
    fontWeight: "900",
    letterSpacing: 2,
  },
});
