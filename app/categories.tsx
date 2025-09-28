
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchBar } from '@/components/SearchBar';
import { useStorage } from '@/hooks/useStorage';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function CategoriesScreen() {
  const { categories, getItemsByCategory } = useStorage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Categories',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      />
      
      <View style={commonStyles.wrapper}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>All Categories</Text>
              <Text style={styles.headerSubtitle}>
                Organize your items by category
              </Text>
            </View>

            {/* Search */}
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search categories..."
            />

            {/* Categories Grid */}
            <View style={styles.categoriesGrid}>
              {filteredCategories.length === 0 ? (
                <View style={styles.emptyState}>
                  <IconSymbol
                    name="folder"
                    size={48}
                    color={colors.textSecondary}
                    style={styles.emptyIcon}
                  />
                  <Text style={styles.emptyTitle}>
                    {searchQuery ? 'No categories found' : 'No categories yet'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'Categories will appear here as you add items'
                    }
                  </Text>
                </View>
              ) : (
                filteredCategories.map((category) => {
                  const categoryItems = getItemsByCategory(category.name);
                  return (
                    <View key={category.id} style={styles.categoryWrapper}>
                      <CategoryCard
                        category={{
                          ...category,
                          itemCount: categoryItems.length,
                        }}
                        onPress={() => router.push(`/category/${encodeURIComponent(category.name)}`)}
                      />
                      
                      {/* Category Stats */}
                      <View style={styles.categoryStats}>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>{categoryItems.length}</Text>
                          <Text style={styles.statLabel}>Items</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>
                            {categoryItems.filter(item => item.isFavorite).length}
                          </Text>
                          <Text style={styles.statLabel}>Favorites</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <Text style={styles.quickStatsTitle}>Quick Stats</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statCardNumber}>{categories.length}</Text>
                  <Text style={styles.statCardLabel}>Total Categories</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statCardNumber}>
                    {categories.reduce((sum, cat) => sum + getItemsByCategory(cat.name).length, 0)}
                  </Text>
                  <Text style={styles.statCardLabel}>Total Items</Text>
                </View>
              </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  categoriesGrid: {
    marginTop: 24,
  },
  categoryWrapper: {
    marginBottom: 16,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
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
  quickStats: {
    marginTop: 32,
  },
  quickStatsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
  },
  statCardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  statCardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});
