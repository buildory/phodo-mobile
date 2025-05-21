import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { getSession } from "@/entities/auth/api";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await getSession();
        if (error) {
          setError(error.message);
        } else {
          setSession(data.session ?? null);
        }
      } catch (e: any) {
        setError(e?.message || "세션 정보를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return {
    session,
    loading,
    error,
  };
};
