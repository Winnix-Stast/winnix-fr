import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Modal, Platform, StyleSheet, Text, TextStyle, TouchableOpacity, View } from "react-native";

import { Colors } from "@/presentation/styles";
import { ErrorMessage, Fonts } from "../../styles/global-styles";

interface Props {
  label?: string;
  styleLabel?: TextStyle;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  name: string;
  control: any;
  placeholder?: string;
  errorMessage?: string;
  modalTitle?: string;
}

export const CustomDatePicker = ({ name, control, iconLeft, iconRight = "calendar-outline", label = "", styleLabel, placeholder = "Selecciona una fecha", errorMessage, modalTitle = "Selecciona una fecha" }: Props) => {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, styleLabel]}>{label}</Text>}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          // Convertimos el valor a Date de forma segura
          const dateValue = value ? new Date(value) : null;
          const isValid = dateValue instanceof Date && !isNaN(dateValue.getTime());

          const formattedDate = isValid ? `${dateValue.getDate().toString().padStart(2, "0")}/${(dateValue.getMonth() + 1).toString().padStart(2, "0")}/${dateValue.getFullYear()}` : placeholder;

          // Manejador del cambio de fecha
          const handleDateChange = (event: any, selectedDate?: Date) => {
            if (Platform.OS === "android") {
              setOpen(false);
              if (event.type === "set" && selectedDate) {
                onChange(selectedDate);
              }
            } else if (Platform.OS === "ios") {
              if (selectedDate) {
                setTempDate(selectedDate);
              }
            }
          };

          return (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setTempDate(isValid ? dateValue : new Date());
                  setOpen(true);
                }}
                style={[
                  styles.selectContainer,
                  {
                    borderColor: errorMessage ? Colors.surface_warning : open ? Colors.text_primary : Colors.neutral_500,
                  },
                ]}>
                {iconLeft && <Ionicons name={iconLeft} size={24} color={Colors.primary_50} style={{ marginRight: 10 }} />}

                <Text style={[styles.valueText, !isValid && { color: Colors.neutral_500 }]}>{formattedDate}</Text>

                {iconRight && <Ionicons name={iconRight} size={24} color={Colors.primary_50} />}
              </TouchableOpacity>

              {/* RENDERIZADO PARA ANDROID: Se abre como un Pop-up nativo */}
              {open && Platform.OS === "android" && <DateTimePicker mode='date' display='default' value={isValid ? dateValue : new Date()} maximumDate={new Date()} onChange={handleDateChange} />}

              {/* RENDERIZADO PARA iOS: Lo envolvemos en un Modal para simular el comportamiento anterior */}
              {open && Platform.OS === "ios" && (
                <Modal transparent={true} animationType='slide' visible={open}>
                  <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={() => setOpen(false)}>
                    <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{modalTitle}</Text>
                      </View>

                      <View style={styles.pickerContainer}>
                        <DateTimePicker mode='date' display='spinner' locale='es-ES' value={tempDate} maximumDate={new Date()} onChange={handleDateChange} textColor={Colors.text_primary} />
                      </View>

                      <View style={styles.modalFooter}>
                        <TouchableOpacity onPress={() => setOpen(false)} style={styles.actionButton}>
                          <Text style={styles.modalCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            onChange(tempDate);
                            setOpen(false);
                          }}
                          style={[styles.actionButton, styles.confirmButton]}>
                          <Text style={styles.modalConfirmText}>Confirmar</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Modal>
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(3, 8, 25, 0.8)",
  },
  modalContent: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 20,
    width: "85%",
    borderWidth: 1,
    borderColor: Colors.border_strong,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: "hidden",
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: Colors.surface_base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_focus,
    alignItems: "center",
  },
  modalTitle: {
    color: Colors.text_brand,
    fontSize: Fonts.normal,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  pickerContainer: {
    paddingVertical: 15,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.surface_pressed,
    backgroundColor: Colors.surface_base,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: Colors.border_subtitle,
  },
  modalCancelText: {
    color: Colors.neutral_400,
    fontSize: Fonts.normal,
    fontWeight: "600",
  },
  modalConfirmText: {
    color: Colors.text_brand,
    fontSize: Fonts.normal,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
