import { View, Text } from "react-native";
import { Pressable } from 'react-native-gesture-handler'
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
      className="flex-1 p-12 gap-8"
    >
      <View className="flex flex-row items-center">
      <RecruitTypeInfoBadge recruitType={project.recruitType} pinDisplay={project.pinDisplay} />
        <Text className="caption1-regular text-fg-neutral-subtle ml-auto">
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
      <View className="flex flex-row items-center gap-6">
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
        className="flex flex-row items-center gap-12"
      >
        <View className="flex flex-row gap-4 items-center flex-1">
          <View className="flex flex-row items-center gap-6">
            <IconSymbol size={20} name="mappin" color={"#717680"} />
            <Text className="label1-regular text-fg-neutral-muted">
              촬영 장소
            </Text>
          </View>
          <Pressable 
            onPress={() => copyToClipboard(project.locationAddress)}
          >
            <View className="flex flex-row items-center flex-1 gap-6">
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
      <Text className="caption1-medium text-fg-neutral-subtle ml-auto">
        지원: {project.projectApplicants.length}
      </Text>
      <View className="h-1 mt-12 bg-stroke-divider-subtle" />
    </View>
  );
}
