import React, { useState, useRef, useMemo, useEffect } from "react";
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
import { FontAwesome } from "@expo/vector-icons";
import { cn } from "@/shared/lib";
import { Tabs, TabItem } from "@/shared/ui/Tabs";
import { ExtendedProfile } from "@/entities/uesrs/model/user.types";
import { useCurrentUserStore } from "@/entities/uesrs/model";
import { useUpdateProfile } from "@/entities/uesrs/model";
import { useUpdatePhotographerProfile } from "@/entities/uesrs/model";
import { useUpdateModelProfile } from "@/entities/uesrs/model";
import { useUploadPortfolioImage } from "@/entities/uesrs/model";
import ValidatedInput from "@/shared/ui/ValidatedInput";
import LongButton from "@/shared/ui/Button";
import { useFormValidator } from "@/shared/hooks/useFormValidator";
import { UserAvatar } from "@/entities/uesrs/ui/UserAvatar";
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
  const updatePhotographerProfile = useUpdatePhotographerProfile();
  const updateModelProfile = useUpdateModelProfile();
  const uploadPortfolioImage = useUploadPortfolioImage();

  const [isLoading, setIsLoading] = useState(false);
  const [photographerImages, setPhotographerImages] = useState<
    Array<{ uri: string; id?: string }>
  >([]);
  const [modelImages, setModelImages] = useState<
    Array<{ uri: string; id?: string }>
  >([]);
  const [activeTab, setActiveTab] = useState<ProfileType>("photographer");

  useEffect(() => {}, [activeTab]);

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

  // 완료 버튼 처리
  const handleComplete = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // 기본 프로필 업데이트
      if (currentUser?.id) {
        await updateProfile.mutateAsync({
          id: currentUser.id,
          values: {
            nickname: values.nickname,
            gender: values.gender,
            profileImage: values.profileImage || undefined,
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

      // 포트폴리오 이미지 업로드 (현재는 로컬 상태만 업데이트)
      // 실제 업로드는 별도 구현 필요
      console.log("작가 포트폴리오 이미지:", photographerImages);
      console.log("모델 포트폴리오 이미지:", modelImages);

      Alert.alert("성공", "프로필이 수정되었습니다.");
      router.back();
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
          <ProfileImagePicker
            imageUri={values.profileImage}
            onImageChange={(imageUri) => setValue("profileImage", imageUri)}
            title="프로필 사진"
            description="프로필에 표시될 이미지를 선택해주세요"
            size={120}
          />

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
            >
              <TabItem name="photographer" title="작가">
                <View className="w-full py-20">
                  {/* 작가 포트폴리오 등록 */}
                  <View className="mb-24">
                    <PortfolioImagePicker
                      images={photographerImages.map((img) => img.uri)}
                      onImagesChange={(uris) =>
                        setPhotographerImages(uris.map((uri) => ({ uri })))
                      }
                      maxImages={5}
                      title="포트폴리오 이미지"
                      description="작가 포트폴리오 이미지를 추가해주세요"
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
                      images={modelImages.map((img) => img.uri)}
                      onImagesChange={(uris) =>
                        setModelImages(uris.map((uri) => ({ uri })))
                      }
                      maxImages={5}
                      title="포트폴리오 이미지"
                      description="모델 포트폴리오 이미지를 추가해주세요"
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
