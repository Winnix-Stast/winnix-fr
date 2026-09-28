import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../styles/global-styles';

interface Props {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export const CustomFormView = ({ children, contentStyle }: Props) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 14,
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
