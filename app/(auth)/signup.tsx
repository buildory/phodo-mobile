import { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter, Link, useLocalSearchParams } from "expo-router";
import { useSendMagicLink } from "@/features/auth/model/useSendMagicLink";
import { useSetSession } from "@/features/auth/model/useSetSession";
import { useUpdateUser } from "@/features/auth/model/useUpdateUser";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import LongButton from "@/shared/ui/Button";

export default function SignUpScreen() {
  const {
    email: initialEmail,
    access_token,
    refresh_token,
  } = useLocalSearchParams();

  const [isVerified, setIsVerified] = useState(false);
  const hasPreFilledEmail =
    typeof initialEmail === "string" && initialEmail.length > 0;
  const [email, setEmail] = useState(hasPreFilledEmail ? initialEmail : "");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const router = useRouter();
  const isDark = false;
  const redirectUrl = process.env.EXPO_PUBLIC_REDIRECT_URL!

  
  const { setAuthSession, success } = useSetSession();
  const { updateUserInfo, error: updateError } = useUpdateUser();
  const { send, error: magicLinkError } = useSendMagicLink({
    defaultRedirectUrl: redirectUrl,
    defaultType: "signup",
  });

  const handleSignup = async () => {
    if (!email || !password || !passwordCheck) {
      Alert.alert("오류", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      Alert.alert("오류", "비밀번호가 달라요");
      return;
    }

    if (!isVerified) {
      Alert.alert(
        "이메일 인증 필요",
        "입력하신 이메일로 인증 링크를 먼저 확인해주세요."
      );
      return;
    }

    const result = await updateUserInfo({ password });

    if (result) {
      router.replace("/(tabs)");
      Alert.alert("성공", "회원가입 완료!");
    } else if (updateError) {
      Alert.alert("실패", updateError);
    }
  };

  const handleSendEmail = async () => {
    const result = await send(email);
    if (result) {
      Alert.alert("성공", "이메일을 확인해주세요!");
    } else if (magicLinkError) {
      Alert.alert("실패", magicLinkError);
    }
  };

  useEffect(() => {
    if (access_token && refresh_token) {
      setAuthSession(access_token as string, refresh_token as string).then((ok) => {
        if (!ok) {
          Alert.alert("오류", "세션 설정에 실패했습니다.");
        }
      });
    }
  }, [access_token, refresh_token]);
  
  useEffect(() => {
    if (success) {
      setIsVerified(true);
    }
  }, [success]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
    >
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.loginLink}>
          <IconSymbol size={24} name="chevron.left" color={"#181D27"} />
          <Text style={[styles.loginText, { color: isDark ? "#fff" : "#000" }]}>
            {"회원가입"}
          </Text>
        </TouchableOpacity>
      </Link>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        포도에 오신 걸 환영해요
      </Text>
      <Text style={[styles.subTitle, { color: isDark ? "#fff" : "#000" }]}>
        시작하려면 아래 정보를 입력해주세요
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
          editable={!hasPreFilledEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="이메일을 입력해주세요"
          placeholderTextColor={isDark ? "#999" : "#666"}
        />
        {isVerified ? (
          <Text style={{ marginTop: 8, color: "#12b76a" }}>
            인증을 완료했어요
          </Text>
        ) : (
          <TouchableOpacity onPress={handleSendEmail}>
            <Text style={styles.sendEmail}>인증 이메일 보내기</Text>
          </TouchableOpacity>
        )}
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
          placeholderTextColor={isDark ? "#999" : "#666"}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
          비밀번호 확인
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#333" : "#f5f5f5",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          onChangeText={setPasswordCheck}
          value={passwordCheck}
          secureTextEntry
          placeholder="비밀번호를 입력해주세요"
          placeholderTextColor={isDark ? "#999" : "#666"}
        />
      </View>

      <LongButton title={"시작하기"} loading={signupLoading} onPress={handleSignup} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "medium",
    marginBottom: 30,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  loginText: {
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "semibold",
    marginLeft: 12,
  },
  sendEmail: {
    color: "#9E77ED",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "PretendardSemiBold",
    fontWeight: "semibold",
  },
});
