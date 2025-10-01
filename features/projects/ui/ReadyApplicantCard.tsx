import { View, Text, Pressable } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { getRelativeTime } from "@/shared/lib";
import ActionButton from "@/shared/ui/ActionButton";
import { calculateDistance, getFormattedDistance } from "@/features/projects/lib/geoUtils";
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
import { useLocationTracking } from "@/shared/hooks/useLocationTracking";

interface ReadyApplicantCardProps {
  item: any;
  project: any;
  myLocation: { latitude: number; longitude: number } | null;
  onCancelPress?: (item: any) => void;
}

export default function ReadyApplicantCard({ item, project, myLocation, onCancelPress }: ReadyApplicantCardProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate: rejectMatch } = useDeleteApplicant();
  const { mutate: createNotification } = useCreateNotification();
  const { mutate: updateApplicant } = useUpdateApplicant();
  const { navigateToChat } = useChatRoomOrCreate();
  
  // 실시간 위치 추적
  const { 
    location: currentLocation, 
    isLocationEnabled, 
    error: locationError,
    requestPermission,
    startTracking 
  } = useLocationTracking({
    accuracy: 6, // High accuracy
    timeInterval: 5000, // 5초마다 업데이트
    distanceInterval: 5, // 5m 이동 시 업데이트
    enabled: true
  });
  
  // 촬영 시작 버튼 활성화 여부 (실시간 위치 사용)
  const isShootingStartEnabled = () => {
    if (!currentLocation || !project?.latitude || !project?.longitude) {
      return false;
    }

    const distanceInMeters = calculateDistance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      project.latitude,
      project.longitude
    );
    
    return distanceInMeters <= 500; // 500m 이내
  };

  // 현재 위치와 프로젝트 위치 간의 거리 (실시간 위치 사용)
  const getCurrentDistance = () => {
    if (!currentLocation || !project?.latitude || !project?.longitude) {
      return null;
    }
    
    return getFormattedDistance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      project.latitude,
      project.longitude
    );
  };

  // 위치 상태에 따른 안내 메시지
  const getLocationMessage = () => {
    if (locationError) {
      return "위치 권한을 허용해주세요.";
    }
    
    if (!isLocationEnabled) {
      return "위치 서비스를 켜주세요.";
    }
    
    if (!currentLocation) {
      return "위치를 확인하고 있어요...";
    }
    
    if (isShootingStartEnabled()) {
      // 500m 이내일 때는 실시간 거리 표시
      const distance = getCurrentDistance();
      return `촬영 장소까지 ${distance} 남았어요!`;
    }
    
    return "촬영 장소 근처에 도착하면 촬영 시작 버튼이 활성화돼요.";
  };

  const openCancelSheet = () => {
    onCancelPress?.(item);
  };

  const handleShootingStart = () => {
    updateApplicant(
      {
        id: item?.id,
        values: {
          status: "shooting",
          startedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["applicants", Number(project?.id)]});
        },
        onError: (error: any) => {
          console.error("촬영 시작 중 오류:", error);
          toast.showError("촬영 시작 실패했어요", "잠시 후 다시 시도해주세요.");
        },
      }
    );
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
            onPress={openCancelSheet}
            className="flex-1"
            size={"md"}
            variant={"assistive"}
            title={"촬영 취소"}
          />
          <ActionButton
            disabled={!isShootingStartEnabled()}
            onPress={handleShootingStart}
            className="flex-1"
            size={"md"}
            variant={"primary"}
            title={"촬영 시작"}
          />
        </View>
        <Text className="caption1-regular text-fg-neutral-muted">{getLocationMessage()}</Text>
      </View>
    </>
  );
} 