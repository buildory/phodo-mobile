import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLogout } from "@/features/auth/model/useLogout";
export default function HomeScreen() {
  const isDark = false;
  const { logout, error, loading } = useLogout();

  const handleLogout = async () => {
    const success = await logout();
    if (!success && error) {
      Alert.alert("로그인 오류", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>홈</Text>
      <Text>앱 버전 0.1.0</Text>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? "#333" : "#f5f5f5" },
        ]}
        onPress={handleLogout}
        disabled={loading}
      >
        <View style={styles.buttonContent}>
          <FontAwesome name="sign-out" size={20} color="#FF3B30" />
          <Text style={[styles.buttonText, { color: "#FF3B30" }]}>
            {loading ? "로그아웃 중..." : "로그아웃"}
          </Text>
          {loading && (
            <ActivityIndicator
              size="small"
              color="#FF3B30"
              style={styles.loadingIndicator}
            />
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
});
