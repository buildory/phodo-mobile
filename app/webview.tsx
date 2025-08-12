import { useLocalSearchParams, router } from "expo-router";
import { WebView } from "react-native-webview";
import { View, ActivityIndicator, SafeAreaView, TouchableOpacity, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import "@/shared/styles/global.css";

export default function WebViewModal() {
  const { url, title } = useLocalSearchParams();

  if (typeof url !== "string") return null;

  return (
    <SafeAreaView className="flex-1 bg-bg-layer-default">
      {/* Header with close button only */}
      <View className="flex-row items-center px-20 pt-28 pb-12 border-b border-stroke-divider-subtle">
        <TouchableOpacity 
          className="p-8"
          onPress={() => router.back()}
        >
          <AntDesign name="close" size={24} color="#181D27" />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <View className="flex-1 px-20">
        <WebView
          source={{ uri: url }}
          startInLoadingState
          renderLoading={() => (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="#9E77ED" />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}