
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { StorageCard } from '@/components/StorageCard';
import { SearchBar } from '@/components/SearchBar';
import { useStorage } from '@/hooks/useStorage';
import { colors, commonStyles } from '@/styles/commonStyles';
import { StorageItem } from '@/types/storage';

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { categories, getItemsByCategory, deleteItem, toggleFavorite, searchItems } = useStorage();
  
  const [categoryItems, setCategoryItems] = useState<StorageItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StorageItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');

  const categoryName = decodeURIComponent(name || '');
  const category = categories.find(cat => cat.name === categoryName);

  useEffect(() => {
    const items = getItemsByCategory(categoryName);
    setCategoryItems(items);
    setFilteredItems(items);
  }, [categoryName, getItemsByCategory]);

  useEffect(() => {
    let items = categoryItems;
    
    if (searchQuery.trim()) {
      items = categoryItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort items
    items = [...items].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });

    setFilteredItems(items);
  }, [searchQuery, categoryItems, sortBy]);

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

  const renderSortButton = () => (
    <Pressable
      onPress={() => {
        const nextSort = sortBy === 'date' ? 'name' : sortBy === 'name' ? 'type' : 'date';
        setSortBy(nextSort);
      }}
      style={styles.sortButton}
    >
      <IconSymbol 
        name="arrow.up.arrow.down" 
        size={16} 
        color={colors.text} 
      />
      <Text style={styles.sortButtonText}>
        {sortBy === 'date' ? 'Date' : sortBy === 'name' ? 'Name' : 'Type'}
      </Text>
    </Pressable>
  );

  if (!category) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <Text style={commonStyles.text}>Category not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: categoryName,
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerRight: renderSortButton,
        }}
      />
      
      <View style={commonStyles.wrapper}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            
            {/* Category Header */}
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                  {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}
                </Text>
              </View>
            </View>

            {/* Category Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{categoryItems.length}</Text>
                <Text style={styles.statLabel}>Total Items</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {categoryItems.filter(item => item.isFavorite).length}
                </Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {new Set(categoryItems.map(item => item.type)).size}
                </Text>
                <Text style={styles.statLabel}>Types</Text>
              </View>
            </View>

            {/* Search */}
            <SearchBar 
              onSearch={handleSearch} 
              placeholder={`Search in ${categoryName}...`}
            />

            {/* Items List */}
            <View style={styles.itemsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {searchQuery ? `Search Results (${filteredItems.length})` : 'Items'}
                </Text>
                <Text style={styles.sortInfo}>
                  Sorted by {sortBy === 'date' ? 'Date' : sortBy === 'name' ? 'Name' : 'Type'}
                </Text>
              </View>

              {filteredItems.length === 0 ? (
                <View style={styles.emptyState}>
                  <IconSymbol
                    name="tray"
                    size={48}
                    color={colors.textSecondary}
                    style={styles.emptyIcon}
                  />
                  <Text style={styles.emptyTitle}>
                    {searchQuery ? 'No results found' : `No items in ${categoryName}`}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : `Add items to the ${categoryName} category to see them here`
                    }
                  </Text>
                  {!searchQuery && (
                    <Pressable
                      onPress={() => router.push('/add-item')}
                      style={styles.addButton}
                    >
                      <IconSymbol name="plus" size={20} color={colors.text} />
                      <Text style={styles.addButtonText}>Add Item</Text>
                    </Pressable>
                  )}
                </View>
              ) : (
                filteredItems.map((item) => (
                  <StorageCard
                    key={item.id}
                    item={item}
                    onPress={() => router.push(`/item/${item.id}`)}
                    onFavorite={() => toggleFavorite(item.id)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))
              )}
            </View>

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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  itemsSection: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  sortInfo: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  sortButtonText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});
