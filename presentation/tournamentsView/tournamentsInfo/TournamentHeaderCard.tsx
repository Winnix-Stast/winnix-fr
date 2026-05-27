import React from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  View,
  useWindowDimensions,
} from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { borderRadius } from '@/presentation/styles/theme';

type TournamentState = string;

type Props = {
  title: string;
  state: TournamentState;
  dateText: string;
  image: ImageSourcePropType;
  titleStyle?: TextStyle;
  dateStyle?: TextStyle;
  statusStyle?: TextStyle;
};

export const TournamentHeaderCard = ({
  title,
  state,
  dateText,
  image,
  titleStyle,
  dateStyle,
  statusStyle,
}: Props) => {
  const { height } = useWindowDimensions();

  // Configuración de estados al estilo videojuego (Alineados con el backend: TournamentEditionStatus)
  const statusConfig: Record<
    string,
    { label: string; color: string; bgColor: string; borderColor: string }
  > = {
    DRAFT: {
      label: 'Borrador',
      color: Colors.text_primary,
      bgColor: Colors.text_tertiary,
      borderColor: Colors.text_tertiary,
    },
    REGISTRATION_OPEN: {
      label: 'Inscripciones Abiertas',
      color: Colors.on_brand,
      bgColor: Colors.brand_primary,
      borderColor: Colors.brand_primary,
    },
    ACTIVE: {
      label: 'En curso',
      color: Colors.text_primary,
      bgColor: Colors.brand_secondary,
      borderColor: Colors.brand_secondary,
    },
    FINISHED: {
      label: 'Finalizado',
      color: Colors.text_primary,
      bgColor: Colors.text_tertiary,
      borderColor: Colors.text_tertiary,
    },
  };

  const { label, color, bgColor, borderColor } = statusConfig[state] || {
    label: state,
    color: Colors.text_primary,
    bgColor: Colors.text_tertiary,
    borderColor: Colors.text_tertiary,
  };

  return (
    <View style={[styles.container, { borderRadius: parseInt(borderRadius.border_m) }]}>
      <ImageBackground
        source={image}
        style={[styles.imageBackground, { height: height * 0.28 }]}
        imageStyle={styles.portrait}
        resizeMode='cover'
      >
        <View style={styles.overlay}>
          {/* Fila Superior con Estado */}
          <View style={styles.topRow}>
            <View style={styles.liveCapsule}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>WINNIX ARENA</Text>
            </View>

            <Text
              style={[
                styles.statusTag,
                { color, backgroundColor: bgColor, borderColor },
                statusStyle,
              ]}
              adjustsFontSizeToFit
            >
              {label}
            </Text>
          </View>

          {/* Sección Media con Título */}
          <View style={styles.middleSection}>
            <View style={styles.titleBadge}>
              <Text style={[styles.title, titleStyle]} numberOfLines={2}>
                {title}
              </Text>
            </View>
          </View>

          {/* Fila Inferior con Fecha */}
          <View style={styles.bottomRow}>
            <View style={styles.dateContainer}>
              <WinnixIcon
                name='calendar-outline'
                size={16}
                color={Colors.brand_primary}
              />
              <View style={{ gap: 2 }}>
                <Text style={styles.dateLabel}>Temporada</Text>
                <Text style={[styles.dateValue, dateStyle]}>{dateText}</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.border_subtitle,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  imageBackground: {
    width: '100%',
  },
  portrait: {
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 8, 25, 0.45)',
    padding: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  liveCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(3, 8, 25, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand_primary,
  },
  liveText: {
    color: Colors.brand_primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    overflow: 'hidden',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginVertical: 12,
  },
  titleBadge: {
    backgroundColor: 'rgba(3, 8, 25, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    color: Colors.text_primary,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(14, 21, 41, 0.95)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.2)',
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    color: Colors.text_tertiary,
    fontSize: 8,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateValue: {
    color: Colors.text_primary,
    fontSize: 11,
    fontWeight: '700',
  },
});
