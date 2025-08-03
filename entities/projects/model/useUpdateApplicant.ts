import { useMutation } from "@tanstack/react-query";
import { updateApplicant } from "../api/updateApplicant";
import type { UpdateApplicantParams } from "./project.types";

export const useUpdateApplicant = () => {
  return useMutation({
    mutationFn: (params: UpdateApplicantParams) => updateApplicant(params),
  });
};
