import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { useUserProfile } from "@/entities/uesrs/model/useUserProfile";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { ProfileView } from "@/features/profiles/ui/ProfileView";
import "@/shared/styles/global.css";

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { profile: currentUserProfile } = useCurrentUserStore();
  const { data: userProfile, isLoading, error } = useUserProfile(userId);
  
  const isOwnProfile = currentUserProfile?.id === userId;

  if (isLoading) {
    return (
      <View className="flex-1 bg-bg-layer-default items-center justify-center">
        <ActivityIndicator size="large" color="#9E77ED" />
        <Text className="mt-16 body2-regular text-fg-neutral-muted">프로필을 불러오는 중...</Text>
      </View>
    );
  }

  if (error || !userProfile) {
    return (
      <View className="flex-1 bg-bg-layer-default items-center justify-center">
        <Text className="heading1-semiBold text-fg-neutral-solid">프로필을 찾을 수 없습니다</Text>
        <Text className="mt-8 body2-regular text-fg-neutral-muted">존재하지 않는 사용자이거나 접근 권한이 없습니다.</Text>
        <TouchableOpacity 
          className="px-16 py-12 mt-24 bg-bg-brand rounded-8"
          onPress={() => router.back()}
        >
          <Text className="text-white body2-medium">뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg-layer-default">
      <View className="flex flex-row items-center p-16 mt-20">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-8"
        >
          <IconSymbol name="chevron.left" size={20} color="#717680" />
        </TouchableOpacity>
        <Text className="heading2-semiBold">{userProfile?.nickname || "사용자"}님 프로필</Text>
        {isOwnProfile ? (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/my-page/setting")}
            className="p-8"
          >
            <IconSymbol name="line.3.horizontal" size={20} color="#717680" />
          </TouchableOpacity>
        ) : (
          <View className="w-36" />
        )}
      </View>
      <ProfileView
        profile={userProfile}
        isOwnProfile={isOwnProfile}
        onBack={() => router.back()}
      />
    </View>
  );
} 