import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { router } from "expo-router";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { ProfileView } from "@/features/profiles/ui/ProfileView";

export default function MyPageScreen() {
  const { profile } = useCurrentUserStore();

  return (
    <SafeAreaView className="flex-1 bg-bg-layer-default">
      {/* 상태바와 제목 사이에 여유 공간 추가 */}
      <View className="mt-10" />
      <View className="flex-row items-center justify-between px-20 pt-20 pb-12">
        <Text className="heading2-semiBold text-fg-neutral-solid">{`${profile?.nickname}님의 프로필`}</Text>
        <TouchableOpacity 
          className="p-8"
          onPress={() => router.push('/(tabs)/my-page/setting')}
        >
          <IconSymbol name="line.3.horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ProfileView 
        profile={profile} 
        isOwnProfile={true}
      />
    </SafeAreaView>
  );
}

