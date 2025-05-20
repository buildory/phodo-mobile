import { supabase } from "@/shared/lib/supabase";

export const signOut = async () => {
  return await supabase.auth.signOut();
};