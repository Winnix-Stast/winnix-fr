import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TeamEditTabType } from '@/presentation/hooks/teams/useEditTeam';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles';

interface Props {
  activeTab: TeamEditTabType;
  onSelectTab: (tab: TeamEditTabType) => void;
}

const TABS = [
  { key: 'ajustes' as const, label: 'Ajustes', icon: 'settings-outline' as const },
  { key: 'multimedia' as const, label: 'Escudo', icon: 'image-outline' as const },
  { key: 'jugadores' as const, label: 'Plantilla', icon: 'people-outline' as const },
  { key: 'info' as const, label: 'Estadísticas', icon: 'stats-chart-outline' as const },
];

export const TeamEditTabBar: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            style={styles.tabButton}
          >
            <WinnixIcon
              name={tab.icon}
              size={18}
              color={isActive ? Colors.brand_primary : Colors.text_tertiary}
              style={{ marginBottom: 4 }}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.tabIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text_tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: Colors.brand_primary,
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '60%',
    height: 3,
    backgroundColor: Colors.brand_primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
