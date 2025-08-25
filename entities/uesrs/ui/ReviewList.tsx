import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { ReviewWithOptions } from "../model/review.types";
import { ReviewItem } from "./ReviewItem";
import Badge from "@/shared/ui/Badge";
import { cn } from "@/shared/lib";

interface ReviewListProps {
  reviews: ReviewWithOptions[];
  isLoading: boolean;
  type: 'MODEL' | 'PHOTOGRAPHER';
  onTypeChange: (type: 'MODEL' | 'PHOTOGRAPHER') => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  type,
  onTypeChange,
  onLoadMore,
  hasMore = false
}) => {
  const getTypeLabel = (type: 'MODEL' | 'PHOTOGRAPHER') => {
    return type === 'MODEL' ? '모델' : '작가';
  };

  const renderReviewItem = ({ item }: { item: ReviewWithOptions }) => (
    <ReviewItem review={item} />
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View className="py-16">
        <ActivityIndicator size="small" color="#9E77ED" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="py-32 items-center">
      <Text className="text-gray-500 text-base">
        아직 {getTypeLabel(type)} 리뷰가 없습니다.
      </Text>
      <Text className="text-gray-400 text-sm mt-4">
        프로젝트를 완료하면 리뷰를 받을 수 있어요!
      </Text>
    </View>
  );

  return (
    <View className="flex-1 mt-16">
      {/* 리뷰 목록 */}
      <Text className="body1-medium text-fg-neutral-solid">촬영 후기</Text>
      <View>
        {reviews.map((review) => (
          <ReviewItem key={review.id.toString()} review={review} />
        ))}
        {reviews.length === 0 && renderEmpty()}
        {hasMore && renderFooter()}
      </View>

      {/* 로딩 상태 */}
      {isLoading && (
        <View className="absolute inset-0 bg-white bg-opacity-50 items-center justify-center">
          <ActivityIndicator size="large" color="#9E77ED" />
        </View>
      )}
    </View>
  );
};
