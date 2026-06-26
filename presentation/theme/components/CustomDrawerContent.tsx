import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { router } from 'expo-router';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { usePermission } from '@/presentation/hooks/auth/usePermission';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { logout } = useAuthStore();
  const { can } = usePermission();
  const insets = useSafeAreaInsets();

  const isOrganizer = can('create:tournament');

  const handleMyZonePress = () => {
    if (isOrganizer) {
      router.push('/winnix/myZone/organizer/brands');
    } else {
      router.push('/winnix/myZone/captain/inscriptions');
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollArea}>
        {/* Header (opcional) del Drawer superior */}
        <View
          style={[styles.drawerHeader, { marginTop: insets.top > 0 ? insets.top : 20 }]}
        >
          <Image
            source={require('@/assets/icons/brand/logo.png')}
            style={styles.logoImage}
          />
        </View>

        {/* Lista de Navegación standard (tabs, perfil, settings) */}
        <View style={styles.listContainer}>
          <DrawerItemList {...props} />

          {/* Ítem dinámico por rol: Mis Marcas (org) o Mis Torneos (captain/player) */}
          <DrawerItem
            label={isOrganizer ? 'Mis Marcas' : 'Mis Torneos'}
            icon={({ color, size }) => (
              <Ionicons
                name={isOrganizer ? 'trophy-outline' : 'football-outline'}
                size={size}
                color={color}
              />
            )}
            onPress={handleMyZonePress}
            labelStyle={styles.drawerItemLabel}
            activeTintColor={Colors.brand_primary}
            inactiveTintColor={Colors.text_secondary}
          />
        </View>
      </DrawerContentScrollView>

      {/* Acciones base del Drawer */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Ionicons name='log-out-outline' size={24} color={Colors.text_primary} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface_screen,
  },
  scrollArea: {
    paddingTop: 0,
  },
  drawerHeader: {
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_focus,
    flexDirection: 'row',
    gap: 15,
  },
  logoImage: {
    width: 120,
    height: 60,
    resizeMode: 'contain',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border_focus,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: Colors.surface_screen,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 15,
  },
  logoutText: {
    fontSize: Fonts.normal,
    fontWeight: '600',
    color: Colors.text_primary,
  },
  drawerItemLabel: {
    fontSize: Fonts.normal,
    fontWeight: '600',
  },
});
