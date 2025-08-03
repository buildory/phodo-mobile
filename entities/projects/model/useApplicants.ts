import { useQuery } from '@tanstack/react-query'
import { getApplicants } from '../api/getApplicants'

export const useApplicants = (projectId: number) => {
  return useQuery({
    queryKey: ['applicants', projectId],
    queryFn: () => getApplicants(projectId),
  })
}
