import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useLogin } from "@/features/login/model/useLogin";
import { validateLogin } from "@/features/login/lib/validate";
import { GoogleLoginButton } from "@/features/login/ui/GoogleLoginButton";
import { useFormValidator } from "@/shared/hooks/useFormValidator";
import LongButton from "@/shared/ui/Button";
import ValidatedInput from "@/shared/ui/ValidatedInput";
import { useToast } from "@/shared/hooks/useToast";

export default function LoginScreen() {
  const {
    values,
    setValue,
    errors,
    validate,
  } = useFormValidator({ email: "", password: "" }, validateLogin);
  const router = useRouter();
  const { login, loading } = useLogin();
  const toast = useToast();

  const handleLogin = async () => {
    if (!validate()) return;
    const {success, message} = await login(values.email, values.password);
   
    if (!success) {
      toast.showError("로그인 실패", message ?? "알 수 없는 오류입니다.");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: "#fff" }]}
    >
      <Text style={[styles.title, { color: "#000" }]}>
        포도 (Phodo)
      </Text>

      <ValidatedInput
        label="이메일"
        placeholder="이메일을 입력해주세요"
        value={values.email}
        onChangeText={(text) => setValue("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <ValidatedInput
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        value={values.password}
        onChangeText={(text) => setValue("password", text)}
        secureTextEntry
        error={errors.password}
      />
      <LongButton
        title={"로그인 하기"}
        loading={loading}
        onPress={handleLogin}
      />

      <View style={styles.signupContainer}>
        <TouchableOpacity onPress={() => router.push("/(auth)/reset-password")}>
          <Text
            style={[styles.signupLink, { color: "#000" }]}
          >
            비밀번호 찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text
            style={[styles.signupLink, { color: "#6172f3" }]}
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
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupLink: {
    fontSize: 14,
    color: "#4285F4",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
