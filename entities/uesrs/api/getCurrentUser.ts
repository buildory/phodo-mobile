import { supabase } from "@/shared/lib/supabase";

export const getCurrentUser  = async () => {
  return await supabase.auth.getUser();
};