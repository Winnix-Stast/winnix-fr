import { Colors } from "@/presentation/styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { LayoutAnimation, Platform, StyleSheet, Text, TextStyle, TouchableOpacity, UIManager, View } from "react-native";

import { ErrorMessage, Fonts } from "../../styles/global-styles";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Option {
  label: string;
  value: string;
}

interface Props {
  label?: string;
  styleLabel?: TextStyle;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  name: string;
  control: any;
  options: Option[];
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
}

export const CustomSelect = ({ name, control, iconLeft, iconRight = "chevron-down-outline", label = "", styleLabel, options, placeholder = "Selecciona una opción", errorMessage, disabled = false }: Props) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    if (disabled) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, styleLabel]}>{label}</Text>}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          const selectedOption = options.find((opt) => opt.value === value);

          return (
            <>
              <TouchableOpacity
                activeOpacity={disabled ? 1 : 0.8}
                onPress={toggleDropdown}
                style={[
                  styles.selectContainer,
                  {
                    borderColor: disabled ? Colors.neutral_500 : errorMessage ? Colors.surface_error : open ? Colors.actions_primary_bg : Colors.neutral_500,
                    opacity: disabled ? 0.6 : 1,
                  },
                ]}>
                {iconLeft && <Ionicons name={iconLeft} size={22} color={Colors.primary_100} style={{ marginRight: 10 }} />}

                <Text style={[styles.valueText, !selectedOption && { color: Colors.neutral_500 }]}>{selectedOption?.label || placeholder}</Text>

                <Ionicons name={open ? "chevron-up-outline" : iconRight} size={22} color={Colors.primary_100} />
              </TouchableOpacity>

              {open && (
                <View style={styles.dropdown}>
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.option}
                      onPress={() => {
                        onChange(option.value);
                        toggleDropdown();
                      }}>
                      <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          );
        }}
      />

      {errorMessage && <Text style={ErrorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 5,
  },
  selectContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: Platform.OS === "ios" ? 14 : 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.neutral_500,
    borderRadius: 10,
    marginTop: 5,
    overflow: "hidden",
  },
  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: Colors.neutral_500,
  },
  optionText: {
    fontSize: Fonts.normal,
    color: Colors.primary_50,
  },
  valueText: {
    flex: 1,
    fontSize: Fonts.normal,
    fontWeight: "500",
    color: Colors.primary_50,
  },
  label: {
    fontSize: Fonts.normal,
    color: Colors.primary_50,
    fontWeight: "bold",
  },
});
