import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "../api/uploadProfileImage";
import { useCurrentUserStore } from "./useCurrentUserStore";

type UploadProfileImageParams = {
  userId: string;
  imageUri: string;
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  const setProfile = useCurrentUserStore((state) => state.setProfile);

  return useMutation({
    mutationFn: (params: UploadProfileImageParams) => uploadProfileImage(params),
    onSuccess: (data, variables) => {
      // 현재 사용자 정보 무효화
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setProfile(data.updatedProfile);
    },
  });
}; 