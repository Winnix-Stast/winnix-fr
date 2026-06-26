import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}

export const ScreenHeader = ({ title, onBack }: ScreenHeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
        <WinnixIcon name='chevron-back-outline' size={26} color={Colors.text_primary} />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {title.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginRight: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text_primary,
    letterSpacing: 1.2,
    flexShrink: 1,
  },
});
