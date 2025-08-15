import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrCreateChatRoom } from '../api/getOrCreateChatRoom';
import { useRouter } from 'expo-router';
import { useCurrentUserStore } from '@/entities/uesrs/model/useCurrentUserStore';

export const useChatRoomOrCreate = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { profile: currentUser } = useCurrentUserStore();

  const mutation = useMutation({
    mutationFn: ({ partnerId }: { partnerId: string }) => {
      if (!currentUser?.id) {
        throw new Error('현재 사용자 정보를 찾을 수 없습니다.');
      }
      return getOrCreateChatRoom(currentUser.id, partnerId);
    },
    onSuccess: (data) => {
      if (data?.data?.id) {
        router.push(`/(tabs)/chat/${data.data.id}`);
      } else {
        console.error("채팅방 ID가 없습니다:", data);
        router.push("/(tabs)/chat");
      }
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
    onError: (error) => {
      console.error("채팅방 생성/찾기 실패:", error);
    },
  });

  const navigateToChat = (partnerId: string) => {
    console.log("navigateToChat 호출됨:", partnerId, "현재 사용자:", currentUser?.id);
    if (!currentUser?.id) {
      console.error("현재 사용자 정보가 없습니다.");
      return;
    }
    mutation.mutate({ partnerId });
  };

  return {
    navigateToChat,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
