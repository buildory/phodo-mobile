import { useEffect, useState } from "react";
import { useCurrentUserStore } from "./useCurrentUserStore";
import { getCurrentUser } from "../api";

export const useCurrentUser = () => {
  const { setProfile } = useCurrentUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getCurrentUser();
        setProfile(profile);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { loading, error };
};