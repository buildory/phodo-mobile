import { getSupabaseClient } from "@/shared/lib/supabase";

type CreateProfileParams = {
  id: string;
  email: string;
};

export const createProfile = async ({ id, email }: CreateProfileParams) => {
  const supabase = getSupabaseClient();
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
