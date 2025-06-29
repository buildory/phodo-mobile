import { getSupabaseClient } from "@/shared/lib/supabase";

export type UpdateUserPayload = {
  email?: string;
  password?: string;
  data?: Record<string, any>;
  emailRedirectTo?: string;
};

export const updateUser = async ({
  email,
  password,
  data,
  emailRedirectTo,
}: UpdateUserPayload) => {
  const supabase = getSupabaseClient();
  const attributes = { email, password, data };
  const options = emailRedirectTo ? { emailRedirectTo } : {};

  return await supabase.auth.updateUser(attributes, options);
};
