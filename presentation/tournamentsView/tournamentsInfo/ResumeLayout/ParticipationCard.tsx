import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconName, WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

type Props = {
  onPressButton: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  iconName?: IconName;
  headerIconName?: IconName;
  headerText?: string;
  gradientColors?: [string, string];
  accentColor?: string;
};

export const ParticipationCard = ({
  onPressButton,
  title = '¡ÚNETE AL TORNEO!',
  subtitle = 'Las inscripciones se encuentran abiertas por tiempo limitado.',
  buttonText = 'INSCRIBIRSE AHORA',
  iconName = 'person-add-outline',
  headerIconName = 'person-circle-outline',
  headerText = 'MI PARTICIPACIÓN',
  gradientColors = ['#0D2825', '#071221'],
  accentColor = Colors.brand_primary,
}: Props) => {
  return (
    <Pressable
      onPress={onPressButton}
      style={[
        styles.outerContainer,
        {
          borderColor: `${accentColor}33`,
          shadowColor: accentColor,
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Slanted energy border decoration */}
        <View style={[styles.topAccentBar, { backgroundColor: accentColor }]} />

        <View style={styles.header}>
          <View
            style={[
              styles.iconBadge,
              {
                backgroundColor: `${accentColor}0D`,
                borderColor: `${accentColor}1A`,
              },
            ]}
          >
            <WinnixIcon name={headerIconName} size={16} color={accentColor} />
          </View>
          <Text style={styles.headerText}>{headerText}</Text>
        </View>

        <View style={styles.body}>
          <View
            style={[
              styles.mainIconWrapper,
              {
                backgroundColor: `${accentColor}08`,
                borderColor: `${accentColor}14`,
              },
            ]}
          >
            <WinnixIcon name={iconName} size={32} color={accentColor} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* Tactical Skewed Action Button */}
        <View style={styles.buttonWrapper}>
          <Pressable
            onPress={onPressButton}
            style={[
              styles.button,
              {
                backgroundColor: accentColor,
                borderColor: accentColor,
              },
            ]}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
            <WinnixIcon
              name='chevron-forward-outline'
              size={14}
              color={Colors.on_brand}
            />
          </Pressable>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 14,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.2)',
    elevation: 4,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  gradient: {
    padding: 16,
    position: 'relative',
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.brand_primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  iconBadge: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(40, 209, 195, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.1)',
  },
  headerText: {
    color: Colors.text_primary,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  mainIconWrapper: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(40, 209, 195, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: Colors.text_primary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: Colors.text_secondary,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
  buttonWrapper: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.brand_primary,
    borderColor: '#5DE6DC',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: Colors.on_brand,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
