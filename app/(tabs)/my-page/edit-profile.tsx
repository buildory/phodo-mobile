import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Tabs, TabItem } from "@/shared/ui/Tabs";
import { useCurrentUserStore } from "@/entities/uesrs/model";
import { useUpdateProfile, useUploadProfileImage } from "@/entities/uesrs/model";
import { useUpdatePhotographerProfile } from "@/entities/uesrs/model";
import { useUpdateModelProfile } from "@/entities/uesrs/model";
import { useUploadPortfolioImage, useDeletePortfolioImage, usePortfolioImages } from "@/entities/uesrs/model";
import ValidatedInput from "@/shared/ui/ValidatedInput";

import { useFormValidator } from "@/shared/hooks/useFormValidator";

import { PortfolioImagePicker } from "@/entities/uesrs/ui/PortfolioImagePicker";
import { ProfileImagePicker } from "@/entities/uesrs/ui/ProfileImagePicker";
import { Ionicons } from "@expo/vector-icons";
import Badge from "@/shared/ui/Badge";


type ProfileType = "photographer" | "model";

interface ProfileFormData {
  nickname: string;
  gender: "male" | "female" | "other";
  profileImage: string | null;
  instagramUrl: string;
  youtubeUrl: string;
  otherUrl: string;
  photographerIntroduction: string;
  modelIntroduction: string;
}

const validateProfile = (values: ProfileFormData) => {
  const errors: Partial<Record<keyof ProfileFormData, string>> = {};

  if (!values.nickname.trim()) {
    errors.nickname = "닉네임을 입력해주세요.";
  }

  if (!values.gender) {
    errors.gender = "성별을 선택해주세요.";
  }

  return errors;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile: currentUser } = useCurrentUserStore();
  const updateProfile = useUpdateProfile();
  const uploadProfileImage = useUploadProfileImage();
  const updatePhotographerProfile = useUpdatePhotographerProfile();
  const updateModelProfile = useUpdateModelProfile();
  const uploadPortfolioImage = useUploadPortfolioImage();
  const deletePortfolioImage = useDeletePortfolioImage();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileType>("photographer");

  // 기존 포트폴리오 이미지 로드
  const { data: photographerImages = [] } = usePortfolioImages(
    currentUser?.id || "", 
    "photographer"
  );
  const { data: modelImages = [] } = usePortfolioImages(
    currentUser?.id || "", 
    "model"
  );

  // 새로 추가할 이미지들 (아직 업로드되지 않은)
  const [newPhotographerImages, setNewPhotographerImages] = useState<string[]>([]);
  const [newModelImages, setNewModelImages] = useState<string[]>([]);

  const { values, setValue, errors, validate } =
    useFormValidator<ProfileFormData>(
      {
        nickname: currentUser?.nickname || "",
        gender: (currentUser?.gender as "male" | "female" | "other") || "other",
        profileImage: currentUser?.profileImage || null,
        instagramUrl:
          currentUser?.profileSocialAccounts?.find(
            (acc: any) => acc.platform === "instagram"
          )?.url || "",
        youtubeUrl:
          currentUser?.profileSocialAccounts?.find(
            (acc: any) => acc.platform === "youtube"
          )?.url || "",
        otherUrl:
          currentUser?.profileSocialAccounts?.find(
            (acc: any) => acc.platform === "other"
          )?.url || "",
        photographerIntroduction:
          currentUser?.photographerProfile?.introduction || "",
        modelIntroduction: currentUser?.modelProfile?.introduction || "",
      },
      validateProfile
    );

  // 포트폴리오 이미지 업로드
  const handlePortfolioImageUpload = async (imageUri: string, profileType: ProfileType) => {
    if (!currentUser?.id) return;

    try {
      await uploadPortfolioImage.mutateAsync({
        userId: currentUser.id,
        profileType,
        imageUri,
      });
      
      // 성공 시 새 이미지 목록에서 제거
      if (profileType === "photographer") {
        setNewPhotographerImages(prev => prev.filter(uri => uri !== imageUri));
      } else {
        setNewModelImages(prev => prev.filter(uri => uri !== imageUri));
      }
    } catch (error) {
      Alert.alert("오류", `포트폴리오 이미지 업로드 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error("포트폴리오 이미지 업로드 에러:", error);
    }
  };

  // 현재 탭의 이미지들 (기존 + 새로 추가된 것들)
  const currentImages = useMemo(() => {
    const existingImages = activeTab === "photographer" ? photographerImages : modelImages;
    const newImages = activeTab === "photographer" ? newPhotographerImages : newModelImages;
    
    return [
      ...existingImages.map(img => ({ uri: img.imageUrl, id: img.id, isExisting: true })),
      ...newImages.map(uri => ({ uri, id: undefined, isExisting: false }))
    ];
  }, [activeTab, photographerImages, modelImages, newPhotographerImages, newModelImages]);

  // 포트폴리오 이미지 변경 핸들러
  const handlePortfolioImagesChange = (images: Array<{ uri: string; id?: string; isExisting?: boolean }>) => {
    const existingUris = (activeTab === "photographer" ? photographerImages : modelImages).map(img => img.imageUrl);
    const newUris = images
      .filter(img => !img.isExisting)
      .map(img => img.uri);
    
    if (activeTab === "photographer") {
      setNewPhotographerImages(newUris);
    } else {
      setNewModelImages(newUris);
    }
  };

  // 포트폴리오 이미지 삭제 핸들러
  const handlePortfolioImageDelete = (imageId: string) => {
    if (!currentUser?.id) return;

    Alert.alert(
      "이미지 삭제",
      "정말로 이 이미지를 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePortfolioImage.mutateAsync({
                imageId,
                userId: currentUser.id,
                profileType: activeTab,
              });
            } catch (error) {
              Alert.alert("오류", `이미지 삭제 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
              console.error("이미지 삭제 에러:", error);
            }
          },
        },
      ]
    );
  };

  // 완료 버튼 처리
  const handleComplete = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // 프로필 이미지 업로드 (새로 선택된 경우에만)
      let profileImageUrl = currentUser?.profileImage;
      if (values.profileImage && values.profileImage !== currentUser?.profileImage) {
        if (!currentUser?.id) throw new Error("사용자 ID가 없습니다.");
        
        try {
          const result = await uploadProfileImage.mutateAsync({
            userId: currentUser.id,
            imageUri: values.profileImage,
          });
          profileImageUrl = result.publicUrl;
        } catch (error) {
          Alert.alert("오류", `프로필 이미지 업로드 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
          console.error("프로필 이미지 업로드 에러:", error);
          return;
        }
      }

      // 기본 프로필 업데이트
      if (currentUser?.id) {
        await updateProfile.mutateAsync({
          id: currentUser.id,
          values: {
            nickname: values.nickname,
            gender: values.gender,
            profileImage: profileImageUrl || undefined,
          },
        });
      }

      // 역할별 프로필 업데이트
      if (activeTab === "photographer" && currentUser?.id) {
        await updatePhotographerProfile.mutateAsync({
          profileId: currentUser.id,
          introduction: values.photographerIntroduction,
        });
      } else if (activeTab === "model" && currentUser?.id) {
        await updateModelProfile.mutateAsync({
          profileId: currentUser.id,
          introduction: values.modelIntroduction,
        });
      }

      // 새 포트폴리오 이미지들 업로드 (작가와 모델 모두)
      const photographerImagesToUpload = newPhotographerImages;
      const modelImagesToUpload = newModelImages;
      
      // 작가 이미지들 업로드
      for (const imageUri of photographerImagesToUpload) {
        await handlePortfolioImageUpload(imageUri, "photographer");
      }
      
      // 모델 이미지들 업로드
      for (const imageUri of modelImagesToUpload) {
        await handlePortfolioImageUpload(imageUri, "model");
      }

             Alert.alert("성공", "프로필이 수정되었습니다.", [
         {
           text: "확인",
           onPress: () => {
             // 프로필 페이지로 돌아가기 전에 잠시 대기
             setTimeout(() => {
               router.back();
             }, 100);
           }
         }
       ]);
    } catch (error) {
      Alert.alert("오류", "프로필 수정에 실패했습니다.");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1 bg-bg-layer-default">
        {/* 헤더 */}
        <View className="flex flex-row items-center justify-between p-16 mt-20">
          <TouchableOpacity
            className="flex-row items-center gap-12"
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#181D27" />
            <Text className="heading2-semiBold text-fg-neutral-solid">
              프로필 수정
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleComplete} disabled={isLoading}>
            <Text className={"heading2-regular text-fg-neutral-muted"}>
              완료
            </Text>
          </TouchableOpacity>
        </View>

        <View className="p-16">
          {/* 닉네임 수정 */}
          <Text className="heading2-semiBold text-fg-neutral-solid">
            기본 정보
          </Text>
          <View className="mt-12">
            <Text className="mt-4 label1-medium">닉네임</Text>
            <Text className="my-8 caption1-regular text-fg-neutral-muted">
              너무 자주 바꾸면 나를 알아보기 어려워질 수 있어요.
            </Text>
            <ValidatedInput
              placeholder="닉네임을 입력해주세요"
              value={values.nickname}
              onChangeText={(text) => setValue("nickname", text)}
              error={errors.nickname}
            />
          </View>

          {/* 성별 선택 */}
          <View className="mt-12">
            <Text className="mt-4 label1-medium">성별</Text>
            <Text className="my-8 caption1-regular text-fg-neutral-muted">
              상대에게 신뢰를 줄 수 있도록 정확히 선택해주세요.
            </Text>
            <View className="flex-row gap-12">
              {[
                { value: "prefer_not_to_say", label: "공개 안함" },
                { value: "female", label: "여성" },
                { value: "male", label: "남성" },
              ].map((option) => (
                <Badge
                  className={
                    values.gender === option.value
                      ? "bg-bg-neutral-weak-pressed"
                      : "bg-bg-neutral-weak"
                  }
                  key={option.value}
                  onPress={() => setValue("gender", option.value as any)}
                  size="md"
                  variant={"default"}
                  label={option.label}
                />
              ))}
            </View>
          </View>

          {/* 프로필 사진 */}
          <Text className="mt-4 label1-medium">프로필 사진</Text>
          <View className="flex-row items-center gap-12">
            <View className="flex-1">
              <ProfileImagePicker
                imageUri={values.profileImage}
                onImageChange={(imageUri) => setValue("profileImage", imageUri)}
                title="프로필 사진"
                description="프로필에 표시될 이미지를 선택해주세요"
                size={120}
              />
            </View>
          </View>

          {/* SNS 입력 */}
          <View className="mt-12">
            <Text className="mb-12 text-base font-medium">SNS 계정</Text>
            <View className="space-y-12">
              <View>
                <Text className="mb-4 text-sm text-gray-600">Instagram</Text>
                <ValidatedInput
                  placeholder="Instagram URL을 입력해주세요"
                  value={values.instagramUrl}
                  onChangeText={(text) => setValue("instagramUrl", text)}
                />
              </View>
              <View>
                <Text className="mb-4 text-sm text-gray-600">YouTube</Text>
                <ValidatedInput
                  placeholder="YouTube URL을 입력해주세요"
                  value={values.youtubeUrl}
                  onChangeText={(text) => setValue("youtubeUrl", text)}
                />
              </View>
              <View>
                <Text className="mb-4 text-sm text-gray-600">
                  기타 웹사이트
                </Text>
                <ValidatedInput
                  placeholder="웹사이트 URL을 입력해주세요"
                  value={values.otherUrl}
                  onChangeText={(text) => setValue("otherUrl", text)}
                />
              </View>
            </View>
          </View>

          {/* 탭 메뉴 - 작가/모델 */}
          <View className="mb-32">
          <Text className="mt-16 heading2-semiBold text-fg-neutral-solid">
            역할 정보
          </Text>
            <Tabs
              variant="underline"
              contentClassName="justify-start items-start p-0"
              initialTab="photographer"
              onTabChange={(tabName: string) => setActiveTab(tabName as ProfileType)}
            >
              <TabItem name="photographer" title="작가">
                <View className="w-full py-20">
                  {/* 작가 포트폴리오 등록 */}
                  <View className="mb-24">
                    <PortfolioImagePicker
                      images={currentImages}
                      onImagesChange={handlePortfolioImagesChange}
                      onImageDelete={handlePortfolioImageDelete}
                      maxImages={6}
                      title="포트폴리오 이미지"
                      description={`작가 포트폴리오 이미지를 추가해주세요 (${photographerImages.length + newPhotographerImages.length}/6)`}
                    />
                  </View>

                  {/* 작가 소개 입력 */}
                  <View>
                    <Text className="mb-12 text-base font-medium">
                      작가 소개
                    </Text>
                    <ValidatedInput
                      placeholder="작가로서의 소개를 작성해주세요"
                      value={values.photographerIntroduction}
                      onChangeText={(text) =>
                        setValue("photographerIntroduction", text)
                      }
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                      className="min-h-120"
                    />
                  </View>
                </View>
              </TabItem>

              <TabItem name="model" title="모델">
                <View className="w-full py-20">
                  {/* 모델 포트폴리오 등록 */}
                  <View className="mb-24">
                    <PortfolioImagePicker
                      images={currentImages}
                      onImagesChange={handlePortfolioImagesChange}
                      onImageDelete={handlePortfolioImageDelete}
                      maxImages={6}
                      title="포트폴리오 이미지"
                      description={`모델 포트폴리오 이미지를 추가해주세요 (${modelImages.length + newModelImages.length}/6)`}
                    />
                  </View>

                  {/* 모델 소개 입력 */}
                  <View>
                    <Text className="mb-12 text-base font-medium">
                      모델 소개
                    </Text>
                    <ValidatedInput
                      placeholder="모델로서의 소개를 작성해주세요"
                      value={values.modelIntroduction}
                      onChangeText={(text) =>
                        setValue("modelIntroduction", text)
                      }
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                      className="min-h-120"
                    />
                  </View>
                </View>
              </TabItem>
            </Tabs>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
