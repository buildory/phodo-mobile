import { useQuery } from "@tanstack/react-query";
import { getReviews, GetReviewsParams } from "../api/getReviews";
import { getReviewStats, GetReviewStatsParams } from "../api/getReviewStats";

export const useReviews = (params: GetReviewsParams) => {
  return useQuery({
    queryKey: ["reviews", params.userId, params.type, params.limit, params.offset],
    queryFn: () => getReviews(params),
    enabled: !!params.userId,
  });
};

export const useReviewStats = (params: GetReviewStatsParams) => {
  return useQuery({
    queryKey: ["reviewStats", params.userId, params.type],
    queryFn: () => getReviewStats(params),
    enabled: !!params.userId,
  });
};
