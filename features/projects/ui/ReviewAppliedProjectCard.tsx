import { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import AntDesign from "@expo/vector-icons/AntDesign";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { getRelativeTime, getShootingDuration } from "@/shared/lib";
import { ShootingStatusBadge } from "@/entities/projects/ui";
import { ShootingPaymentInfo } from "@/entities/projects/ui";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import { UserAvatar } from "@/entities/uesrs/ui/UserAvatar";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const channelMap = {
  phodo: "포도쉐어",
  email: "이메일",
  etc: "기타매체",
}
interface ReviewAppliedProjectCardProps {
  item: any;
  project: any;
}

export default function ReviewAppliedProjectCard({ item, project }: ReviewAppliedProjectCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [zipFileName, setZipFileName] = useState<string>("");
  const { navigateToChat } = useChatRoomOrCreate();
  const shootingDuration = getShootingDuration(project.startedAt, project.endedAt);

  const handleImageUpload = async () => {
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
  };

  return (
    <View className="p-16 gap-8 flex flex-col bg-bg-layer-default rounded-16">
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-8">
          <ShootingStatusBadge status={project.status} />
        </View>
        <Text className="caption1-regular">
          {getRelativeTime(project.createdAt)}
        </Text>
      </View>
      
      <Pressable>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="headline1-semiBold"
        >
          {project.title || "제목 없음"}
        </Text>
      </Pressable>
      
      <View className="flex flex-row justify-between">
      <View className="flex flex-row items-center gap-6">
          <UserAvatar size={24} imageUrl={project?.profiles?.profileImage} nickname={project?.profiles?.nickname} />
          <Text>{project?.profiles?.nickname}</Text>
        </View>
        <Pressable onPress={() => navigateToChat(project.profiles.id)}>
          <Text className="text-fg-neutral-muted">채팅하기</Text>
        </Pressable>
      </View>

      <View className="flex flex-row items-center gap-6">
        <IconSymbol size={20} name="mappin" color={"#717680"} />
        {project.distance && <Text>{project.distance}</Text>}
        <Pressable
          onPress={() => copyToClipboard(project.locationAddress)}
          className="flex flex-row items-center"
        >
          <Text className="label1-regular mr-4">{project.inputLocation}</Text>
          <IconSymbol size={20} name="copy" color="#000" />
        </Pressable>
      </View>

      <View className="flex flex-row items-center gap-4">
        <IconSymbol name="camera" size={24} color="#1A1C20" />
        <Text className="label1-regular text-fg-neutral-muted">촬영 기록</Text>
        <Text className="label1-medium text-fg-neutral-solid">
          {shootingDuration} {project.startedAt && project.endedAt && "진행"}
        </Text>
        <Text className="label1-regular text-fg-info-solid ml-auto">
          {"1시간 30분"}
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
          {/* {uploadedFiles.length > 0 ? (
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
          )} */}
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
        isPaid={project?.isPaid}
        pricePerHour={project?.pricePerHour}
        requestNote={project?.requestNote}
      />

    </View>
  );
}


