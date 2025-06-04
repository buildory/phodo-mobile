import { supabase } from "@/shared/lib/supabase";

export const getProjects = async (
  selected?: "photographer" | "model" | null
) => {
  const query = supabase
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

  if (selected) {
    return query.eq("recruit_type", selected);
  }

  return query;
};
