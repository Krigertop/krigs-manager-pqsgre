
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { StorageCard } from '@/components/StorageCard';
import { SearchBar } from '@/components/SearchBar';
import { useStorage } from '@/hooks/useStorage';
import { colors, commonStyles } from '@/styles/commonStyles';
import { StorageItem } from '@/types/storage';

export default function AllItemsScreen() {
  const { items, deleteItem, toggleFavorite } = useStorage();
  
  const [filteredItems, setFilteredItems] = useState<StorageItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type' | 'category'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'notes' | 'files' | 'links' | 'images'>('all');

  useEffect(() => {
    let filtered = items;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type/favorite filter
    if (filterBy !== 'all') {
      if (filterBy === 'favorites') {
        filtered = filtered.filter(item => item.isFavorite);
      } else {
        filtered = filtered.filter(item => item.type === filterBy.slice(0, -1)); // Remove 's' from end
      }
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
  }, [items, searchQuery, sortBy, filterBy]);

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

  const getFilterCount = (filter: typeof filterBy) => {
    switch (filter) {
      case 'favorites':
        return items.filter(item => item.isFavorite).length;
      case 'notes':
        return items.filter(item => item.type === 'note').length;
      case 'files':
        return items.filter(item => item.type === 'file').length;
      case 'links':
        return items.filter(item => item.type === 'link').length;
      case 'images':
        return items.filter(item => item.type === 'image').length;
      default:
        return items.length;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'All Items',
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
            
            {/* Stats Header */}
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>All Items</Text>
              <Text style={styles.statsSubtitle}>
                {filteredItems.length} of {items.length} items
              </Text>
            </View>

            {/* Search */}
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search all items..."
            />

            {/* Filter Tabs */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {[
                { key: 'all', label: 'All', icon: 'list.bullet' },
                { key: 'favorites', label: 'Favorites', icon: 'heart.fill' },
                { key: 'notes', label: 'Notes', icon: 'doc.text' },
                { key: 'files', label: 'Files', icon: 'folder' },
                { key: 'links', label: 'Links', icon: 'link' },
                { key: 'images', label: 'Images', icon: 'photo' },
              ].map((filter) => (
                <Pressable
                  key={filter.key}
                  style={[
                    styles.filterTab,
                    filterBy === filter.key && styles.filterTabActive,
                  ]}
                  onPress={() => setFilterBy(filter.key as typeof filterBy)}
                >
                  <IconSymbol
                    name={filter.icon as any}
                    size={16}
                    color={filterBy === filter.key ? colors.text : colors.textSecondary}
                  />
                  <Text style={[
                    styles.filterTabText,
                    filterBy === filter.key && styles.filterTabTextActive,
                  ]}>
                    {filter.label}
                  </Text>
                  <View style={[
                    styles.filterBadge,
                    filterBy === filter.key && styles.filterBadgeActive,
                  ]}>
                    <Text style={[
                      styles.filterBadgeText,
                      filterBy === filter.key && styles.filterBadgeTextActive,
                    ]}>
                      {getFilterCount(filter.key as typeof filterBy)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Sort Info */}
            <View style={styles.sortInfo}>
              <Text style={styles.sortText}>
                Sorted by {sortBy === 'date' ? 'Date' : 
                          sortBy === 'name' ? 'Name' : 
                          sortBy === 'type' ? 'Type' : 'Category'}
              </Text>
              <Text style={styles.resultCount}>
                {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
              </Text>
            </View>

            {/* Items List */}
            {filteredItems.length === 0 ? (
              <View style={styles.emptyState}>
                <IconSymbol
                  name="tray"
                  size={48}
                  color={colors.textSecondary}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>
                  {searchQuery || filterBy !== 'all' ? 'No items found' : 'No items yet'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery || filterBy !== 'all'
                    ? 'Try adjusting your search or filter'
                    : 'Add your first item to get started'
                  }
                </Text>
                {!searchQuery && filterBy === 'all' && (
                  <Pressable
                    onPress={() => router.push('/add-item')}
                    style={styles.addButton}
                  >
                    <IconSymbol name="plus" size={20} color={colors.text} />
                    <Text style={styles.addButtonText}>Add First Item</Text>
                  </Pressable>
                )}
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
  statsHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  filterContainer: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    marginRight: 8,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: colors.text,
  },
  filterBadge: {
    backgroundColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: colors.backgroundAlt,
  },
  filterBadgeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterBadgeTextActive: {
    color: colors.text,
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
