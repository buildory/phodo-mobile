import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChatMessage, CreateChatMessageParams } from '../api/createChatMessage';

export const useCreateChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateChatMessageParams) => createChatMessage(params),
    onSuccess: (data, variables) => {
      // 해당 채팅방의 메시지 목록 새로고침
      queryClient.invalidateQueries({ 
        queryKey: ['chatMessages', variables.chatRoomId] 
      });
      
      // 채팅방 목록도 새로고침 (마지막 메시지 업데이트를 위해)
      queryClient.invalidateQueries({ 
        queryKey: ['chatRooms'] 
      });
    },
  });
};

