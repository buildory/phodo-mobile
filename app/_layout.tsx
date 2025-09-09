import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth, ToastProvider, QueryProvider, BottomSheetProvider } from '@/shared/providers';
import { useColorScheme } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { usePushNotificationListeners } from '@/shared/hooks/usePushNotificationListeners'
import { useCurrentUser } from '@/entities/uesrs/model';
import * as Notifications from 'expo-notifications';
import '@/shared/styles/global.css';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {

  return (
    <QueryProvider>
      <AuthProvider>
        <BottomSheetProvider>
          <InnerLayout />
        </BottomSheetProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

function InnerLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  useCurrentUser();
  usePushNotificationListeners();


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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pathname === '/' || 
          pathname === '/shooting-history' || 
          pathname === '/chat' || 
          pathname === '/my-page') {
        BackHandler.exitApp();
        return true;
      }
      
      if (pathname.startsWith('/chat/') && pathname !== '/chat') {
        router.replace('/chat');
        return true;
      }
    
      return false;
    });
    
    return () => backHandler.remove();
  }, [pathname, router]);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="user" options={{ headerShown: false }} />
        <Stack.Screen 
          name="webview" 
          options={{ 
            presentation: "modal",
            headerShown: false 
          }} 
        />
      </Stack>
      <ToastProvider />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
