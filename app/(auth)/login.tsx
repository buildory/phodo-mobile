import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useLogin } from "@/features/login/model/useLogin";
import { GoogleLoginButton } from "@/features/login/ui/GoogleLoginButton";
import LongButton from "@/shared/ui/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const {login, loading, error} = useLogin();
  const isDark = false;

const handleLogin = async () => {
  const success = await login(email, password);
  if (!success && error) {
    Alert.alert("로그인 오류", error);
  }
};
  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
    >
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        포도 (Phodo)
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
          이메일
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#333" : "#f5f5f5",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="이메일을 입력해주세요"
          placeholderTextColor={isDark ? "#999" : "#666"}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
          비밀번호
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#333" : "#f5f5f5",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="비밀번호를 입력해주세요"
        />
      </View>

      <LongButton title={"로그인 하기"} loading={loading} onPress={handleLogin} />
   
      <View style={styles.signupContainer} >
        <TouchableOpacity onPress={() => router.push('/(auth)/reset-password')}>
          <Text
            style={[styles.signupLink, { color: isDark ? "#fff" : "#000" }]}
          >
            비밀번호 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text
            style={[styles.signupLink, { color: isDark ? "#fff" : "#6172f3" }]}
          >
            회원가입
          </Text>
        </TouchableOpacity>
      </View>
      <GoogleLoginButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  googleButton: {
    backgroundColor: "#DB4437",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  googleIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: "#333",
  },
  signupLink: {
    fontSize: 14,
    color: "#4285F4",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
