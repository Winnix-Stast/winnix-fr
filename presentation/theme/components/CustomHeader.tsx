import { Ionicons } from "@expo/vector-icons";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/presentation/styles/colors";
import { Fonts } from "@/presentation/styles/global-styles";

export const CustomHeader = ({ navigation, options }: DrawerHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const role = "ORGANIZER";

  return (
    <View style={[styles.headerContainer, { paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 10 }]}>
      {/* Left Area: Hamburger Menu & Title */}
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.toggleDrawer()} activeOpacity={0.8}>
          <Ionicons name='menu-outline' size={28} color={Colors.text_primary} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {options.title || "Winnix"}
        </Text>
      </View>

      {/* Right Area: Role Badge, Profile Avatar, Logout */}
      <View style={styles.rightSection}>
        {/* Role Badge */}
        <View style={styles.roleBadgeContainer}>
          <Text style={styles.roleText}>{role}</Text>
        </View>

        {/* Profile Avatar */}
        <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push("/winnix/profile")} activeOpacity={0.8}>
          <Ionicons name='person-circle-outline' size={32} color={Colors.brand_secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface_screen,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_focus,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  menuButton: {
    backgroundColor: Colors.surface_elevated,
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border_focus,
  },
  title: {
    fontSize: Fonts.normal,
    fontWeight: "900",
    color: Colors.text_brand,
    textTransform: "uppercase",
    letterSpacing: 1,
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roleBadgeContainer: {
    backgroundColor: "rgba(234, 132, 10, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(234, 132, 10, 0.5)",
  },
  roleText: {
    color: Colors.brand_primary,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
});
