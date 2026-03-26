import { Colors } from "@/presentation/styles/colors";
import { borderRadius, spacing, typography } from "@/presentation/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TeamCard3DProps {
  team: any;
  onEdit: () => void;
  onDelete: () => void;
  onPress: () => void;
}

export const TeamCard3D = ({ team, onEdit, onDelete, onPress }: TeamCard3DProps) => {
  // Mock videogame stats
  const score = Math.floor(Math.random() * 50) + 80;
  const goals = Math.floor(Math.random() * 30) + 10;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.cardContainer}>
      <View style={styles.cardInner}>
        {/* Header Ribbon */}
        <View style={styles.cardRibbon}>
          <Text style={styles.ribbonText}>RANK: Gold</Text>
        </View>

        {/* Action Buttons Top Right */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={onEdit} activeOpacity={0.6}>
            <Ionicons name='create-outline' size={18} color={Colors.text_secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete} activeOpacity={0.6}>
            <Ionicons name='trash-outline' size={18} color={Colors.text_secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBg}>
              <Image source={require("./tournament.png")} style={styles.logoImage} resizeMode='cover' />
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <View style={styles.idBadgeMini}>
              <Ionicons name='key' size={12} color={Colors.text_brand} style={{ marginRight: 4 }} />
              <Text style={styles.incrementalText}>ID {team.incremental}</Text>
            </View>
            <Text style={styles.teamName} numberOfLines={1}>
              {team.name}
            </Text>
          </View>
        </View>

        {/* Huge Stats Row at the bottom */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name='people' size={24} color={Colors.text_brand} />
            <Text style={styles.statValue}>{team.players?.length || 0}</Text>
            <Text style={styles.statLabel}>JUGADORES</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Ionicons name='football' size={24} color={Colors.orange_400} />
            <Text style={styles.statValue}>{goals}</Text>
            <Text style={styles.statLabel}>GOLES</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Ionicons name='star' size={24} color={Colors.text_warning} />
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>SCORE</Text>
          </View>
        </View>

        {/* Glossy Overlay (3D look) */}
        <View style={styles.glossyOverlay} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    width: "100%",
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardInner: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: parseInt(borderRadius.border_m),
    borderWidth: 1,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: Colors.surface_pressed,
    borderBottomColor: Colors.surface_base,
    borderRightColor: Colors.surface_base,
    overflow: "hidden",
    position: "relative",
  },
  cardRibbon: {
    position: "absolute",
    top: 10,
    left: -30,
    backgroundColor: Colors.orange_500,
    paddingVertical: 2,
    paddingHorizontal: 30,
    transform: [{ rotate: "-45deg" }],
    zIndex: 10,
    borderWidth: 1,
    borderColor: Colors.orange_200,
  },
  ribbonText: {
    color: Colors.on_brand,
    fontSize: parseInt(typography.caption_xs_bold.size),
    fontWeight: "bold",
    letterSpacing: 1,
  },
  idBadgeMini: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface_base,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    marginBottom: 6,
  },
  incrementalText: {
    color: Colors.text_brand,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  cardContent: {
    flexDirection: "row",
    padding: parseInt(spacing.spacing_m),
    paddingTop: parseInt(spacing.spacing_xl),
    paddingBottom: parseInt(spacing.spacing_m),
  },
  logoContainer: {
    marginRight: parseInt(spacing.spacing_l),
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: parseInt(borderRadius.border_xs),
    backgroundColor: Colors.surface_base,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.surface_pressed,
    overflow: "hidden",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  teamName: {
    fontSize: parseInt(typography.h2_bold.size),
    fontWeight: "heavy",
    color: Colors.text_primary,
    textShadowColor: Colors.surface_pressed,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface_base,
    borderTopWidth: 1,
    borderColor: Colors.surface_pressed,
    paddingVertical: parseInt(spacing.spacing_m),
    justifyContent: "space-around",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    color: Colors.text_primary,
    fontSize: parseInt(typography.h3_bold.size),
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    color: Colors.text_tertiary,
    fontSize: parseInt(typography.caption_s_semibold.size),
    fontWeight: "bold",
    marginTop: 4,
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: Colors.surface_pressed,
  },
  actionsContainer: {
    position: "absolute",
    top: 10,
    right: 15,
    flexDirection: "row",
    gap: 8,
    zIndex: 20,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: parseInt(borderRadius.border_xs),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  glossyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    pointerEvents: "none",
  },
});
