import { Colors } from "@/presentation/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ImageStyle, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface TeamHeroProps {
  team: any;
  onToggleFavorite: (id: string, isFav: boolean) => void;
}

export const TeamHero = ({ team, onToggleFavorite }: TeamHeroProps) => {
  return (
    <View style={styles.heroSection as ViewStyle}>
      <LinearGradient colors={["rgba(40, 209, 195, 0.15)", "transparent", "rgba(3, 8, 25, 0.8)"]} style={styles.heroGradient as ViewStyle} />

      <Animated.View entering={FadeIn.delay(100).duration(800)} style={styles.heroContent as ViewStyle}>
        <View style={styles.logoWrapper as ViewStyle}>
          <View style={styles.logoGlow as ViewStyle} />
          <View style={styles.logoBracketTop as ViewStyle} />
          <View style={styles.logoBracketBottom as ViewStyle} />
          <Image source={team.logo ? { uri: team.logo } : require("@/presentation/dashboard/components/tournament.png")} style={styles.logo as ImageStyle} resizeMode='cover' />
        </View>

        <View style={styles.titleInfo as ViewStyle}>
          <Text style={styles.teamNameText as TextStyle}>{team.name.toUpperCase()}</Text>
          <View style={styles.sportBadge as ViewStyle}>
            <View style={styles.sportDot as ViewStyle} />
            <Text style={styles.sportText as TextStyle}>{team.sport?.name || "EQUIPO"}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            onToggleFavorite(team._id, !!team.isFavorite);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          style={styles.favBtnHero as ViewStyle}>
          <Ionicons name={team.isFavorite ? "star" : "star-outline"} size={22} color={team.isFavorite ? Colors.orange_400 : Colors.text_tertiary} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    height: 280,
    justifyContent: "center",
    paddingTop: 40,
    position: "relative",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  logoGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.brand_primary,
    opacity: 0.2,
    transform: [{ scale: 1.4 }],
    alignSelf: "center",
    top: 0,
  },
  logoBracketTop: {
    position: "absolute",
    top: -10,
    left: -10,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.brand_primary,
  },
  logoBracketBottom: {
    position: "absolute",
    bottom: -10,
    right: -10,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.brand_primary,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: "rgba(40, 209, 195, 0.3)",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  titleInfo: {
    alignItems: "center",
  },
  teamNameText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
    textAlign: "center",
    textShadowColor: Colors.brand_primary,
    textShadowRadius: 10,
  },
  sportBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(40, 209, 195, 0.1)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.brand_primary,
  },
  sportDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand_primary,
    marginRight: 10,
  },
  sportText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  favBtnHero: {
    position: "absolute",
    right: 20,
    top: 40,
    width: 44,
    height: 44,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(40, 209, 195, 0.4)",
  },
});
