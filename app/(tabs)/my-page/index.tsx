import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { ProfileView } from "@/features/profiles/ui/ProfileView";
import { IconSymbol } from "@/shared/ui/IconSymbol";

export default function MyPageScreen() {
  const { profile: currentUser } = useCurrentUserStore();

  if (!currentUser) {
    return (
      <View className="flex-1 bg-bg-layer-default items-center justify-center">
        <Text className="body1-regular text-text-secondary">사용자 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg-layer-default">
      {/* 헤더 */}
      <View className="flex flex-row items-center justify-between p-16 mt-20">
        <Text className="heading2-semiBold">{currentUser?.nickname || "사용자"}님 프로필</Text>
        <View className="flex flex-row gap-12">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/my-page/edit-profile")}
            className="p-8"
          >
            <IconSymbol name="pencil" size={20} color="#717680" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/my-page/setting")}
            className="p-8"
          >
            <IconSymbol name="line.3.horizontal" size={20} color="#717680" />
          </TouchableOpacity>
        </View>
      </View>
      <ProfileView
        profile={currentUser}
        isOwnProfile={true}
        onBack={() => router.back()}
      />
    </View>
  );
}
