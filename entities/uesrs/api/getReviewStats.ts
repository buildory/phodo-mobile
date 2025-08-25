import { getSupabaseClient } from "@/shared/lib/supabase";
import { toCamel } from "@/shared/lib";
import { ReviewStats } from "../model/review.types";

export interface GetReviewStatsParams {
  userId: string;
  type?: 'MODEL' | 'PHOTOGRAPHER';
}

export const getReviewStats = async ({
  userId,
  type
}: GetReviewStatsParams): Promise<ReviewStats> => {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('reviews')
    .select(`
      *,
      selected_options:review_selected_options(
        review_option_id,
        review_options(
          id,
          name_ko,
          category_id,
          review_categories(
            id,
            name_ko,
            type
          )
        )
      )
    `)
    .eq('reviewee_id', userId);

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching review stats:', error);
    throw new Error('리뷰 통계를 불러오는데 실패했습니다.');
  }

  const reviews = data || [];
  const totalReviews = reviews.length;

  // 카테고리별 통계 계산
  const categoryStats: ReviewStats['categoryStats'] = {};

  reviews.forEach((review: any) => {
    review.selected_options?.forEach((option: any) => {
      const categoryName = option.review_options.review_categories.name_ko;
      const optionName = option.review_options.name_ko;

      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = {
          count: 0,
          options: {}
        };
      }

      categoryStats[categoryName].count++;
      
      if (!categoryStats[categoryName].options[optionName]) {
        categoryStats[categoryName].options[optionName] = 0;
      }
      categoryStats[categoryName].options[optionName]++;
    });
  });

  return {
    totalReviews,
    categoryStats
  };
};
