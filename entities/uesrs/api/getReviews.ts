import { getSupabaseClient } from "@/shared/lib/supabase";
import { toCamel } from "@/shared/lib";
import { ReviewWithOptions } from "../model/review.types";

export interface GetReviewsParams {
  userId: string;
  type?: 'MODEL' | 'PHOTOGRAPHER';
  limit?: number;
  offset?: number;
}

export const getReviews = async ({
  userId,
  type,
  limit = 20,
  offset = 0
}: GetReviewsParams): Promise<ReviewWithOptions[]> => {
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
      ),
      reviewer:profiles!reviews_reviewer_id_fkey(
        nickname,
        profile_image
      ),
      project:projects(
        title,
        input_location,
        pin_display
      )
    `)
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('리뷰를 불러오는데 실패했습니다.');
  }

  // toCamel을 사용하여 snake_case를 camelCase로 변환
  return (data || []).map(review => toCamel(review));
};
