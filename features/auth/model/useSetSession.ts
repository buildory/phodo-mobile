import { useState } from "react";
import { setSession } from "@/entities/auth/api";

export const useSetSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const setAuthSession = async (
    access_token: string,
    refresh_token: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await setSession({ access_token, refresh_token });
      if (error) {
        setError(error.message);
        return false;
      } else {
        setSuccess(true);
        return true;
      }
    } catch (e: any) {
      const message = e?.message ?? "세션 설정 중 오류 발생";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    setAuthSession,
    loading,
    error,
    success,
  };
};
