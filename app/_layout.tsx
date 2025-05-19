import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/shared/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    PretendardThin: require('@/assets/fonts/Pretendard-Thin.ttf'),
    PretendardExtraLight: require('@/assets/fonts/Pretendard-ExtraLight.ttf'),
    PretendardLight: require('@/assets/fonts/Pretendard-Light.ttf'),
    PretendardRegular: require('@/assets/fonts/Pretendard-Regular.ttf'),
    PretendardMedium: require('@/assets/fonts/Pretendard-Medium.ttf'),
    PretendardSemiBold: require('@/assets/fonts/Pretendard-SemiBold.ttf'),
    PretendardBold: require('@/assets/fonts/Pretendard-Bold.ttf'),
    PretendardExtraBold: require('@/assets/fonts/Pretendard-ExtraBold.ttf'),
    PretendardBlack: require('@/assets/fonts/Pretendard-Black.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
