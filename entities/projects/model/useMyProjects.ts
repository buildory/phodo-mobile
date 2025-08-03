import { useQuery } from '@tanstack/react-query'
import { getMyProjects } from '../api/getMyProjects';

export const useMyProjects = (userId: string) => {
  return useQuery({
    queryKey: ['myProjects', userId],
    queryFn: () => getMyProjects(userId),
  })
}
