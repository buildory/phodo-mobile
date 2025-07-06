import { View, Text, StyleSheet, Pressable } from "react-native";
import Badge from "@/shared/ui/Badge";
import { copyToClipboard } from "@/shared/lib/clipboard";
import { IconSymbol } from "@/shared/ui/IconSymbol";

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

export function ProjectCard({ project }) {
  return (
    <View
      className="card"
      style={{
        borderColor: "#E9EAEB",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        flex: 1,
        gap: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Badge
          label={project.recruitType === "model" ? "모델 구인" : "작가 구인"}
          backgroundColor="#fff"
          color="#6172f3"
          borderColor="#6172f3"
          borderRadius={4}
          borderWidth={1}
        />
        <Badge
          label={project.pinDisplay === "always" ? "상시 촬영" : "버블 촬영"}
          backgroundColor="#fff"
          color="#6172f3"
          borderColor="transparent"
          borderWidth={1}
        />
      </View>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{ fontWeight: "bold", fontSize: 18 }}
      >
        {project.title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconSymbol size={12} name="mappin" color={"#717680"} />
            <Text
              style={{
                color: "#535862",
                fontSize: 14,
                lineHeight: 18,
                marginLeft: 4,
              }}
            >
              {project.distance}
            </Text>
          </View>

          <Pressable
            onPress={() => copyToClipboard(project.locationAddress)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text style={{ fontSize: 14, lineHeight: 18, color: "#535862" }}>
              {project.inputLocation}
            </Text>
            <IconSymbol
              size={12}
              name="copy"
              color="#000"
              style={{ marginLeft: 4 }}
            />
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 4 }} className="category">
        {project.projectCategories.map((categoryWrapper) => (
          <Badge
            key={categoryWrapper.categories.id}
            label={categoryWrapper.categories.name}
            backgroundColor="#fff"
            color="#000000"
            borderColor="#E9EAEB"
            borderWidth={1}
            icon={<IconSymbol size={12} name="hash" color={"#000"} />}
          />
        ))}
      </View>
      <Badge
        label={SHOOTING_PREFERENCE_LABELS[project.deviceSource]}
        backgroundColor="#fff"
        color="#000000"
        borderColor="#E9EAEB"
        borderWidth={1}
        icon={<IconSymbol size={12} name="hash" color={"#000"} />}
      />
      <View style={{ flexDirection: "row", gap: 4 }} className="category">
        {project.projectDevices.map((deviceWrapper) => (
          <Badge
            key={deviceWrapper.devices.id}
            label={deviceWrapper.devices.name}
            backgroundColor="#fff"
            color="#000000"
            borderColor="#E9EAEB"
            borderWidth={1}
            icon={<IconSymbol size={12} name="hash" color={"#000"} />}
          />
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Badge
          label={project.isPaid ? "유료" : "무료"}
          backgroundColor="#9e77ed"
          color="#ffffff"
          borderRadius={4}
        />
        <Text style={{ color: "#9e77ed", fontWeight: 700 }}>
          {project.isPaid
            ? `${new Intl.NumberFormat("ko-KR").format(
                project.pricePerHour
              )}원`
            : COOPERATION_LABELS[project.requestNote].title}
        </Text>
      </View>
      <View style={styles.separator} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>{project.profiles.nickname}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <IconSymbol size={12} name="users" color={"#000"} />
          <Text>0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 12,
  },
});
