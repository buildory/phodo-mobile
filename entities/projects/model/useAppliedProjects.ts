import { useQuery } from '@tanstack/react-query'
import { getAppliedProjects } from '../api/getAppliedProjects'

export const useAppliedProjects = (userId: string) => {
  return useQuery({
    queryKey: ['appliedProjects', userId],
    queryFn: () => getAppliedProjects(userId),
  })
}
