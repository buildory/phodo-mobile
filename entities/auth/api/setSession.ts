import { supabase } from "@/shared/lib/supabase";

export type AuthTokenPair = {
  access_token: string;
  refresh_token: string;
};

export const setSession = async ({ access_token, refresh_token }: AuthTokenPair) => {
  return await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
};