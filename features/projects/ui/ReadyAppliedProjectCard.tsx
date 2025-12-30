import { View, Text, Pressable } from "react-native";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { getRelativeTime } from "@/shared/lib";
import { ShootingStatusBadge } from "@/entities/projects/ui";
import { ShootingPaymentInfo } from "@/entities/projects/ui";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import ActionButton from "@/shared/ui/ActionButton";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useUpdateApplicant } from "@/entities/projects/model/useUpdateApplicant";
import { UserAvatar } from "@/entities/uesrs/ui/UserAvatar";

const channelMap = {
  phodo: "포도쉐어",
  email: "이메일",
  etc: "기타매체",
}
interface ReadyAppliedProjectCardProps {
  item: any;
  project: any;
  onCancelPress?: (item: any) => void;
}

export default function ReadyAppliedProjectCard({ item, project, onCancelPress }: ReadyAppliedProjectCardProps) {
  const { navigateToChat } = useChatRoomOrCreate();

  const openCancelSheet = () => {
    onCancelPress?.(item);
  };

  return (
    <View className="p-16 gap-8 flex flex-col bg-bg-layer-default rounded-16">
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-8">
          <ShootingStatusBadge status={project.status} />
        </View>
        <Text className="caption1-regular">
          {getRelativeTime(project.createdAt)}
        </Text>
      </View>
      
      <Pressable>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="headline1-semiBold"
        >
          {project.title || "제목 없음"}
        </Text>
      </Pressable>
      
      <View className="flex flex-row items-center gap-6">
          <UserAvatar size={24} imageUrl={project?.profiles?.profileImage} nickname={project?.profiles?.nickname} />
          <Text>{project?.profiles?.nickname}</Text>
        </View>

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

      <View className="flex flex-row items-center gap-4">
        <SimpleLineIcons name="present" size={24} color="#1A1C20" />
        <Text className="label1-regular text-fg-neutral-muted">공유 방법</Text>
        <Text className="label1-regular text-fg-neutral-solid">
          {channelMap[item?.shareChannel as keyof typeof channelMap] || item?.shareChannel}
        </Text>
      </View>
      
      <ShootingPaymentInfo
        isPaid={project?.isPaid}
        pricePerHour={project?.pricePerHour}
        requestNote={project?.requestNote}
      />
      
      <View className="flex flex-row gap-8">
      <ActionButton
        onPress={openCancelSheet}
        className="flex-1"
        size={"md"}
        variant={"assistive"}
        title={"촬영 취소"}
          />
      </View>
    </View>
  );
}
