import { useMutation } from "@tanstack/react-query";
import { createApplicant } from './../api/createApplicant';
import { CreateApplicantParams } from "./project.types";

export const useCreateApplicant = () => {
  return useMutation({
    mutationFn: (params: CreateApplicantParams) => createApplicant(params),
  });
};
