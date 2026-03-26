import { Colors } from "@/presentation/styles/colors";
import { CustomButton } from "@/presentation/theme/components/";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ModalRN from "react-native-modal";

interface Props {
  visible: boolean;
  teamName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const TeamDeleteModal: React.FC<Props> = ({ visible, teamName, onClose, onConfirm, isDeleting }) => {
  return (
    <ModalRN isVisible={visible} onBackdropPress={onClose} animationIn='zoomIn' animationOut='zoomOut' backdropOpacity={0.8} style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name='warning' size={50} color={Colors.red_500} />
        </View>

        <Text style={styles.title}>¿Eliminar Equipo?</Text>
        <Text style={styles.subtitle}>
          Estás a punto de eliminar permanentemente a <Text style={styles.highlight}>{teamName}</Text>. Esta acción no se puede deshacer y todos los jugadores perderán acceso al equipo.
        </Text>

        <View style={styles.buttonRow}>
          <View style={{ flex: 1 }}>
            <CustomButton label='Cancelar' onPress={onClose} outline disabled={isDeleting} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomButton label={isDeleting ? "Borrando..." : "Eliminar"} onPress={onConfirm} icon='trash-outline' disabled={isDeleting} />
          </View>
        </View>
      </View>
    </ModalRN>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.red_900,
    borderTopColor: Colors.red_500,
    borderLeftColor: Colors.red_500,
    padding: 24,
    width: "90%",
    maxWidth: 350,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.red_900 + "40",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.red_500,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.red_400,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.text_secondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  highlight: {
    color: Colors.text_primary,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
  },
});
