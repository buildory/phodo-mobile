import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  StatusBar,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from "@mj-studio/react-native-naver-map";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import ProjectDetailCard from "@/features/projects/ui/ProjectDetailCard";
import { useProject } from "@/entities/projects/model";
import {
  getMarkerImage,
  getDistanceFromLatLonInKm,
} from "@/features/projects/lib";
import { Tabs, TabItem } from "@/shared/ui/Tabs";
import LongButton from "@/shared/ui/Button";
import { useCreateApplicant } from "@/entities/projects/model/useCreateApplicant";
import { useCreateNotification } from "@/entities/notification/model";
import { getConceptImages } from "@/entities/projects/api/getConceptImages";
import { useWatchLocation } from "@/features/projects/model/useWatchLocation";
import type { Applicant } from "@/entities/projects/model";
import { useToast } from "@/shared/hooks/useToast";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { ReviewStats } from "@/entities/uesrs/ui";
import { useReviewStats } from "@/entities/uesrs/model/useReviews";
import { PortfolioImage, usePortfolioImages } from "@/entities/uesrs/model/usePortfolioImages";
import { FontAwesome } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");


export default function ProjectEditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { profile } = useCurrentUserStore();
  const { data: project, isLoading } = useProject(String(id));
  const { mutate: createApplicant } = useCreateApplicant();
  const { mutate: createNotification } = useCreateNotification();
  const myLocation = useWatchLocation();
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: reviewStats } = useReviewStats({
    userId: profile?.id ?? "",
    type: project?.recruitType === "model" ? "PHOTOGRAPHER" : "MODEL"
  });

  const { data: portfolioImages, isLoading: portfolioLoading, error: portfolioError } =
  usePortfolioImages(profile?.id ?? "", project?.recruitType === "model" ? "model" : "photographer");

  const distance =
    myLocation?.latitude != null &&
    myLocation?.longitude != null &&
    project?.latitude != null &&
    project?.longitude != null
      ? getDistanceFromLatLonInKm(
          myLocation.latitude,
          myLocation.longitude,
          project.latitude,
          project.longitude
        )
      : undefined;

  const [conceptImages, setConceptImages] = useState<
    { id: number; imageUrl: string }[]
  >([]);

  const handleBackWard = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getConceptImages(String(id));
        setConceptImages(data);
      } catch (error) {
        console.error("Error fetching concept images:", error);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!project || !profile?.id) return;

    const hasAlreadyApplied = project.projectApplicants?.some(
      (applicant: Applicant) => applicant.applicantId === profile?.id
    );

    setAlreadyApplied(Boolean(hasAlreadyApplied));
  }, [project, profile?.id]);

  const handleApplicant = () => {
    if (!project || !profile?.id) return;

    if (alreadyApplied) {
      return;
    }

    createApplicant(
      {
        projectId: project.id,
        status: "pending",
        applicantId: profile?.id,
      },
      {
        onSuccess: () => {
          router.push("/(tabs)/shooting-history");
          toast.showSuccess("지원 완료", "모집글에 지원했어요. 좋은 만남이 기대되네요!");

          createNotification({
            title: "매칭 대기",
            body: `${profile?.nickname ? `${profile.nickname}님이` : "누군가"} 모집글에 지원했어요. 좋은 만남이 기대되네요!`,
            userId: project.userId,
            data: { type: "shooting", userId: project.userId },
          });
        },
        onError: (error: any) => {
          console.error("지원 중 오류:", error);
          toast.showError("지원 실패했어요", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  };

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

  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <Pressable
        style={{ paddingVertical: 12, paddingHorizontal: 16 }}
        onPress={handleBackWard}
      >
        <IconSymbol size={24} name="x" color={"#181D27"} />
      </Pressable>
      <ScrollView>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {!isLoading && (
            <ProjectDetailCard project={{ ...project, distance }} reviewCount={reviewStats?.totalReviews ?? 0} />
          )}
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Tabs variant="underline">
            <TabItem name="home" title="설명">
              <ScrollView
                className="w-full"
                contentContainerStyle={{ paddingVertical: 16 }}
              >
                <View>
                  <View>
                    <Text className="heading2-semiBold">촬영 위치</Text>
                    <Text className="text-fg-neutral-muted">
                      {project?.locationAddress}
                    </Text>
                  </View>
                  {project?.latitude && project?.longitude && (
                    <NaverMapView
                      camera={{
                        latitude: project?.latitude,
                        longitude: project?.longitude,
                        zoom: 16,
                      }}
                      style={{
                        height: 300,
                        width: "100%",
                        marginTop: 8,
                        borderRadius: 8,
                      }}
                      isShowLocationButton={false}
                      isExtentBoundedInKorea={true}
                      isScrollGesturesEnabled={false}
                      isZoomGesturesEnabled={false}
                      isRotateGesturesEnabled={false}
                      isTiltGesturesEnabled={false}
                      isShowScaleBar={false}
                      maxZoom={16}
                      minZoom={12}
                    >
                      <View style={{ borderRadius: 8 }}>
                        <NaverMapMarkerOverlay
                          latitude={project?.latitude}
                          longitude={project?.longitude}
                          width={40}
                          height={40}
                          image={getMarkerImage(
                            project.pinDisplay,
                            project.recruitType,
                            project.userId === profile?.id
                              ? "self"
                              : project.profiles.gender
                          )}
                        />
                      </View>
                    </NaverMapView>
                  )}
                </View>
                {conceptImages.length > 0 && (
                  <View>
                    <Text className="heading2-semiBold mt-16">촬영 컨셉</Text>
                    <Text className="text-fg-neutral-muted">
                      이런 느낌이면 좋겠어요 :)
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 8, paddingRight: 8 }}
                      style={{ marginTop: 16 }}
                    >
                      {conceptImages.map((img, idx) => (
                        <Image
                          key={idx}
                          source={{ uri: img.imageUrl }}
                          style={{ width: 248, height: 248, borderRadius: 8 }}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
                {project?.description && (
                  <View className="mt-16">
                    <Text className="heading2-semiBold">상세 설명</Text>
                    <Text className="border-stroke-divider-subtle border round py-12 px-16 rounded-8 mt-8">
                      {project?.description}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </TabItem>
            <TabItem name="profile" title="프로필">
              <View className="w-full py-20 min-h-[400px]">
                {portfolioLoading ? (
                  <View className="items-center justify-center py-40">
                    <ActivityIndicator size="large" color="#9E77ED" />
                    <Text className="mt-16 body2-regular text-fg-brand">
                      포트폴리오 로딩 중...
                    </Text>
                  </View>
                ) : memoizedPortfolioImages.length > 0 ? (
                  <View className="w-full">
                    <View className="flex-row flex-wrap justify-between">
                      {memoizedPortfolioImages.slice(0, 6).map((image, index) => {
                        const imageSize = (screenWidth - 80) / 2; // 2열 그리드
                        return (
                          <View 
                            key={image.id} 
                            className="mb-8"
                            style={{ 
                              width: imageSize,
                              height: imageSize
                            }}
                          >
                            <Image
                              source={{ uri: image.imageUrl }}
                              className="w-full h-full rounded-8"
                              resizeMode="cover"
                            />
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ) : (
                  <View className="items-center justify-center py-40">
                    <FontAwesome name="camera" size={48} color="#999" />
                    <Text className="mt-16 body1-regular text-fg-neutral-solid">
                      포트폴리오 이미지가 없습니다
                    </Text>
                    <Text className="mt-8 body2-regular text-fg-neutral-muted">
                      {project?.recruitType === "model" ? "모델" : "작가"} 포트폴리오를 등록해보세요
                    </Text>
                  </View>
                )}
              </View>
            </TabItem>
            <TabItem name="review" title="리뷰">
              <View className="mt-16 flex flex-row items-center justify-between">
                <Text className="heading2-semiBold text-fg-neutral-solid">리뷰</Text>
                {reviewStats && reviewStats.totalReviews > 0 && (
                  <Text className="label1-semiBold text-fg-neutral-muted">모든 리뷰 보기</Text>
                )}
              </View>
            {reviewStats && reviewStats.totalReviews > 0 ? (
                <ReviewStats 
                  stats={reviewStats}
                />
              ) : (
                <View className="py-32 items-center">
                <Text className="text-gray-500 text-base">
                  아직 리뷰가 없습니다.
                </Text>
              </View>
              )}
            </TabItem>
          </Tabs>
        </View>
      </ScrollView>
      <View className="px-16 pb-20 pt-12 ">
        {project?.userId === profile?.id ? (
          <LongButton
            onPress={() => router.push("/(tabs)/shooting-history")}
            title={"상세 현황 보기"}
            loading={false}
          />
        ) : (
          <LongButton
            disabled={alreadyApplied}
            onPress={() => handleApplicant()}
            title={alreadyApplied ? "지원 완료" : "지원하기"}
            loading={false}
          />
        )}
      </View>
    </View>
  );
}
