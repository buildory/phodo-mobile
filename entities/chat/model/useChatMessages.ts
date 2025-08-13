import { useQuery } from '@tanstack/react-query'
import { getChatMessages } from '../api/getChatMessages'

export const useChatMessages = (chatRoomId: string) => {
  return useQuery({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: () => getChatMessages(chatRoomId),
  })
}
