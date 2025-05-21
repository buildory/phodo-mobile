import { useState } from "react";
import { updateUser, UpdateUserPayload } from "@/entities/auth/api";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateUserInfo = async (payload: UpdateUserPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await updateUser(payload);
      if (error) {
        setError(error.message);
        return false;
      } else {
        setSuccess(true);
        return true;
      }
    } catch (e: any) {
      setError(e?.message ?? "알 수 없는 오류");
      return false;
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
