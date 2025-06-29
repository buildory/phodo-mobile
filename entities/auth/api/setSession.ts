import { getSupabaseClient } from "@/shared/lib/supabase";

export type AuthTokenPair = {
  access_token: string;
  refresh_token: string;
};

export const setSession = async ({ access_token, refresh_token }: AuthTokenPair) => {
  const supabase = getSupabaseClient();
  return await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
};