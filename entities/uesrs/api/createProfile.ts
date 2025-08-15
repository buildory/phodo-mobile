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

  if (error) return { data, error };

  const { error: photographerError } = await supabase
    .from("photographer_profiles")
    .upsert(
      [
        {
          profile_id: id,
          total_shootings: 0,
          total_shooting_time: 0,
          avg_matching_speed: 0,
        },
      ],
      { onConflict: "profile_id" }
    );


  const { error: modelError } = await supabase
    .from("model_profiles")
    .upsert(
      [
        {
          profile_id: id,
          total_shootings: 0,
          total_shooting_time: 0,
          avg_matching_speed: 0,
        },
      ],
      { onConflict: "profile_id" }
    );

  return { 
    data, 
    error: error || photographerError || modelError 
  };
};
