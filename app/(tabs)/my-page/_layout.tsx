import { Stack } from "expo-router";

export default function MyPageLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "마이페이지" , headerShown: false}} />
      <Stack.Screen name="edit-profile" options={{ title: "프로필 수정" }} />
      <Stack.Screen name="setting" options={{ title: "설정" }} />
    </Stack>
  );
}