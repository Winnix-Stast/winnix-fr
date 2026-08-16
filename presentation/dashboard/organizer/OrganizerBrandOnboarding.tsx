import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';
import { CustomIcon } from '@/presentation/theme/components/icons/CustomIcon';

interface OrganizerBrandOnboardingProps {
  userName: string;
  onCreateBrand: () => void;
  onShowTutorial: () => void;
}

export const OrganizerBrandOnboarding = ({
  userName,
  onCreateBrand,
  onShowTutorial,
}: OrganizerBrandOnboardingProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.onboardingContainer}>
      <View style={styles.onboardingHeader}>
        <Text style={styles.welcomeTitle}>¡Hola, {userName}! 👋</Text>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={styles.helpButtonCircle}
            onPress={onShowTutorial}
            activeOpacity={0.7}
          >
            <WinnixIcon
              name='help-circle-outline'
              size={24}
              color={Colors.brand_primary}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.onboardingIconWrapper}>
        <CustomIcon name='empty-tournament' size={260} />
      </View>

      <View style={styles.explanationCard}>
        <View style={styles.explanationHeader}>
          <WinnixIcon
            name='information-circle-outline'
            size={20}
            color={Colors.brand_primary}
          />
          <Text style={styles.explanationTitle}>¿Cómo empezar mi liga?</Text>
        </View>
        <Text style={styles.explanationText}>
          Para comenzar a organizar tus campeonatos, primero necesitas crear una{' '}
          <Text style={styles.boldText}>Liga</Text> (es decir, el nombre oficial de tu
          organización de torneos).
        </Text>
        <Text style={styles.explanationText}>
          Una vez creada, podrás armar todas las temporadas, torneos y partidos que
          quieras y administrarlos desde este panel.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        activeOpacity={0.8}
        onPress={onCreateBrand}
      >
        <Ionicons
          name='trophy-outline'
          size={20}
          color={Colors.on_brand}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.createButtonText}>CREAR MI PRIMERA LIGA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  onboardingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  onboardingHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text_primary,
    flex: 1,
  },
  helpButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(40, 209, 195, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.4)',
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  onboardingIconWrapper: {
    marginVertical: 10,
    alignItems: 'center',
  },
  explanationCard: {
    backgroundColor: Colors.surface_elevated || '#0E1529',
    borderColor: Colors.border_focus || 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 30,
    gap: 10,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.text_secondary,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
    color: Colors.brand_primary,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.actions_primary_bg,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  createButtonText: {
    color: Colors.on_brand,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
