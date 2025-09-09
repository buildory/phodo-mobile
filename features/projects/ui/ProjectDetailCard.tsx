import { View, Text, Pressable } from "react-native";
import Badge from "@/shared/ui/Badge";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Project } from "@/entities/projects/model";
import { ShootingPaymentInfo } from "@/entities/projects/ui";
import { getRelativeTime } from "@/shared/lib/dateUtils";
import { RecruitTypeInfoBadge } from "@/entities/projects/ui";
import { UserAvatar } from "@/entities/uesrs/ui";
dayjs.locale("ko");

const SHOOTING_PREFERENCES = {
  NO_PREFERENCE: "no_preference",
  OWN_DEVICE: "own_device",
  PHOTOGRAPHER_DEVICE: "photographer_device",
  MODEL_DEVICE: "model_device",
} as const;

type ShootingPreference =
  (typeof SHOOTING_PREFERENCES)[keyof typeof SHOOTING_PREFERENCES];

const SHOOTING_PREFERENCE_LABELS: Record<ShootingPreference, string> = {
  no_preference: "기기 상관 없어요",
  own_device: "제 기기로 촬영 원해요",
  photographer_device: "작가님 기기로 촬영 원해요",
  model_device: "모델님 기기로 촬영 가능해요",
};

const daysMap = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

function formatTime(timeString: string) {
  if (!timeString) return "시간 없음";

  const parsed = dayjs(`2000-01-01T${timeString}`);

  if (!parsed.isValid()) return "잘못된 시간";

  return parsed.locale("ko").format("A h:mm");
}

interface ProjectDetailCardProps {
  project: Project;
}

export default function ProjectDetailCard({ project }: ProjectDetailCardProps) {
  return (
    <View className="flex-1 gap-8 p-12">
      <View className="flex flex-row items-center">
        <RecruitTypeInfoBadge
          recruitType={project.recruitType}
          pinDisplay={project.pinDisplay}
        />
        <Text className="caption1-regular text-fg-neutral-subtle ml-auto">
          {getRelativeTime(project.createdAt)}
        </Text>
      </View>

      <Pressable>
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          className="headline2-semiBold"
        >
          {project.title || "제목 없음"}
        </Text>
      </Pressable>
      <View className="flex flex-row items-center gap-6">
        <UserAvatar
          size={22}
          imageUrl={project.profiles.profileImage}
          nickname={project.profiles.nickname}
        />
        <Text className="label1-medium text-fg-neutral-solid">
          {project.profiles.nickname}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-6">
        <IconSymbol size={20} name="mappin" color={"#1A1C20"} />
        <Text className="label1-regular text-fg-neutral-muted">촬영 장소</Text>
        <Pressable
          onPress={() => copyToClipboard(project.locationAddress)}
          className="flex flex-row items-center"
        >
          <Text className="mr-4 label1-medium text-fg-neutral-solid">
            {project.inputLocation}
          </Text>
          <IconSymbol size={20} name="copy" color="#000" />
        </Pressable>
      </View>

      <View className="flex flex-row items-center gap-6">
        <IconSymbol size={20} name="calendar" color={"#1A1C20"} />
        <Text className="label1-regular text-fg-neutral-muted">운영 일정</Text>
        <View className="flex flex-wrap items-center w-2/3">
          <Text className="label1-medium text-fg-neutral-solid">
            {project?.availableDates?.join(", ")}
            {project?.availableDays
              ?.map((day) => `(${daysMap[day]})`)
              .join(", ")}
          </Text>
        </View>
      </View>

      <View className="flex flex-row items-center gap-6">
        <IconSymbol size={20} name="clock" color={"#1A1C20"} />
        <Text className="label1-regular text-fg-neutral-muted">운영 시간</Text>
        <Text className="label1-medium text-fg-neutral-solid">
          {formatTime(project?.availableStartTime)} ~{" "}
          {formatTime(project?.availableEndTime)}
        </Text>
      </View>

      <View className="flex flex-row items-center gap-6">
        <IconSymbol size={20} name="camera" color={"#1A1C20"} />
        <Text className="label1-regular text-fg-neutral-muted">촬영 시간</Text>
        <Text className="label1-medium text-fg-neutral-solid">
          {project.durationHours}시간
        </Text>
      </View>

      <View className="flex flex-row items-center gap-2">
        <View className="flex flex-row flex-wrap w-full gap-2">
          {project.projectCategories.map((categoryWrapper) => (
            <Badge
              size="sm"
              className="rounded-full"
              key={categoryWrapper.categories.id}
              label={categoryWrapper.categories.name}
              icon={<IconSymbol size={12} name="hash" color="#000" />}
            />
          ))}
        </View>
      </View>
      <View className="flex flex-row items-center gap-2">
        <View className="flex flex-row flex-wrap items-center w-full gap-2">
          <Badge
            size="sm"
            className="rounded-full"
            label={SHOOTING_PREFERENCE_LABELS[project.deviceSource]}
            icon={<IconSymbol size={12} name="check" color={"#000"} />}
          />
        </View>
      </View>
      <View className="flex flex-row items-center gap-2">
        <View className="flex flex-row flex-wrap items-center w-full gap-2">
          {project.projectDevices.map((deviceWrapper) => (
            <Badge
              key={deviceWrapper.devices.id}
              label={deviceWrapper.devices.name}
              size="sm"
              className="rounded-full"
              icon={
                deviceWrapper.devices.type === "iphone" ||
                deviceWrapper.devices.type === "galaxy" ? (
                  <IconSymbol size={12} name="smartphone" color={"#000"} />
                ) : (
                  <IconSymbol size={12} name="camera" color={"#000"} />
                )
              }
            />
          ))}
        </View>
      </View>

      <ShootingPaymentInfo
        isPaid={project.isPaid}
        pricePerHour={project.pricePerHour}
        requestNote={project.requestNote}
      />
      <Text className="caption1-medium text-fg-neutral-subtle ml-auto">
        지원: {project.projectApplicants.length}
      </Text>
    </View>
  );
}
