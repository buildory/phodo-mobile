import { getSupabaseClient } from "@/shared/lib/supabase";
import { toCamel } from "@/shared/lib";
import { ChatRoomWithUsers } from "../model/chat.types";

export const getChatMessages = async (chatRoomId: string) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("chat_messages")
    .select(
      `
      *,
    sender:profiles(id, nickname, profile_image)
  `
    )
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const messages = toCamel(data);

  return messages;
};
