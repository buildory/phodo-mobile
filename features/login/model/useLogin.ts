import { useRouter } from "expo-router";
import { useState } from "react";
import { mapLoginErrorMessage } from "@/features/login/lib/loginErrorMapper";
import { signInWithPassword } from "@/entities/auth/api/signInWithPassword";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const { error: supabaseError } = await signInWithPassword(email, password);

      if (supabaseError) {
        console.error("로그인 오류:", supabaseError.message);
        return { success: false, message: mapLoginErrorMessage(supabaseError.message) };
      }

      router.replace("/(tabs)");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error
            ? mapLoginErrorMessage(err.message)
            : "알 수 없는 오류가 발생했습니다.",
      };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};