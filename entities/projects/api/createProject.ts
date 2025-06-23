import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake } from "@/shared/lib";

export const createProject = async (payload) => {
  const supabase = getSupabaseClient();

    const categoryQuery = await supabase
    .from("categories")
    .select("id, slug")
    .in("slug", payload.projectCategories);
    
  const deviceQuery = await supabase
    .from("devices")
    .select("id, type")
    .in("type", payload.projectDevices);

  if (categoryQuery.error) throw categoryQuery.error;
  if (deviceQuery.error) throw deviceQuery.error;

  const categoryIds = categoryQuery.data.map((c) => c.id);
  const deviceIds = deviceQuery.data.map((d) => d.id);

  const {
  projectCategories,
  projectDevices,
  ...rest
} = payload;

    const payloadSnake = toSnake({
    ...rest,
    category_ids: categoryIds,
     device_ids: deviceIds
  });

    const { data, error } = await supabase.rpc("create_project_with_relations", payloadSnake);
  
    if (error) throw error;

  return data;
};
