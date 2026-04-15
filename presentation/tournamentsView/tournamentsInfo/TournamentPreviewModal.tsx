import React, { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconName, WinnixIcon } from "@/presentation/plugins/Icon";
import { Colors as ThemeColors } from "@/presentation/styles/colors";
import { Colors, Flex } from "@/presentation/styles/global-styles";
import { CustomFormView } from "@/presentation/theme/components/CustomFormView";
import { CustomText } from "@/presentation/theme/components/CustomText";
import { GradientContainer } from "@/presentation/theme/components/GradientCard";

import { CreateEditionFormData } from "@/presentation/schemas/tournamentSchema";
import { InformationTournament, ResumeLayout, TournamentTeamsLayout } from "@/presentation/tournamentsView";
import { TournamentHeaderCard } from "@/presentation/tournamentsView/tournamentsInfo/TournamentHeaderCard";
import { TournamentMenu } from "@/presentation/tournamentsView/tournamentsInfo/TournamentMenu";

interface PreviewProps {
  visible: boolean;
  onClose: () => void;
  formData: CreateEditionFormData;
}

export const TournamentPreviewModal = ({ visible, onClose, formData }: PreviewProps) => {
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("summary");
  const [favorite, setFavorite] = useState<boolean>(false);

  const menuItems = [
    { key: "summary", label: "Resumen", icon: "folder-open-outline" as IconName },
    { key: "teams", label: "Equipos", icon: "people-outline" as IconName },
    { key: "bracket", label: "Llaves", icon: "flag-outline" as IconName },
    { key: "info", label: "Info", icon: "information-circle-outline" as IconName },
  ];

  const formatDateText = () => {
    if (!formData.startDate && !formData.endDate) return "Fecha por definir";
    const startObj = formData.startDate ? new Date(formData.startDate) : null;
    const endObj = formData.endDate ? new Date(formData.endDate) : null;
    const startStr = startObj ? `${startObj.getDate()} ${startObj.toLocaleString("es", { month: "short" })} ` : "?";
    const endStr = endObj ? `${endObj.getDate()} ${endObj.toLocaleString("es", { month: "short" })} ${endObj.getFullYear()} ` : "?";
    return `${startStr} - ${endStr} `;
  };

  const stateMock = "in-progress" as any;

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='fullScreen' onRequestClose={onClose}>
      <CustomFormView>
        <ScrollView>
          <View style={{ ...Flex.columnCenter, gap: 12, padding: 15 }}>
            <Pressable onPress={onClose} style={[styles.back, { top: top }]}>
              <View style={styles.closeBtn}>
                <WinnixIcon name={"close-outline"} size={30} color={Colors.light} />
              </View>
            </Pressable>

            <Pressable onPress={() => setFavorite(!favorite)} style={[styles.like, { top: top - 30 }]}>
              <WinnixIcon name={favorite ? "heart" : "heart-outline"} size={30} color={favorite ? Colors.primary : Colors.light} />
            </Pressable>

            <TournamentHeaderCard title={formData.seasonName || "Torneo Sin Título"} state={stateMock} dateText={formatDateText()} buttonLabel='Inscribirse' image={formData.image ? { uri: formData.image } : require("@/assets/images/imgT.jpg")} onPressButton={() => {}} titleStyle={{ fontSize: 32 }} />

            <View style={{ marginVertical: 20, ...Flex.rowCenter, gap: 24 }}>
              <GradientContainer colors={["rgba(30,62,166,0.9)", "rgba(77,33,133,0.9)"]} borderColor={Colors.secondaryDark}>
                <WinnixIcon name='football-outline' style={[styles.icon, { backgroundColor: Colors.secondaryDark }]} />
                <View style={{ gap: 4 }}>
                  <CustomText label='Deporte' size={16} color={Colors.light} />
                  <CustomText label={formData.sport || "—"} size={22} color={Colors.light} weight={"bold"} />
                </View>
              </GradientContainer>
            </View>

            <TournamentMenu activeKey={activeTab} onSelect={setActiveTab} items={menuItems} />

            {/* Render mock information to simulate the view */}
            {activeTab === "summary" && <ResumeLayout />}
            {activeTab === "teams" && <TournamentTeamsLayout />}
            {activeTab === "info" && <InformationTournament />}
          </View>
        </ScrollView>
      </CustomFormView>
    </Modal>
  );
};

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
  closeBtn: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 2,
  },
  icon: {
    padding: 10,
    borderRadius: 12,
  },
  sponsorsContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 15,
    borderColor: ThemeColors.border_focus,
    borderWidth: 1,
  },
  sponsorsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  sponsorChip: {
    backgroundColor: ThemeColors.surface_pressed,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ThemeColors.brand_primary,
  },
});
