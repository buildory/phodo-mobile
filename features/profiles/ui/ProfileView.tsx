import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { cn } from "@/shared/lib";
import { Tabs, TabItem } from "@/shared/ui/Tabs";
import { ExtendedProfile } from "@/entities/uesrs/model/user.types";

type ProfileType = "photographer" | "model";

interface ProfileViewProps {
  profile: ExtendedProfile;
  isOwnProfile: boolean;
  onBack?: () => void;
}

export function ProfileView({
  profile,
  isOwnProfile,
  onBack,
}: ProfileViewProps) {
  const [selectedProfile, setSelectedProfile] =
    useState<ProfileType>("photographer");

  // 실제 통계 데이터 사용
  const getStats = (type: ProfileType) => {
    if (type === "photographer" && profile.photographerProfile) {
      return {
        totalShoots: profile.photographerProfile.totalShootings,
        totalHours: profile.photographerProfile.totalShootingTime,
        avgMatchSpeed: profile.photographerProfile.avgMatchingSpeed,
      };
    } else if (type === "model" && profile.modelProfile) {
      return {
        totalShoots: profile.modelProfile.totalShootings,
        totalHours: profile.modelProfile.totalShootingTime,
        avgMatchSpeed: profile.modelProfile.avgMatchingSpeed,
      };
    }

    // 기본값
    return {
      totalShoots: 0,
      totalHours: 0,
      avgMatchSpeed: 0,
    };
  };

  const currentStats = getStats(selectedProfile);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* 프로필 타입 선택 */}

      {/* 포트폴리오 & 프로필 정보 */}
      <View className="">
        {/* 포트폴리오 대표 사진 */}
        <View className="relative border border-gray-40">
          <View
            className="w-full overflow-hidden bg-bg-layer-subtle rounded-12"
            style={{ height: 160 }}
          >
            {/* 포트폴리오 이미지 - 추후 실제 이미지로 교체 */}
            <View className="items-center justify-center w-full h-full bg-purple-100">
              <FontAwesome name="camera" size={28} color="#9E77ED" />
              <Text className="mt-6 body2-regular text-fg-brand">
                포트폴리오 대표 사진
              </Text>
            </View>
          </View>

          {/* 수정 버튼 - 본인 프로필일 때만 표시 */}
          {isOwnProfile && (
            <TouchableOpacity
              className="absolute items-center justify-center w-32 h-32 bg-white rounded-full shadow-sm top-12 right-12"
              onPress={() => {
                console.log("포트폴리오 수정");
              }}
            >
              <FontAwesome name="pencil" size={14} color="#666" />
            </TouchableOpacity>
          )}

          {/* 프로필 사진 - 포트폴리오와 겹침 */}
          <View
            className="absolute rounded-full left-16 border-gray-40"
            style={{ bottom: -30 }}
          >
            <View
              className="p-2 bg-white rounded-full"
              style={{ width: 80, height: 80 }}
            >
              <View className="items-center justify-center flex-1 rounded-full bg-bg-layer-subtle">
                {profile?.profileImage ? (
                  <Image
                    source={{ uri: profile.profileImage }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <FontAwesome name="user" size={24} color="#999" />
                )}
              </View>
            </View>
          </View>
        </View>

        {/* 프로필 텍스트 정보 */}
        <View className="items-center mt-20">
          {/* 닉네임 */}

          <View className="flex-row justify-end items-center w-full px-16">
            <Text className="body2-medium text-fg-neutral-solid mr-12">
              {profile?.nickname || "사용자"}
            </Text>
            <View className="flex-row items-center gap-8">
              <TouchableOpacity
                className={cn(
                  "py-8 px-12 rounded-8",
                  selectedProfile === "photographer"
                    ? "bg-fg-brand"
                    : "bg-bg-neutral-weak"
                )}
                onPress={() => setSelectedProfile("photographer")}
              >
                <Text
                  className={cn(
                    "text-center body2-medium",
                    selectedProfile === "photographer"
                      ? "text-fg-neutral-inverted"
                      : "text-fg-neutral-muted"
                  )}
                >
                  작가
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={cn(
                  "py-8 px-12 rounded-8",
                  selectedProfile === "model"
                    ? "bg-fg-brand"
                    : "bg-bg-neutral-weak"
                )}
                onPress={() => setSelectedProfile("model")}
              >
                <Text
                  className={cn(
                    "text-center body2-medium",
                    selectedProfile === "model"
                      ? "text-fg-neutral-inverted"
                      : "text-fg-neutral-muted"
                  )}
                >
                  모델
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 프로필 수정 버튼 - 본인 프로필일 때만 표시 */}
          {isOwnProfile && (
            <View className="w-full px-16 mt-8">
            <TouchableOpacity
              className="flex-row justify-center bg-bg-neutral-weak px-14 py-9 rounded-10"
            >
              <Text className="body2-semiBold text-fg-neutral-muted ">
                {`프로필 수정`}
              </Text>
            </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {(() => {
        const instagramAccount = profile?.profileSocialAccounts?.find(
          (account) => account.platform === "instagram"
        );
        if (!instagramAccount?.url) return null;
        
        // Instagram URL에서 사용자명 추출
        const getInstagramUsername = (url: string) => {
          const match = url.match(/(?:instagram\.com\/|@)([^\/\?]+)/);
          return match ? match[1] : "Instagram";
        };
        
        return (
          <View className="mx-20 mb-16">
            <TouchableOpacity
              className="flex-row items-center p-12 bg-bg-layer-subtle rounded-8"
              onPress={() => Linking.openURL(instagramAccount.url!)}
            >
              <FontAwesome name="instagram" size={20} color="#E4405F" />
              <View className="flex-1 mx-12">
                <Text className="body2-medium text-fg-neutral-solid">
                  {getInstagramUsername(instagramAccount.url!)}
                </Text>
                <Text className="caption1-regular text-fg-neutral-muted">
                  Instagram 바로가기
                </Text>
              </View>
              <FontAwesome name="external-link" size={14} color="#666" />
            </TouchableOpacity>
          </View>
        );
      })()}

      {(() => {
        const youtubeAccount = profile?.profileSocialAccounts?.find(
          (account) => account.platform === "youtube"
        );
        if (!youtubeAccount?.url) return null;
        
        return (
          <View className="mx-20 mb-16">
            <TouchableOpacity
              className="flex-row items-center p-12 bg-bg-layer-subtle rounded-8"
              onPress={() => Linking.openURL(youtubeAccount.url!)}
            >
              <FontAwesome name="youtube-play" size={20} color="#FF0000" />
              <View className="flex-1 mx-12">
                <Text className="body2-medium text-fg-neutral-solid">
                  YouTube
                </Text>
                <Text className="caption1-regular text-fg-neutral-muted">
                  YouTube 바로가기
                </Text>
              </View>
              <FontAwesome name="external-link" size={14} color="#666" />
            </TouchableOpacity>
          </View>
        );
      })()}

             {(() => {
         const otherAccount = profile?.profileSocialAccounts?.find(
           (account) => account.platform === "other"
         );
         if (!otherAccount?.url) return null;
         
         // URL에서 도메인 추출
         const getDomain = (url: string) => {
           try {
             const domain = new URL(url).hostname.replace('www.', '');
             return domain;
           } catch {
             return "웹사이트";
           }
         };
         
         return (
           <View className="mx-20 mb-16">
             <TouchableOpacity
               className="flex-row items-center p-12 bg-bg-layer-subtle rounded-8"
               onPress={() => Linking.openURL(otherAccount.url!)}
             >
               <FontAwesome name="link" size={20} color="#666" />
               <View className="flex-1 mx-12">
                 <Text className="body2-medium text-fg-neutral-solid" numberOfLines={1}>
                   {getDomain(otherAccount.url!)}
                 </Text>
                 <Text className="caption1-regular text-fg-neutral-muted">
                   웹사이트 바로가기
                 </Text>
               </View>
               <FontAwesome name="external-link" size={14} color="#666" />
             </TouchableOpacity>
           </View>
         );
       })()}
      {/* 통계 정보 */}
      <View className="mx-20 mb-32">
        <View className="p-20 bg-bg-layer-subtle rounded-12">
          <View className="flex-row items-center justify-between mb-16">
            <View className="items-center flex-1">
              <Text className="caption1-regular text-fg-neutral-muted mb-4">
                총 촬영횟수
              </Text>
              <Text className="body1-semiBold text-fg-brand">
                {currentStats.totalShoots}회
              </Text>
            </View>

            <View className="w-1 h-40 mx-16 bg-stroke-divider-subtle" />

            <View className="items-center flex-1">
              <Text className="caption1-regular text-fg-neutral-muted mb-4">
                총 촬영시간
              </Text>
              <Text className="body1-semiBold text-fg-brand">
                {currentStats.totalHours}시간
              </Text>
            </View>

            <View className="w-1 h-40 mx-16 bg-stroke-divider-subtle" />

            <View className="items-center flex-1">
              <Text className="caption1-regular text-fg-neutral-muted mb-4">
                평균매칭속도
              </Text>
              <Text className="body1-semiBold text-fg-brand">
                {currentStats.avgMatchSpeed}분
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 탭 영역 */}
      <View className="mx-20 mb-32" style={{ minHeight: 400 }}>
        <Tabs
          variant="underline"
          contentClassName="justify-start items-start p-0"
        >
          <TabItem name="intro" title="소개">
            <View className="w-full py-20">
              <Text className="body1-regular text-fg-neutral-solid">
                {selectedProfile === "photographer"
                  ? profile.photographerProfile?.introduction ||
                    "작가 소개 내용이 여기에 표시됩니다."
                  : profile.modelProfile?.introduction ||
                    "모델 소개 내용이 여기에 표시됩니다."}
              </Text>
              <Text className="mt-12 body2-regular text-fg-neutral-muted">
                자세한 프로필 정보와 소개글을 확인할 수 있습니다.
              </Text>
              <Text className="mt-16 body2-regular text-fg-neutral-muted">
                추가 소개 내용이나 경력 사항, 전문 분야 등의 정보를 여기에
                표시할 수 있습니다.
              </Text>
            </View>
          </TabItem>

          <TabItem name="projects" title="모집글">
            <View className="w-full py-20">
              <Text className="body1-regular text-fg-neutral-solid">
                {selectedProfile === "photographer"
                  ? "작가가 올린"
                  : "모델이 지원한"}{" "}
                모집글 목록이 여기에 표시됩니다.
              </Text>
              <Text className="mt-12 body2-regular text-fg-neutral-muted">
                진행 중인 프로젝트와 완료된 프로젝트를 확인할 수 있습니다.
              </Text>
              <Text className="mt-16 body2-regular text-fg-neutral-muted">
                최근 활동한 프로젝트들의 목록과 상태를 여기서 볼 수 있습니다.
              </Text>
            </View>
          </TabItem>

          <TabItem name="reviews" title="리뷰">
            <View className="w-full py-20">
              <Text className="body1-regular text-fg-neutral-solid">
                {selectedProfile === "photographer"
                  ? "작가에 대한"
                  : "모델에 대한"}{" "}
                리뷰가 여기에 표시됩니다.
              </Text>
              <Text className="mt-12 body2-regular text-fg-neutral-muted">
                다른 사용자들이 남긴 평가와 후기를 확인할 수 있습니다.
              </Text>
              <Text className="mt-16 body2-regular text-fg-neutral-muted">
                평점과 함께 상세한 리뷰 내용들을 살펴볼 수 있습니다.
              </Text>
            </View>
          </TabItem>
        </Tabs>
      </View>
    </ScrollView>
  );
}
