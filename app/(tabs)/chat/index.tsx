import { SafeAreaView, View, Text, FlatList } from "react-native";
import { useChatRooms } from "@/entities/chat/model/useChatRooms";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { router } from "expo-router";
import ChatRoomItem from "@/features/chat/ui/ChatRoomItem";

export default function ChatListScreen() {
  const { profile } = useCurrentUserStore();
  const { data: chatRooms, isLoading } = useChatRooms(profile?.id || "");

  const handleChatRoomPress = (chatRoomId: string) => {
    router.push(`/(tabs)/chat/${chatRoomId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bg-layer-default">
        <View className="flex-1 items-center justify-center">
          <Text className="body1-regular text-fg-neutral">로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-bg-layer-default">
        <View className="flex-1 items-center justify-center p-16">
          <Text className="body1-regular text-fg-neutral text-center">
            아직 채팅방이 없어요{'\n'}
            프로젝트에 지원하거나 매칭을 통해{'\n'}
            채팅을 시작해보세요!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-layer-default">
      <FlatList
        className="mt-20"
        data={chatRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatRoomItem
            chatRoom={item}
            onPress={() => handleChatRoomPress(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-8" />}
      />
    </SafeAreaView>
  );
}