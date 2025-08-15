import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { getRelativeTime } from "@/shared/lib";
import ActionButton from "@/shared/ui/ActionButton";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import {
  ShootingStatusBadge,
  ShootingPaymentInfo,
} from "@/entities/projects/ui";
import {
  useUpdateApplicant,
  useDeleteApplicant,
} from "@/entities/projects/model";
import { useCreateNotification } from "@/entities/notification/model";
import { useToast } from "@/shared/hooks/useToast";
import { router } from "expo-router";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";

interface ReadyApplicantCardProps {
  item: any;
  project: any;
}

export default function ReadyApplicantCard({ item, project }: ReadyApplicantCardProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate: rejectMatch } = useDeleteApplicant();
  const { mutate: createNotification } = useCreateNotification();
  const { mutate: updateApplicant } = useUpdateApplicant();
  const { navigateToChat } = useChatRoomOrCreate();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleMatchCancel = () => {
    setModalVisible(true);
  };

  return (
    <>
      <View className="flex flex-col gap-8 p-16 bg-bg-layer-default rounded-16">
        <View className="flex flex-row items-center justify-between">
          <ShootingStatusBadge status={item?.status} />
          <Text className="caption1-regular text-fg-neutral-subtle">
            {getRelativeTime(item.createdAt)}
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text>{item?.applicant?.nickname}</Text>
          <Pressable 
            onPress={() => {navigateToChat(item?.applicant?.id)}}
          > 
            <Text className="label1-regular text-fg-neutral-muted">{item?.status === "pending" ? "프로필 보기" : "채팅하기"}</Text>
          </Pressable>
        </View>
        <ShootingPaymentInfo
          isPaid={item?.isPaid}
          pricePerHour={item?.pricePerHour}
          requestNote={item?.requestNote}
        />
        <View className="flex flex-row gap-16">
          <ActionButton
            onPress={handleMatchCancel}
            className="flex-1"
            size={"md"}
            variant={"assistive"}
            title={"촬영 취소"}
          />
          <ActionButton
            disabled={item?.status === "ready"}
            onPress={() => {}}
            className="flex-1"
            size={"md"}
            variant={"primary"}
            title={"촬영 시작"}
          />
        </View>
        <Text className="caption1-regular text-fg-neutral-muted">촬영 장소 근처에 도착하면 촬영 시작 버튼이 활성화돼요.</Text>
      </View>

      <ConfirmModal
        visible={isModalVisible}
        title={"촬영을 취소할까요?"}
        description={"진행 버튼을 누르면 촬영이 취소됩니다."}
        confirmText="진행"
        cancelText="취소"
        onConfirm={() => {}}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
} 