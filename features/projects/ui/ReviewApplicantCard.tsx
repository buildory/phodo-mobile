import { View, Text, Pressable } from "react-native";
import { getRelativeTime } from "@/shared/lib";
import {
  ShootingStatusBadge,
  ShootingPaymentInfo,
} from "@/entities/projects/ui";
import { router } from "expo-router";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import ActionButton from "@/shared/ui/ActionButton";
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Feather from '@expo/vector-icons/Feather';
import { Picker } from "@react-native-picker/picker";
interface ReviewApplicantCardProps {
  item: any;
  project: any;
}

export default function ReviewApplicantCard({ item, project }: ReviewApplicantCardProps) {
  const { navigateToChat } = useChatRoomOrCreate();
  
  return (
    <View className="flex flex-col gap-8 p-16 bg-bg-layer-default rounded-16">
      <View className="flex flex-row items-center justify-between">
        <ShootingStatusBadge status={item?.status} />
        <Text className="caption1-regular text-fg-neutral-subtle">
          {getRelativeTime(item.createdAt)}
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
          <Text className="label1-regular text-fg-neutral-solid">1시간 20분 진행</Text>
          <Text className="label1-regular text-fg-info-solid ml-auto">1시간 30분</Text>
        </View>
        <View className="flex flex-row items-center gap-4">
          <SimpleLineIcons name="present" size={24} color="#1A1C20" />
          <Text className="label1-regular text-fg-neutral-muted">공유 방법</Text>
          <View className="border-stroke-divider-subtle border rounded-8 w-1/2 ml-auto">
          <Picker
              >
                <Picker.Item label="포도쉐어" value="podoshare" />
                <Picker.Item label="이메일" value="email" />
                <Picker.Item label="기타매체" value="etc" />
              </Picker>
          </View>
        </View>
        <View className="flex flex-row items-center gap-4">
          <AntDesign name="upload" size={24} color="#1A1C20" />
          <Text className="label1-regular text-fg-neutral-muted">공유 사진</Text>
          <Text className="label1-regular text-fg-neutral-solid">A1C2E3G4-01-0703.zip</Text>
          <Text className="label1-regular text-fg-neutral-muted ml-auto">업로드</Text>
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
            variant={"primary"}
            title={"리뷰 작성"}
          />
  <Text className="caption1-regular text-fg-neutral-muted">7일 후 자동으로 촬영 완료 처리돼요.</Text>
    </View>
  );
} 