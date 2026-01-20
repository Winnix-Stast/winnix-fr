import { Ionicons } from "@expo/vector-icons";
import { borderRadius, colors, spacing, typography } from "@styles";
import React, { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Animated, Keyboard, StyleSheet, Text, TextInput, TextStyle, TouchableWithoutFeedback, View } from "react-native";

interface CustomSearchProps {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  styleLabel?: TextStyle;
  errorMessage?: string;
}

export const CustomSearch = ({ name, control, label, placeholder = "Buscar...", iconLeft, iconRight, styleLabel, errorMessage }: CustomSearchProps) => {
  const [isActive, setIsActive] = useState(false);

  const shadowAnim = useRef(new Animated.Value(0)).current;

  const animatedStyle = {
    shadowOpacity: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.4],
    }),
    shadowRadius: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 6],
    }),
    elevation: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 6],
    }),
  };

  useEffect(() => {
    Animated.timing(shadowAnim, {
      toValue: isActive ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {label && <Text style={[styles.label, styleLabel]}>{label}</Text>}

        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  borderColor: colors.brand_secondary,
                  shadowColor: colors.brand_secondary,
                },
                animatedStyle,
              ]}>
              {iconLeft && <Ionicons name={iconLeft} size={22} color={colors.brand_secondary} style={{ marginRight: spacing.spacing_2xs }} />}
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.text_tertiary}
                value={value}
                onChangeText={onChange}
                onFocus={() => setIsActive(true)}
                onBlur={() => {
                  setIsActive(false);
                  onBlur();
                }}
              />
              {iconRight && <Ionicons name={iconRight} size={22} color={colors.brand_secondary} />}
            </Animated.View>
          )}
        />

        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: spacing.spacing_xs,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderRadius: borderRadius.border_s,
    paddingHorizontal: spacing.spacing_s,
    alignItems: "center",
    backgroundColor: colors.surface_base,
    shadowOffset: { width: 0, height: spacing.spacing_2xs },
  },
  input: {
    flex: 1,
    fontSize: typography.body_m_medium.size,
    height: 50,
    paddingHorizontal: spacing.spacing_xs,
    color: colors.text_primary,
  },
  label: {
    fontSize: typography.body_m_semibold.size,
    marginBottom: spacing.spacing_2xs,
    fontWeight: typography.body_m_semibold.weight.toLowerCase() as "600",
    color: colors.text_primary,
  },
  errorMessage: {
    color: colors.red_500,
    marginTop: spacing.spacing_2xs,
    fontSize: typography.caption_m_regular.size,
  },
});
