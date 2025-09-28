import "react-native-reanimated";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(220, 38, 38)", // KrigS Red
      background: "rgb(13, 13, 13)", // Dark background
      card: "rgb(31, 31, 31)", // Dark card
      text: "rgb(245, 245, 245)", // Light text
      border: "rgb(64, 64, 64)", // Dark border
      notification: "rgb(239, 68, 68)", // Red notification
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(220, 38, 38)", // KrigS Red
      background: "rgb(13, 13, 13)", // Dark background
      card: "rgb(31, 31, 31)", // Dark card
      text: "rgb(245, 245, 245)", // Light text
      border: "rgb(64, 64, 64)", // Dark border
      notification: "rgb(239, 68, 68)", // Red notification
    },
  };

  return (
    <>
      <StatusBar style="light" animated />
      <ThemeProvider value={CustomDarkTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <WidgetProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "rgb(13, 13, 13)" },
              }}
            >
              {/* Main screens */}
              <Stack.Screen name="index" />
              <Stack.Screen name="add-item" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="categories" />
              <Stack.Screen name="all-items" />
              <Stack.Screen name="favorites" />
              
              {/* Dynamic routes */}
              <Stack.Screen name="item/[id]" />
              <Stack.Screen name="category/[name]" />
              
              {/* Modal screens */}
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="formsheet"
                options={{
                  presentation: "formSheet",
                  sheetGrabberVisible: true,
                  sheetAllowedDetents: [0.5, 0.8, 1.0],
                  sheetCornerRadius: 20,
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="transparent-modal"
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                }}
              />
            </Stack>
          </WidgetProvider>
          <SystemBars style="light" />
        </GestureHandlerRootView>
      </ThemeProvider>
    </>
  );
}
