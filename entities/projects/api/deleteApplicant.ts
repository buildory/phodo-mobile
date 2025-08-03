import { getSupabaseClient } from "@/shared/lib/supabase";

export const deleteApplicant = async (applicantId: number) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("project_applicants")
    .delete()
    .eq("id", applicantId);
  return { data, error };
};
