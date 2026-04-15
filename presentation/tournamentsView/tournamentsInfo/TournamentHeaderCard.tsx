import { Colors, Flex, Radius } from "@/presentation/styles/global-styles";
import { CustomButton } from "@/presentation/theme/components/CustomButton";
import React from "react";
import { ImageBackground, ImageSourcePropType, StyleSheet, Text, TextStyle, useWindowDimensions, View } from "react-native";

type TournamentState = string;

type Props = {
  title: string;
  state: TournamentState;
  dateText: string;
  buttonLabel: string;
  image: ImageSourcePropType;
  onPressButton: () => void;
  titleStyle?: TextStyle;
  dateStyle?: TextStyle;
  statusStyle?: TextStyle;
};

export const TournamentHeaderCard = ({ title, state, dateText, buttonLabel, image, onPressButton, titleStyle, dateStyle, statusStyle }: Props) => {
  const { height } = useWindowDimensions();

  // Configuración de estados
  const statusConfig: Record<string, { label: string; backgroundColor: string }> = {
    "in-progress": {
      label: "Inscripciones Abiertas",
      backgroundColor: "rgba(0, 200, 151, 0.8)",
    },
    next: {
      label: "Próximamente",
      backgroundColor: "rgba(234, 179, 8, 0.8)",
    },
    finished: {
      label: "Finalizado",
      backgroundColor: "rgba(120, 120, 120, 0.7)",
    },
    ongoing: {
      label: "En Progreso",
      backgroundColor: "rgba(59, 130, 246, 0.7)",
    },
    draft: {
      label: "Borrador",
      backgroundColor: "rgba(120, 120, 120, 0.7)",
    },
    published: {
      label: "Publicado",
      backgroundColor: "rgba(0, 200, 151, 0.8)",
    },
    in_progress: {
      label: "En Progreso",
      backgroundColor: "rgba(59, 130, 246, 0.7)",
    },
    cancelled: {
      label: "Cancelado",
      backgroundColor: "rgba(255, 0, 0, 0.7)",
    },
  };

  const { label, backgroundColor } = statusConfig[state] || { label: state, backgroundColor: "rgba(120, 120, 120, 0.7)" };

  return (
    <ImageBackground source={image} style={[styles.imageBackground, { height: height * 0.3 }]} imageStyle={styles.portrait}>
      <View style={styles.overlay}>
        {/* Título */}
        <Text style={[styles.title, titleStyle]}>{title}</Text>

        {/* Contenido */}
        <View
          style={{
            ...Flex.rowCenter,
            justifyContent: "space-between",
            width: "100%",
            gap: 10,
          }}>
          {/* Estado */}
          <Text style={[styles.status, { backgroundColor }, statusStyle]} adjustsFontSizeToFit>
            {label}
          </Text>

          {/* Fecha */}
          <Text style={[styles.date, dateStyle]}>{dateText}</Text>

          {(state === "in-progress" || state === "published" || state === "draft") && (
            <CustomButton
              stylePressable={{
                flex: 1,
                backgroundColor: "rgba(255, 210, 60, .8)",
              }}
              styleText={{ color: Colors.light, fontSize: 16 }}
              label={buttonLabel}
              onPress={onPressButton}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  portrait: {
    width: "100%",
    borderRadius: 16,
  },
  overlay: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 12,
    padding: 12,
  },
  title: {
    fontSize: 28,
    color: Colors.light,
    fontWeight: "bold",
    marginBottom: 20,
  },
  status: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: Radius.big,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light,
  },
  date: {
    flex: 1,
    textAlign: "center",
    color: Colors.light,
    fontSize: 16,
  },
});
