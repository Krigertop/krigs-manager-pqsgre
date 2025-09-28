import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router, Stack } from "expo-router";
import { Button } from "@/components/button";
import { colors } from "@/styles/commonStyles";

export default function TransparentModalDemo() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Transparent Modal",
          presentation: "transparentModal",
          headerShown: false,
        }}
      />
      <Pressable style={styles.backdrop} onPress={() => router.back()}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Transparent Modal</Text>
              <Button variant="ghost" onPress={() => router.back()}>
                ✕
              </Button>
            </View>
            <Text style={styles.description}>
              This modal has a transparent background overlay
            </Text>
            <View style={styles.content}>
              <Text style={styles.property}>Features:</Text>
              <Text style={styles.detail}>• Transparent backdrop</Text>
              <Text style={styles.detail}>• Tap outside to close</Text>
              <Text style={styles.detail}>• Centered presentation</Text>
              <Text style={styles.detail}>• Custom styling</Text>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: 20,
    maxWidth: 400,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: colors.textSecondary,
  },
  content: {
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  property: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.primary,
  },
  detail: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 4,
  },
});
