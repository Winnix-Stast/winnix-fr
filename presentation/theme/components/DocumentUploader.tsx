import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/presentation/styles";
import { ErrorMessage, Fonts } from "@/presentation/styles/global-styles";

interface Props {
  name: string;
  control: any;
  label?: string;
  errorMessage?: string;
}

export const DocumentUploader = ({ name, control, label, errorMessage }: Props) => {
  const pickDocument = async (onChange: (val: string) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/plain"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onChange(result.assets[0].name);
      }
    } catch (error) {
      console.log("Error picking document", error);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity style={[styles.uploadBox, errorMessage ? { borderColor: Colors.surface_warning } : {}]} activeOpacity={0.8} onPress={() => pickDocument(onChange)}>
            {value ? (
              <View style={styles.fileRow}>
                <Ionicons name='document-text' size={30} color={Colors.brand_secondary} />
                <Text style={styles.fileName} numberOfLines={1}>
                  {value}
                </Text>
                <TouchableOpacity onPress={() => onChange("")} style={styles.closeIcon}>
                  <Ionicons name='close-circle' size={24} color={Colors.surface_warning} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name='cloud-upload-outline' size={32} color={Colors.primary_50} />
                <Text style={styles.placeholderText}>Toca para subir PDF o TXT con las reglas</Text>
              </View>
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
    gap: 8,
  },
  label: {
    fontSize: Fonts.normal,
    color: Colors.primary_50,
    fontWeight: "bold",
  },
  uploadBox: {
    width: "100%",
    minHeight: 100,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.border_focus,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface_elevated,
    padding: 15,
  },
  placeholder: {
    alignItems: "center",
  },
  placeholderText: {
    color: Colors.primary_50,
    marginTop: 8,
    fontSize: Fonts.small,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  fileName: {
    color: Colors.text_primary,
    fontSize: Fonts.normal,
    flex: 1,
  },
  closeIcon: {
    marginLeft: "auto",
  },
});
