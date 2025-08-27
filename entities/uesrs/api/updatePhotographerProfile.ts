import { getSupabaseClient } from "@/shared/lib/supabase";

type UpdatePhotographerProfileParams = {
  profileId: string;
  totalShootings?: number;
  totalShootingTime?: number;
  avgMatchingSpeed?: number;
  introduction?: string;
};

export const updatePhotographerProfile = async (params: UpdatePhotographerProfileParams) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("photographer_profiles")
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
