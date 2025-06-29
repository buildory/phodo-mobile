import { getSupabaseClient } from "@/shared/lib/supabase";

export const signOut = async () => {
  const supabase = getSupabaseClient();
  return await supabase.auth.signOut();
};