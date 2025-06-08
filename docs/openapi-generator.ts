import fs from 'fs';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registerProjectPaths } from '@/entities/projects/api';

const registry = new OpenAPIRegistry();

registerProjectPaths(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);

const openapiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Phodo App API',
    version: '1.0.0',
    description: '⚠️ 이 API는 Supabase SDK를 통해 호출됩니다.',
  },
});

fs.writeFileSync('./docs/openapi.json', JSON.stringify(openapiDocument, null, 2));
console.log('✅ OpenAPI 문서 생성 완료: ./docs/openapi.json');
