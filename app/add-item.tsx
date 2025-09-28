
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { useStorage } from '@/hooks/useStorage';
import { colors, commonStyles } from '@/styles/commonStyles';
import { emojies } from '@/constants/Colors';

const ITEM_TYPES = [
  { id: 'note', name: 'Note', icon: 'doc.text', color: colors.primary },
  { id: 'file', name: 'File', icon: 'folder', color: colors.accent },
  { id: 'link', name: 'Link', icon: 'link', color: colors.success },
  { id: 'image', name: 'Image', icon: 'photo', color: '#8B5CF6' },
];

export default function AddItemScreen() {
  const { addItem, categories } = useStorage();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState('note');
  const [selectedCategory, setSelectedCategory] = useState('Notes');
  const [tags, setTags] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📝');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!content.trim() && !url.trim()) {
      Alert.alert('Error', 'Please enter content or URL');
      return;
    }

    setLoading(true);
    
    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await addItem({
        title: title.trim(),
        content: content.trim(),
        type: selectedType as any,
        category: selectedCategory,
        tags: tagArray,
        emoji: selectedEmoji,
        isFavorite: false,
        url: url.trim() || undefined,
        size: selectedType === 'file' ? Math.floor(Math.random() * 1000000) : undefined,
      });

      Alert.alert('Success', 'Item added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderHeaderRight = () => (
    <Button
      onPress={handleSave}
      disabled={loading}
      loading={loading}
      size="sm"
      style={styles.saveButton}
    >
      Save
    </Button>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Item',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerRight: renderHeaderRight,
        }}
      />
      
      <View style={commonStyles.wrapper}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            
            {/* Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type</Text>
              <View style={styles.typeContainer}>
                {ITEM_TYPES.map((type) => (
                  <Pressable
                    key={type.id}
                    style={[
                      styles.typeButton,
                      selectedType === type.id && styles.typeButtonSelected,
                      { borderColor: type.color }
                    ]}
                    onPress={() => setSelectedType(type.id)}
                  >
                    <IconSymbol
                      name={type.icon as any}
                      size={20}
                      color={selectedType === type.id ? type.color : colors.textSecondary}
                    />
                    <Text style={[
                      styles.typeButtonText,
                      selectedType === type.id && { color: type.color }
                    ]}>
                      {type.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Emoji Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Emoji</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.emojiContainer}
              >
                {emojies.slice(0, 20).map((emoji, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.emojiButton,
                      selectedEmoji === emoji && styles.emojiButtonSelected
                    ]}
                    onPress={() => setSelectedEmoji(emoji)}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Title Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title..."
                placeholderTextColor={colors.textSecondary}
                maxLength={100}
              />
            </View>

            {/* URL Input (for links and files) */}
            {(selectedType === 'link' || selectedType === 'file') && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {selectedType === 'link' ? 'URL' : 'File Path/URL'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={url}
                  onChangeText={setUrl}
                  placeholder={selectedType === 'link' ? 'https://...' : 'File path or URL...'}
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}

            {/* Content Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {selectedType === 'note' ? 'Content' : 'Description'}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={content}
                onChangeText={setContent}
                placeholder={`Enter ${selectedType === 'note' ? 'content' : 'description'}...`}
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Category Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
              >
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.name && styles.categoryButtonSelected,
                      { borderColor: category.color }
                    ]}
                    onPress={() => setSelectedCategory(category.name)}
                  >
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category.name && { color: category.color }
                    ]}>
                      {category.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Tags Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <TextInput
                style={styles.input}
                value={tags}
                onChangeText={setTags}
                placeholder="Enter tags separated by commas..."
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.helperText}>
                Separate tags with commas (e.g., work, important, project)
              </Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    minWidth: 80,
  },
  typeButtonSelected: {
    backgroundColor: colors.card,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  emojiContainer: {
    paddingVertical: 8,
  },
  emojiButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emojiButtonSelected: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
  },
  emojiText: {
    fontSize: 20,
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
  categoryContainer: {
    paddingVertical: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    marginRight: 12,
  },
  categoryButtonSelected: {
    backgroundColor: colors.card,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  saveButton: {
    paddingHorizontal: 16,
  },
  bottomSpacing: {
    height: 40,
  },
});
