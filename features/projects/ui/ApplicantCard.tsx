import { useState } from "react";
import { View, Text } from "react-native";
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

export default function ApplicantCard({ item, project }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate: rejectMatch } = useDeleteApplicant();
  const { mutate: createNotification } = useCreateNotification();
  const { mutate: updateApplicant } = useUpdateApplicant();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleMatchCancel = () => {
    setModalVisible(true);
  };

  const handleApproveMatch = () => {
    updateApplicant(
      {
        id: item?.id,
        values: {
          status: "ready",
          updatedAt: new Date(),
        },
      },
      {
        onSuccess: () => {
          createNotification({
            title: "촬영 대기",
            body: `매칭이 성사되었어요. 자세한 일정은 채팅으로 소통해보세요!`,
            userId: item?.applicant?.id,
            data: { type: "shooting", userId: item?.applicant?.id },
          });
          queryClient.invalidateQueries({ queryKey: ["applicants", Number(project?.id)]});
        },
        onError: (error: any) => {
          console.error("매칭 수락 중 오류:", error);
          toast.showError("매칭 수락 실패했어요", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  };

  const handleConfirmCancel = () => {
    setModalVisible(false);

    updateApplicant(
      {
        id: item?.id,
        values: {
          status: "cancel",
          updatedAt: new Date(),
        },
      },
      {
        onSuccess: () => {
          createNotification({
            title: "촬영 취소",
            body: `아쉽지만 이번 촬영은 취소되었어요. 곧 더 멋진 촬영이 기다리고 있을 거예요.`,
            userId: item?.applicant?.id,
            data: { type: "shooting", userId: item?.applicant?.id },
          });
        queryClient.invalidateQueries({ queryKey: ["applicants", Number(project?.id)]});
        },
        onError: (error: any) => {
          console.error("매칭 취소 중 오류:", error);
          toast.showError("매칭 취소 실패했어요", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  };

  const handleConfirmReject = () => {
    setModalVisible(false);

    rejectMatch(item.id, {
      onSuccess: () => {
        createNotification({
          title: "매칭 취소",
          body: `아쉽지만 ${project?.profiles?.nickname}님과의 매칭이 성사되지 않았어요. 곧 더 잘 맞는 분을 만날 수 있을 거에요!`,
          userId: item?.applicant?.id,
          data: { type: "shooting", userId: item?.applicant?.id },
        });
         queryClient.invalidateQueries({ queryKey: ["applicants", Number(project?.id)]});
      },
      onError: (error: any) => {
        console.error("매칭 거절 중 오류:", error);
        toast.showError("매칭 거절 실패했어요", "잠시 후 다시 시도해주세요.");
      },
    });
  };

  return (
    <>
      <View className="p-16 gap-8 flex flex-col bg-bg-layer-default rounded-16">
        <View className="flex flex-row justify-between items-center">
          <ShootingStatusBadge status={item?.status} />
          <Text className="caption1-regular">
            {getRelativeTime(item.createdAt)}
          </Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text>{item?.applicant?.nickname}</Text>
          <Text>프로필 보기</Text>
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
            title={item?.status === "pending" ? "매칭 거절" : "촬영 취소"}
          />
          <ActionButton
            disabled={item?.status === "ready"}
            onPress={handleApproveMatch}
            className="flex-1"
            size={"md"}
            variant={"primary"}
            title={item?.status === "pending" ? "매칭 수락" : "촬영 시작"}
          />
        </View>
      </View>

      <ConfirmModal
        visible={isModalVisible}
        title={
          item?.status === "pending"
            ? "매칭을 거절할까요?"
            : "촬영을 취소할까요?"
        }
        description={
          item?.status === "pending"
            ? `진행 버튼을 누르면 ${item.project.recruitType === "photographer" ? "작가" : "모델"}님께 알림이 전송돼요. 이번 요청만 취소되는 것이니, 다음에 다시 매칭하실 수도 있어요.`
            : "진행 버튼을 누르면 촬영이 취소됩니다."
        }
        confirmText="진행"
        cancelText="취소"
        onConfirm={
          item?.status === "pending" ? handleConfirmReject : handleConfirmCancel
        }
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
}
