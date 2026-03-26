import { IconName, WinnixIcon } from "@/presentation/plugins/Icon";
import { Colors, Flex, Fonts } from "@/presentation/styles/global-styles";
import { CustomFormView } from "@/presentation/theme/components/CustomFormView";
import { CustomText } from "@/presentation/theme/components/CustomText";
import { GradientContainer } from "@/presentation/theme/components/GradientCard";
import { BracketLayout, InformationTournament, ResumeLayout, TournamentTeamsLayout } from "@/presentation/tournamentsView";

import { OurTournamentHeaderCard } from "@/presentation/tournamentsView/ourTournaments";
import { TournamentMenu } from "@/presentation/tournamentsView/tournamentsInfo/TournamentMenu";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View, ActivityIndicator } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from '@tanstack/react-query';
import { tournamentsActions } from "@/core/tournaments/actions/tournaments-actions";

const OurTournamentLayout = () => {
  const { id } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("summary");

  const menuItems = [
    { key: "summary", label: "Resumen", icon: "folder-open-outline" as IconName },
    { key: "teams", label: "Equipos", icon: "people-outline" as IconName },
    { key: "bracket", label: "Llaves", icon: "flag-outline" as IconName },
    { key: "info", label: "Info", icon: "information-circle-outline" as IconName },
  ];

  const [favorite, setFavorite] = useState<boolean>(false);

  const handleSaveFavorite = () => {
    setFavorite(!favorite);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleChangeView = (view: string) => {
    setActiveTab(view);
  };

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentsActions.getTournamentByIdAction(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.dark }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!tournament) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.dark }}>
        <CustomText label="No se encontró el torneo" color={Colors.light} />
      </View>
    );
  }

  const startDate = new Date(tournament.start_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  const endDate = new Date(tournament.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

  const createdTournament = {
    id: tournament._id,
    title: tournament.name,
    state: tournament.status,
    dateText: `${startDate} - ${endDate}`,
    buttonLabel: "Inscribirse",
    image: tournament.image ? { uri: tournament.image } : require("@/assets/images/imgT.jpg"),
  };

  const matches = [
    { id: 1, teamA: "Storm Raiders", teamB: "Crimson Wolves", scoreA: 2, scoreB: 1, status: "Finalizado" },
    { id: 2, teamA: "Blue Hawks", teamB: "Iron Titans", scoreA: 1, scoreB: 3, status: "En curso" },
    { id: 3, teamA: "Shadow Lynx", teamB: "Golden Bulls", scoreA: 0, scoreB: 0, status: "Pendiente" },
  ];
  const upcomingMatches = [
    { id: 1, teamA: "Storm Raiders", teamB: "Ice Breakers", date: "Hoy 16:00", stage: "Semifinal" },
    { id: 2, teamA: "Thunder Wolves", teamB: "Crimson Hawks", date: "Hoy 18:00", stage: "Semifinal" },
    { id: 3, teamA: "Shadow Titans", teamB: "Golden Foxes", date: "Mañana 14:30", stage: "Final" },
  ];

  return (
    <CustomFormView>
      <ScrollView>
        <View style={{ ...Flex.columnCenter, gap: 12, padding: 15 }}>
          <Pressable
            onPress={handleGoBack}
            style={[
              styles.back,
              {
                top: top - 30,
              },
            ]}>
            <WinnixIcon name={"chevron-back-outline"} size={30} color={Colors.light} />
          </Pressable>

          <Pressable
            onPress={handleSaveFavorite}
            style={[
              styles.like,
              {
                top: top - 30,
              },
            ]}>
            <WinnixIcon name={favorite ? "heart" : "heart-outline"} size={30} color={favorite ? Colors.primary : Colors.light} />
          </Pressable>

          <OurTournamentHeaderCard
            key={createdTournament.id}
            title={createdTournament.title}
            state={createdTournament.state}
            dateText={createdTournament.dateText}
            image={createdTournament.image}
            onPressButton={() => console.log("Inscripción!")}
            titleStyle={{ fontSize: 32 }}
          />

          {/* Cards teams and reward */}
          <View style={{ marginVertical: 20, ...Flex.rowCenter, gap: 24 }}>
            <GradientContainer colors={["rgba(30,62,166,0.9)", "rgba(77,33,133,0.9)"]} borderColor={Colors.secondaryDark}>
              {<WinnixIcon name='people-outline' style={[styles.icon, { backgroundColor: Colors.secondaryDark }]} />}
              <View style={{ gap: 4 }}>
                <CustomText label='Equipos' size={16} color={Colors.light} />
                <CustomText label='28' size={22} color={Colors.light} weight={"bold"} />
              </View>
            </GradientContainer>

            <GradientContainer colors={["rgba(234, 132, 10, .6)", "rgba(124, 43, 19, .8)"]} borderColor='#ddd'>
              {<WinnixIcon name='people-outline' style={[styles.icon, { backgroundColor: "#00c897" }]} />}
              <View style={{ gap: 4 }}>
                <CustomText label='Premio' size={16} color={Colors.primary} />
                <CustomText label='100.000' size={22} color={Colors.light} weight={"bold"} />
              </View>
            </GradientContainer>
          </View>

          <TournamentMenu activeKey={activeTab} onSelect={(key) => handleChangeView(key)} items={menuItems} />

          {/* Section View Summary */}
          {activeTab === "summary" && <ResumeLayout />}

          {/* Section teams */}
          {activeTab === "teams" && <TournamentTeamsLayout />}

          {/* Section Bracket */}
          {/* {activeTab === "bracket" && <BracketLayout />} */}
          {activeTab === "bracket" && (
            <BracketLayout
              matches={matches}
              upcomingMatches={upcomingMatches}
              // onNavigateToDetails={(id) => navigation.navigate("MatchDetails", { id })}
            />
          )}

          {activeTab === "info" && <InformationTournament />}
        </View>
      </ScrollView>
    </CustomFormView>
  );
};

export default OurTournamentLayout;

const styles = StyleSheet.create({
  like: {
    position: "absolute",
    right: 25,
    zIndex: 10,
    elevation: 10,
  },

  back: {
    position: "absolute",
    left: 20,
    zIndex: 10,
    elevation: 10,
  },

  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderEndStartRadius: 80,
    borderEndEndRadius: 80,
  },

  nameTournament: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.light,
    textAlign: "center",
    top: -30,
  },

  contentOptions: {
    width: "90%",
    marginHorizontal: "auto",
    top: -15,
  },

  optionsTitle: {
    fontSize: Fonts.large,
    marginRight: 20,
  },

  contentView: {
    width: "90%",
    marginHorizontal: "auto",
    marginVertical: 10,
  },

  icon: {
    padding: 10,
    borderRadius: 12,
  },
});
