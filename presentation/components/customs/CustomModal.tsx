import React from 'react';
import {
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

export interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  maxWidth?: number;
  maxHeightPercent?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  showCloseButton?: boolean;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * Modal universal responsive de Winnix
 * Compatible y optimizado para dispositivos móviles, tablets (iPad/Android) y Web.
 */
export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  maxWidth = 520,
  maxHeightPercent = 0.85,
  header,
  footer,
  children,
  showCloseButton = true,
  scrollable = true,
  style,
  contentContainerStyle,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Anchura adaptativa: respeta maxWidth en tablets/web y 92% en móviles
  const modalWidth = Math.min(maxWidth, windowWidth * 0.92);
  const modalMaxHeight = windowHeight * maxHeightPercent;

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Backdrop Blur con oscurecimiento profundo */}
          <BlurView intensity={24} tint='dark' style={StyleSheet.absoluteFill} />
          <View style={styles.backdropDimmer} />

          {/* Tarjeta del Modal con fondo degradado absoluto */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={[
                styles.cardContainer,
                {
                  width: modalWidth,
                  maxHeight: modalMaxHeight,
                },
                style,
              ]}
            >
              {/* Capa de fondo degradada cyberpunk */}
              <LinearGradient
                colors={['#0f1738', '#05091a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {/* Encabezado Opcional o Botón de Cerrar */}
              {(header || showCloseButton) && (
                <View style={styles.headerRow}>
                  <View style={styles.headerContent}>{header}</View>
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onClose}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={styles.closeBtn}
                      activeOpacity={0.7}
                    >
                      <WinnixIcon name='close' size={20} color={Colors.text_tertiary} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Cuerpo del Modal con ScrollView adaptable */}
              {scrollable ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[styles.scrollBody, contentContainerStyle]}
                  bounces={false}
                  style={styles.scrollView}
                >
                  {children}
                </ScrollView>
              ) : (
                <View style={[styles.nonScrollBody, contentContainerStyle]}>
                  {children}
                </View>
              )}

              {/* Pie de Página / Botonera */}
              {footer && <View style={styles.footerRow}>{footer}</View>}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(2, 6, 20, 0.85)',
  },
  backdropDimmer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(2, 6, 20, 0.85)',
  },
  cardContainer: {
    backgroundColor: '#0c122c',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  headerContent: {
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  scrollView: {
    flexShrink: 1,
  },
  scrollBody: {
    paddingVertical: 14,
  },
  nonScrollBody: {
    paddingVertical: 14,
  },
  footerRow: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.07)',
  },
});
