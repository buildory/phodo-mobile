import { supabase } from "@/shared/lib/supabase";

export const getUserByEmail = async (email: string) => {
  return await await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
};
