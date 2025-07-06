import { z } from "zod";
import {
  NotificationSchema,
  CreateNotificationParamsSchema,
} from "./notification.schema";

export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotificationParams = z.infer<
  typeof CreateNotificationParamsSchema
>;
