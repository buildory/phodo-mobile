import { getSupabaseClient } from "@/shared/lib/supabase";

export const signInWithGoogle = async (idToken: string) => {
  const supabase = getSupabaseClient();
  return await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });
};