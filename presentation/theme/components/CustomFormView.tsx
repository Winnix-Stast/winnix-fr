import { ReactNode } from "react";
import { Keyboard, StyleProp, TouchableWithoutFeedback, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from "../../styles/global-styles";

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
          // paddingBottom: 60,
        }}
        style={[
          {
            backgroundColor: Colors.dark,
            minHeight: "100%",
          },
          contentStyle,
        ]}>
        {children}
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};
