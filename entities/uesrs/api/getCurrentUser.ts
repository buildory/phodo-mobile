import { getSupabaseClient } from "@/shared/lib/supabase";

export const getCurrentUser  = async () => {
  const supabase = getSupabaseClient();
  return await supabase.auth.getUser();
};