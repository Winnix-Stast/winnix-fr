import { ReactNode } from 'react';
import { Keyboard, StyleProp, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '../../styles/global-styles';

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
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={80}
        extraHeight={120}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          // paddingBottom: 80,
        }}
        style={[
          {
            backgroundColor: Colors.dark,
            minHeight: '100%',
          },
          contentStyle,
        ]}
      >
        {children}
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};
