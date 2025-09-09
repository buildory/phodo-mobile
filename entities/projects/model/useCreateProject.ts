import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../api/createProject";

type CreateProjectParams = {
  form: any;
  images: string[];
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateProjectParams) => createProject(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['projects'] 
      });
    },
  });
};
