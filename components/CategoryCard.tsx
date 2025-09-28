
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Category } from '@/types/storage';
import { colors } from '@/styles/commonStyles';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.count}>
          {category.itemCount} {category.itemCount === 1 ? 'item' : 'items'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 140,
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
