import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake } from "@/shared/lib";
import type { CreateChatRoomParams } from "../model/chat.types";

export const createChatRoom = async (params: CreateChatRoomParams) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("chat_rooms")
    .insert(toSnake(params));
  return { data, error };
};
