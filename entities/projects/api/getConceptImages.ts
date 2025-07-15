import { getSupabaseClient } from "@/shared/lib/supabase";
import { ConceptImages } from "../model";
import { toCamel } from "@/shared/lib";

export const getConceptImages = async (
  projectId: number
): Promise<ConceptImages[]> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("concept_images")
    .select("image_url")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true });

  if (error) throw error;

  return data ? data.map(toCamel) : [];
};
