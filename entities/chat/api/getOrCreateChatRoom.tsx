import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake, toCamel } from "@/shared/lib";
import type { CreateChatRoomParams } from "../model/chat.types";

export const getOrCreateChatRoom = async (user1Id: string, user2Id: string) => {
  const supabase = getSupabaseClient();
  
  const { data: existingRoom, error: findError } = await supabase
    .from("chat_rooms")
    .select("*")
    .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
    .single();

  if (findError && findError.code !== 'PGRST116') {
    throw findError;
  }

  if (existingRoom) {
    return { data: toCamel(existingRoom), error: null };
  }

  const newRoomParams: CreateChatRoomParams = {
    user1Id,
    user2Id,
  };

  const { data: newRoom, error: createError } = await supabase
    .from("chat_rooms")
    .insert(toSnake(newRoomParams))
    .select()
    .single();

  if (createError) throw createError;

  return { data: toCamel(newRoom), error: null };
};

