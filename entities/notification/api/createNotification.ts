import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake } from "@/shared/lib";
import type { CreateNotificationParams } from "../model/notification.types";

export const createNotification = async (params: CreateNotificationParams) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("notifications")
    .insert(toSnake(params));
  return { data, error };
};
