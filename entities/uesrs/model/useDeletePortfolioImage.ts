import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePortfolioImage } from "../api/deletePortfolioImage";

type DeletePortfolioImageParams = {
  imageId: string;
  userId: string;
  profileType: 'photographer' | 'model';
};

export const useDeletePortfolioImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeletePortfolioImageParams) => deletePortfolioImage({ imageId: params.imageId }),
    onSuccess: (data, variables) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["portfolioImages", variables.userId, variables.profileType] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}; 