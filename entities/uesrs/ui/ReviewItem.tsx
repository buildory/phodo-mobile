import React from "react";
import { View, Text, TextInput } from "react-native";
import { ReviewWithOptions } from "../model/review.types";
import { UserAvatar } from "./UserAvatar";
import Badge from "@/shared/ui/Badge";
import { formatDate } from "@/shared/lib";
import { IconSymbol } from "@/shared/ui/IconSymbol";

interface ReviewItemProps {
  review: ReviewWithOptions;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const getTypeLabel = (type: "MODEL" | "PHOTOGRAPHER") => {
    return type === "MODEL" ? "모델" : "작가";
  };

  return (
    <View className="mb-8 border-b border-stroke-divider-subtle pb-16">
      {/* 리뷰어 정보 */}
      <View className="flex-row items-center mt-8">
        <UserAvatar
          size={32}
          imageUrl={review.reviewer?.profileImage}
          nickname={review.reviewer?.nickname}
        />
        <View className="flex-1 ml-8">
          <Text className="label1-medium text-fg-neutral-solid">
            {review.reviewer?.nickname || "알 수 없음"}
          </Text>
        </View>

        <Text className="label2-medium text-bg-info-solid">
          {review.project?.pinDisplay === "bubble" ? "버블 촬영" : "상시 촬영"}
        </Text>
      </View>

      {/* 프로젝트 정보 */}
      {review.project && (
        <View className="mt-8">
          <Text className="text-fg-neutral-muted body2-semiBold">
            {review.project.title}
          </Text>
          <View className="flex-row items-center gap-4">
            <IconSymbol size={14} name="mappin" color={"#868b94"} />
            <Text className="text-fg-neutral-muted label2-regular">
              {review.project.inputLocation}
            </Text>
          </View>
        </View>
      )}

      {review.comment && (
        <View className="mt-8">
          <Text className="body1-regular text-fg-neutral-solid">
            {review.comment}
          </Text>
        </View>
      )}

      {/* 선택된 옵션들 */}
      {review.selectedOptions && review.selectedOptions.length > 0 && (
        <View className="mt-8">
          <View className="flex-row flex-wrap gap-8">
            {review.selectedOptions?.map((option) => (
              <Badge
                key={option.reviewOptionId}
                variant="subtle"
                size="sm"
                label={`# ${option.reviewOptions.nameKo}`}
              />
            ))}
          </View>
        </View>
      )}

      {/* 날짜 */}
      <Text className="label2-regular text-fg-neutral-muted self-end">
        {formatDate(review.createdAt)}
      </Text>
    </View>
  );
};
