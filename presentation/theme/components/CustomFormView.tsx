import { colors, spacing } from "@styles";
import { ReactNode } from "react";
import { Keyboard, StyleProp, TouchableWithoutFeedback, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Props {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export const CustomFormView = ({ children, contentStyle }: Props) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: spacing.spacing_4xl,
        }}
        style={[
          {
            backgroundColor: colors.surface_screen,
            minHeight: "100%",
          },
          contentStyle,
        ]}>
        {children}
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};
