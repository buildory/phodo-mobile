import { getSupabaseClient } from "@/shared/lib/supabase";
import { toCamel } from "@/shared/lib";

export const getApplicants = async (projectId: number) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("project_applicants")
    .select(`
      id,
      status,
      message,
      created_at,
      updated_at,
      matched_at,
      started_at,
      ended_at,
      completed_at,
      reason,
      share_channel,
      download_url,
      applicant:profiles (
        id,
        nickname,
        gender,
        profile_image
      ),
      project:projects (
        title,
        recruit_type
      )
    `)
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return data ? data.map(toCamel) : [];
};
