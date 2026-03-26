import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useMyTeams } from "@/presentation/hooks/teams/useMyTeams";
import { Colors } from "@/presentation/styles/colors";
import { Fonts } from "@/presentation/styles/global-styles";
import { CustomIcon } from "@/presentation/theme/components/icons/CustomIcon";
import { TeamCard3D } from "./components/TeamCard3D";
import { TeamDeleteModal } from "./components/TeamDeleteModal";
import { TeamEditModal } from "./components/TeamEditModal";

export const CaptainDashboardView = () => {
  const router = useRouter();
  const { teams, loading, updateTeamMutation, deleteTeamMutation, selectedTeam, isEditModalVisible, setIsEditModalVisible, isDeleteModalVisible, setIsDeleteModalVisible, openEditModal, openDeleteModal, handleEditSubmit, handleDeleteConfirm } = useMyTeams();

  const handleCreateTeam = () => {
    router.push("/winnix/team/create");
  };

  if (loading && teams.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.brand_primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus Equipos</Text>
        <Text style={styles.subtitle}>Gestiona tus equipos y jugadores</Text>
      </View>

      {teams.length > 0 ? (
        <FlatList data={teams} keyExtractor={(item) => item._id} renderItem={({ item }) => <TeamCard3D team={item} onEdit={() => openEditModal(item)} onDelete={() => openDeleteModal(item)} onPress={() => router.push(`/winnix/team/${item._id}` as any)} />} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.iconWrapper}>
            <CustomIcon name='create-team' size={300} />
          </View>
          <Text style={styles.emptyTitle}>Lidera tus equipos</Text>
          <Text style={styles.emptySubtitle}>Aún no tienes equipos. Crea uno, recluta a los mejores y prepárate para la gloria en la arena.</Text>

          <TouchableOpacity style={styles.createButton} activeOpacity={0.8} onPress={handleCreateTeam}>
            <Text style={styles.createButtonText}>CREAR EQUIPO</Text>
          </TouchableOpacity>
        </View>
      )}

      {teams.length > 0 && (
        <TouchableOpacity style={styles.floatingButton} onPress={handleCreateTeam} activeOpacity={0.9}>
          <CustomIcon name='plus' size={30} color={Colors.on_brand} />
        </TouchableOpacity>
      )}

      {/* Modals */}
      <TeamEditModal visible={isEditModalVisible} team={selectedTeam} onClose={() => setIsEditModalVisible(false)} onSubmit={handleEditSubmit} isSubmitting={updateTeamMutation.isPending} />

      <TeamDeleteModal visible={isDeleteModalVisible} teamName={selectedTeam?.name || ""} onClose={() => setIsDeleteModalVisible(false)} onConfirm={handleDeleteConfirm} isDeleting={deleteTeamMutation.isPending} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface_base,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
  },
  iconWrapper: {
    marginBottom: 10,
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
  listContent: {
    paddingBottom: 100,
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
