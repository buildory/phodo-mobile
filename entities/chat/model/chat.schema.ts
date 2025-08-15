import { z } from "zod";

export const ChatRoomSchema = z.object({
  id: z.string(),
  user1Id: z.string(),
  user2Id: z.string(),
  createdAt: z.date(),
});

export const CreateChatRoomParamsSchema = ChatRoomSchema.omit({
  id: true,
  createdAt: true,
});

export const ProfileSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  profileImage: z.string().nullable().optional(),
});

export const ChatRoomWithUsersSchema = ChatRoomSchema.extend({
  user1: ProfileSchema,
  user2: ProfileSchema,
});

export const ChatMessageSchema = z.object({
  id: z.string(),
  chatRoomId: z.string(),
  senderId: z.string(),
  content: z.string(),
  createdAt: z.date(),
  isRead: z.boolean(),
});

export const CreateChatMessageParamsSchema = ChatMessageSchema.omit({
  id: true,
  createdAt: true,
  isRead: true,
});
