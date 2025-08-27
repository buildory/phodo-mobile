import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModelProfile } from "../api";

type UpdateModelProfileParams = {
  profileId: string;
  totalShootings?: number;
  totalShootingTime?: number;
  avgMatchingSpeed?: number;
  introduction?: string;
};

export const useUpdateModelProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateModelProfileParams) => updateModelProfile(params),
    onSuccess: (data, variables) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["userProfile", variables.profileId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
