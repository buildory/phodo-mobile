import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake } from "@/shared/lib";
import type { CreateApplicantParams } from "../model";

export const createApplicant = async (params: CreateApplicantParams) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("project_applicants")
    .insert(toSnake(params));
  return { data, error };
};
