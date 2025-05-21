import { supabase } from "@/shared/lib/supabase";

export const getSession = async () => {
  return await supabase.auth.getSession();
};