import { Colors } from "@/presentation/styles";
import React from "react";
import { StyleSheet, Text, type TextProps, TextStyle } from "react-native";

type AppTextProps = Omit<TextProps, "children"> & {
  label: string;
  color?: string;
  size?: number;
  weight?: TextStyle["fontWeight"];
  singleLine?: boolean;
};

export const CustomText = ({ label, color = Colors.primary_100, size = 16, weight = "normal", singleLine = false, style, ...rest }: AppTextProps) => {
  return (
    <Text numberOfLines={singleLine ? 1 : undefined} ellipsizeMode={singleLine ? "tail" : undefined} style={[styles.base, { color, fontSize: size, fontWeight: weight }, style]} {...rest}>
      {label}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    lineHeight: 22,
    textAlign: "center",
  },
});
