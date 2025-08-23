import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChatMessages } from "@/entities/chat/model/useChatMessages";
import { useCreateChatMessage } from "@/entities/chat/model/useCreateChatMessage";
import { useChatRoom } from "@/entities/chat/model/useChatroom";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { formatDateTime } from "@/shared/lib";
import { UserAvatar } from "@/entities/uesrs/ui/UserAvatar";
import { Feather } from "@expo/vector-icons";

const MAX_MESSAGE_LENGTH = 2000;

const ChatMessageItem = React.memo(({ 
  item, 
  index, 
  isMe, 
  partnerInfo,
}: { 
  item: ChatMessage; 
  index: number; 
  isMe: boolean; 
  partnerInfo: any; 
}) => {
  return (
    <>
      {index === 0 && (
        <View className="flex flex-row items-center justify-center bg-bg-info-opacity p-12 rounded-12 mb-16">
          <Text className="caption1-medium text-fg-neutral-solid text-center">
            촬영이 진행되는 동안 이 공간에서 소통할 수 있으며 일정이
            마무리되면 채팅도 함께 종료돼요.
          </Text>
        </View>
      )}
      <View
        className={`bg-flex-row gap-6 my-12 ${isMe ? "flex-row-reverse" : "flex-row"}`}
      >
        {!isMe && (
          <UserAvatar
            nickname={partnerInfo?.nickname}
            size={32}
            imageUrl={partnerInfo?.profileImage}
          />
        )}
        <View
          className={`p-6 rounded-8 max-w-[55%] ${isMe ? "self-end bg-fg-brand" : "self-start bg-bg-layer-fill"}`}
        >
          <Text
            className={`label2-regular ${isMe ? "text-fg-neutral-inverted" : "text-fg-neutral-solid"}`}
          >
            {item.content}
          </Text>
        </View>
        <View className="flex-col items-end justify-end">
          <Text className="caption2-regular text-fg-neutral-subtle">
            {formatDateTime(item.createdAt)}
          </Text>
        </View>
      </View>
    </>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.content === nextProps.item.content &&
    prevProps.item.createdAt === nextProps.item.createdAt &&
    prevProps.isMe === nextProps.isMe &&
    prevProps.partnerInfo?.nickname === nextProps.partnerInfo?.nickname &&
    prevProps.partnerInfo?.profileImage === nextProps.partnerInfo?.profileImage &&
    prevProps.index === nextProps.index
  );
});

type ChatMessage = {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
};

const ChatScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { profile } = useCurrentUserStore();
  const { data: messagesData, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessages(String(id));
  const { data: chatRoomInfo } = useChatRoom(String(id));
  const { mutate: createMessage } = useCreateChatMessage();
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const isUser1 = useMemo(
    () => chatRoomInfo?.user1Id === profile?.id,
    [chatRoomInfo?.user1Id, profile?.id]
  );
  const partnerInfo = useMemo(
    () => (isUser1 ? chatRoomInfo?.user2 : chatRoomInfo?.user1),
    [isUser1, chatRoomInfo?.user1, chatRoomInfo?.user2]
  );

    const messages = useMemo(() => {
      if (!messagesData?.pages || !Array.isArray(messagesData.pages) || messagesData.pages.length === 0) {
        return [];
      }
      
      const allMessages = messagesData.pages.flat().filter(Boolean);
      
      if (allMessages.length === 0) return [];
      
      return allMessages;
    }, [messagesData?.pages]);

  const handleMessage = (text: string) => {
    if (text.length > MAX_MESSAGE_LENGTH) {
      return;
    }
    setMessage(text);
  };

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [messages]);

  useEffect(() => {
    if (messages && messages.length > 0 && messages.length <= 1) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(() => {
    if (message.trim() && profile?.id && chatRoomInfo) {
      createMessage({
        chatRoomId: String(id),
        senderId: profile.id,
        content: message.trim(),
        notificationInfo: {
          partnerId : partnerInfo?.id,
          partnerName: chatRoomInfo.user1Id === profile.id 
            ? chatRoomInfo.user2?.nickname 
            : chatRoomInfo.user1?.nickname,
        },
      });
      setMessage("");
    }
  }, [message, profile?.id, chatRoomInfo, createMessage, id]);

  const renderItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const isMe = item.senderId === profile?.id;

      return (
        <ChatMessageItem
          item={item}
          index={index}
          isMe={isMe}
          partnerInfo={partnerInfo}
        />
      );
    },
    [profile?.id, partnerInfo]
  );

  return (
    <KeyboardAvoidingView
      className="bg-bg-layer-default flex-1 px-16"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView edges={["top"]}>
        <View className="mb-8">
          <TouchableOpacity
            className="flex-row items-center gap-12"
            onPress={() => {
              router.replace('/chat');
              console.log("뒤로 가기 버튼을 누르면 채팅방 목록으로 이동")
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#181D27" />
            <Text className="heading2-semiBold text-fg-neutral-solid">
              {partnerInfo?.nickname || "채팅방"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        inverted={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onStartReached={() => {
          // if (hasNextPage && !isFetchingNextPage && messagesData?.pages) {
          //   fetchNextPage();
          // }
        }}
        onStartReachedThreshold={0.1}
        ListHeaderComponent={isFetchingNextPage ? (
          <View className="flex-row justify-center py-4">
            <Text className="text-fg-neutral-subtle">과거 메시지를 불러오는 중...</Text>
          </View>
        ) : null}
        onContentSizeChange={() => {
          if (messages && messages.length > 0) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 300);
          }
        }}
      />
      <View className="flex-row items-center gap-12 py-4">
        <TextInput
          className="flex-1 bg-bg-neutral-weak border-none rounded-4 label1-regular text-fg-neutral-solid px-8 py-6"
          style={{ maxHeight: 100 }}
          placeholderTextColor="#b0b3ba"
          value={message}
          onChangeText={handleMessage}
          placeholder="메시지를 입력해주세요"
          maxLength={MAX_MESSAGE_LENGTH}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          disabled={!message.trim()}
          className={` rounded-8 p-6 ${!message.trim() ? "bg-bg-disabled" : "bg-fg-brand"}`}
          onPress={sendMessage}
        >
          <Feather name="send" size={20} color={!message.trim() ? "#d1d3d8" : "#ffffff"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
