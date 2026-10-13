import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';

export const NotificationEmptyState: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <WinnixIcon name='notifications-outline' size={44} color={Colors.text_tertiary} />
      </View>

      <Text style={styles.title}>Estás al día</Text>
      <Text style={styles.subtitle}>
        Aquí recibirás avisos de tus partidos, solicitudes de equipos, convocatorias y
        novedades de tus torneos.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 72,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text_primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text_tertiary,
    textAlign: 'center',
    lineHeight: 21,
  },
});
