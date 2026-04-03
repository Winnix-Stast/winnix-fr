import { Colors } from "@/presentation/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Image, ImageStyle, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface TeamContentProps {
  team: any;
  activeTab: string;
  router: any;
}

export const TeamContent = ({ team, activeTab, router }: TeamContentProps) => {
  return (
    <Animated.View key={activeTab} entering={FadeInDown.duration(400).springify()} style={styles.tabContent as ViewStyle}>
      {activeTab === "stats" && <TeamStats team={team} />}
      {activeTab === "players" && <TeamPlayers team={team} router={router} />}
      {activeTab === "tournaments" && <TeamTournaments team={team} />}
      {activeTab === "matches" && <TeamMatches />}
      {activeTab === "sponsors" && <TeamSponsors team={team} />}
    </Animated.View>
  );
};

const TeamStats = ({ team }: { team: any }) => (
  <View style={styles.contentPadding}>
    <SectionTitle title='DATA STREAM / ESTADÍSTICAS' icon='analytics' />
    <View style={styles.statsGrid as ViewStyle}>
      <StatCard label='PARTIDOS' value={team.globalStats?.matchesPlayed || 0} icon='football' color={Colors.brand_primary} delay={100} />
      <StatCard label='TÍTULOS' value={team.globalStats?.titlesWon || 0} icon='trophy' color={Colors.brand_primary} delay={200} isHighlight />
      <StatCard label='VICTORIAS' value={team.globalStats?.matchesWon || 0} icon='radio-button-on' color={Colors.green_400} delay={300} />
      <StatCard label='RACHA' value={`${team.globalStats?.winStreak || 0} 🔥`} icon='flame' color={Colors.orange_400} delay={400} />
      <StatCard label='EMPATES' value={team.globalStats?.totalDraws || 0} icon='remove-circle-outline' color={Colors.text_tertiary} delay={500} />
      <StatCard label='DERROTAS' value={team.globalStats?.totalLost || 0} icon='alert-circle-outline' color={Colors.red_400} delay={600} />
      <StatCard label='DATA TOTAL / GOLES' value={team.globalStats?.totalGoals || 0} icon='infinite' color={Colors.brand_primary} delay={700} fullWidth />
    </View>
  </View>
);

const TeamPlayers = ({ team, router }: { team: any; router: any }) => (
  <View style={styles.contentPadding}>
    <SectionTitle title='UNIDADES DISPONIBLES / ROSTER' icon='people' />
    <View style={styles.playersList as ViewStyle}>{team.members?.length > 0 ? team.members.map((member: any, index: number) => <PlayerCard key={member.player?._id || index} player={member.player} stats={member.playerGlobalStats} index={index} onPress={() => router.push(`/winnix/profile/${member.player?._id}` as any)} />) : <EmptySection message='Sin unidades en este sector' />}</View>
  </View>
);

const TeamTournaments = ({ team }: { team: any }) => (
  <View style={styles.contentPadding}>
    <SectionTitle title='ZONAS DE OPERACIÓN / TORNEOS' icon='map' />
    <View style={styles.infoSection as ViewStyle}>{team.tournaments?.length > 0 ? team.tournaments.map((t: any, index: number) => <TournamentItem key={t.tournament?._id || index} tournament={t.tournament} index={index} />) : <EmptySection message='No hay despliegues activos' />}</View>
  </View>
);

const TeamMatches = () => (
  <View style={styles.contentPadding}>
    <SectionTitle title='PRÓXIMOS OBJETIVOS' icon='time' />
    <View style={styles.infoSection as ViewStyle}>
      <EmptySection message='OBJETIVOS NO DETECTADOS' />
    </View>
  </View>
);

const TeamSponsors = ({ team }: { team: any }) => (
  <View style={styles.contentPadding}>
    <SectionTitle title='CENTROS DE APOYO / ALIADOS' icon='business' />
    <View style={styles.sponsorsGrid as ViewStyle}>
      {team.sponsor ? (
        <View style={styles.sponsorCard as ViewStyle}>
          <View style={styles.sponsorIconWrapper as ViewStyle}>
            <Ionicons name='shield-checkmark' size={40} color={Colors.brand_primary} />
          </View>
          <Text style={styles.sponsorName as TextStyle}>ALIADO TIPO A</Text>
          <Text style={styles.sponsorSub as TextStyle}>SOPORTE LOGÍSTICO ACTIVO</Text>
        </View>
      ) : (
        <EmptySection message='SOLICITANDO RECURSOS' />
      )}
    </View>
  </View>
);

// --- HELPER COMPONENTS ---

const SectionTitle = ({ title, icon }: { title: string; icon: any }) => (
  <Animated.View entering={FadeInRight.duration(600)} style={styles.sectionHeader as ViewStyle}>
    <View style={styles.sectionIconBox as ViewStyle}>
      <Ionicons name={icon} size={12} color={Colors.surface_base} />
    </View>
    <Text style={styles.sectionTitleText as TextStyle}>{title}</Text>
  </Animated.View>
);

const StatCard = ({ label, value, icon, color, delay, fullWidth, isHighlight }: any) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(600)} style={[styles.statCard as ViewStyle, fullWidth && { width: width - 30 }, isHighlight && styles.statCardHighlight]}>
    <View style={[styles.statIconCircle as ViewStyle, { borderColor: color }]}>
      <Ionicons name={icon} size={14} color={color} />
    </View>
    <View>
      <Text style={[styles.statCardValue as TextStyle, isHighlight && { color: Colors.brand_primary }]}>{value}</Text>
      <Text style={styles.statCardLabel as TextStyle}>{label}</Text>
    </View>
    {isHighlight && <View style={styles.cornerMarker as ViewStyle} />}
  </Animated.View>
);

const PlayerCard = ({ player, stats, index, onPress }: any) => (
  <Animated.View entering={FadeInDown.delay(index * 50)}>
    <Pressable onPress={onPress} style={styles.playerCardGame as ViewStyle}>
      <View style={styles.playerAvatarWrapper as ViewStyle}>
        <Image source={{ uri: player?.profilePicture || "https://via.placeholder.com/150" }} style={styles.playerAvatarHex as ImageStyle} />
      </View>
      <View style={styles.playerInfoGame as ViewStyle}>
        <Text style={styles.playerNameGame as TextStyle}>
          {player?.firstName?.toUpperCase()} {player?.lastName?.toUpperCase()}
        </Text>
        <View style={styles.playerStatRowGame as ViewStyle}>
          <PlayerMiniStat label='XP' value={stats?.matchesPlayed || 0} />
          <PlayerMiniStat label='KILLS' value={stats?.goals || 0} />
        </View>
      </View>
      <Ionicons name='barcode-outline' size={24} color={Colors.text_tertiary} opacity={0.3} />
    </Pressable>
  </Animated.View>
);

const PlayerMiniStat = ({ label, value }: any) => (
  <View style={styles.miniStatBox as ViewStyle}>
    <Text style={styles.miniStatLabel as TextStyle}>{label}:</Text>
    <Text style={styles.miniStatValue as TextStyle}>{value}</Text>
  </View>
);

const TournamentItem = ({ tournament, index }: any) => (
  <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.tournamentItemGame as ViewStyle}>
    <View style={styles.tournIconBox as ViewStyle}>
      <Ionicons name='navigate-outline' size={18} color={Colors.brand_primary} />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.tournamentName as TextStyle}>{tournament?.name?.toUpperCase() || "SECTOR"}</Text>
      <View style={styles.statusRow as ViewStyle}>
        <View style={styles.statusDot as ViewStyle} />
        <Text style={styles.tournamentStatus as TextStyle}>ESTADO: EN CURSO</Text>
      </View>
    </View>
  </Animated.View>
);

const EmptySection = ({ message }: { message: string }) => (
  <View style={styles.emptyContainer as ViewStyle}>
    <View style={styles.emptyScanner as ViewStyle} />
    <Text style={styles.emptyText as TextStyle}>{message.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  tabContent: {
    minHeight: 350,
  },
  contentPadding: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 25,
    marginBottom: 20,
    gap: 12,
  },
  sectionIconBox: {
    width: 24,
    height: 24,
    backgroundColor: Colors.brand_primary,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "45deg" }],
  },
  sectionTitleText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2.5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    gap: 10,
  },
  statCard: {
    width: (width - 30) / 2,
    backgroundColor: "rgba(10, 20, 50, 0.5)",
    borderRadius: 2,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderWidth: 1,
    borderColor: "rgba(40, 209, 195, 0.1)",
  },
  statCardHighlight: {
    borderColor: Colors.brand_primary,
    shadowColor: Colors.brand_primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
  },
  statCardLabel: {
    fontSize: 12,
    color: Colors.text_tertiary,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  cornerMarker: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.brand_primary,
  },
  playersList: {
    paddingHorizontal: 15,
    gap: 12,
  },
  playerCardGame: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.brand_primary,
    borderRadius: 4,
  },
  playerAvatarWrapper: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(40, 209, 195, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  playerAvatarHex: {
    width: 40,
    height: 40,
    borderRadius: 0,
  },
  playerInfoGame: {
    flex: 1,
    marginLeft: 15,
  },
  playerNameGame: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
  playerStatRowGame: {
    flexDirection: "row",
    marginTop: 5,
    gap: 15,
  },
  miniStatBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniStatLabel: {
    color: Colors.text_tertiary,
    fontSize: 8,
    marginRight: 4,
  },
  miniStatValue: {
    color: Colors.brand_primary,
    fontSize: 9,
    fontWeight: "bold",
  },
  infoSection: {
    paddingHorizontal: 15,
    gap: 12,
  },
  tournamentItemGame: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 15,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  tournIconBox: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(40, 209, 195, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.brand_primary,
  },
  tournamentName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.green_400,
    marginRight: 6,
  },
  tournamentStatus: {
    color: Colors.green_400,
    fontSize: 8,
    fontWeight: "bold",
  },
  emptyContainer: {
    height: 160,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(40, 209, 195, 0.1)",
  },
  emptyScanner: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 2,
    backgroundColor: Colors.brand_primary,
    opacity: 0.1,
  },
  emptyText: {
    color: Colors.text_tertiary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 4,
  },
  sponsorsGrid: {
    paddingHorizontal: 15,
  },
  sponsorCard: {
    backgroundColor: "rgba(40, 209, 195, 0.03)",
    paddingVertical: 40,
    borderRadius: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(40, 209, 195, 0.2)",
  },
  sponsorIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(40, 209, 195, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.brand_primary,
  },
  sponsorName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 3,
  },
  sponsorSub: {
    color: Colors.brand_primary,
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 8,
    letterSpacing: 2,
  },
});
