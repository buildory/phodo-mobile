import { View, Text, Pressable } from "react-native";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { getRelativeTime } from "@/shared/lib";
import { ShootingStatusBadge } from "@/entities/projects/ui";
import { ShootingPaymentInfo } from "@/entities/projects/ui";
import { useChatRoomOrCreate } from "@/entities/chat/model/useChatRoomOrCreate";
import { useElapsedTime } from "@/shared/hooks/useElapsedTime";

interface ShootingAppliedProjectCardProps {
  project: any;
}

export default function ShootingAppliedProjectCard({ project }: ShootingAppliedProjectCardProps) {
  const { navigateToChat } = useChatRoomOrCreate();
  const elapsedTime = useElapsedTime(project.startedAt);

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
      
      <View className="flex flex-row justify-between">
        <Text>{project.profiles.nickname}</Text>
        <Pressable onPress={() => navigateToChat(project.profiles.id)}>
          <Text className="text-fg-neutral-muted">채팅하기</Text>
        </Pressable>
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
          <IconSymbol name="camera" size={24} color="#1A1C20" />
          <Text className="label1-regular text-fg-neutral-muted">촬영 기록</Text>
          <Text className="label1-regular text-fg-info-solid ml-auto">{elapsedTime || '알 수 없음'}</Text>
      </View>
      
      <ShootingPaymentInfo
        isPaid={project?.isPaid}
        pricePerHour={project?.pricePerHour}
        requestNote={project?.requestNote}
      />
    </View>
  );
}


