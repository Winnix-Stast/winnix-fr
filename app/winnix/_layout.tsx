import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { usePermission } from '@/presentation/hooks/auth/usePermission';
import { CustomDrawerContent, CustomHeader } from '@/presentation/theme/components/';
import { WinnixIcon } from '@/presentation/plugins/Icon';

const CheckAuthenticationLayout = () => {
  const { status, checkStatus } = useAuthStore();
  const { can } = usePermission();
  const isOrganizer = can('create:tournament');

  useEffect(() => {
    checkStatus();
  }, []);

  if (status === 'checking') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (status === 'unauthenticated') {
    return <Redirect href='/auth/login' />;
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        header: ({ layout, navigation, route, options }) => (
          <CustomHeader
            layout={layout}
            navigation={navigation}
            options={options}
            route={route}
          />
        ),
        drawerActiveBackgroundColor: 'rgba(124, 43, 19, 0.15)',
        drawerActiveTintColor: '#ea840a',
        drawerInactiveTintColor: '#a3adb8',
        drawerLabelStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen
        name='tabs'
        options={{
          drawerLabel: 'Inicio',
          title: 'Inicio',
          drawerIcon: ({ color, size }) => (
            <WinnixIcon name='home-outline' size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name='myZone'
        options={{
          drawerItemStyle: { display: 'none' },
          title: isOrganizer ? 'Mis Marcas' : 'Mis Torneos',
        }}
      />

      <Drawer.Screen
        name='profile'
        options={{
          drawerLabel: 'Mi perfil',
          title: 'Mi perfil',
          drawerIcon: ({ color, size }) => (
            <WinnixIcon name='person-outline' size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name='settings'
        options={{
          drawerLabel: 'Ajustes',
          title: 'Ajustes',
          drawerIcon: ({ color, size }) => (
            <WinnixIcon name='settings-outline' size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name='ourTournaments'
        options={{
          drawerItemStyle: { display: 'none' },
          title: isOrganizer ? 'Mis Marcas' : 'Mis Torneos',
        }}
      />

      <Drawer.Screen
        name='brand/create'
        options={{
          drawerItemStyle: { display: 'none' },
          title: '',
        }}
      />
      <Drawer.Screen
        name='tournament/create'
        options={{
          drawerItemStyle: { display: 'none' },
          title: '',
        }}
      />
      <Drawer.Screen
        name='team/create'
        options={{
          drawerItemStyle: { display: 'none' },
          title: '',
        }}
      />

      <Drawer.Screen
        name='team/[id]'
        options={{
          drawerItemStyle: { display: 'none' },
          title: '',
        }}
      />

      <Drawer.Screen
        name='tournament/[id]'
        options={{
          drawerItemStyle: { display: 'none' },
          title: '',
        }}
      />

      <Drawer.Screen
        name='tournament/edit'
        options={{
          drawerItemStyle: { display: 'none' },
          title: '',
        }}
      />

      <Drawer.Screen
        name='brand/[id]'
        options={{
          drawerItemStyle: { display: 'none' },
          title: '',
        }}
      />
    </Drawer>
  );
};

export default CheckAuthenticationLayout;
