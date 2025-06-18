import { Stack } from "expo-router";
import { SafeAreaView, StatusBar } from "react-native";

export default function ProjectLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      />
    </SafeAreaView>
  );
}
