import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake } from "@/shared/lib";

export interface CreateChatMessageParams {
  chatRoomId: string;
  senderId: string;
  content: string;
}

export const createChatMessage = async (params: CreateChatMessageParams) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("chat_messages")
    .insert(toSnake({
      chatRoomId: params.chatRoomId,
      senderId: params.senderId,
      content: params.content,
      isRead: false,
    }))
    .select()
    .single();

  if (error) throw error;
  return data;
};

