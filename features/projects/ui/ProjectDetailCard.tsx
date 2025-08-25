import { View, Text, Pressable } from "react-native";
import Badge from "@/shared/ui/Badge";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

export const COOPERATION_OPTIONS = [
  "thanks",
  "favor",
  "sns_tag",
  "portfolio",
  "original",
] as const;

export type CooperationOption = (typeof COOPERATION_OPTIONS)[number];
export type CooperationOptionMeta = {
  title: string;
  description?: string;
};

export const COOPERATION_LABELS: Record<
  CooperationOption,
  CooperationOptionMeta
> = {
  thanks: {
    title: "감사 인사 전달 💜",
    description: "간단한 선물이나 진심 어린 인사로 마음을 전할게요",
  },
  favor: {
    title: "작은 부탁 가능 💜",
    description: "짧은 영상, 추가 컷 요청 등 소소한 부탁은 도와드릴게요",
  },
  sns_tag: {
    title: "SNS 태그 약속 💜",
    description: "결과물을 작가님 계정 태그하거나 소개드릴게요",
  },
  portfolio: {
    title: "포트폴리오 교류 💜",
    description: "결과물은 서로 포트폴리오에 자유롭게 활용할 수 있어요",
  },
  original: {
    title: "원본 모두 제공 💜",
    description: "촬영한 원본 컷을 전부 공유해드릴게요",
  },
};

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

export default function ProjectDetailCard({ project, reviewCount }) {
  return (
    <View className="p-12 gap-8 flex-1">
      <View className="flex flex-row items-center gap-6">
        <Badge
          label={project.recruitType === "model" ? "모델 구인" : "작가 구인"}
          className="border-stroke-field border rounded-4"
        />
        <Badge
          label={project.pinDisplay === "always" ? "상시 촬영" : "버블 촬영"}
          className="border-stroke-field border rounded-4"
        />
      </View>
      <Pressable>
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          className="headline1-semiBold"
        >
          {project.title || "제목 없음"}
        </Text>
      </Pressable>

      <View className="flex flex-row items-center gap-6">
        <IconSymbol size={12} name="camera" color={"#717680"} />
        <Text className="label1-regular">{project.durationHours} 시간</Text>

        <View className="flex flex-row items-center gap-8">
          <Badge label={project.isPaid ? "유료" : "무료"} />
          <Text className="text-fg-brand label1-semiBold">
            {project.isPaid
              ? `${new Intl.NumberFormat("ko-KR").format(project.pricePerHour)}원`
              : COOPERATION_LABELS[project.requestNote]?.title}
          </Text>
        </View>
      </View>

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

      <View className="flex flex-row items-center gap-6">
        <IconSymbol size={12} name="calendar" color={"#717680"} />
        <Text className="label1-regular">촬영 가능 일정</Text>
        <View className="flex flex-wrap items-center w-2/3">
        <Text className="label1-regular">
          {project?.availableDates?.join(", ")}
          {project?.availableDays?.map((day) => ` ${daysMap[day]}`).join(", ")}
        </Text>
        </View>
      </View>

      <View className="flex flex-row items-center gap-6">
        <IconSymbol size={12} name="clock" color={"#717680"} />
        <Text className="label1-regular">촬영가능 시간</Text>
        <Text className="label1-regular">
          {formatTime(project?.availableStartTime)} ~{" "}
          {formatTime(project?.availableEndTime)}
        </Text>
      </View>

      <View className="flex flex-row gap-2 items-center">
        <Text className="caption2-regular">촬영 분야</Text>
        <View className="flex flex-row gap-2 w-2/3 flex-wrap">
          {project.projectCategories.map((categoryWrapper) => (
            <Badge
              size="sm"
              key={categoryWrapper.categories.id}
              label={categoryWrapper.categories.name}
              icon={<IconSymbol size={12} name="hash" color="#000" />}
            />
          ))}
        </View>
      </View>
      <View className="flex flex-row gap-2 items-center">
        <Text className="caption2-regular">촬영 방식</Text>
        <View className="flex flex-row gap-2 items-center w-2/3 flex-wrap">
          <Badge
            label={SHOOTING_PREFERENCE_LABELS[project.deviceSource]}
            icon={<IconSymbol size={12} name="hash" color={"#000"} />}
          />
        </View>
      </View>
      <View className="flex flex-row gap-2 items-center">
        <Text className="caption2-regular">선호 기기</Text>
        <View className="flex flex-row gap-2 items-center w-2/3 flex-wrap">
          {project.projectDevices.map((deviceWrapper) => (
            <Badge
              key={deviceWrapper.devices.id}
              label={deviceWrapper.devices.name}
              size="sm"
              variant={"outline"}
              icon={<IconSymbol size={12} name="hash" color={"#000"} />}
            />
          ))}
        </View>
      </View>

      <View className="mt-12 h-1 bg-stroke-divider-subtle" />
      <View className="flex flex-row justify-between">
        <Text>{project.profiles.nickname}</Text>
        <View className="flex flex-row gap-2">
          <View className="flex flex-row items-center gap-2">
            <Text className="caption2-regular">지원자</Text>
            <Text className="caption2-regular">{project.projectApplicants.length}</Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="caption2-regular">리뷰</Text>
            <Text className="caption2-regular">{reviewCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
