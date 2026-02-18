import { Colors } from "@/presentation/styles";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  onChange: () => void;
  checked: boolean;
}

export const MyCheckbox = ({ onChange, checked = false }: Props) => {
  return (
    <Pressable role='checkbox' aria-checked={checked} style={[styles.checkboxBase, checked && styles.checkboxChecked]} onPress={onChange}>
      {checked && <Ionicons name='checkmark-outline' size={24} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxBase: {
    width: 27,
    height: 27,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.neutral_200,
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    borderColor: Colors.actions_primary_bg,
    backgroundColor: Colors.actions_primary_bg,
  },
});
