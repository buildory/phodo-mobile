import { getSupabaseClient } from "@/shared/lib/supabase";
import { Project } from "../model";
import { toCamel } from "@/shared/lib";

export const getProject = async (projectId: string): Promise<Project | null> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        *,
        profiles (
          nickname,
          gender
        ),
        project_applicants (
          applicant_id
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
        ),
        reviews!left(*)
      `
    )
    .eq("id", projectId)
    .single();

  if (error) throw error;

  const reviewCount = data?.reviews?.length || 0;
  
  const { reviews, ...projectData } = data || {};
  const projectWithReviewCount = {
    ...projectData,
    reviewCount
  };

  return projectWithReviewCount ? toCamel(projectWithReviewCount) : null;
};
