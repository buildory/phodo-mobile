import { getSupabaseClient } from "@/shared/lib/supabase";

export const getUserByEmail = async (email: string) => {
  const supabase = getSupabaseClient();
  return await await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
};
