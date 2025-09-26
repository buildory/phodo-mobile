import { View, Text, Pressable } from "react-native";
import { getRelativeTime } from "@/shared/lib";
import { useElapsedTime } from "@/shared/hooks/useElapsedTime";
import {
  ShootingStatusBadge,
  ShootingPaymentInfo,
} from "@/entities/projects/ui";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import ActionButton from "@/shared/ui/ActionButton";
import { IconSymbol } from "@/shared/ui/IconSymbol";

interface ShootingApplicantCardProps {
  item: any;
  project: any;
}

export default function ShootingApplicantCard({ item, project }: ShootingApplicantCardProps) {
  const { navigateToChat } = useChatRoomOrCreate();
  const elapsedTime = useElapsedTime(item?.startedAt);

  return (
    <View className="flex flex-col gap-8 p-16 bg-bg-layer-default rounded-16">
      <View className="flex flex-row items-center justify-between">
        <ShootingStatusBadge status={item?.status} />
        <Text className="caption1-regular text-fg-neutral-subtle">
          {getRelativeTime(item.updatedAt)}
        </Text>
      </View>
              <View className="flex flex-row justify-between">
          <Text>{item?.applicant?.nickname}</Text>
          <Pressable onPress={() => navigateToChat(item?.applicant?.id)}> 
            <Text className="label1-regular text-fg-neutral-muted">채팅하기</Text>
          </Pressable>
        </View>
        <View className="flex flex-row items-center gap-4">
          <IconSymbol name="camera" size={24} color="#1A1C20" />
          <Text className="label1-regular text-fg-neutral-muted">촬영 기록</Text>
          <Text className="label1-regular text-fg-info-solid ml-auto">{elapsedTime || '알 수 없음'}</Text>
        </View>
      <ShootingPaymentInfo
        isPaid={item?.isPaid}
        pricePerHour={item?.pricePerHour}
        requestNote={item?.requestNote}
      />
        <View className="flex flex-row gap-16">
          <ActionButton
            onPress={() => {}}
            className="flex-1"
            size={"md"}
            variant={"assistive"}
            title={"촬영 중단"}
          />
          <ActionButton
            disabled={item?.status === "ready"}
            onPress={() => {}}
            className="flex-1"
            size={"md"}
            variant={"primary"}
            title={"촬영 종료"}
          />
        </View>
    </View>
  );
} 