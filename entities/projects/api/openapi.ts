import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ProjectSchema, ProfileSchema, CategorySchema, DeviceSchema, ProjectListParamsSchema } from '../model/project.schema';

export const registerProjectPaths = (registry: OpenAPIRegistry) => {
  registry.register('Project', ProjectSchema);
  registry.register('Profile', ProfileSchema);
  registry.register('Category', CategorySchema);
  registry.register('Device', DeviceSchema);

  registry.registerPath({
    method: 'get',
    path: '/projects',
    summary: 'Get projects list',
    request: { query: ProjectListParamsSchema },
    responses: {
      200: {
        description: 'List of projects',
        content: {
          'application/json': {
            schema: z.array(ProjectSchema),
          },
        },
      },
    },
  });
};