import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller } from 'react-hook-form';
import { Colors } from '@/presentation/styles';

interface CustomSearchProps {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  styleLabel?: TextStyle;
  errorMessage?: string;
}

export const CustomSearch = ({
  name,
  control,
  label,
  placeholder = 'Buscar...',
  iconLeft,
  iconRight,
  styleLabel,
  errorMessage,
}: CustomSearchProps) => {
  const [isActive, setIsActive] = useState(false);

  const shadowAnim = useRef(new Animated.Value(0)).current;

  const animatedStyle = {
    shadowOpacity: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.4],
    }),
    shadowRadius: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 6],
    }),
    elevation: shadowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 6],
    }),
  };

  useEffect(() => {
    Animated.timing(shadowAnim, {
      toValue: isActive ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {label && <Text style={[styles.label, styleLabel]}>{label}</Text>}

        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  borderColor: isActive ? Colors.brand_primary : '#192147',
                  shadowColor: Colors.brand_primary,
                },
                animatedStyle,
              ]}
            >
              {iconLeft && (
                <Ionicons
                  name={iconLeft}
                  size={20}
                  color={isActive ? Colors.brand_primary : Colors.text_tertiary}
                  style={{ marginRight: 8 }}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.text_tertiary}
                value={value}
                onChangeText={onChange}
                onFocus={() => setIsActive(true)}
                onBlur={() => {
                  setIsActive(false);
                  onBlur();
                }}
              />
              {iconRight && (
                <Ionicons
                  name={iconRight}
                  size={20}
                  color={isActive ? Colors.brand_primary : Colors.text_tertiary}
                />
              )}
            </Animated.View>
          )}
        />

        {errorMessage && (
          <Text style={{ color: Colors.text_error, marginTop: 4, fontSize: 12 }}>
            {errorMessage}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: '#070a1e',
    shadowOffset: { width: 0, height: 0 },
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: 48,
    paddingHorizontal: 8,
    color: Colors.text_primary,
    fontWeight: '600',
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    fontWeight: 'bold',
    color: Colors.text_secondary,
    letterSpacing: 1,
  },
});
