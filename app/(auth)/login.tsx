import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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
  const { values, setValue, errors, validate } = useFormValidator(
    { email: "", password: "" },
    validateLogin
  );
  const router = useRouter();
  const { login, loading } = useLogin();
  const toast = useToast();

  const handleLogin = async () => {
    if (!validate()) return;
    const { success, message } = await login(values.email, values.password);

    if (!success) {
      toast.showError("로그인 실패", message ?? "알 수 없는 오류입니다.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bg-layer-default p-20"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <Text className="title2-bold text-fg-brand text-center mb-40">
          포도 (Phodo)
        </Text>

        <View className="gap-20">
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
        </View>
        <LongButton
          title={"로그인 하기"}
          loading={loading}
          onPress={handleLogin}
        />

        <View className="gap-16 flex-row justify-center mt-20">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/reset-password")}
          >
            <Text className="body1-semiBold text-fg-neutral-muted">
              비밀번호 찾기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text className="body1-semiBold text-fg-brand">회원가입</Text>
          </TouchableOpacity>
        </View>
        <View className="h-1 bg-stroke-divider-subtle mt-20"></View>
        <GoogleLoginButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
