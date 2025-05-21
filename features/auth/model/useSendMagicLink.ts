import { useState } from "react";
import { sendMagicLink } from "@/entities/auth/api";

type UseSendMagicLinkParams = {
  defaultRedirectUrl?: string;
  defaultType?: string;
};

export const useSendMagicLink = (params?: UseSendMagicLinkParams) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const send = async (
    email: string,
    redirectUrl?: string,
    type?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const finalRedirect = redirectUrl || params?.defaultRedirectUrl || "";
    const finalType = type || params?.defaultType;

    try {
      const { error } = await sendMagicLink({
        email,
        redirectUrl: finalRedirect,
        type: finalType,
      });

      if (error) {
        setError(error.message);
        return false;
      } else {
        setSuccess(true);
        return true;
      }
    } catch (e: any) {
      const message = e?.message ?? "알 수 없는 오류가 발생했습니다.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    send,
    loading,
    error,
    success,
  };
};