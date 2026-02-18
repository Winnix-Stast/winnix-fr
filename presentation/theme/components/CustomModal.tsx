import { WinnixIcon } from "@/presentation/plugins/Icon";
import { Colors } from "@/presentation/styles/global-styles";
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

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  children,
  animationIn = "slideInUp",
  animationOut = "slideOutDown",
  backdropOpacity = 0.5,
  modalStyle,
  contentStyle,
  swipeDirection,
  showIcon = true,
  iconColor = Colors.light,
  iconSize = 28,
  iconContainerStyle = {},
}) => {
  return (
    <ModalRN
      isVisible={visible}
      animationIn={animationIn}
      animationOut={animationOut}
      backdropOpacity={backdropOpacity}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection={swipeDirection}
      onSwipeComplete={onClose}
      style={[{ margin: 0, justifyContent: "center", alignItems: "center" }, modalStyle]}>
      <View
        style={[
          {
            backgroundColor: "white",
            borderRadius: 12,
            overflow: "hidden",
            position: "relative",
            width: "90%",
            paddingTop: showIcon ? 40 : 0, // deja espacio si hay icono
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
                top: 25,
                right: 15,
                zIndex: 10,
                padding: 5,
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
