import React from 'react';
import { Tabs } from 'expo-router';
import { WinnixIcon } from '@/presentation/plugins/Icon';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name='index'
        options={{
          tabBarItemStyle: { display: 'none', height: 0 },
          tabBarStyle: { display: 'none' },
          href: null,
        }}
      />

      <Tabs.Screen
        name='dashboard/index'
        options={{
          title: `Inicio`,
          tabBarIcon: ({ color }) => (
            <WinnixIcon size={28} name='home-outline' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='(tournamentStack)'
        options={{
          headerShown: false,
          title: `Torneos`,
          tabBarIcon: ({ color }) => (
            <WinnixIcon size={28} name='football-outline' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='calendar/index'
        options={{
          title: `Calendario`,
          tabBarIcon: ({ color }) => (
            <WinnixIcon size={28} name='calendar-outline' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='notifications/index'
        options={{
          title: `Notificaciones`,
          tabBarIcon: ({ color }) => (
            <WinnixIcon size={28} name='notifications-outline' color={color} />
          ),
        }}
      />

      {/* Explorar: oculto en este MVP — se habilitará cuando esté lista la vista pública
      <Tabs.Screen
        name='(exploreStack)'
        options={{
          headerShown: false,
          title: `Explorar`,
          tabBarIcon: ({ color }) => <WinnixIcon size={28} name='grid-outline' color={color} />,
        }}
      />
      */}

      {/* (exploreStack) debe estar declarado aunque esté oculto para que Expo Router
          no arroje error por la ruta huérfana */}
      <Tabs.Screen
        name='(exploreStack)'
        options={{
          headerShown: false,
          href: null,
          tabBarItemStyle: { display: 'none', height: 0 },
        }}
      />
    </Tabs>
  );
}
