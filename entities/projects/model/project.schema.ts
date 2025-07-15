import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const CategorySchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "아이폰" }),
  })
  .openapi("Category");

export const DeviceSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: "감성스냅" }),
    type: z.string().optional().openapi({ example: "dslr" }),
  })
  .openapi("Device");

export const ProfileSchema = z
  .object({
    nickname: z.string().openapi({ example: "포도여성작가" }),
    gender: z.string().openapi({ example: "female" }),
  })
  .openapi("Profile");

export const ProjectSchema = z
  .object({
    id: z.number().openapi({ example: 8 }),
    title: z
      .string()
      .openapi({ example: "지금 여기서 촬영할 모델님을 구해요" }),
    description: z.string().nullable().optional().openapi({ example: null }),
    user_id: z
      .string()
      .openapi({ example: "0a48f1b7-6d5b-4771-bc15-9d30bd13312c" }),
    created_at: z
      .string()
      .openapi({ format: "date-time", example: "2025-06-03T01:17:49.869079" }),
    availability_type: z.string().openapi({ example: "any" }),
    available_days: z
      .array(z.string())
      .nullable()
      .optional()
      .openapi({ example: null }),
    available_start_time: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: null }),
    available_end_time: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: null }),
    duration_hours: z.number().nullable().optional().openapi({ example: null }),
    is_paid: z.boolean().openapi({ example: false }),
    price_per_hour: z.number().nullable().optional().openapi({ example: null }),
    latitude: z.number().openapi({ example: 35.1796 }),
    longitude: z.number().openapi({ example: 129.0756 }),
    location_address: z
      .string()
      .openapi({ example: "부산광역시 중구 중앙대로 1001" }),
    input_location: z.string().openapi({ example: "부산광역시청" }),
    device_source: z.string().openapi({ example: "model_device" }),
    pin_display: z.string().openapi({ example: "bubble" }),
    recruit_type: z
      .enum(["model", "photographer"])
      .openapi({ example: "model" }),
    request_note: z.string().openapi({ example: "thanks" }),
    profiles: ProfileSchema,
    project_categories: z.array(z.object({ categories: CategorySchema })),
    project_devices: z.array(z.object({ devices: DeviceSchema })),
  })
  .openapi("Project");

export const ProjectListParamsSchema = z
  .object({
    recruitType: z
      .enum(["photographer", "model"])
      .nullable()
      .optional()
      .openapi({
        example: "photographer",
        description: "Filter by recruit type",
      }),
  })
  .openapi("ProjectListParams");

export const ConceptImagesSchema = z
  .object({
    id: z.number().openapi({ example: 8 }),
    projectId: z.number().openapi({ example: 36 }),
    imageUrl: z.string().openapi({ example: "https://example.com/image.jpg" }),
    orderIndex: z.number().openapi({ example: 0 }),
  })
  .openapi("ConceptImages");

export const ApplicantSchema = z.object({
  id: z.number().openapi({ example: 8 }),
  projectId: z.number().openapi({ example: 36 }),
  applicantId: z
    .string()
    .openapi({ example: "0a48f1b7-6d5b-4771-bc15-9d30bd13312c" }),
  status: z.string().openapi({ example: "pending" }),
  createdAt: z
    .string()
    .openapi({ format: "date-time", example: "2025-06-03T01:17:49.869079" }),
  updatedAt: z
    .string()
    .openapi({ format: "date-time", example: "2025-06-15 19:40:20.245925" }),
  message: z
    .string()
    .optional()
    .openapi({ example: "응답이 늦거나 연락이 어려웠어요" }),
});

export const CreateApplicantParamsSchema = ApplicantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
