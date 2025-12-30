import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake } from "@/shared/lib";

type CreateProjectParams = {
  form: any;
  images: string[];
};

export const createProject = async ({ form, images }: CreateProjectParams) => {
  const supabase = getSupabaseClient();

  const categoryQuery = await supabase
    .from("categories")
    .select("id, slug")
    .in("slug", form.projectCategories);
    
  const deviceQuery = await supabase
    .from("devices")
    .select("id, type")
    .in("type", form.projectDevices);

  if (categoryQuery.error) throw categoryQuery.error;
  if (deviceQuery.error) throw deviceQuery.error;

  const categoryIds = categoryQuery.data.map((c) => c.id);
  const deviceIds = deviceQuery.data.map((d) => d.id);

  const {
    projectCategories,
    projectDevices,
    ...rest
  } = form;

  const payloadSnake = toSnake({
    ...rest,
    category_ids: categoryIds,
    device_ids: deviceIds
  });

  const { data, error } = await supabase.rpc("create_project_with_relations", payloadSnake);
  
  if (error) throw error;

  return data;
};
