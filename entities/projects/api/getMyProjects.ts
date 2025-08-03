import { getSupabaseClient } from "@/shared/lib/supabase";
import { Project } from "../model";
import { toCamel } from "@/shared/lib";

export const getMyProjects = async (
  userId: string
): Promise<Project[]> => {
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
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ? data.map(toCamel) : [];
};

