import { View, Text, Pressable, Linking } from "react-native";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { getRelativeTime, getShootingDuration } from "@/shared/lib";
import { ShootingStatusBadge } from "@/entities/projects/ui";
import { ShootingPaymentInfo } from "@/entities/projects/ui";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import { useCountdown } from "@/shared/hooks/useCountdown";
import { useToast } from "@/shared/hooks/useToast";
import ActionButton from "@/shared/ui/ActionButton";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import dayjs from "dayjs";

interface CompletedAppliedProjectCardProps {
  item: any;
  project: any;
}

const channelMap = {
  phodo: "포도쉐어",
  email: "이메일",
  etc: "기타매체",
}

export default function CompletedAppliedProjectCard({ item, project }: CompletedAppliedProjectCardProps) {
  const { navigateToChat } = useChatRoomOrCreate();
  console.log("item", item);
  const shootingDuration = getShootingDuration(item.startedAt, item.endedAt);
  const toast = useToast();
  
  // 24시간 다운로드 제한 카운트다운
  const countdown = useCountdown(item?.completedAt, 24 * 60 * 60 * 1000); // 24시간
  const canDownload = !countdown.isExpired && item?.downloadUrl;
  
  // 리뷰 작성 기간 계산 (completedAt + 7일)
  const getReviewPeriod = () => {
    if (!item?.completedAt) return null;
    
    const completedDate = dayjs(item.completedAt);
    const reviewDeadline = completedDate.add(7, 'day');
    const now = dayjs();
    const daysLeft = reviewDeadline.diff(now, 'day');
    
    if (daysLeft < 0) {
      return "리뷰 작성 기간이 만료되었습니다.";
    } else if (daysLeft === 0) {
      return "오늘 리뷰 작성 기간이 마감돼요.";
    } else {
      return `리뷰 작성 기간이 ${daysLeft}일 남았어요.`;
    }
  };
  
  const reviewPeriodText = getReviewPeriod();
  const isReviewPeriodExpired = reviewPeriodText?.includes("만료되었습니다");

  const handleFileDownload = async () => {
    if (item?.downloadUrl) {
      try {
        await Linking.openURL(item?.downloadUrl);
      } catch (error) {
        console.error("파일 다운로드 중 오류:", error);
        toast.showError("다운로드 실패", "다운로드 URL이 없습니다.");
      }
    }
  };

  return (
    <View className="p-16 gap-8 flex flex-col bg-bg-layer-default rounded-16">
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-8">
          <ShootingStatusBadge status={item.status} />
        </View>
        <Text className="caption1-regular">
          {getRelativeTime(item.createdAt)}
        </Text>
      </View>
      
      <Pressable>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="headline1-semiBold"
        >
          {item.title || "제목 없음"}
        </Text>
      </Pressable>
      
      <View className="flex flex-row justify-between">
        <Text>{item.profiles.nickname}</Text>
        <Pressable onPress={() => navigateToChat(item.profiles.id)}>
          <Text className="text-fg-neutral-muted">채팅하기</Text>
        </Pressable>
      </View>

      <View className="flex flex-row items-center gap-4">
        <IconSymbol name="camera" size={24} color="#1A1C20" />
        <Text className="label1-regular text-fg-neutral-muted">촬영 기록</Text>
        <Text className="label1-regular text-fg-info-solid ml-auto">
          {shootingDuration} {item.startedAt && item.endedAt && "진행"}
        </Text>
      </View>

      <View className="flex flex-row items-center gap-4">
        <IconSymbol name="present" size={24} color="#1A1C20" />
        <Text className="label1-regular text-fg-neutral-muted">공유 방법</Text>
        <Text className="label1-medium text-fg-neutral-solid">
          {channelMap[project?.shareChannel as keyof typeof channelMap] || project?.shareChannel}
        </Text>
      </View>

      {canDownload && (
        <View className="flex flex-row items-center gap-4">
          <AntDesign name="picture" size={24} color="#1A1C20" />
          <Text className="label1-regular text-fg-neutral-muted">공유 사진</Text>
          <Text numberOfLines={1} ellipsizeMode="middle" className="label1-medium text-fg-neutral-solid flex-1">
            {project?.downloadUrl?.split("/").pop() || "ZIP 파일 업로드됨"}
          </Text>
          <Pressable onPress={handleFileDownload} disabled={!canDownload}>
            <Feather name="download" size={24} color="#1A1C20" />  
          </Pressable>
          <Text className="label1-regular text-fg-info-solid ml-auto">
            {countdown.formattedTime}
          </Text>
        </View>
      )}

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
      
      <ShootingPaymentInfo
        isPaid={project?.isPaid}
        pricePerHour={project?.pricePerHour}
        requestNote={project?.requestNote}
      />
      
      <View className="flex flex-row gap-8">
        <ActionButton
          onPress={() => {}}
          className="flex-1"
          size="md"
          variant={isReviewPeriodExpired ? "disabled" : "primary"}
          title={isReviewPeriodExpired ? "리뷰 작성 기간 만료" : "리뷰 작성"}
          disabled={isReviewPeriodExpired}
        />
      </View>
      
      {reviewPeriodText && (
        <Text className="caption1-regular text-fg-neutral-muted">{reviewPeriodText}</Text>
      )}
    </View>
  );
}
