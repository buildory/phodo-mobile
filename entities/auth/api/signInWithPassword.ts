import { supabase } from "@/shared/lib/supabase";

export const signInWithPassword = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};