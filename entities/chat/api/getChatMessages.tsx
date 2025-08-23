import { getSupabaseClient } from "@/shared/lib/supabase";
import { toCamel } from "@/shared/lib";

export const getChatMessages = async (chatRoomId: string, limit: number = 20) => {
  if (!chatRoomId) {
    throw new Error('chatRoomId is required');
  }

  const supabase = getSupabaseClient();

  let query = supabase
    .from("chat_messages")
    .select(
      `
      *,
      sender:profiles(id, nickname, profile_image)
    `
    )
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: false })
    .limit(limit);

  const { data, error } = await query;

  if (error) throw error;

  const messages = toCamel(data);
   
  if (!messages || !Array.isArray(messages)) {
    return [];
  }
  
  return messages.reverse();
};
