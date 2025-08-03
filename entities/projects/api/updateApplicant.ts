import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake } from "@/shared/lib";
import type { UpdateApplicantParams } from "../model";

export const updateApplicant = async ({ id, values }: UpdateApplicantParams) => {
  console.log('id', id);
    console.log('values', values);
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("project_applicants")
    .update(toSnake(values))
    .eq("id", id);
console.log(data)
  return { data, error };
};
