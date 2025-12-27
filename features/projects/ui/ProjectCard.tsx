import { View, Text, Pressable } from "react-native";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import {
  calculateDistance,
  getFormattedDistance,
} from "@/features/projects/lib/geoUtils";
import { UserAvatar } from "@/entities/uesrs/ui";
import { ShootingPaymentInfo } from "@/entities/projects/ui";
import { getRelativeTime } from "@/shared/lib";
import { RecruitTypeInfoBadge } from "@/entities/projects/ui";
interface ProjectCardProps {
  project: any;
  myLocation: { latitude: number; longitude: number } | null;
  onPress: () => void;
}

export function ProjectCard({
  project,
  myLocation,
  onPress,
}: ProjectCardProps) {
  const distanceInMeters =
    myLocation && project?.latitude && project?.longitude
      ? calculateDistance(
          myLocation.latitude,
          myLocation.longitude,
          project.latitude,
          project.longitude
        )
      : null;

  const distance =
    distanceInMeters !== null
      ? getFormattedDistance(
          myLocation!.latitude,
          myLocation!.longitude,
          project.latitude,
          project.longitude
        )
      : "거리 알 수 없음";

  return (
    <View
      className="flex-1 gap-8 p-12"
    >
      <View className="flex flex-row items-center">
      <RecruitTypeInfoBadge recruitType={project.recruitType} pinDisplay={project.pinDisplay} />
        <Text className="ml-auto caption1-regular text-fg-neutral-subtle">
          {getRelativeTime(project.createdAt)}
        </Text>
      </View>
      <Pressable onPress={onPress}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="heading2-semiBold text-fg-neutral-solid"
        >
          {project.title}
        </Text>
      </Pressable>
      <View className="flex flex-row gap-6 items-center">
        <UserAvatar
          size={24}
          imageUrl={project.profiles.profileImage}
          nickname={project.profiles.nickname}
        />
        <Text className="label1-medium text-fg-neutral-solid">
          {project.profiles.nickname}
        </Text>
      </View>
      <View
        className="flex flex-row gap-12 items-center"
      >
        <View className="flex flex-row flex-1 gap-4 items-center">
          <View className="flex flex-row gap-6 items-center">
            <IconSymbol size={20} name="mappin" color={"#717680"} />
            <Text className="label1-regular text-fg-neutral-muted">
              촬영 장소
            </Text>
          </View>
          <Pressable 
            onPress={() => copyToClipboard(project.locationAddress)}
          >
            <View className="flex flex-row flex-1 gap-6 items-center">
            <Text 
              ellipsizeMode="tail" 
              numberOfLines={1}
              className="label1-medium text-fg-neutral-solid"
            >
              {project.inputLocation}
            </Text>
            <IconSymbol
              size={20}
              name="copy"
              color="#000"
              className="ml-4"
            />
            </View>
          </Pressable>
        </View>
        <Text className="caption1-regular text-fg-info-solid">
          {distance}
        </Text>
      </View>
      <ShootingPaymentInfo
        isPaid={project.isPaid}
        pricePerHour={project.pricePerHour}
        requestNote={project.requestNote}
      />
      <Text className="ml-auto caption1-medium text-fg-neutral-subtle">
        지원: {project?.projectApplicants?.length || 0}
      </Text>
      <View className="mt-12 h-1 bg-stroke-divider-subtle" />
    </View>
  );
}
