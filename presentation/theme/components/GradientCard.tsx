import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";

type GradientContainerProps = {
  colors?: [string, string, ...string[]];
  borderColor?: string;
  containerStyle?: ViewStyle;
  children: ReactNode;
};

export const GradientContainer = ({
  colors = ["rgba(30,62,166,0.9)", "rgba(77,33,133,0.9)"],
  borderColor = "#ddd",
  containerStyle,
  children,
}: GradientContainerProps) => {
  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, { borderColor }, containerStyle]}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    flex: 1,
  },
});
