import { useState } from "react";
import { updateUser, UpdateUserPayload } from "@/entities/auth/api";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateUserInfo = async (
    payload: UpdateUserPayload
  ): Promise<{ ok: boolean; error?: string }> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await updateUser(payload);
      if (error) {
        setError(error.message);
        return { ok: false, error: error.message };
      } else {
        setSuccess(true);
        return { ok: true };
      }
    } catch (e: any) {
      const message = e?.message ?? "알 수 없는 오류";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserInfo,
    loading,
    error,
    success,
  };
};

