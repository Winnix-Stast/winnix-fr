import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Controller } from "react-hook-form";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/presentation/styles";
import { ErrorMessage, Fonts } from "@/presentation/styles/global-styles";

interface Props {
  name: string;
  control: any;
  label: string;
  errorMessage?: string;
  aspect?: [number, number];
  isRound?: boolean;
}

export const CustomImagePicker = ({ name, control, label, errorMessage, aspect = [4, 3], isRound = false }: Props) => {
  const pickImage = async (onChange: (value: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity style={[styles.pickerContainer, isRound && styles.roundContainer, errorMessage ? { borderColor: Colors.surface_warning } : {}, !value && styles.emptyPicker]} activeOpacity={0.8} onPress={() => pickImage(onChange)}>
            {value ? (
              <Image source={{ uri: value }} style={[styles.image, isRound && styles.roundImage]} resizeMode='cover' />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name='camera-outline' size={32} color={Colors.primary_50} />
                <Text style={styles.placeholderText}>Tocar para subir</Text>
              </View>
            )}

            {value && (
              <TouchableOpacity style={styles.removeButton} onPress={() => onChange("")}>
                <Ionicons name='close-circle' size={24} color={Colors.surface_warning} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
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
  label: {
    fontSize: Fonts.normal,
    color: Colors.primary_50,
    fontWeight: "bold",
  },
  pickerContainer: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: Colors.border_focus,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface_elevated,
  },
  emptyPicker: {
    borderStyle: "dashed",
    borderColor: Colors.neutral_500,
  },
  roundContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  roundImage: {
    borderRadius: 60,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: Colors.primary_50,
    marginTop: 8,
    fontSize: Fonts.small,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
  },
});
