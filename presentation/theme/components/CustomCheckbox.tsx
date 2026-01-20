import { Ionicons } from "@expo/vector-icons";
import { borderRadius, colors } from "@styles";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  onChange: () => void;
  checked: boolean;
}

export const MyCheckbox = ({ onChange, checked = false }: Props) => {
  return (
    <Pressable role='checkbox' aria-checked={checked} style={[styles.checkboxBase, checked && styles.checkboxChecked]} onPress={onChange}>
      {checked && <Ionicons name='checkmark-outline' size={24} color={colors.on_brand} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxBase: {
    width: 27,
    height: 27,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.border_2xs,
    borderWidth: 2,
    borderColor: colors.text_secondary,
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    borderColor: colors.brand_primary,
    backgroundColor: colors.brand_primary,
  },
});
