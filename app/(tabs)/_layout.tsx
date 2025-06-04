import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/shared/ui/HapticTab";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { Colors } from "@/shared/styles/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.purple[500],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: undefined,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "주변",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "설정",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
