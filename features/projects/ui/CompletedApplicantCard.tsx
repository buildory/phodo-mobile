import { View, Text, Pressable, Linking } from "react-native";
import { getRelativeTime, getShootingDuration } from "@/shared/lib";
import dayjs from "dayjs";
import {
  ShootingStatusBadge,
  ShootingPaymentInfo,
} from "@/entities/projects/ui";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import ActionButton from "@/shared/ui/ActionButton";
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import { useCountdown } from "@/shared/hooks/useCountdown";
import { useToast } from "@/shared/hooks/useToast";
import { UserAvatar } from "@/entities/uesrs/ui";
interface CompletedApplicantCardProps {
  item: any;
  project: any;
}

const channelMap = {
  phodo: "포도쉐어",
  email: "이메일",
  etc: "기타매체",
}
export default function CompletedApplicantCard({ item, project }: CompletedApplicantCardProps) {
  const { navigateToChat } = useChatRoomOrCreate();
  const shootingDuration = getShootingDuration(item?.startedAt, item?.endedAt);
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
    <View className="flex flex-col gap-8 p-16 bg-bg-layer-default rounded-16">
      <View className="flex flex-row items-center justify-between">
        <ShootingStatusBadge status={item?.status} />
        <Text className="caption1-regular text-fg-neutral-subtle">
          {getRelativeTime(item.createdAt)}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-6">
          <UserAvatar size={24} imageUrl={item?.applicant?.profileImage} nickname={item?.applicant?.nickname} />
          <Text>{item?.applicant?.nickname}</Text>
        </View>
        <View className="flex flex-row items-center gap-4">
          <IconSymbol name="camera" size={24} color="#1A1C20" />
          <Text className="label1-regular text-fg-neutral-muted">촬영 기록</Text>
          <Text className="label1-medium text-fg-neutral-solid">{shootingDuration} {item?.startedAt && item?.endedAt && "진행"}</Text>
          <Text className="label1-regular text-fg-neutral-muted ml-auto">상세보기</Text>
        </View>
        <View className="flex flex-row items-center gap-4">
          <SimpleLineIcons name="present" size={24} color="#1A1C20" />
          <Text className="label1-regular text-fg-neutral-muted">공유 방법</Text>
          <Text className="label1-medium text-fg-neutral-solid">{channelMap[item?.shareChannel as keyof typeof channelMap] || item?.shareChannel}</Text>
        </View>

          <View className="flex flex-row items-center gap-4">
            <AntDesign name="picture" size={24} color="#1A1C20" />
            <Text className="label1-regular text-fg-neutral-muted">공유 사진</Text>
            <Text numberOfLines={1} ellipsizeMode="middle" className="label1-medium text-fg-neutral-solid flex-1">
              {item?.downloadUrl?.split("/").pop() || "ZIP 파일 업로드됨"}
            </Text>
            {canDownload && (
              <>
              <Pressable onPress={handleFileDownload} disabled={!canDownload}>
                <Feather name="download" size={24} color="#1A1C20" />  
              </Pressable>
              <Text className="label1-regular text-fg-info-solid ml-auto">
                {countdown.formattedTime}
              </Text>
              </>
            )}
          </View>
          
      <ShootingPaymentInfo
        isPaid={item?.isPaid}
        pricePerHour={item?.pricePerHour}
        requestNote={item?.requestNote}
      />
           <ActionButton
             onPress={() => {}}
             className="flex-1"
             size={"md"}
             variant={isReviewPeriodExpired ? "disabled" : "primary"}
             title={isReviewPeriodExpired ? "리뷰 작성 기간 만료" : "리뷰 작성"}
             disabled={isReviewPeriodExpired}
           />
   {reviewPeriodText && (
     <Text className="caption1-regular text-fg-neutral-muted">{reviewPeriodText}</Text>
   )}
    </View>
  );
}