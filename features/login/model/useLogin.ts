import { useRouter } from "expo-router";
import { useState } from "react";
import { signInWithPassword } from "@/entities/auth/api/signInWithPassword";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return false;
    }

    setLoading(true);
    try {
      const { error: supabaseError } = await signInWithPassword(email, password);

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

  return { login, loading, error };
};