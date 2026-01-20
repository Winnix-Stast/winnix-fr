import { MyCheckbox } from "@/presentation/theme/components/CustomCheckbox";
import { SignUpFormData } from "@/presentation/types/SignUpData";
import { colors, spacing, typography } from "@styles";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  control: Control<SignUpFormData>;
  Haptics: any;
  handleTermsClick: () => void;
  errors: FieldErrors<SignUpFormData>;
}

export const TermsAndConditions = ({ control, Haptics, handleTermsClick, errors }: Props) => (
  <>
    <View style={styles.terms}>
      <View style={styles.termsTextContainer}>
        <Text style={styles.termText}>Acepto los</Text>
        <Pressable onPress={handleTermsClick}>
          <Text style={styles.termsLink}>términos y condiciones</Text>
        </Pressable>
      </View>

      <Controller
        control={control}
        name='isChecked'
        defaultValue={false}
        render={({ field: { onChange, value } }) => (
          <MyCheckbox
            onChange={() => {
              Haptics.selectionAsync();
              onChange(!value);
            }}
            checked={value ?? false}
          />
        )}
      />
    </View>

    {errors?.isChecked && <Text style={styles.errorText}>{errors.isChecked.message}</Text>}
  </>
);
const styles = StyleSheet.create({
  terms: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: spacing.spacing_s + spacing.spacing_2xs,
    zIndex: 2,
  },

  termsTextContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.spacing_2xs,
  },

  termText: {
    fontSize: typography.body_s_medium.size + 2,
    color: colors.text_primary,
  },

  termsLink: {
    fontSize: typography.body_s_medium.size + 2,
    color: colors.text_brand,
    textDecorationLine: "underline",
  },
  errorText: {
    color: colors.red_500,
    fontSize: typography.body_s_medium.size,
    marginTop: spacing.spacing_2xs,
  },
});
