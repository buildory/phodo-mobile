import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/shared/ui/HapticTab";
import { IconSymbol } from "@/shared/ui/IconSymbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#9E77ED",
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
        name="shooting-history"
        options={{
          title: "촬영 내역",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="clipboard" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "채팅",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-page"
        options={{
          title: "프로필",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
