import { useRouter } from "expo-router";
import { useState } from "react";
import { signOut } from "@/entities/auth/api";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { supabase } from "@/shared/lib/supabase";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const isGoogle = session?.user?.app_metadata?.provider === "google";

      const { error: supabaseError } = await signOut();
      if (supabaseError) {
        setError(supabaseError.message);
        return false;
      }

      if (isGoogle) {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          await GoogleSignin.signOut();
        }
      }

      router.replace("/(auth)/login");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
}
