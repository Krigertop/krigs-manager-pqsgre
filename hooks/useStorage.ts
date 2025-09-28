
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageItem, Category, StorageStats } from '@/types/storage';

const STORAGE_KEY = 'krigs_storage_data';
const CATEGORIES_KEY = 'krigs_categories_data';

export const useStorage = () => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Default categories
  const defaultCategories: Category[] = [
    { id: '1', name: 'Notes', emoji: '📝', color: '#DC2626', itemCount: 0 },
    { id: '2', name: 'Files', emoji: '📁', color: '#F59E0B', itemCount: 0 },
    { id: '3', name: 'Links', emoji: '🔗', color: '#10B981', itemCount: 0 },
    { id: '4', name: 'Images', emoji: '🖼️', color: '#8B5CF6', itemCount: 0 },
  ];

  // Load data from AsyncStorage
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(CATEGORIES_KEY),
      ]);

      if (itemsData) {
        const parsedItems = JSON.parse(itemsData).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        setItems(parsedItems);
      }

      if (categoriesData) {
        setCategories(JSON.parse(categoriesData));
      } else {
        setCategories(defaultCategories);
        await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
      }
    } catch (error) {
      console.error('Error loading storage data:', error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save items to AsyncStorage
  const saveItems = useCallback(async (newItems: StorageItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
      updateCategoryCounts(newItems);
    } catch (error) {
      console.error('Error saving items:', error);
    }
  }, []);

  // Update category counts
  const updateCategoryCounts = useCallback(async (currentItems: StorageItem[]) => {
    const updatedCategories = categories.map(category => ({
      ...category,
      itemCount: currentItems.filter(item => item.category === category.name).length,
    }));
    
    setCategories(updatedCategories);
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
    } catch (error) {
      console.error('Error updating category counts:', error);
    }
  }, [categories]);

  // Add new item
  const addItem = useCallback(async (item: Omit<StorageItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: StorageItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const newItems = [newItem, ...items];
    await saveItems(newItems);
  }, [items, saveItems]);

  // Update item
  const updateItem = useCallback(async (id: string, updates: Partial<StorageItem>) => {
    const newItems = items.map(item =>
      item.id === id
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    );
    await saveItems(newItems);
  }, [items, saveItems]);

  // Delete item
  const deleteItem = useCallback(async (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    await saveItems(newItems);
  }, [items, saveItems]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      await updateItem(id, { isFavorite: !item.isFavorite });
    }
  }, [items, updateItem]);

  // Get items by category
  const getItemsByCategory = useCallback((categoryName: string) => {
    return items.filter(item => item.category === categoryName);
  }, [items]);

  // Get favorite items
  const getFavoriteItems = useCallback(() => {
    return items.filter(item => item.isFavorite);
  }, [items]);

  // Search items
  const searchItems = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.content.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [items]);

  // Get storage stats
  const getStats = useCallback((): StorageStats => {
    const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0);
    const recentItems = items
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);

    return {
      totalItems: items.length,
      totalSize,
      categories,
      recentItems,
    };
  }, [items, categories]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    items,
    categories,
    loading,
    addItem,
    updateItem,
    deleteItem,
    toggleFavorite,
    getItemsByCategory,
    getFavoriteItems,
    searchItems,
    getStats,
    refreshData: loadData,
  };
};
