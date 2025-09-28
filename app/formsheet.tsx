import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router, Stack } from "expo-router";
import { Button } from "@/components/button";
import { colors } from "@/styles/commonStyles";

export default function FormSheetDemo() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Form Sheet Modal",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerLeft: () => (
            <Button variant="ghost" onPress={() => router.back()}>
              Close
            </Button>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Form Sheet Modal</Text>
        <Text style={styles.description}>
          This is a form sheet presentation style
        </Text>
        <View style={styles.content}>
          <Text style={styles.property}>Form Sheet Features:</Text>
          <Text style={styles.detail}>• Partial screen coverage</Text>
          <Text style={styles.detail}>• Draggable sheet</Text>
          <Text style={styles.detail}>• Multiple detent levels</Text>
          <Text style={styles.detail}>• Rounded corners</Text>
          <Text style={styles.detail}>• Grab handle visible</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: colors.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  content: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
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
