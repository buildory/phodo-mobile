import { useState, useEffect } from "react";
import { getProjects } from "../api/getProjects";

export const useProjects = (recruitType: "photographer" | "model" | null) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects(recruitType)
      .then(({ data, error }) => {
        console.log(data);
        if (error) setError(error.message);
        else setData(data ?? []);
      })
      .finally(() => setLoading(false));
  }, [recruitType]);

  return { data, loading, error };
};
