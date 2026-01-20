import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { KeyboardTypeOptions, Platform, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View } from "react-native";

import { borderRadius, colors, spacing, typography } from "@styles";
// import { CustomFormView } from "@/presentation/theme/components/CustomFormView";

interface Props extends TextInputProps {
  label?: string;
  styleLabel?: TextStyle;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  name: string;
  control: any;
  keyboardType?: KeyboardTypeOptions;
  isPassword?: boolean;
  errorMessage?: string;
}

export const CustomInput = ({ name, control, iconLeft, iconRight, label = "", styleLabel, keyboardType = "default", isPassword = false, errorMessage, ...rest }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, styleLabel]}>{label}</Text>}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={{
              borderColor: errorMessage ? colors.red_500 : isActive ? colors.border_focus : colors.text_tertiary,
              ...styles.containerInput,
            }}>
            {iconLeft && <Ionicons name={iconLeft} size={24} color={colors.text_primary} />}
            <TextInput
              ref={inputRef}
              placeholderTextColor={colors.text_tertiary}
              onFocus={() => setIsActive(true)}
              onBlur={() => {
                setIsActive(false);
                onBlur();
              }}
              value={value}
              keyboardType={keyboardType}
              onChangeText={onChange}
              secureTextEntry={isPassword}
              style={styles.input}
              {...rest}
            />
            {iconRight && <Ionicons name={iconRight} size={24} color={colors.text_primary} />}
          </View>
        )}
      />

      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    gap: spacing.spacing_2xs,
  },
  containerInput: {
    borderWidth: 1,
    borderRadius: borderRadius.border_s,
    padding: Platform.OS === "ios" ? spacing.spacing_s : spacing.spacing_2xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.spacing_s,
    backgroundColor: colors.surface_input,
  },
  input: {
    flex: 1,
    fontSize: typography.body_m_medium.size,
    fontWeight: typography.body_m_medium.weight.toLowerCase() as "500",
    color: colors.text_primary,
  },
  label: {
    fontSize: typography.body_m_bold.size,
    color: colors.text_primary,
    fontWeight: typography.body_m_bold.weight.toLowerCase() as "bold",
  },
  errorMessage: {
    color: colors.red_500,
    marginTop: spacing.spacing_2xs,
    fontSize: typography.body_s_medium.size,
  },
});
