import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChatRoom } from '../api/createChatRoom';
import { CreateChatRoomParams } from './chat.types';
import { useRouter } from 'expo-router';

export const useCreateChatRoom = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (params: CreateChatRoomParams) => createChatRoom(params),
    onSuccess: (data) => {
      // 채팅방 생성 성공 시 해당 채팅방으로 이동
      if (data?.data?.[0]?.id) {
        router.push(`/(tabs)/chat/${data.data[0].id}`);
      }
      // 채팅방 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });
};
