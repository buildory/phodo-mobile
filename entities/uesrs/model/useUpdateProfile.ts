import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api";
import type { UpdateProfileParams } from "./user.types";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (params: UpdateProfileParams) => updateProfile(params),
  });
};
