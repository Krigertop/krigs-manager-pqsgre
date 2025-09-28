
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { StorageItem } from '@/types/storage';
import { colors } from '@/styles/commonStyles';
import { krigSColors } from '@/constants/Colors';

interface StorageCardProps {
  item: StorageItem;
  onPress: () => void;
  onFavorite: () => void;
  onDelete: () => void;
}

export const StorageCard: React.FC<StorageCardProps> = ({
  item,
  onPress,
  onFavorite,
  onDelete,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return 'doc.text';
      case 'file':
        return 'folder';
      case 'link':
        return 'link';
      case 'image':
        return 'photo';
      default:
        return 'doc';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note':
        return krigSColors.primary;
      case 'file':
        return krigSColors.gold;
      case 'link':
        return krigSColors.success;
      case 'image':
        return '#8B5CF6';
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) }]}>
            <IconSymbol
              name={getTypeIcon(item.type) as any}
              size={16}
              color={colors.text}
            />
          </View>
          <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
        </View>
        
        <View style={styles.actions}>
          <Pressable onPress={onFavorite} style={styles.actionButton}>
            <IconSymbol
              name={item.isFavorite ? 'heart.fill' : 'heart'}
              size={18}
              color={item.isFavorite ? krigSColors.primary : colors.textSecondary}
            />
          </Pressable>
          <Pressable onPress={onDelete} style={styles.actionButton}>
            <IconSymbol
              name="trash"
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.emoji} {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.content}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.tags}>
          {item.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {item.tags.length > 2 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 2}</Text>
          )}
        </View>
        
        <View style={styles.meta}>
          {item.size && (
            <Text style={styles.metaText}>{formatSize(item.size)}</Text>
          )}
          <Text style={styles.metaText}>{formatDate(item.updatedAt)}</Text>
        </View>
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
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.4)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  tagText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  meta: {
    alignItems: 'flex-end',
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
