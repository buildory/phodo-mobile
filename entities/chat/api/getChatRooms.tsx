import { getSupabaseClient } from "@/shared/lib/supabase";
import { toCamel } from "@/shared/lib";
import { ChatRoomWithUsers } from "../model/chat.types";

export const getChatRooms = async (userId: string) => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("chat_rooms")
    .select(
      `
      *,
      user1:profiles!chat_rooms_user1_id_fkey(id, nickname, profile_image),
      user2:profiles!chat_rooms_user2_id_fkey(id, nickname, profile_image)
    `
    )
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const chatRooms = toCamel(data) as ChatRoomWithUsers[];

  const result = chatRooms?.map((room) => {
    const partner = room.user1?.id === userId ? room.user2 : room.user1;

    return {
      id: room.id,
      createdAt: room.createdAt,
      partnerId: partner.id,
      partnerName: partner.nickname,
      profileImage: partner.profileImage,
      lastMessage: room.lastMessage,
      lastMessageTime: room.lastMessageTime,
      lastMessageSenderId: room.lastMessageSenderId,
      unreadCount: room.unreadCount,
    };
  });

  return result;
};
