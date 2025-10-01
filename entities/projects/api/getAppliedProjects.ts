import { getSupabaseClient } from "@/shared/lib/supabase";
import { Project } from "../model";
import { toCamel } from "@/shared/lib";

export const getAppliedProjects = async (
  userId: string
): Promise<Project[]> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("project_applicants")
    .select(`
      status,
      project:project_id (
        *,
        profiles (
          id,
          nickname,
          gender
        ),
        project_categories (
          categories (
            id,
            name
          )
        ),
        project_devices (
          devices (
            id,
            type,
            name
          )
        )
      )
    `)
    .eq("applicant_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

    return data
    ? data.map((item) => ({
        ...toCamel(item.project),
        status: item.status,
      }))
    : [];
};
