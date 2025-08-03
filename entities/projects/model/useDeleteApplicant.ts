import { useMutation } from "@tanstack/react-query";
import { deleteApplicant } from "../api/deleteApplicant";

export const useDeleteApplicant = () => {
  return useMutation({
    mutationFn: (applicantId: number) => deleteApplicant(applicantId),
  });
};
