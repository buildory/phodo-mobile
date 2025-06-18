import { getSupabaseClient } from "@/shared/lib/supabase";

export const signInWithPassword = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  return await supabase.auth.signInWithPassword({ email, password });
};