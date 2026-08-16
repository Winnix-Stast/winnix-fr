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
import { LinearGradient } from 'expo-linear-gradient';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { getTournamentStatusConfig } from '@/presentation/styles';
import { Colors } from '@/presentation/styles/colors';

type TournamentState = string;

type Props = {
  title: string;
  state: TournamentState;
  dateText: string;
  image: ImageSourcePropType;
  statusLabel?: string;
  titleStyle?: TextStyle;
  dateStyle?: TextStyle;
  statusStyle?: TextStyle;
};

export const TournamentHeaderCard = ({
  title,
  state,
  statusLabel,
  dateText,
  image,
  titleStyle,
  dateStyle,
  statusStyle,
}: Props) => {
  const { height } = useWindowDimensions();

  const statusStyleConfig = getTournamentStatusConfig(state);
  const color = statusStyleConfig.headerTextColor;
  const bgColor = statusStyleConfig.headerBgColor;
  const borderColor = statusStyleConfig.headerBorderColor;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        style={[styles.imageBackground, { height: Math.max(220, height * 0.28) }]}
        imageStyle={styles.portrait}
        resizeMode='cover'
      >
        <LinearGradient
          colors={[
            'rgba(6, 11, 24, 0.25)',
            'rgba(6, 11, 24, 0.65)',
            'rgba(6, 11, 24, 0.95)',
          ]}
          locations={[0, 0.5, 1]}
          style={styles.gradientOverlay}
        >
          <View style={styles.topRow}>
            <View
              style={[
                styles.statusTag,
                { backgroundColor: bgColor, borderColor: borderColor },
              ]}
            >
              <Text style={[styles.statusTagText, { color }, statusStyle]}>
                {(statusLabel || state).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.middleSection}>
            <Text style={[styles.title, titleStyle]} numberOfLines={2}>
              {title}
            </Text>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.dateContainer}>
              <View style={styles.calendarIconBg}>
                <WinnixIcon
                  name='calendar-outline'
                  size={15}
                  color={Colors.brand_primary}
                />
              </View>
              <View style={{ gap: 2 }}>
                <Text style={styles.dateLabel}>TEMPORADA DE JUEGO</Text>
                <Text style={[styles.dateValue, dateStyle]}>{dateText}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.25)',
    shadowColor: '#28D1C3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  imageBackground: {
    width: '100%',
  },
  portrait: {
    borderRadius: 20,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  statusTag: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(10, 16, 38, 0.75)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.2)',
  },
  dateLabel: {
    color: '#A2B4D6',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  dateValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
