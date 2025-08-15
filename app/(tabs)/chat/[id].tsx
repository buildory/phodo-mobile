import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Platform,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Device from "expo-device";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChatMessages } from "@/entities/chat/model/useChatMessages";
import { useCreateChatMessage } from "@/entities/chat/model/useCreateChatMessage";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";

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
  const { id } = useLocalSearchParams();
  const { profile } = useCurrentUserStore();
  const { data: messages } = useChatMessages(String(id));
  const { mutate: createMessage } = useCreateChatMessage();
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (message.trim() && profile?.id) {
      createMessage({
        chatRoomId: String(id),
        senderId: profile.id,
        content: message.trim(),
      });
      setMessage("");
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === profile?.id;
    const time = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageContainer,
          { flexDirection: isMe ? "row-reverse" : "row" },
        ]}
      >
        {!isMe && (
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {/* {item.userId.charAt(0).toUpperCase()} */}
              </Text>
            </View>
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isMe ? styles.myBubble : styles.otherBubble,
            { alignSelf: isMe ? "flex-end" : "flex-start" },
          ]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
          <Text
            style={[
              styles.timestamp,
              isMe ? styles.timestampLeft : styles.timestampRight,
            ]}
          >
            {time}
          </Text>
        </View>
        {isMe && <Text>{item.isRead ? "읽음" : "안읽음"}</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#181D27" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>채팅방</Text>
        </View>
      </SafeAreaView>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatArea}
        style={{ flex: 1 }}
      />

      <View style={styles.inputBar}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="메시지를 입력하세요..."
          style={styles.textInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#181D27" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  chatArea: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  messageContainer: {
    width: "100%",
    marginVertical: 6,
    alignItems: "flex-end",
  },
  avatarWrapper: {
    marginRight: 8,
    justifyContent: "flex-end",
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: "75%",
  },
  myBubble: {
    backgroundColor: "#DCF8C6",
  },
  otherBubble: {
    backgroundColor: "#EEE",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  timestampLeft: {
    alignSelf: "flex-start",
  },
  timestampRight: {
    alignSelf: "flex-end",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  inputButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    marginRight: 6,
  },
  sendButton: {
    padding: 6,
  },
}); 