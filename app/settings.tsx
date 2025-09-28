
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { useStorage } from '@/hooks/useStorage';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { getStats, refreshData } = useStorage();
  const stats = getStats();

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your items and cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['krigs_storage_data', 'krigs_categories_data']);
              await refreshData();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export functionality will be available in a future update. Your data is safely stored locally on your device.',
      [{ text: 'OK' }]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Import functionality will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      
      <View style={commonStyles.wrapper}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            
            {/* App Info */}
            <View style={styles.section}>
              <View style={styles.appHeader}>
                <View style={styles.appIcon}>
                  <Text style={styles.appIconText}>K</Text>
                </View>
                <View style={styles.appInfo}>
                  <Text style={styles.appName}>KrigS</Text>
                  <Text style={styles.appSubtitle}>Kriger Storage</Text>
                  <Text style={styles.appVersion}>Version 1.0.0</Text>
                </View>
              </View>
            </View>

            {/* Storage Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Storage Statistics</Text>
              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Total Items</Text>
                  <Text style={styles.statValue}>{stats.totalItems}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Categories</Text>
                  <Text style={styles.statValue}>{stats.categories.length}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Favorites</Text>
                  <Text style={styles.statValue}>
                    {stats.recentItems.filter(item => item.isFavorite).length}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Storage Used</Text>
                  <Text style={styles.statValue}>{formatBytes(stats.totalSize)}</Text>
                </View>
              </View>
            </View>

            {/* Data Management */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Management</Text>
              
              <Pressable style={styles.menuItem} onPress={handleExportData}>
                <View style={styles.menuItemLeft}>
                  <IconSymbol name="square.and.arrow.up" size={20} color={colors.accent} />
                  <Text style={styles.menuItemText}>Export Data</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleImportData}>
                <View style={styles.menuItemLeft}>
                  <IconSymbol name="square.and.arrow.down" size={20} color={colors.accent} />
                  <Text style={styles.menuItemText}>Import Data</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </Pressable>

              <Pressable style={styles.menuItem} onPress={() => refreshData()}>
                <View style={styles.menuItemLeft}>
                  <IconSymbol name="arrow.clockwise" size={20} color={colors.success} />
                  <Text style={styles.menuItemText}>Refresh Data</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              
              <View style={styles.aboutCard}>
                <Text style={styles.aboutText}>
                  KrigS (Kriger Storage) is your personal file and note manager designed for 
                  convenient offline storage and cross-device accessibility. All your data 
                  is stored locally on your device for privacy and security.
                </Text>
                
                <Text style={styles.aboutFeatures}>Features:</Text>
                <Text style={styles.featureItem}>• Offline storage</Text>
                <Text style={styles.featureItem}>• Multiple content types</Text>
                <Text style={styles.featureItem}>• Category organization</Text>
                <Text style={styles.featureItem}>• Search functionality</Text>
                <Text style={styles.featureItem}>• Tag-based organization</Text>
              </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>
              
              <Button
                onPress={handleClearAllData}
                variant="outline"
                style={[styles.dangerButton, { borderColor: colors.error }]}
                textStyle={{ color: colors.error }}
              >
                Clear All Data
              </Button>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: colors.text,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  aboutCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aboutText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  aboutFeatures: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    paddingLeft: 8,
  },
  dangerButton: {
    backgroundColor: 'transparent',
  },
  bottomSpacing: {
    height: 40,
  },
});
