import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPortfolioImage } from "../api/uploadPortfolioImage";

type UploadPortfolioImageParams = {
  userId: string;
  profileType: 'photographer' | 'model';
  imageFile: File;
  title?: string;
};

export const useUploadPortfolioImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UploadPortfolioImageParams) => uploadPortfolioImage(params),
    onSuccess: (data, variables) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["portfolioImages", variables.userId, variables.profileType] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
