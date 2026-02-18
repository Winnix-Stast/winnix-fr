import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { KeyboardTypeOptions, Platform, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View } from "react-native";

import { Colors } from "@/presentation/styles";
import { ErrorMessage, Fonts } from "../../styles/global-styles";

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
              borderColor: errorMessage ? Colors.surface_warning : isActive ? Colors.text_primary : Colors.neutral_500,
              ...styles.containerInput,
            }}>
            {iconLeft && <Ionicons name={iconLeft} size={24} color={Colors.primary_50} />}
            <TextInput
              ref={inputRef}
              placeholderTextColor={Colors.neutral_500}
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
            {iconRight && <Ionicons name={iconRight} size={24} color={Colors.primary_50} />}
          </View>
        )}
      />

      {errorMessage && <Text style={ErrorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    gap: 5,
  },
  containerInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: Platform.OS === "ios" ? 12 : 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
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
