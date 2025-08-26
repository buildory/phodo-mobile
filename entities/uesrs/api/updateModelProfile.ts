import { getSupabaseClient } from "@/shared/lib/supabase";

type UpdateModelProfileParams = {
  profileId: string;
  totalShootings?: number;
  totalShootingTime?: number;
  avgMatchingSpeed?: number;
  introduction?: string;
};

export const updateModelProfile = async (params: UpdateModelProfileParams) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("model_profiles")
    .update({
      total_shootings: params.totalShootings,
      total_shooting_time: params.totalShootingTime,
      avg_matching_speed: params.avgMatchingSpeed,
      introduction: params.introduction,
    })
    .eq("profile_id", params.profileId)
    .select()
    .single();

  return { data, error };
};
