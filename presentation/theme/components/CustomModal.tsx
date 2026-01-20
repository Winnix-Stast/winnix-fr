import { WinnixIcon } from "@/presentation/plugins/Icon";
import { borderRadius, colors, spacing } from "@styles";
import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import ModalRN, { ModalProps } from "react-native-modal";

type AppModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationIn?: ModalProps["animationIn"];
  animationOut?: ModalProps["animationOut"];
  backdropOpacity?: number;
  modalStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  swipeDirection?: ModalProps["swipeDirection"];
  showIcon?: boolean;
  iconColor?: string;
  iconSize?: number;
  iconContainerStyle?: StyleProp<ViewStyle>;
};

export const AppModal: React.FC<AppModalProps> = ({ visible, onClose, children, animationIn = "slideInUp", animationOut = "slideOutDown", backdropOpacity = 0.5, modalStyle, contentStyle, swipeDirection, showIcon = true, iconColor = colors.text_primary, iconSize = 28, iconContainerStyle = {} }) => {
  return (
    <ModalRN isVisible={visible} animationIn={animationIn} animationOut={animationOut} backdropOpacity={backdropOpacity} onBackdropPress={onClose} onBackButtonPress={onClose} swipeDirection={swipeDirection} onSwipeComplete={onClose} style={[{ margin: 0, justifyContent: "center", alignItems: "center" }, modalStyle]}>
      <View
        style={[
          {
            backgroundColor: colors.surface_elevated,
            borderRadius: borderRadius.border_s,
            overflow: "hidden",
            position: "relative",
            width: "90%",
            paddingTop: showIcon ? spacing.spacing_2xl : 0,
          },
          contentStyle,
        ]}>
        {/* Icono de cierre */}
        {showIcon && (
          <TouchableOpacity
            onPress={onClose}
            style={[
              {
                position: "absolute",
                top: spacing.spacing_2xl,
                right: spacing.spacing_s,
                zIndex: 10,
                padding: spacing.spacing_2xs,
              },
              iconContainerStyle,
            ]}>
            <WinnixIcon name='close-outline' size={iconSize} color={iconColor} />
          </TouchableOpacity>
        )}

        {/* Contenido */}
        {children}
      </View>
    </ModalRN>
  );
};
