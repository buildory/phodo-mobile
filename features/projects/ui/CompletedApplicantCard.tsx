import { View, Text, Pressable } from "react-native";
import { getRelativeTime } from "@/shared/lib";
import {
  ShootingStatusBadge,
  ShootingPaymentInfo,
} from "@/entities/projects/ui";
import { router } from "expo-router";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";

interface CompletedApplicantCardProps {
  item: any;
  project: any;
}

export default function CompletedApplicantCard({ item, project }: CompletedApplicantCardProps) {
  const { navigateToChat } = useChatRoomOrCreate();
  
  return (
    <View className="flex flex-col gap-8 p-16 bg-bg-layer-default rounded-16">
      <View className="flex flex-row items-center justify-between">
        <ShootingStatusBadge status={item?.status} />
        <Text className="caption1-regular">
          {getRelativeTime(item.createdAt)}
        </Text>
      </View>
              <View className="flex flex-row justify-between">
          <Text>{item?.applicant?.nickname}</Text>
          <Pressable onPress={() => navigateToChat(item?.applicant?.id)}> 
            <Text>채팅하기</Text>
          </Pressable>
        </View>
      <ShootingPaymentInfo
        isPaid={item?.isPaid}
        pricePerHour={item?.pricePerHour}
        requestNote={item?.requestNote}
      />
      <View className="flex flex-row gap-16">
        <View className="flex-1" />
        <View className="flex-1" />
      </View>
    </View>
  );
} 