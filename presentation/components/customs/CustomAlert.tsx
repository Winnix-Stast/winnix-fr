import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Radius } from '@/presentation/styles/global-styles';
import { useAlertStore } from './useAlertStore';

export const CustomAlert = () => {
  const { visible, config, hideAlert } = useAlertStore();

  if (!visible || !config) return null;

  const {
    title,
    message,
    type = 'info',
    confirmText = 'ACEPTAR',
    onConfirm,
    showCancel = false,
    cancelText = 'CANCELAR',
    onCancel,
  } = config;

  const typeMap = {
    success: {
      color: '#00c897',
      icon: 'checkmark-circle-outline' as const,
      bgGlow: 'rgba(0, 200, 151, 0.08)',
    },
    error: {
      color: '#ff5c5c',
      icon: 'alert-circle-outline' as const,
      bgGlow: 'rgba(255, 92, 92, 0.08)',
    },
    warning: {
      color: '#EAB308',
      icon: 'warning-outline' as const,
      bgGlow: 'rgba(234, 179, 8, 0.08)',
    },
    info: {
      color: '#6366F1',
      icon: 'information-circle-outline' as const,
      bgGlow: 'rgba(99, 102, 241, 0.08)',
    },
  };

  const { color, icon, bgGlow } = typeMap[type] || typeMap.info;

  const handleConfirm = () => {
    hideAlert();
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    hideAlert();
    if (onCancel) onCancel();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <View style={styles.overlayContainer}>
        {/* Backdrop blur */}
        <BlurView intensity={20} tint='dark' style={StyleSheet.absoluteFillObject} />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(3, 8, 25, 0.8)' },
          ]}
        />

        {/* Cyberpunk Alert Card */}
        <View style={[styles.alertCard, { borderColor: `${color}45` }]}>
          <LinearGradient colors={['#0c122c', '#040816']} style={styles.gradientBg}>
            {/* Upper Glowing Icon */}
            <View
              style={[
                styles.iconContainer,
                { borderColor: `${color}35`, backgroundColor: bgGlow },
              ]}
            >
              <WinnixIcon name={icon} size={38} color={color} />
            </View>

            {/* Title & Description */}
            <Text style={[styles.title, { color: color }]}>{title.toUpperCase()}</Text>
            <Text style={styles.message}>{message}</Text>

            {/* Actions */}
            <View style={styles.buttonContainer}>
              {showCancel && (
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.cancelBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>{cancelText.toUpperCase()}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleConfirm}
                style={[styles.confirmBtn, { backgroundColor: color }]}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmBtnText}>{confirmText.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  alertCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radius.medium,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  gradientBg: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#C2CAD6',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#C2CAD6',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  confirmBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmBtnText: {
    color: '#030819',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});
