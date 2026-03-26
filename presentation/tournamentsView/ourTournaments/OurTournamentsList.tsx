import { FlatList, View, RefreshControl } from "react-native";
import { TournamentTeamItem } from "../TournamentTeamItem";

import { router } from "expo-router";
import { Colors } from "@/presentation/styles/colors";

interface Props {
  tournaments: any;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const OurTournamentsList = ({ tournaments, refreshing = false, onRefresh }: Props) => {
  // const tournaments = [
  //   {
  //     id: "1",
  //     label: "Copa Elite Gaming ",
  //     state: "in-progress",
  //     img: require("../../../assets/icons/tournament.png"),
  //     stats: [
  //       {
  //         _id: "s1",
  //         iconName: "people-outline" as IconName,
  //         title: "Participantes",
  //         value: "32 equipos",
  //         iconColor: Colors.secondaryDark,
  //       },
  //       {
  //         _id: "s2",
  //         iconName: "trophy-outline" as IconName,
  //         title: "Torneos",
  //         value: "5 activos",
  //         iconColor: Colors.primary,
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     label: "Liga Pro Champions",
  //     state: "next",
  //     img: require("../../../assets/icons/tournament.png"),
  //     stats: [
  //       {
  //         _id: "s3",
  //         iconName: "people-outline" as IconName,
  //         title: "Participantes",
  //         value: "20 equipos",
  //         iconColor: Colors.secondaryDark,
  //       },
  //       {
  //         _id: "s4",
  //         iconName: "pricetag-outline" as IconName,
  //         title: "Premio",
  //         value: "$3,000",
  //         iconColor: Colors.primary,
  //       },
  //     ],
  //   },
  // ];

  const handleNavigate = (item: any) => {
    console.log("item :>> ", item);
    router.push(`/winnix/ourTournaments/${item._id}`);
  };

  return (
    <View style={{ paddingBottom: 150 }}>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item._id}
        refreshControl={
          onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.brand_primary]} tintColor={Colors.brand_primary} /> : undefined
        }
        renderItem={({ item }) => (
          <TournamentTeamItem
            label={item.name}
            state={item.status}
            // img={require("../../../assets/icons/tournament.png")}
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

export default OurTournamentsList;
