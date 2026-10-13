import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NOTIFICATION_CATEGORY_FILTERS } from '@/core/notifications/constants/notifications-config';
import { NotificationCategory } from '@/core/notifications/interface/notification.interface';
import { Colors } from '@/presentation/styles/colors';

interface Props {
  selectedCategory: NotificationCategory | 'UNREAD';
  onSelectCategory: (cat: NotificationCategory | 'UNREAD') => void;
  unreadCount?: number;
}

export const NotificationFilterChips: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  unreadCount = 0,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        style={styles.scrollView}
      >
        {NOTIFICATION_CATEGORY_FILTERS.map((filter) => {
          const isSelected = selectedCategory === filter.id;
          const isUnreadFilter = filter.id === 'UNREAD';

          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => onSelectCategory(filter.id as any)}
              activeOpacity={0.75}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
              >
                {filter.label}
              </Text>
              {isUnreadFilter && unreadCount > 0 && (
                <Text
                  style={[
                    styles.badgeCount,
                    isSelected ? styles.badgeCountSelected : styles.badgeCountUnselected,
                  ]}
                >
                  {unreadCount}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 8,
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 0,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    height: 40,
  },
  chipSelected: {
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  chipUnselected: {
    backgroundColor: Colors.surface_elevated,
    borderColor: Colors.surface_pressed,
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  chipTextSelected: {
    color: Colors.surface_screen,
  },
  chipTextUnselected: {
    color: Colors.text_secondary,
  },
  badgeCount: {
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  badgeCountSelected: {
    backgroundColor: Colors.surface_screen,
    color: Colors.brand_primary,
  },
  badgeCountUnselected: {
    backgroundColor: Colors.orange_400,
    color: Colors.surface_screen,
  },
});
