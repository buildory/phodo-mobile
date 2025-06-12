import { supabase } from "@/shared/lib/supabase";
import { Project, ProjectListParams } from "../model";

export const getProjects = async (
  params: ProjectListParams
): Promise<Project[]> => {
  let query = supabase
    .from("projects")
    .select(
      `
        *,
        profiles (
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
      `
    )
    .order("created_at", { ascending: false });

  if (params.recruitType) {
    query = query.eq("recruit_type", params.recruitType);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data ?? [];
};
