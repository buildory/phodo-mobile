import { useRouter } from "expo-router";
import { useState } from "react";
import { signOut } from "@/entities/auth/api/signout";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const { error: supabaseError } = await signOut();

      if (supabaseError) {
        setError(supabaseError.message);
        return false;
      } else {
        router.replace("/(tabs)");
        return true;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};