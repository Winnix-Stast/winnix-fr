import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NotificationItem } from '@/core/notifications/interface/notification.interface';
import { NotificationModal } from '@/presentation/components/customs';
import { useNotifications } from '@/presentation/hooks/notifications/useNotifications';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { NotificationEmptyState } from './components/NotificationEmptyState';
import { NotificationFilterChips } from './components/NotificationFilterChips';
import { NotificationItemCard } from './components/NotificationItemCard';

export const NotificationsView: React.FC = () => {
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    onRefresh,
    selectedCategory,
    setSelectedCategory,
    markAsRead,
    markAllAsRead,
    respondAction,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSubmittingAction,
  } = useNotifications();

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeftGroup}>
          <Text style={styles.headerTitle}>NOTIFICACIONES</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllAsRead}
            style={styles.markAllBtn}
            activeOpacity={0.75}
          >
            <WinnixIcon
              name='checkmark-done-outline'
              size={16}
              color={Colors.brand_primary}
            />
            <Text style={styles.markAllBtnText}>Marcar leídas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter Chips */}
      <NotificationFilterChips
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        unreadCount={unreadCount}
      />

      {/* Notifications List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.brand_primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NotificationItemCard
              item={item}
              onPressItem={(notification) => setSelectedNotification(notification)}
              onMarkAsRead={markAsRead}
            />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.paginationLoader}>
                <ActivityIndicator size='small' color={Colors.brand_primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={<NotificationEmptyState />}
        />
      )}

      {/* Modal Custom de Detalle de Notificación */}
      <NotificationModal
        visible={!!selectedNotification}
        item={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onRespondAction={(id, action) => {
          respondAction(id, action);
          setSelectedNotification(null);
        }}
        isSubmittingAction={isSubmittingAction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface_screen,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text_primary,
    letterSpacing: 0.5,
  },
  unreadBadge: {
    backgroundColor: Colors.brand_primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    color: Colors.surface_screen,
    fontSize: 11,
    fontWeight: '900',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(40, 209, 195, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.25)',
  },
  markAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brand_primary,
  },
  clearAllBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  paginationLoader: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
