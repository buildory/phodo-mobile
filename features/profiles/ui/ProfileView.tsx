import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { cn } from "@/shared/lib";
import { Tabs, TabItem } from "@/shared/ui/Tabs";
import { ExtendedProfile } from "@/entities/uesrs/model/user.types";
import { useMyProjects } from "@/entities/projects/model";
import { ProjectCard } from "@/features/projects/ui/ProjectCard";
import { usePortfolioImages, PortfolioImage } from "@/entities/uesrs/model";
import { UserAvatar } from "@/entities/uesrs/ui/UserAvatar";

const { width: screenWidth } = Dimensions.get("window");

type ProfileType = "photographer" | "model";

interface ProfileViewProps {
  profile: ExtendedProfile;
  isOwnProfile: boolean;
  onBack?: () => void;
}

export function ProfileView({ profile, isOwnProfile }: ProfileViewProps) {
  const [selectedProfile, setSelectedProfile] =
    useState<ProfileType>("photographer");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: myProjects } = useMyProjects(profile?.id ?? "");
  const filteredProjects =
    myProjects?.filter(
      (project) =>
        (selectedProfile === "model" &&
          project.recruitType === "photographer") ||
        (selectedProfile === "photographer" && project.recruitType === "model")
    ) || [];

  // 포트폴리오 이미지들 가져오기
  const { data: portfolioImages, isLoading: portfolioLoading, error: portfolioError } =
    usePortfolioImages(profile?.id ?? "", selectedProfile);

  // 포트폴리오 이미지 메모이제이션
  const memoizedPortfolioImages = useMemo(() => {
    // 에러가 발생하면 빈 배열 반환
    if (portfolioError) {
      console.warn('포트폴리오 이미지 로딩 에러:', portfolioError);
      return [];
    }
    return portfolioImages || [];
  }, [portfolioImages, portfolioError]) as PortfolioImage[];

  // 이미지 인덱스가 변경될 때 currentImageIndex 업데이트
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [memoizedPortfolioImages]);

  const getStats = (type: ProfileType) => {
    if (type === "photographer" && profile?.photographerProfile) {
      return {
        totalShoots: profile.photographerProfile.totalShootings || 0,
        totalHours: profile.photographerProfile.totalShootingTime || 0,
        avgMatchSpeed: profile.photographerProfile.avgMatchingSpeed || 0,
      };
    } else if (type === "model" && profile?.modelProfile) {
      return {
        totalShoots: profile.modelProfile.totalShootings || 0,
        totalHours: profile.modelProfile.totalShootingTime || 0,
        avgMatchSpeed: profile.modelProfile.avgMatchingSpeed || 0,
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
      <View>
                 {/* 포트폴리오 대표 사진 */}
         <View className="relative border border-gray-40">
           <View
             className="w-full overflow-hidden bg-bg-layer-subtle"
             style={{ 
               height: memoizedPortfolioImages.length > 0 ? 360 : 120 
             }}
           >
             {/* 포트폴리오 이미지 가로 스크롤 */}
             {portfolioLoading ? (
               <View className="items-center justify-center w-full h-full bg-purple-100">
                 <ActivityIndicator size="large" color="#9E77ED" />
                 <Text className="mt-6 body2-regular text-fg-brand">
                   포트폴리오 로딩 중...
                 </Text>
               </View>
                           ) : memoizedPortfolioImages.length > 0 ? (
                <View className="relative w-full h-full">
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    className="w-full h-full"
                    removeClippedSubviews={true}
                    onMomentumScrollEnd={(event) => {
                      const index = Math.round(
                        event.nativeEvent.contentOffset.x / screenWidth
                      );
                      setCurrentImageIndex(index);
                    }}
                  >
                    {memoizedPortfolioImages.map((image, index) => (
                      <View key={image.id} className="h-full">
                        <Image
                          style={{
                            width: screenWidth,
                            height: "100%",
                          }}
                          source={{
                            uri: image.url,
                            cache: "force-cache",
                          }}
                          className="w-full h-full"
                          resizeMode="cover"
                          fadeDuration={300}
                        />
                      </View>
                    ))}
                  </ScrollView>
                  <View className="absolute bottom-12 right-12 bg-bg-overlay rounded-full">
                    <View className="px-6 py-4 bg-black bg-opacity-50 rounded-8">
                      <Text className="text-fg-neutral-inverted caption1-medium">
                        {currentImageIndex + 1}/{memoizedPortfolioImages.length}
                      </Text>
                    </View>
                  </View>
                </View>
             ) : (
               <View className="items-center justify-center w-full h-full bg-purple-100">
                 <FontAwesome name="camera" size={28} color="#9E77ED" />
                 <Text className="mt-6 body2-regular text-fg-brand">
                   포트폴리오 사진
                 </Text>
               </View>
             )}
           </View>
          <View
            className="absolute rounded-full left-16 border-gray-40"
            style={{ bottom: -30 }}
          >
            <UserAvatar size={64} imageUrl={profile?.profileImage} nickname={profile?.nickname} />
          </View>
        </View>

        {/* 프로필 텍스트 정보 */}
        <View className="items-center mt-20">
          {/* 닉네임 */}

          <View className="flex-row items-center justify-end w-full px-16">
            <Text className="mr-12 body2-medium text-fg-neutral-solid">
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
              <TouchableOpacity className="flex-row justify-center bg-bg-neutral-weak px-14 py-9 rounded-10">
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
          <View className="mx-20">
            <TouchableOpacity
              className="flex-row items-center p-12 bg-bg-layer-subtle rounded-8"
              onPress={() => Linking.openURL(instagramAccount.url!)}
            >
              <FontAwesome name="instagram" size={20} color="#E4405F" />
              <View className="flex-1 mx-12">
                <Text className="body2-medium text-fg-neutral-solid">
                  {getInstagramUsername(instagramAccount.url!)}
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

        // YouTube URL에서 채널명 또는 핸들 추출
        const getYouTubeChannelName = (url: string) => {
          try {
            // 채널 URL 패턴들
            const channelPatterns = [
              /(?:youtube\.com\/channel\/)([^\/\?]+)/,
              /(?:youtube\.com\/c\/)([^\/\?]+)/,
              /(?:youtube\.com\/@)([^\/\?]+)/,
              /(?:youtube\.com\/user\/)([^\/\?]+)/,
            ];
            
            for (const pattern of channelPatterns) {
              const match = url.match(pattern);
              if (match) {
                return match[1];
              }
            }
            
            // 일반 YouTube URL인 경우 도메인 반환
            return "YouTube";
          } catch {
            return "YouTube";
          }
        };

        return (
          <View className="mx-20">
            <TouchableOpacity
              className="flex-row items-center p-12 bg-bg-layer-subtle rounded-8"
              onPress={() => Linking.openURL(youtubeAccount.url!)}
            >
              <FontAwesome name="youtube-play" size={20} color="#FF0000" />
              <View className="flex-1 mx-12">
                <Text className="body2-medium text-fg-neutral-solid">
                  {getYouTubeChannelName(youtubeAccount.url!)}
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
            const domain = new URL(url).hostname.replace("www.", "");
            return domain;
          } catch {
            return "웹사이트";
          }
        };

        return (
          <View className="mx-20">
            <TouchableOpacity
              className="flex-row items-center p-12 bg-bg-layer-subtle rounded-8"
              onPress={() => Linking.openURL(otherAccount.url!)}
            >
              <FontAwesome name="link" size={20} color="#666" />
              <View className="flex-1 mx-12">
                <Text
                  className="body2-medium text-fg-neutral-solid"
                  numberOfLines={1}
                >
                  {getDomain(otherAccount.url!)}
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
              <Text className="mb-4 caption1-regular text-fg-neutral-muted">
                총 촬영횟수
              </Text>
              <Text className="body1-semiBold text-fg-brand">
                {currentStats.totalShoots}회
              </Text>
            </View>

            <View className="w-1 h-40 mx-16 bg-stroke-divider-subtle" />

            <View className="items-center flex-1">
              <Text className="mb-4 caption1-regular text-fg-neutral-muted">
                총 촬영시간
              </Text>
              <Text className="body1-semiBold text-fg-brand">
                {currentStats.totalHours}시간
              </Text>
            </View>

            <View className="w-1 h-40 mx-16 bg-stroke-divider-subtle" />

            <View className="items-center flex-1">
              <Text className="mb-4 caption1-regular text-fg-neutral-muted">
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
                  ? profile?.photographerProfile?.introduction ||
                    "작가 소개 내용이 여기에 표시됩니다."
                  : profile?.modelProfile?.introduction ||
                    "모델 소개 내용이 여기에 표시됩니다."}
              </Text>
            </View>
          </TabItem>

          <TabItem name="projects" title="모집글">
            <View className="w-full py-20">
              {filteredProjects.length > 0 ? (
                <FlatList
                  data={filteredProjects}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <ProjectCard project={item} onPress={() => {}} />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 16,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                  }}
                  className="flex-1"
                />
              ) : (
                <View className="items-center justify-center py-40">
                  <FontAwesome name="folder-open" size={48} color="#999" />
                  <Text className="mt-16 body1-regular text-fg-neutral-solid">
                    {selectedProfile === "photographer" ? "작가" : "모델"}로
                    생성한 모집글이 없습니다
                  </Text>
                  <Text className="mt-8 body2-regular text-fg-neutral-muted">
                    새로운 모집글을 만들어보세요
                  </Text>
                </View>
              )}
            </View>
          </TabItem>

          <TabItem name="reviews" title="리뷰">
            <View className="w-full py-20">
              <Text className="body1-regular text-fg-neutral-solid">
                {selectedProfile === "photographer"
                  ? "작가에 대한 "
                  : "모델에 대한 "}
                리뷰가 여기에 표시됩니다.
              </Text>
            </View>
          </TabItem>
        </Tabs>
      </View>
    </ScrollView>
  );
}
