import { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, Platform } from "react-native";
import { getRelativeTime } from "@/shared/lib";
import {
  ShootingStatusBadge,
  ShootingPaymentInfo,
} from "@/entities/projects/ui";
import { UserAvatar } from "@/entities/uesrs/ui/UserAvatar";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import ActionButton from "@/shared/ui/ActionButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { getShootingDuration, getDaysUntilCompletion } from "@/shared/lib";
import { useUpdateApplicant } from "@/entities/projects/model";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/useToast";
import * as ImagePicker from 'expo-image-picker';
import { uploadImagesAsZip } from '@/entities/projects/api/uploadImages';
import { createNotification } from "@/entities/notification/api/createNotification";

const channelMap = {
  phodo: "포도쉐어",
  email: "이메일",
  etc: "기타매체",
}
interface ReviewApplicantCardProps {
  item: any;
  project: any;
}

export default function ReviewApplicantCard({
  item,
  project,
}: ReviewApplicantCardProps) {
  const { navigateToChat } = useChatRoomOrCreate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [zipFileName, setZipFileName] = useState<string>("");
  const queryClient = useQueryClient();
  const toast = useToast();
  const { mutate: updateApplicant } = useUpdateApplicant();
  const shootingDuration = getShootingDuration(item?.startedAt, item?.endedAt);
  const daysUntilCompletion = getDaysUntilCompletion(item?.completedAt);

  // 기존 downloadUrl이 있으면 상태에 설정
  useEffect(() => {
    if (item?.downloadUrl) {
      setUploadedFiles([item.downloadUrl]);
      // downloadUrl에서 파일명 추출 (예: https://example.com/path/shooting_1234567890.zip -> shooting_1234567890.zip)
      const urlParts = item.downloadUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      setZipFileName(fileName);
    }
  }, [item?.downloadUrl]);

  const handleImageUpload = async () => {
    try {
      // 권한 요청
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("권한 필요", "사진을 선택하려면 갤러리 접근 권한이 필요합니다.");
        return;
      }

      // 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8, // 압축 품질
        selectionLimit: 10, // 최대 10장
      });

      if (!result.canceled && result.assets.length > 0) {
        setIsUploading(true);
        
        try {
          // 이미지 ZIP 업로드
          const uploadResult = await uploadImagesAsZip(result.assets, project?.shootingCode);
          
          if (uploadResult.success) {
            setUploadedFiles(uploadResult.files || []);
            setZipFileName(uploadResult.zipFileName || "");
            
            // downloadUrl 업데이트
            if (uploadResult.files && uploadResult.files.length > 0) {
              updateApplicant(
                {
                  id: item?.id,
                  values: {
                    status: item?.status, // 기존 상태 유지
                    downloadUrl: uploadResult.files[0], // ZIP 파일의 다운로드 URL
                    updatedAt: new Date(),
                  },
                },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: ["applicants", Number(project?.id)],
                    });
                    toast.showSuccess("업로드 완료", `${result.assets.length}장의 사진이 ZIP 파일로 업로드되었습니다.`);
                  },
                  onError: (error: any) => {
                    console.error("downloadUrl 업데이트 중 오류:", error);
                    toast.showError("업로드 실패", "다운로드 URL 업데이트에 실패했습니다.");
                  },
                }
              );
            } else {
              toast.showSuccess("업로드 완료", `${result.assets.length}장의 사진이 ZIP 파일로 업로드되었습니다.`);
            }
          } else {
            toast.showError("업로드 실패", uploadResult.error || "사진 업로드에 실패했습니다.");
          }
        } catch (error) {
          console.error("업로드 중 오류:", error);
          toast.showError("업로드 실패", "사진 업로드 중 오류가 발생했습니다.");
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error("이미지 선택 중 오류:", error);
      toast.showError("오류", "이미지 선택 중 오류가 발생했습니다.");
      setIsUploading(false);
    }
  };

  const handleShootingComplete = () => {
    updateApplicant(
      {
        id: item?.id,
        values: {
          status: "done",
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        onSuccess: () => {
          createNotification({
            title: "촬영 완료",
            body: `촬영이 완료되었어요.`,
            userId: item?.applicant?.id,
            data: { type: "shooting", userId: item?.applicant?.id },
          });
          queryClient.invalidateQueries({
            queryKey: ["applicants", Number(project?.id)],
          });
        },
        onError: (error: any) => {
          console.error("촬영 완료 중 오류:", error);
          toast.showError("촬영 완료 실패했어요", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  };

  return (
    <View className="flex flex-col gap-8 p-16 bg-bg-layer-default rounded-16">
      <View className="flex flex-row items-center justify-between">
        <ShootingStatusBadge status={item?.status} />
        <Text className="caption1-regular text-fg-neutral-subtle">
          {getRelativeTime(item.updatedAt)}
        </Text>
      </View>
      <View className="flex flex-row justify-between">
      <View className="flex flex-row items-center gap-6">
          <UserAvatar size={24} imageUrl={item?.applicant?.profileImage} nickname={item?.profiles?.applicant} />
          <Text>{item?.applicant?.nickname}</Text>
        </View>
        <Pressable onPress={() => navigateToChat(item?.profiles?.id)}>
          <Text className="label1-regular text-fg-neutral-muted">채팅하기</Text>
        </Pressable>
      </View>
      <View className="flex flex-row items-center gap-4">
        <IconSymbol name="camera" size={24} color="#1A1C20" />
        <Text className="label1-regular text-fg-neutral-muted">촬영 기록</Text>
        <Text className="label1-regular text-fg-info-solid ml-auto">
        {shootingDuration} {item?.startedAt && item?.endedAt && "진행"}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-4">
        <SimpleLineIcons name="present" size={24} color="#1A1C20" />
        <Text className="label1-regular text-fg-neutral-muted">공유 방법</Text>
        <Text className="label1-regular text-fg-neutral-solid">
          {channelMap[item?.shareChannel as keyof typeof channelMap] || item?.shareChannel}
        </Text>
      </View>
      {item?.shareChannel === "phodo" && (
        <View className="flex flex-row items-center gap-4">
          <AntDesign name="upload" size={24} color="#1A1C20" />
          <Text className="label1-regular text-fg-neutral-muted">
            공유 사진
          </Text>
          {uploadedFiles.length > 0 ? (
            <Text 
              className="label1-regular text-fg-neutral-solid flex-1"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {zipFileName || "ZIP 파일 업로드됨"}
            </Text>
          ) : (
            <Text className="label1-regular text-fg-neutral-muted flex-1">
              사진을 선택해주세요
            </Text>
          )}
          <Pressable 
            onPress={handleImageUpload}
            disabled={isUploading}
            className="ml-auto"
          >
            <Text className={`label1-regular ${isUploading ? 'text-fg-neutral-muted' : 'text-fg-info-solid'}`}>
              {isUploading ? '업로드 중...' : uploadedFiles.length > 0 ? '변경' : '업로드'}
            </Text>
          </Pressable>
        </View>
      )}
      <ShootingPaymentInfo
        isPaid={item?.isPaid}
        pricePerHour={item?.pricePerHour}
        requestNote={item?.requestNote}
      />
      <ActionButton
        onPress={handleShootingComplete}
        className="flex-1"
        size={"md"}
        variant={"primary"}
        title={"촬영 완료"}
      />
      {daysUntilCompletion >= 0 && (
        <Text className="caption1-regular text-fg-neutral-muted">
          {daysUntilCompletion === 0
            ? "오늘 자동으로 촬영 완료 처리돼요."
            : daysUntilCompletion + "일 후 자동으로 촬영 완료 처리돼요."}
        </Text>
      )}
    </View>
  );
}