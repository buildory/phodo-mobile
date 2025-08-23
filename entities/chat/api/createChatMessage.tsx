import { getSupabaseClient } from "@/shared/lib/supabase";
import { toSnake } from "@/shared/lib";

export interface CreateChatMessageParams {
  chatRoomId: string;
  senderId: string;
  content: string;
}

export const createChatMessage = async (params: CreateChatMessageParams) => {
  const supabase = getSupabaseClient();

  const { data: messageData, error: messageError } = await supabase
    .from("chat_messages")
    .insert(toSnake({
      chatRoomId: params.chatRoomId,
      senderId: params.senderId,
      content: params.content,
      isRead: false,
    }))
    .select()
    .single();

  if (messageError) throw messageError;

  const { error: roomError } = await supabase
    .from("chat_rooms")
    .update(toSnake({
      lastMessage: params.content,
      lastMessageTime: new Date().toISOString(),
      lastMessageSenderId: params.senderId,
    }))
    .eq("id", params.chatRoomId);

  if (roomError) throw roomError;

  return messageData;
};

