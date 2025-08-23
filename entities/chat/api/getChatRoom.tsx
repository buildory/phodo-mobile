import { getSupabaseClient } from "@/shared/lib/supabase";
import { toCamel } from "@/shared/lib";

export const getChatRoom = async (chatRoomId: string) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("chat_rooms")
    .select(`
      *,
      user1:user1_id(*),
      user2:user2_id(*)
    `)
    .eq("id", chatRoomId)
    .single();

  if (error) throw error;
  return toCamel(data);
}; 