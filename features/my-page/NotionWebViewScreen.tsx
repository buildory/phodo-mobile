import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, RouteProp } from "@react-navigation/native";

export default function NotionWebViewScreen() {
  const route = useRoute<RouteProp<{ params: { title: string; url: string } }, "params">>();
  const { title, url } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator style={{ marginTop: 20 }} size="large" />
        )}
      />
    </View>
  );
}
