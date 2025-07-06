import { getSupabaseClient } from "@/shared/lib/supabase";

export const getSession = async () => {
  const supabase = getSupabaseClient();
  return await supabase.auth.getSession();
};