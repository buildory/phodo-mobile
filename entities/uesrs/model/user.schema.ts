import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  nickname: z.string(),
  gender: z.string().optional(),
  profileImage: z.string(),
  pushToken : z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export const UpdateProfileParamsSchema = ProfileSchema.omit({
  id: true,
  email: true,
  createdAt: true,
});
