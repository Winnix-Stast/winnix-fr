import { Ionicons } from "@expo/vector-icons";
import { borderRadius, colors, spacing, typography } from "@styles";
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  stylePressable?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  disabled?: boolean;
  styleIcon?: StyleProp<TextStyle>;
}

export const CustomButton = ({ label, icon, onPress, stylePressable, styleText, disabled = false, styleIcon }: Props) => {
  return (
    <Pressable
      onPress={!disabled ? onPress : undefined}
      style={({ pressed }) => [
        {
          backgroundColor: disabled ? colors.text_disabled : pressed ? colors.actions_primary_pressed : colors.actions_primary_bg,
          opacity: disabled ? 0.6 : 1,
        },
        styles.button,
        stylePressable,
      ]}
      disabled={disabled}>
      <Text style={[styles.label, styleText]}>{label}</Text>

      {icon && <Ionicons name={icon} size={24} color={colors.on_brand} style={[{ marginHorizontal: spacing.spacing_2xs }, styleIcon]} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 50,
    padding: spacing.spacing_s,
    borderRadius: borderRadius.border_s,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  label: {
    color: colors.on_brand,
    fontSize: typography.body_m_bold.size,
    fontWeight: typography.body_m_bold.weight.toLowerCase() as "bold",
    textTransform: "capitalize",
  },
});
