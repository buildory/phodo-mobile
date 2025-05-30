import { supabase } from "@/shared/lib/supabase";

export const signInWithGoogle = async (idToken: string) => {
  return await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });
};