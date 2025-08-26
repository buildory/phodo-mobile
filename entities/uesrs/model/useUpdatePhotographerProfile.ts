import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePhotographerProfile } from "../api";

type UpdatePhotographerProfileParams = {
  profileId: string;
  totalShootings?: number;
  totalShootingTime?: number;
  avgMatchingSpeed?: number;
  introduction?: string;
};

export const useUpdatePhotographerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdatePhotographerProfileParams) => updatePhotographerProfile(params),
    onSuccess: (data, variables) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["userProfile", variables.profileId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
