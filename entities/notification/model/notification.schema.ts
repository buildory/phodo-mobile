import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  data: z.record(z.any()).optional(),
  createdAt: z.string().optional(),
});

export const CreateNotificationParamsSchema = NotificationSchema.omit({
  id: true,
  createdAt: true,
});
