import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { Radius } from '@/presentation/styles/global-styles';
import { TutorialStep } from './types';

interface BaseTutorialModalProps {
  tutorialKey: string;
  steps: TutorialStep[];
  visible: boolean;
  onClose: () => void;
  accentColor?: string;
}

export const BaseTutorialModal = ({
  tutorialKey,
  steps,
  visible,
  onClose,
  accentColor = Colors.brand_primary,
}: BaseTutorialModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const animValue = useSharedValue(0);
  const scaleValue = useSharedValue(0.9);

  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
      animValue.value = 0;
      animValue.value = withTiming(1, { duration: 400 });
      scaleValue.value = withSpring(1, { damping: 15 });
    } else {
      scaleValue.value = withTiming(0.9, { duration: 200 });
    }
  }, [visible]);

  // Trigger page transition animation
  useEffect(() => {
    animValue.value = 0;
    animValue.value = withTiming(1, { duration: 350 });
  }, [currentStep]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete tutorial
      await SecureStorageAdapter.setItem(tutorialKey, 'completed');
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = async () => {
    await SecureStorageAdapter.setItem(tutorialKey, 'completed');
    onClose();
  };

  // Reanimated style for fade-in & slide-in of content
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animValue.value,
      transform: [{ translateX: interpolate(animValue.value, [0, 1], [30, 0]) }],
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const activeStepData = steps[currentStep];

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlayContainer}>
        {/* Glassmorphic backdrop */}
        <BlurView intensity={30} tint='dark' style={StyleSheet.absoluteFillObject} />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(3, 8, 25, 0.75)' },
          ]}
        />

        {/* Reanimated Animated card wrapper */}
        <Animated.View
          style={[
            styles.modalCard,
            cardAnimatedStyle,
            { borderColor: `${accentColor}35` },
          ]}
        >
          <LinearGradient
            colors={['#0c122c', '#040816']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBg}
          >
            {/* Header: Steps and Close/Skip button */}
            <View style={styles.header}>
              <Text style={[styles.stepIndicatorText, { color: accentColor }]}>
                PASO {currentStep + 1} DE {steps.length}
              </Text>
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipButtonText}>OMITIR</Text>
              </TouchableOpacity>
            </View>

            {/* Slide Content */}
            <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
              {/* Outer glowing icon container */}
              <View style={[styles.iconOuterRing, { borderColor: `${accentColor}40` }]}>
                <LinearGradient
                  colors={[`${accentColor}15`, 'transparent']}
                  style={styles.iconRingInner}
                >
                  <WinnixIcon
                    name={activeStepData.icon as any}
                    size={46}
                    color={accentColor}
                  />
                </LinearGradient>
              </View>

              <Text style={styles.title}>{activeStepData.title}</Text>
              <Text style={styles.description}>{activeStepData.description}</Text>

              {/* Example Card Box (Sport/Video Game Visual Aid) */}
              {activeStepData.exampleTitle && (
                <View style={styles.exampleBox}>
                  <View
                    style={[styles.exampleTag, { backgroundColor: `${accentColor}20` }]}
                  >
                    <Text style={[styles.exampleTagText, { color: accentColor }]}>
                      {activeStepData.exampleTitle.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.exampleText}>{activeStepData.exampleDesc}</Text>
                </View>
              )}
            </Animated.View>

            {/* Footer: Progress bar and Action Buttons */}
            <View style={styles.footer}>
              {/* Progress Dots */}
              <View style={styles.dotsContainer}>
                {steps.map((_, index) => {
                  const isActive = index === currentStep;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        isActive
                          ? [styles.activeDot, { backgroundColor: accentColor }]
                          : styles.inactiveDot,
                      ]}
                    />
                  );
                })}
              </View>

              {/* Navigation buttons */}
              <View style={styles.navButtonsContainer}>
                {currentStep > 0 && (
                  <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backBtn}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.backBtnText}>ATRÁS</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleNext}
                  style={[styles.nextBtn, { backgroundColor: accentColor }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextBtnText}>
                    {currentStep === steps.length - 1 ? '¡ENTENDIDO!' : 'SIGUIENTE'}
                  </Text>
                  <WinnixIcon
                    name={
                      currentStep === steps.length - 1
                        ? 'checkmark-circle-outline'
                        : 'arrow-forward'
                    }
                    size={18}
                    color='#030819'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: Radius.big,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  gradientBg: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIndicatorText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  skipButtonText: {
    color: '#6E7C96',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  contentContainer: {
    alignItems: 'center',
    minHeight: 280,
    justifyContent: 'center',
    marginVertical: 10,
  },
  iconOuterRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  iconRingInner: {
    width: '100%',
    height: '100%',
    borderRadius: 43,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F5F7FA',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#C2CAD6',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  exampleBox: {
    width: '100%',
    backgroundColor: '#070a18',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
  },
  exampleTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  exampleTagText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  exampleText: {
    fontSize: 13,
    color: '#9EADCE',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 20,
    gap: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 18,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#2D3A54',
  },
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    color: '#C2CAD6',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  nextBtn: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    color: '#030819',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});
