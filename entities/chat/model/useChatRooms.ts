import { useQuery } from '@tanstack/react-query'
import { getChatRooms } from '../api/getChatRooms'

export const useChatRooms = (userId: string) => {
  return useQuery({
    queryKey: ['chatRooms', userId],
    queryFn: () => getChatRooms(userId),
  })
}
