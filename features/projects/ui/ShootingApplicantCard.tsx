import { View, Text, Pressable } from "react-native";
import { getRelativeTime, getOneWeekLater } from "@/shared/lib";
import { useElapsedTime } from "@/shared/hooks/useElapsedTime";
import {
  ShootingStatusBadge,
  ShootingPaymentInfo,
} from "@/entities/projects/ui";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import ActionButton from "@/shared/ui/ActionButton";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { useUpdateApplicant } from "@/entities/projects/model";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/useToast";
import { UserAvatar } from "@/entities/uesrs/ui";

interface ShootingApplicantCardProps {
  item: any;
  project: any;
}

export default function ShootingApplicantCard({ item, project }: ShootingApplicantCardProps) {
  const { navigateToChat } = useChatRoomOrCreate();
  const elapsedTime = useElapsedTime(item?.startedAt);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { mutate: updateApplicant } = useUpdateApplicant();

  const handleShootingEnd = () => {
    updateApplicant(
      {
        id: item?.id,
        values: {
          status: "review",
          endedAt: new Date(),
          completedAt: getOneWeekLater(),
          updatedAt: new Date(),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["applicants", Number(project?.id)]});
        },
        onError: (error: any) => {
          console.error("촬영 종료 중 오류:", error);
          toast.showError("촬영 종료 실패했어요", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  }
  const handleShootingStop = () => {
    updateApplicant(
      {
        id: item?.id,
        values: {
          status: "ready",
          startedAt: undefined,
          updatedAt: new Date(),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["applicants", Number(project?.id)]});
        },
        onError: (error: any) => {
          console.error("촬영 중단 중 오류:", error);
          toast.showError("촬영 중단 실패했어요", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  }

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
          <UserAvatar size={24} imageUrl={item?.applicant?.profileImage} nickname={item?.applicant?.nickname} />
          <Text>{item?.applicant?.nickname}</Text>
        </View>
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
            onPress={handleShootingStop}
            className="flex-1"
            size={"md"}
            variant={"assistive"}
            title={"촬영 중단"}
          />
          <ActionButton
            disabled={item?.status === "ready"}
            onPress={handleShootingEnd}
            className="flex-1"
            size={"md"}
            variant={"primary"}
            title={"촬영 종료"}
          />
        </View>
    </View>
  );
} 