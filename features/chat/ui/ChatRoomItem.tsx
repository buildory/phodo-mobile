import {
    View,
    Text,
    Pressable,
    Image
  } from "react-native";

export default function ChatRoomItem({chatRoom, onPress}) {
  return (
    <Pressable onPress={onPress} className="flex flex-row justify-between">
        <View className="flex flex-row items-center gap-8">
        <Image className="rounded-full" style={{width: 40, height: 40}} source={{uri: "https://reactnative.dev/img/tiny_logo.png"}} />
        <View className="flex flex-col gap-2">
            <Text className="body2-semiBold">{chatRoom.partnerName}</Text>
            <Text className="label2-regular">{"채팅 중"}</Text>
        </View>
        </View>
        <View className="flex flex-col gap-4">
        <Text className="text-fg-neutral-subtle caption1-regular">{"1분 전"}</Text>
        <View className="flex items-center justify-center w-24 h-24 px-6 py-2 rounded-full bg-fg-curious-solid">
        <Text className=" text-fg-neutral-inverted caption2-semiBold">1</Text>
        </View>
        </View>
    </Pressable>
  )
}
