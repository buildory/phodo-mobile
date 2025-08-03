import React from "react";
import { View, Text } from "react-native";
import Badge from "@/shared/ui/Badge";

const COOPERATION_OPTIONS = [
  "thanks",
  "favor",
  "sns_tag",
  "portfolio",
  "original",
] as const;

type CooperationOption = (typeof COOPERATION_OPTIONS)[number];

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

interface ProjectPaymentInfoProps {
  isPaid: boolean;
  pricePerHour?: number;
  requestNote?: keyof typeof COOPERATION_LABELS;
}

export function ShootingPaymentInfo({
  isPaid,
  pricePerHour,
  requestNote,
}: ProjectPaymentInfoProps) {
  return (
    <View className="flex flex-row items-center gap-8">
      <Badge label={isPaid ? "유료" : "무료"} />
      <Text className="text-fg-brand label1-semiBold">
        {isPaid
          ? `${new Intl.NumberFormat("ko-KR").format(pricePerHour ?? 0)}원`
          : COOPERATION_LABELS[requestNote ?? "thanks"]?.title}
      </Text>
    </View>
  );
}