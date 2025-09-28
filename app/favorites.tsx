
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { StorageCard } from '@/components/StorageCard';
import { SearchBar } from '@/components/SearchBar';
import { useStorage } from '@/hooks/useStorage';
import { colors, commonStyles } from '@/styles/commonStyles';
import { StorageItem } from '@/types/storage';

export default function FavoritesScreen() {
  const { items, deleteItem, toggleFavorite } = useStorage();
  
  const [favoriteItems, setFavoriteItems] = useState<StorageItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StorageItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type' | 'category'>('date');

  useEffect(() => {
    const favorites = items.filter(item => item.isFavorite);
    setFavoriteItems(favorites);
  }, [items]);

  useEffect(() => {
    let filtered = favoriteItems;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = favoriteItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });

    setFilteredItems(filtered);
  }, [favoriteItems, searchQuery, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteItem(id)
        },
      ]
    );
  };

  const renderHeaderRight = () => (
    <View style={styles.headerActions}>
      <Pressable
        onPress={() => {
          const nextSort = sortBy === 'date' ? 'name' : 
                          sortBy === 'name' ? 'type' : 
                          sortBy === 'type' ? 'category' : 'date';
          setSortBy(nextSort);
        }}
        style={styles.headerButton}
      >
        <IconSymbol name="arrow.up.arrow.down" size={16} color={colors.text} />
      </Pressable>
      
      <Pressable
        onPress={() => router.push('/add-item')}
        style={styles.headerButton}
      >
        <IconSymbol name="plus" size={20} color={colors.text} />
      </Pressable>
    </View>
  );

  // Group favorites by category for stats
  const favoritesByCategory = favoriteItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const favoritesByType = favoriteItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Favorites',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerRight: renderHeaderRight,
        }}
      />
      
      <View style={commonStyles.wrapper}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <IconSymbol name="heart.fill" size={32} color={colors.primary} />
              </View>
              <Text style={styles.headerTitle}>Favorite Items</Text>
              <Text style={styles.headerSubtitle}>
                {favoriteItems.length} {favoriteItems.length === 1 ? 'favorite item' : 'favorite items'}
              </Text>
            </View>

            {/* Quick Stats */}
            {favoriteItems.length > 0 && (
              <View style={styles.statsSection}>
                <Text style={styles.statsTitle}>Quick Stats</Text>
                
                {/* Category breakdown */}
                <View style={styles.statsContainer}>
                  <Text style={styles.statsSubtitle}>By Category</Text>
                  <View style={styles.statsGrid}>
                    {Object.entries(favoritesByCategory).map(([category, count]) => (
                      <View key={category} style={styles.statItem}>
                        <Text style={styles.statNumber}>{count}</Text>
                        <Text style={styles.statLabel}>{category}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Type breakdown */}
                <View style={styles.statsContainer}>
                  <Text style={styles.statsSubtitle}>By Type</Text>
                  <View style={styles.statsGrid}>
                    {Object.entries(favoritesByType).map(([type, count]) => (
                      <View key={type} style={styles.statItem}>
                        <Text style={styles.statNumber}>{count}</Text>
                        <Text style={styles.statLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Search */}
            {favoriteItems.length > 0 && (
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search favorites..."
              />
            )}

            {/* Sort Info */}
            {favoriteItems.length > 0 && (
              <View style={styles.sortInfo}>
                <Text style={styles.sortText}>
                  Sorted by {sortBy === 'date' ? 'Date' : 
                            sortBy === 'name' ? 'Name' : 
                            sortBy === 'type' ? 'Type' : 'Category'}
                </Text>
                <Text style={styles.resultCount}>
                  {filteredItems.length} of {favoriteItems.length} shown
                </Text>
              </View>
            )}

            {/* Items List */}
            {favoriteItems.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol
                  name="heart"
                  size={64}
                  color={colors.textSecondary}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>No favorites yet</Text>
                <Text style={styles.emptySubtitle}>
                  Tap the heart icon on any item to add it to your favorites
                </Text>
                <Pressable
                  onPress={() => router.push('/all-items')}
                  style={styles.browseButton}
                >
                  <IconSymbol name="list.bullet" size={20} color={colors.text} />
                  <Text style={styles.browseButtonText}>Browse All Items</Text>
                </Pressable>
              </View>
            ) : filteredItems.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol
                  name="magnifyingglass"
                  size={48}
                  color={colors.textSecondary}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>
                  Try adjusting your search terms
                </Text>
              </View>
            ) : (
              <View style={styles.itemsList}>
                {filteredItems.map((item) => (
                  <StorageCard
                    key={item.id}
                    item={item}
                    onPress={() => router.push(`/item/${item.id}`)}
                    onFavorite={() => toggleFavorite(item.id)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </View>
            )}

            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
    marginVertical: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sortInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sortText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  resultCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: colors.backgroundAlt,
  },
  itemsList: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});
