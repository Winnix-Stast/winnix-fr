import { ActivityIndicator, FlatList, View } from "react-native";

import { IconName } from "@/presentation/plugins/Icon";
import { Colors } from "@/presentation/styles/global-styles";
import { TournamentTeamItem } from "./TournamentTeamItem";
import { CustomText } from "@/presentation/theme/components/CustomText";

import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { tournamentsActions } from "@/core/tournaments/actions/tournaments-actions";

const TournamentsList = () => {
  const { data: editions = [], isLoading } = useQuery({
    queryKey: ["all-editions"],
    queryFn: () => tournamentsActions.getAllEditionsAction(),
  });

  const handleNavigate = (item: any) => {
    router.push(`/winnix/tabs/(tournamentStack)/tournament/${item._id}`);
  };

  const statusMap: Record<string, string> = {
    draft: "Borrador",
    published: "Publicado",
    in_progress: "En curso",
    finished: "Finalizado",
    cancelled: "Cancelado",
  };

  const mapEditionToItem = (edition: any) => ({
    ...edition,
    label: edition.seasonName || "Edición",
    state: edition.status || "draft",
    img: edition.image || require("../../assets/icons/tournament.png"),
    stats: [
      {
        _id: `${edition._id}-status`,
        iconName: "flag-outline" as IconName,
        title: "Estado",
        value: statusMap[edition.status] || edition.status,
        iconColor: Colors.primary,
      },
      {
        _id: `${edition._id}-date`,
        iconName: "calendar-outline" as IconName,
        title: "Inicio",
        value: edition.startDate
          ? new Date(edition.startDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
          : "Sin definir",
        iconColor: Colors.secondaryDark,
      },
    ],
  });

  if (isLoading) {
    return (
      <View style={{ paddingVertical: 40, alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (editions.length === 0) {
    return (
      <View style={{ paddingVertical: 60, alignItems: "center", gap: 8 }}>
        <CustomText label="No hay torneos disponibles" color={Colors.gray} size={16} weight="bold" />
        <CustomText label="Las ediciones creadas aparecerán aquí" color={Colors.gray} size={14} />
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: 150 }}>
      <FlatList
        data={editions.map(mapEditionToItem)}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TournamentTeamItem
            label={item.label}
            state={item.state}
            img={item.img}
            stats={item.stats}
            onPressCard={() => handleNavigate(item)}
          />
        )}
        contentContainerStyle={{
          gap: 20,
          paddingBottom: 70,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TournamentsList;
