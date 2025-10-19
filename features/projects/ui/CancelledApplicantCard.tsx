import { View, Text, Pressable } from "react-native";
import { getRelativeTime } from "@/shared/lib";
import {
  ShootingStatusBadge,
  ShootingPaymentInfo,
} from "@/entities/projects/ui";
import { router } from "expo-router";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import ActionButton from "@/shared/ui/ActionButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDeleteApplicant } from "@/entities/projects/model";
import { useToast } from "@/shared/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { UserAvatar } from "@/entities/uesrs/ui";
interface CancelledApplicantCardProps {
  item: any;
  project: any;
}

export default function CancelledApplicantCard({ item, project }: CancelledApplicantCardProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteMatch } = useDeleteApplicant();

  const handleDeleteHistory = () => {
    deleteMatch(item.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["applicants", Number(project?.id)]});
      },
      onError: (error: any) => {
        console.error("기록 삭제 중 오류:", error);
        toast.showError("기록 삭제 실패했어요", "잠시 후 다시 시도해주세요.");
      },
    });
  };
  return (
    <View className="p-16 gap-8 flex flex-col bg-bg-layer-default rounded-16">
      <View className="flex flex-row justify-between items-center">
        <ShootingStatusBadge status={item?.status} />
        <Text className="caption1-regular">
          {getRelativeTime(item.updatedAt)}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-6">
          <UserAvatar size={24} imageUrl={item?.applicant?.profileImage} nickname={item?.applicant?.nickname} />
          <Text>{item?.applicant?.nickname}</Text>
        </View>
      <View className="flex flex-row gap-6">
        <MaterialCommunityIcons
          name="alarm-light-outline"
          size={24}
          color="black"
        />
        <Text className="label1-regular text-fg-neutral-muted">
          취소한 사유
        </Text>
        <Text className="label1-medium text-fg-neutral-solid">
          {item?.reason}
        </Text>
      </View>
      <ActionButton
        onPress={handleDeleteHistory}
        className="flex-1"
        size={"md"}
        variant={"assistive"}
        title={"기록 삭제"}
      />
    </View>
  );
} 