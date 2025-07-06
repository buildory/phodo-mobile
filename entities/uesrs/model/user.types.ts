import { z } from "zod";
import { ProfileSchema, UpdateProfileParamsSchema } from "./user.schema";

export type Profile = z.infer<typeof ProfileSchema>;

export type UpdateProfileParams = {
  id: string;
  values: Partial<z.infer<typeof UpdateProfileParamsSchema>>;
};
