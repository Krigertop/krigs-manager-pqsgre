
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput, Linking } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { useStorage } from '@/hooks/useStorage';
import { colors, commonStyles } from '@/styles/commonStyles';
import { StorageItem } from '@/types/storage';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, updateItem, deleteItem, toggleFavorite } = useStorage();
  
  const [item, setItem] = useState<StorageItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  useEffect(() => {
    const foundItem = items.find(i => i.id === id);
    if (foundItem) {
      setItem(foundItem);
      setEditTitle(foundItem.title);
      setEditContent(foundItem.content);
      setEditTags(foundItem.tags.join(', '));
    }
  }, [id, items]);

  const handleSave = async () => {
    if (!item) return;
    
    try {
      const tagArray = editTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await updateItem(item.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
        tags: tagArray,
      });

      setIsEditing(false);
      Alert.alert('Success', 'Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item.');
    }
  };

  const handleDelete = () => {
    if (!item) return;
    
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(item.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleOpenUrl = async () => {
    if (!item?.url) return;
    
    try {
      const supported = await Linking.canOpenURL(item.url);
      if (supported) {
        await Linking.openURL(item.url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return 'doc.text';
      case 'file': return 'folder';
      case 'link': return 'link';
      case 'image': return 'photo';
      default: return 'doc';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note': return colors.primary;
      case 'file': return colors.accent;
      case 'link': return colors.success;
      case 'image': return '#8B5CF6';
      default: return colors.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!item) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <Text style={commonStyles.text}>Item not found</Text>
        <Button onPress={() => router.back()} style={{ marginTop: 20 }}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: isEditing ? 'Edit Item' : item.title,
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => toggleFavorite(item.id)}
                style={styles.headerButton}
              >
                <IconSymbol
                  name={item.isFavorite ? 'heart.fill' : 'heart'}
                  size={20}
                  color={item.isFavorite ? colors.primary : colors.textSecondary}
                />
              </Pressable>
              
              <Pressable
                onPress={() => setIsEditing(!isEditing)}
                style={styles.headerButton}
              >
                <IconSymbol
                  name={isEditing ? 'xmark' : 'pencil'}
                  size={20}
                  color={colors.text}
                />
              </Pressable>
            </View>
          ),
        }}
      />
      
      <View style={commonStyles.wrapper}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            
            {/* Item Header */}
            <View style={styles.header}>
              <View style={styles.typeContainer}>
                <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) }]}>
                  <IconSymbol
                    name={getTypeIcon(item.type) as any}
                    size={24}
                    color={colors.text}
                  />
                </View>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              </View>
              
              {item.emoji && (
                <Text style={styles.emoji}>{item.emoji}</Text>
              )}
            </View>

            {/* Title */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Title</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Enter title..."
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={styles.title}>{item.title}</Text>
              )}
            </View>

            {/* URL (if applicable) */}
            {item.url && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>URL</Text>
                <Pressable onPress={handleOpenUrl} style={styles.urlContainer}>
                  <IconSymbol name="link" size={16} color={colors.accent} />
                  <Text style={styles.urlText} numberOfLines={1}>
                    {item.url}
                  </Text>
                  <IconSymbol name="arrow.up.right" size={16} color={colors.accent} />
                </Pressable>
              </View>
            )}

            {/* Content */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {item.type === 'note' ? 'Content' : 'Description'}
              </Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editContent}
                  onChangeText={setEditContent}
                  placeholder="Enter content..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.content}>{item.content}</Text>
              )}
            </View>

            {/* Tags */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editTags}
                  onChangeText={setEditTags}
                  placeholder="Enter tags separated by commas..."
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <View style={styles.tagsContainer}>
                  {item.tags.length > 0 ? (
                    item.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noTagsText}>No tags</Text>
                  )}
                </View>
              )}
            </View>

            {/* Metadata */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information</Text>
              <View style={styles.metadataContainer}>
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Created:</Text>
                  <Text style={styles.metadataValue}>{formatDate(item.createdAt)}</Text>
                </View>
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Updated:</Text>
                  <Text style={styles.metadataValue}>{formatDate(item.updatedAt)}</Text>
                </View>
                {item.size && (
                  <View style={styles.metadataRow}>
                    <Text style={styles.metadataLabel}>Size:</Text>
                    <Text style={styles.metadataValue}>
                      {(item.size / 1024).toFixed(1)} KB
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            {isEditing ? (
              <View style={styles.actionButtons}>
                <Button
                  onPress={handleSave}
                  style={styles.saveButton}
                  textStyle={styles.saveButtonText}
                >
                  Save Changes
                </Button>
                <Button
                  onPress={() => setIsEditing(false)}
                  variant="outline"
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
              </View>
            ) : (
              <View style={styles.actionButtons}>
                <Button
                  onPress={handleDelete}
                  variant="outline"
                  style={[styles.deleteButton, { borderColor: colors.error }]}
                  textStyle={{ color: colors.error }}
                >
                  Delete Item
                </Button>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.5,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emoji: {
    fontSize: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 32,
  },
  content: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urlText: {
    flex: 1,
    fontSize: 14,
    color: colors.accent,
    marginHorizontal: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
  },
  noTagsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  metadataContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  metadataLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  metadataValue: {
    fontSize: 14,
    color: colors.text,
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
  actionButtons: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  cancelButton: {
    borderColor: colors.border,
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
  bottomSpacing: {
    height: 40,
  },
});
