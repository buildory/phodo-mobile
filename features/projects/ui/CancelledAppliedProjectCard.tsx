import { View, Text, Pressable } from "react-native";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { getRelativeTime } from "@/shared/lib";
import { ShootingStatusBadge } from "@/entities/projects/ui";
import { ShootingPaymentInfo } from "@/entities/projects/ui";

interface CancelledAppliedProjectCardProps {
  item: any;
  project: any;
}

export default function CancelledAppliedProjectCard({ item, project }: CancelledAppliedProjectCardProps) {
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
      
      <ShootingPaymentInfo
        isPaid={project?.isPaid}
        pricePerHour={project?.pricePerHour}
        requestNote={project?.requestNote}
      />
    </View>
  );
}
