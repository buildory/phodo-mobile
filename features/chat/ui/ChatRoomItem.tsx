import {
    View,
    Text,
    Pressable,
  } from "react-native";
import { UserAvatar } from "@/entities/uesrs/ui/UserAvatar";
import { getRelativeTime } from "@/shared/lib";  

interface ChatRoom {
  id: string;
  partnerName: string;
  profileImage: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSenderId?: string;
  unreadCount?: number;
  createdAt: string;
}

interface ChatRoomItemProps {
  chatRoom: ChatRoom;
  onPress: () => void;
}

export default function ChatRoomItem({ chatRoom, onPress }: ChatRoomItemProps) {
  return (
    <Pressable onPress={onPress} className="flex flex-row justify-between border-b border-stroke-divider-weak px-16 py-12">
        <View className="flex flex-row items-center gap-8 flex-1 min-w-0">
        <UserAvatar nickname={chatRoom.partnerName} size={40} imageUrl={chatRoom.profileImage} />
        <View className="flex flex-col gap-2 flex-1 min-w-0">
            <Text className="body2-semiBold">{chatRoom.partnerName || "알 수 없음"}</Text>
            <Text className="label2-regular" numberOfLines={1} ellipsizeMode="tail">
              {chatRoom.lastMessage || ""}
            </Text>
        </View>
        </View>
        <View className="flex flex-col gap-4 items-end ml-8">
        <Text className="text-fg-neutral-subtle caption1-regular">
          {chatRoom.lastMessageTime ? getRelativeTime(chatRoom.lastMessageTime) : getRelativeTime(chatRoom.createdAt)}
        </Text>
        {chatRoom.unreadCount && chatRoom.unreadCount > 0 && (
          <View className="flex items-center justify-center min-w-24 h-24 px-4 py-2 rounded-full bg-fg-curious-solid">
            <Text className="text-fg-neutral-inverted caption2-semiBold text-center">
              {chatRoom.unreadCount > 99 ? '99+' : chatRoom.unreadCount}
            </Text>
          </View>
        )}
        </View>
    </Pressable>
  )
}
