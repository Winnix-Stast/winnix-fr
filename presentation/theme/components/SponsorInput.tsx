import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Colors } from "@/presentation/styles";
import { ErrorMessage, Fonts } from "@/presentation/styles/global-styles";

interface Props {
  name: string;
  control: any;
  label: string;
  placeholder?: string;
  errorMessage?: string;
}

export const SponsorInput = ({ name, control, label, placeholder = "Agregar Sponsor", errorMessage }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddSponsor = (onChange: (val: string[]) => void, currentList: string[]) => {
    if (inputValue.trim()) {
      const newList = [...(currentList || []), inputValue.trim()];
      onChange(newList);
      setInputValue("");
    }
  };

  const handleRemoveSponsor = (onChange: (val: string[]) => void, currentList: string[], index: number) => {
    const newList = currentList.filter((_, i) => i !== index);
    onChange(newList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          const sponsors: string[] = value || [];

          return (
            <View>
              <View style={styles.inputRow}>
                <TextInput style={[styles.input, errorMessage ? { borderColor: Colors.surface_warning } : {}]} placeholder={placeholder} placeholderTextColor={Colors.neutral_500} value={inputValue} onChangeText={setInputValue} onSubmitEditing={() => handleAddSponsor(onChange, sponsors)} />
                <TouchableOpacity style={styles.addButton} onPress={() => handleAddSponsor(onChange, sponsors)} activeOpacity={0.8}>
                  <Ionicons name='add' size={24} color={Colors.text_primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.chipsContainer}>
                {sponsors.map((sponsor, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{sponsor}</Text>
                    <TouchableOpacity onPress={() => handleRemoveSponsor(onChange, sponsors, index)}>
                      <Ionicons name='close-circle' size={18} color={Colors.surface_warning} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
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
    gap: 8,
  },
  label: {
    fontSize: Fonts.normal,
    color: Colors.primary_50,
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border_focus,
    borderRadius: 10,
    padding: 12,
    color: Colors.text_primary,
    backgroundColor: Colors.surface_base,
    fontSize: Fonts.normal,
  },
  addButton: {
    backgroundColor: Colors.brand_secondary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface_pressed,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border_subtitle,
  },
  chipText: {
    color: Colors.text_primary,
    fontSize: Fonts.small,
  },
});
