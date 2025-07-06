import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake } from "@/shared/lib";
import type { UpdateProfileParams } from "../model/user.types";

export const updateProfile = async ({ id, values }: UpdateProfileParams) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(toSnake(values))
    .eq("id", id);

  return { data, error };
};
