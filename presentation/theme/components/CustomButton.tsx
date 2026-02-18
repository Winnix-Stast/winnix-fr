import { Colors } from "@/presentation/styles";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import { Fonts } from "../../styles/global-styles";

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
          backgroundColor: disabled ? Colors.neutral_500 : pressed ? Colors.actions_primary_bg + "90" : Colors.actions_primary_bg,
          opacity: disabled ? 0.6 : 1,
        },
        styles.button,
        stylePressable,
      ]}
      disabled={disabled}>
      <Text style={[styles.label, styleText]}>{label}</Text>

      {icon && <Ionicons name={icon} size={24} color={Colors.surface_base} style={[{ marginHorizontal: 5 }, styleIcon]} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 50,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  label: {
    color: Colors.surface_base,
    fontSize: Fonts.normal,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
