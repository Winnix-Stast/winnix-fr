import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/presentation/styles/colors";
import { WinnixIcon } from "@/presentation/plugins/Icon";

type Stat = {
  label: string;
  value: string | number;
};

type Props = {
  title?: string;
  stats: Stat[];
};

const getStatConfig = (label: string) => {
  const norm = label.toLowerCase();
  if (norm.includes("encuentro") || norm.includes("partido") || norm.includes("juego")) {
    return { icon: "game-controller-outline" as const, color: Colors.brand_secondary };
  }
  if (norm.includes("gol") || norm.includes("puntos") || norm.includes("anotado")) {
    return { icon: "flame-outline" as const, color: Colors.brand_primary };
  }
  if (norm.includes("destacado") || norm.includes("jugador") || norm.includes("mvp")) {
    return { icon: "trophy-outline" as const, color: "#FBBF24" }; // Gold
  }
  if (norm.includes("avance") || norm.includes("progreso") || norm.includes("porcent")) {
    return { icon: "speedometer-outline" as const, color: "#4ADE80" }; // Neon Green
  }
  return { icon: "stats-chart-outline" as const, color: Colors.brand_primary };
};

export const TournamentStatsCard = ({ title = "Estadísticas del torneo", stats }: Props) => {
  return (
    <View style={styles.container}>
      {/* Futuristic Header */}
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <WinnixIcon name="stats-chart-outline" size={18} color={Colors.brand_primary} />
        </View>
        <Text style={styles.headerText}>{title}</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Cyber Grid */}
      <View style={styles.grid}>
        {stats.map((stat, index) => {
          const config = getStatConfig(stat.label);
          return (
            <View key={index} style={styles.gridCell}>
              {/* Energy line accent on left */}
              <View style={[styles.cellAccent, { backgroundColor: config.color }]} />

              <View style={styles.cellHeader}>
                <WinnixIcon name={config.icon} size={16} color={config.color} />
                <Text style={styles.cellLabel} numberOfLines={1}>
                  {stat.label}
                </Text>
              </View>

              <Text style={styles.cellValue} numberOfLines={1} adjustsFontSizeToFit>
                {stat.value}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  iconBadge: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "rgba(40, 209, 195, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(40, 209, 195, 0.1)",
  },
  headerText: {
    color: Colors.text_primary,
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginLeft: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  gridCell: {
    width: "48.5%",
    height: 80,
    backgroundColor: Colors.surface_elevated,
    borderColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  cellAccent: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 10,
    width: 3.5,
    borderRadius: 2,
  },
  cellHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  cellLabel: {
    color: Colors.text_tertiary,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    flex: 1,
  },
  cellValue: {
    color: Colors.text_primary,
    fontSize: 18,
    fontWeight: "900",
    paddingLeft: 2,
  },
});
