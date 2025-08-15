import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api";

export const useUserProfile = (userId: string | null) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });
};
