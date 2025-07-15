import { useQuery } from "@tanstack/react-query";
import { getConceptImages } from "../api/getConceptImages";

export const useProjects = (projectId: number) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getConceptImages(projectId),
  });
};
