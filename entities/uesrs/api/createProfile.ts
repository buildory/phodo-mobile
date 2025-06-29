import { supabase } from "@/shared/lib/supabase";

type CreateProfileParams = {
  id: string;
  email: string;
};

export const createProfile = async ({ id, email }: CreateProfileParams) => {
  const { data, error } = await supabase.from("profiles").upsert(
    [
      {
        id,
        email,
      },
    ],
    { onConflict: "id" }
  );

  return { data, error };
};
