import { useInfiniteQuery } from '@tanstack/react-query'
import { getChatMessages } from '../api/getChatMessages'

export const useChatMessages = (chatRoomId: string) => {
  return useInfiniteQuery({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: () => {
      return getChatMessages(chatRoomId, 30);
    },
    getNextPageParam: (lastPage, allPages) => {
      // 안전한 처리 추가
      if (!lastPage || !Array.isArray(lastPage) || lastPage.length < 30) {
        return undefined;
      }
      // 다음 페이지를 위한 timestamp는 현재 페이지의 가장 오래된 메시지의 created_at
      const oldestMessage = lastPage[0]; // 첫 번째 메시지가 가장 오래된 메시지
      return oldestMessage?.createdAt;
    },
    initialPageParam: '',
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
    retry: 3, // 재시도 횟수
    retryDelay: 1000, // 재시도 간격
  })
}
