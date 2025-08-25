import React from "react";
import { View, Text } from "react-native";
import { ReviewStats as ReviewStatsType } from "../model/review.types"

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
  return (
    <View className="mt-16">
      <Text className="body1-medium text-fg-neutral-solid mt-16">
        이런 점이 좋았어요
      </Text>
      <View className="flex-row items-center justify-between mt-8">
        <View className="flex-row items-center">
          <Text className="label1-medium">
            {stats.totalReviews} 명 참여
          </Text>
        </View>
      </View>

        <View>
          {Object.entries(stats.categoryStats).map(
            ([categoryName, categoryData]) => (
              <View key={categoryName} className="min-w-120">
                {/* <Text className="text-sm font-medium text-gray-700 mb-8">
                  {categoryName}
                </Text> */}
                <View className="mt-8">
                  {Object.entries((categoryData as any).options).map(
                    ([optionName, count]) => (
                      <View
                        key={optionName}
                        className="px-12 py-10 flex-row items-center justify-between bg-bg-positive-opacity rounded-4"
                      >
                        <Text
                          className="label1-medium text-fg-positive-solid"
                          numberOfLines={1}
                        >
                          {optionName}
                        </Text>
                        <Text
                          className="label1-medium text-fg-neutral-subtle"
                          numberOfLines={1}
                        >
                          {count as number}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )
          )}
        </View>
    
    </View>
  );
};
