import AsyncStorage from "@react-native-async-storage/async-storage";

export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const raw = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_SUPABASE_AUTH_STORAGE_KEY ?? '');
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const userId = parsed?.user?.id;

    return userId ?? null;
  } catch (error) {
    console.error("유저 ID 조회 실패:", error);
    return null;
  }
};
