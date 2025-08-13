import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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
      <SafeAreaView className="flex-1 bg-bg-layer-default">
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#9E77ED" />
          <Text className="mt-16 body2-regular text-fg-neutral-muted">프로필을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !userProfile) {
    return (
      <SafeAreaView className="flex-1 bg-bg-layer-default">
        <View className="items-center justify-center flex-1">
          <Text className="heading1-semiBold text-fg-neutral-solid">프로필을 찾을 수 없습니다</Text>
          <Text className="mt-8 body2-regular text-fg-neutral-muted">존재하지 않는 사용자이거나 접근 권한이 없습니다.</Text>
          <TouchableOpacity 
            className="px-16 py-12 mt-24 bg-bg-brand rounded-8"
            onPress={() => router.back()}
          >
            <Text className="body2-medium text-white">뒤로 가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-layer-default">
      <View className="flex-row items-center justify-between px-20 pt-20 pb-12">
        <TouchableOpacity 
          className="p-8"
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="title2-bold text-fg-neutral-solid">프로필</Text>
        {isOwnProfile ? (
          <TouchableOpacity 
            className="p-8"
            onPress={() => router.push('/(tabs)/my-page/setting')}
          >
            <IconSymbol name="line.3.horizontal" size={24} color="#333" />
          </TouchableOpacity>
        ) : (
          <View className="w-36" />
        )}
      </View>
      
      <ProfileView 
        profile={userProfile} 
        isOwnProfile={isOwnProfile}
      />
    </SafeAreaView>
  );
}
