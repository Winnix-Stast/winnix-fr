import React from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { brandsActions } from "@/core/brands/actions/brands-actions";
import { tournamentsActions } from "@/core/tournaments/actions/tournaments-actions";
import { WinnixIcon } from "@/presentation/plugins/Icon";
import { Colors, Flex, Fonts } from "@/presentation/styles/global-styles";
import { CustomFormView } from "@/presentation/theme/components/CustomFormView";
import { CustomText } from "@/presentation/theme/components/CustomText";
import { GradientContainer } from "@/presentation/theme/components/GradientCard";
import { ScrollView } from "react-native-gesture-handler";

const BrandDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const { data: brand, isLoading: loadingBrand } = useQuery({
    queryKey: ["brand", id],
    queryFn: () => brandsActions.getBrandByIdAction(id as string),
    enabled: !!id,
  });

  const { data: editions, isLoading: loadingEditions } = useQuery({
    queryKey: ["editions-by-brand", id],
    queryFn: () => tournamentsActions.getEditionsByBrandAction(id as string),
    enabled: !!id,
  });

  if (loadingBrand) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!brand) {
    return (
      <View style={styles.centered}>
        <CustomText label="No se encontró la marca" color={Colors.light} />
      </View>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  };

  const statusLabel = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      draft: { label: "Borrador", color: "#f59e0b" },
      published: { label: "Publicado", color: "#3b82f6" },
      in_progress: { label: "En curso", color: "#10b981" },
      finished: { label: "Finalizado", color: "#6b7280" },
      cancelled: { label: "Cancelado", color: "#ef4444" },
    };
    return map[status] || { label: status, color: Colors.gray };
  };

  return (
    <CustomFormView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 15, gap: 16 }}>
          {/* Back button */}
          <Pressable onPress={() => router.back()} style={[styles.back, { top: top - 30 }]}>
            <WinnixIcon name="chevron-back-outline" size={30} color={Colors.light} />
          </Pressable>

          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.brandLogoContainer}>
              {brand.logo ? (
                <View style={styles.brandLogo}>
                  <WinnixIcon name="trophy-outline" size={50} color={Colors.primary} />
                </View>
              ) : (
                <View style={styles.brandLogo}>
                  <WinnixIcon name="trophy-outline" size={50} color={Colors.primary} />
                </View>
              )}
            </View>
            <Text style={styles.brandName}>{brand.name}</Text>
            <Text style={styles.brandMeta}>Marca de torneo · ID #{brand.incremental || "—"}</Text>
          </View>

          {/* Stats */}
          <View style={{ ...Flex.rowCenter, gap: 16 }}>
            <GradientContainer colors={["rgba(30,62,166,0.9)", "rgba(77,33,133,0.9)"]} borderColor={Colors.secondaryDark}>
              <WinnixIcon name="layers-outline" style={[styles.icon, { backgroundColor: Colors.secondaryDark }]} />
              <View style={{ gap: 4 }}>
                <CustomText label="Ediciones" size={14} color={Colors.light} />
                <CustomText label={String(editions?.length || 0)} size={22} color={Colors.light} weight="bold" />
              </View>
            </GradientContainer>

            <GradientContainer colors={["rgba(16,185,129,0.6)", "rgba(5,100,70,0.8)"]} borderColor="#10b981">
              <WinnixIcon name="checkmark-circle-outline" style={[styles.icon, { backgroundColor: "#10b981" }]} />
              <View style={{ gap: 4 }}>
                <CustomText label="Estado" size={14} color={Colors.light} />
                <CustomText label={brand.isActive ? "Activa" : "Inactiva"} size={18} color={Colors.light} weight="bold" />
              </View>
            </GradientContainer>
          </View>

          {/* Editions Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ediciones del Torneo</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push({ pathname: "/winnix/tournament/create", params: { brandId: id as string } })}
            >
              <WinnixIcon name="add-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.addButtonText}>Nueva Edición</Text>
            </TouchableOpacity>
          </View>

          {loadingEditions ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : editions && editions.length > 0 ? (
            <View style={{ gap: 12 }}>
              {editions.map((edition: any) => {
                const st = statusLabel(edition.status);
                return (
                  <TouchableOpacity key={edition._id} style={styles.editionCard} activeOpacity={0.8} onPress={() => router.push(`/winnix/tabs/(tournamentStack)/tournament/${edition._id}`)}>
                    <View style={styles.editionTop}>
                      <Text style={styles.editionName}>{edition.seasonName}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: st.color + "22", borderColor: st.color }]}>
                        <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                      </View>
                    </View>
                    <View style={styles.editionMeta}>
                      <WinnixIcon name="calendar-outline" size={16} color={Colors.gray} />
                      <Text style={styles.editionDate}>
                        {formatDate(edition.startDate)} — {edition.endDate ? formatDate(edition.endDate) : "Sin definir"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyEditions}>
              <WinnixIcon name="calendar-outline" size={50} color={Colors.gray} />
              <Text style={styles.emptyText}>Aún no hay ediciones</Text>
              <Text style={styles.emptySubtext}>Crea la primera edición de esta marca</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </CustomFormView>
  );
};

export default BrandDetailScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark,
  },
  back: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    elevation: 10,
  },
  brandHeader: {
    alignItems: "center",
    gap: 8,
    paddingTop: 30,
    paddingBottom: 10,
  },
  brandLogoContainer: {
    marginBottom: 10,
  },
  brandLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  brandName: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light,
    textAlign: "center",
  },
  brandMeta: {
    fontSize: Fonts.small,
    color: Colors.gray,
  },
  icon: {
    padding: 10,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: Fonts.normal,
    fontWeight: "bold",
    color: Colors.light,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addButtonText: {
    fontSize: Fonts.small,
    color: Colors.primary,
    fontWeight: "600",
  },
  editionCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 10,
  },
  editionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  editionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editionDate: {
    fontSize: Fonts.small,
    color: Colors.gray,
  },
  emptyEditions: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.gray,
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: Fonts.small,
    color: Colors.gray,
  },
});
