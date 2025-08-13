import { z } from "zod";
import {
  ChatRoomSchema,
  CreateChatRoomParamsSchema,
  ChatRoomWithUsersSchema,
  ChatMessageSchema,
  CreateChatMessageParamsSchema,
} from "./chat.schema";

export type ChatRoom = z.infer<typeof ChatRoomSchema>;
export type CreateChatRoomParams = z.infer<typeof CreateChatRoomParamsSchema>;
export type ChatRoomWithUsers = z.infer<typeof ChatRoomWithUsersSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type CreateChatMessageParams = z.infer<typeof CreateChatMessageParamsSchema>;
