import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChatMessage, CreateChatMessageParams } from '../api/createChatMessage';
import { useCreateNotification } from '@/entities/notification/model/useCreateNotification';
import { useCurrentUserStore } from '@/entities/uesrs/model/useCurrentUserStore';
import { CreateChatMessageWithNotificationParams } from './chat.types';

export const useCreateChatMessage = () => {
  const queryClient = useQueryClient();
  const { mutate: createNotification } = useCreateNotification();
  const { profile } = useCurrentUserStore();

  return useMutation({
    mutationFn: (params: CreateChatMessageWithNotificationParams) => createChatMessage(params),
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['chatMessages', variables.chatRoomId] 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['chatRooms'] 
      });

      if (variables.notificationInfo && profile?.id) {
        createNotification({
          title: profile.nickname || "알 수 없음",
          body: variables.content || "알 수 없음",
          userId: variables.notificationInfo.partnerId,
          data: { 
            type: "chat", 
            chatRoomId: variables.chatRoomId,
            senderId: profile.id 
          },
        });
      }
    },
  });
};
