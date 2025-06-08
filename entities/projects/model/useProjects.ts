import { useQuery } from '@tanstack/react-query'
import { getProjects } from '../api/getProjects'
import { ProjectListParams } from './project.types'

export const useProjects = (params: ProjectListParams) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => getProjects(params),
  })
}
