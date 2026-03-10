import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useMyTournaments } from "@/presentation/hooks/tournaments/useMyTournaments";
import { Colors } from "@/presentation/styles";
import { Fonts } from "@/presentation/styles/global-styles";
import { CustomIcon } from "@/presentation/theme/components/icons/CustomIcon";
import OurTournamentsList from "@/presentation/tournamentsView/ourTournaments/OurTournamentsList";

export const OrganizerDashboardView = () => {
  const router = useRouter();
  const { tournaments, loading } = useMyTournaments();

  const handleCreateTournament = () => {
    router.push("/winnix/tournament/create");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.brand_primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus Torneos</Text>
        <Text style={styles.subtitle}>Gestiona tus competiciones activas</Text>
      </View>

      {tournaments.length > 0 ? (
        <OurTournamentsList tournaments={tournaments} />
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.iconWrapper}>
            <CustomIcon name='empty-tournament' size={300} />
          </View>
          <Text style={styles.emptyTitle}>Ningún torneo activo</Text>
          <Text style={styles.emptySubtitle}>La arena está vacía. Es hora de organizar el próximo gran evento y convocar a los mejores equipos.</Text>

          <TouchableOpacity style={styles.createButton} activeOpacity={0.8} onPress={handleCreateTournament}>
            <Text style={styles.createButtonText}>CREAR TORNEO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón flotante siempre visible si hay torneos */}
      {tournaments.length > 0 && (
        <TouchableOpacity style={styles.floatingButton} onPress={handleCreateTournament} activeOpacity={0.9}>
          <CustomIcon name='plus' size={30} color={Colors.on_brand} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface_base,
    padding: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text_primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: Fonts.normal,
    color: Colors.text_tertiary,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
  },
  iconWrapper: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text_brand,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: Fonts.normal,
    color: Colors.text_tertiary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  createButton: {
    backgroundColor: Colors.actions_primary_bg,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  createButtonText: {
    color: Colors.on_brand,
    fontSize: Fonts.normal,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface_base,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.actions_primary_bg,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});
