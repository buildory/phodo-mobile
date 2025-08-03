import { View, Text, Pressable } from "react-native";
import Badge from "@/shared/ui/Badge";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { getRelativeTime } from "@/shared/lib";
import ActionButton from "@/shared/ui/ActionButton";
import { useRouter } from "expo-router";
import { ShootingPaymentInfo } from "@/entities/projects/ui";

export default function MyProjectCard({ project }) {
  const router = useRouter();
  return (
    <View className="p-16 gap-8 flex flex-col bg-bg-layer-default rounded-16">
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-8">
          <Badge
            label={project.recruitType === "model" ? "모델 구인" : "작가 구인"}
            className="border-stroke-field border rounded-6 bg-bg-neutral-weak"
          />
          <Badge
            label={project.pinDisplay === "always" ? "상시 촬영" : "버블 촬영"}
            className="border-stroke-field border rounded-6 bg-bg-neutral-weak"
          />
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
      <Text>{project.profiles.nickname}</Text>
      <View className="flex flex-row items-center gap-6">
        <IconSymbol size={12} name="mappin" color={"#717680"} />
        {project.distance && <Text>{project.distance}</Text>}
        <Pressable
          onPress={() => copyToClipboard(project.locationAddress)}
          className="flex flex-row items-center"
        >
          <Text className="label1-regular mr-4">{project.inputLocation}</Text>
          <IconSymbol size={12} name="copy" color="#000" />
        </Pressable>
      </View>
      <ShootingPaymentInfo
        isPaid={project?.isPaid}
        pricePerHour={project?.pricePerHour}
        requestNote={project?.requestNote}
      />
      <View className="flex flex-row gap-16">
        <ActionButton
          onPress={() => router.push(`/project/${project.id}/edit`)}
          className="flex-1"
          size={"md"}
          variant={"assistive"}
          title={"모집글 보기"}
        />
        <ActionButton
          onPress={() =>
            router.push({
              pathname: "/shooting-history/[id]/applicant",
              params: { id: String(project.id) },
            })
          }
          className="flex-1"
          size={"md"}
          variant={"primary"}
          title={"지원 현황보기"}
        />
      </View>
    </View>
  );
}
