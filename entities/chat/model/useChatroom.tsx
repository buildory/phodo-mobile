import { useQuery } from '@tanstack/react-query';
import { getChatRoom } from '../api/getChatRoom';

export const useChatRoom = (chatRoomId: string) => {
  return useQuery({
    queryKey: ['chatRoom', chatRoomId],
    queryFn: () => getChatRoom(chatRoomId),
    enabled: !!chatRoomId,
  });
};