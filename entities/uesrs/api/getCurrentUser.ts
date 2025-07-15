import { toCamel } from "@/shared/lib";
import { getSupabaseClient } from "@/shared/lib/supabase";

export const getCurrentUser  = async () => {
  const supabase = getSupabaseClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) throw new Error("유저 없음");

    const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data? toCamel(data): null;
};