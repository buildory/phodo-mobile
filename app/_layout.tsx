import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/shared/providers/AuthProvider';
import { ToastProvider } from '@/shared/providers/ToastProvider';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}

function InnerLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
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

  const { user, loading } = useAuth();
  const ready = fontsLoaded && !loading;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (ready && !user) {
      requestAnimationFrame(() => {
        router.replace('/login');
      });
    }
  }, [ready, user]);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <ToastProvider />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
