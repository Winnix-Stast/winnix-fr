import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '@/presentation/styles/colors';

interface CustomPaginationInfinityScrollProps<T> extends Partial<FlatListProps<T>> {
  data: T[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading?: boolean;
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  emptyMessage?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const CustomPaginationInfinityScroll = <T,>({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  renderItem,
  emptyMessage = 'No se encontraron resultados',
  onRefresh,
  isRefreshing = false,
  ...rest
}: CustomPaginationInfinityScrollProps<T>) => {
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ListFooterContent = useMemo(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size='small' color={Colors.brand_primary} />
      </View>
    );
  }, [isFetchingNextPage]);

  const ListEmptyContent = useMemo(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage.toUpperCase()}</Text>
      </View>
    );
  }, [isLoading, emptyMessage]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item: any, index) => item?._id || item?.id || index.toString()}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={ListFooterContent}
      ListEmptyComponent={ListEmptyContent}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      contentContainerStyle={[
        styles.listContent,
        data.length === 0 && styles.listEmptyStyle,
        rest.contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  listEmptyStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.text_tertiary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
  },
});
