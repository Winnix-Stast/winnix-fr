import { useMyBrands } from "@/presentation/hooks/brands/useMyBrands";
import { Colors, Fonts } from "@/presentation/styles/global-styles";
import { CustomText } from "@/presentation/theme/components/CustomText";
import { WinnixIcon } from "@/presentation/plugins/Icon";
import { MainContainerView } from "@/presentation/theme/components/MainContainerView";
import OurTournamentsList from "@/presentation/tournamentsView/ourTournaments/OurTournamentsList";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { CustomIcon } from "@/presentation/theme/components/icons/CustomIcon";

const OurTournaments = () => {
  const router = useRouter();
  const { brands, loading, isRefreshing, refresh } = useMyBrands();

  const handleCreateTournament = () => {
    router.push("/winnix/tournament/create");
  };

  if (loading) {
    return (
      <MainContainerView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View>
      </MainContainerView>
    );
  }

  return (
    <MainContainerView>
      {/* FAB - Create Tournament */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateTournament}
        activeOpacity={0.9}
      >
        <WinnixIcon name='add-outline' size={35} />
      </TouchableOpacity>

      <View style={styles.tournaments}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Marcas</Text>
          <Text style={styles.subtitle}>Gestiona tus marcas y ediciones</Text>
        </View>

        {brands.length > 0 ? (
          <OurTournamentsList tournaments={brands} refreshing={isRefreshing} onRefresh={refresh} />
        ) : (
          <View style={styles.emptyStateContainer}>
            <CustomIcon name='empty-tournament' size={250} />
            <Text style={styles.emptyTitle}>Aún no tienes marcas</Text>
            <Text style={styles.emptySubtitle}>
              Crea tu primera marca de torneo para empezar a organizar ediciones y competiciones.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              activeOpacity={0.8}
              onPress={() => router.push("/winnix/brand/create")}
            >
              <Ionicons name='trophy-outline' size={20} color={Colors.light} style={{ marginRight: 8 }} />
              <Text style={styles.createButtonText}>CREAR MI PRIMERA MARCA</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </MainContainerView>
  );
};

export default OurTournaments;

const styles = StyleSheet.create({
  tournaments: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Fonts.small,
    color: Colors.gray,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    zIndex: 1,
    right: 20,
    backgroundColor: Colors.primary,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    borderColor: Colors.light,
    borderWidth: 1,
    elevation: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: Fonts.normal,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 8,
  },
  createButtonText: {
    color: Colors.light,
    fontSize: Fonts.normal,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
