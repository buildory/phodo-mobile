import { z } from 'zod'
import { ProjectSchema, ProjectListParamsSchema } from './project.schema'

export type Project = z.infer<typeof ProjectSchema>
export type ProjectListParams = z.infer<typeof ProjectListParamsSchema>
