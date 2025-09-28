
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { CategoryCard } from '@/components/CategoryCard';
import { StorageCard } from '@/components/StorageCard';
import { SearchBar } from '@/components/SearchBar';
import { useStorage } from '@/hooks/useStorage';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function HomeScreen() {
  const {
    items,
    categories,
    loading,
    deleteItem,
    toggleFavorite,
    searchItems,
    getStats,
  } = useStorage();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredItems(searchItems(searchQuery));
    } else {
      setFilteredItems(items.slice(0, 10)); // Show recent 10 items
    }
  }, [searchQuery, items, searchItems]);

  const stats = getStats();

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
    <Pressable
      onPress={() => router.push('/add-item')}
      style={styles.headerButton}
    >
      <IconSymbol name="plus" color={colors.text} size={24} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => router.push('/settings')}
      style={styles.headerButton}
    >
      <IconSymbol name="gear" color={colors.text} size={24} />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <Text style={commonStyles.text}>Loading KrigS...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'KrigS',
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
          headerLeft: renderHeaderLeft,
        }}
      />
      
      <View style={commonStyles.wrapper}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to KrigS</Text>
            <Text style={styles.welcomeSubtitle}>
              Your personal storage manager
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalItems}</Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.categories.length}</Text>
                <Text style={styles.statLabel}>Categories</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {items.filter(item => item.isFavorite).length}
                </Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              <Pressable 
                style={styles.quickAction}
                onPress={() => router.push('/favorites')}
              >
                <IconSymbol name="heart.fill" size={24} color={colors.primary} />
                <Text style={styles.quickActionText}>Favorites</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickAction}
                onPress={() => router.push('/all-items')}
              >
                <IconSymbol name="list.bullet" size={24} color={colors.accent} />
                <Text style={styles.quickActionText}>All Items</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickAction}
                onPress={() => router.push('/categories')}
              >
                <IconSymbol name="folder" size={24} color={colors.success} />
                <Text style={styles.quickActionText}>Categories</Text>
              </Pressable>
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <Pressable onPress={() => router.push('/categories')}>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onPress={() => router.push(`/category/${encodeURIComponent(category.name)}`)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Recent Items Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? `Search Results (${filteredItems.length})` : 'Recent Items'}
              </Text>
              {!searchQuery && (
                <Pressable onPress={() => router.push('/all-items')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </Pressable>
              )}
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
                  {searchQuery ? 'No results found' : 'No items yet'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Tap the + button to add your first item'
                  }
                </Text>
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

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    minWidth: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingHorizontal: 8,
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
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
  },
  bottomSpacing: {
    height: 40,
  },
});
