import { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
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
import ValidatedInput from "@/shared/ui/ValidatedInput";
import { useFormValidator } from "@/shared/hooks/useFormValidator";
import { validateResetPassword } from "@/features/auth/lib/validate";
import LongButton from "@/shared/ui/Button";
import { useToast } from "@/shared/hooks/useToast";
import { getUserByEmail } from "@/entities/uesrs/api/getUserByEmail";

const TIMER_DURATION = 60 * 10;
type EmailVerificationStatus = "initial" | "sent" | "expired" | "verified";

export default function resetPasswordScreen() {
  const {
    email: initialEmail,
    access_token,
    refresh_token,
  } = useLocalSearchParams();

  const [timeLeft, setTimeLeft] = useState(0);
  const [emailStatus, setEmailStatus] =
    useState<EmailVerificationStatus>("initial");
  const [isVerified, setIsVerified] = useState(false);
  const hasPreFilledEmail =
    typeof initialEmail === "string" && initialEmail.length > 0;
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [sendMailLoading, setSendMailLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const isDark = false;
  const redirectUrl = process.env.EXPO_PUBLIC_REDIRECT_URL!;

  const { values, setValue, errors, setErrors, validate } = useFormValidator(
    {
      email: hasPreFilledEmail ? initialEmail : "",
      password: "",
      passwordConfirm: "",
    },
    validateResetPassword
  );

  const isFormValid =
    values.email &&
    values.password &&
    values.passwordConfirm &&
    !errors.email &&
    !errors.password &&
    !errors.passwordConfirm;

  const { setAuthSession, success } = useSetSession();
  const { updateUserInfo, error: updateError } = useUpdateUser();
  const { send, error: magicLinkError } = useSendMagicLink({
    defaultRedirectUrl: redirectUrl,
    defaultType: "reset-password",
  });

  const handleResetPassword = async () => {
    if (!validate()) return;

    if (!isVerified) {
      setErrors((prev) => ({
        ...prev,
        email: "입력하신 이메일로 인증 링크를 먼저 확인해주세요.",
      }));
      return;
    }

    setResetPasswordLoading(true);

    const { ok, error } = await updateUserInfo({ password: values.password });

    if (ok) {
      router.replace("/(tabs)");
    } else if (error?.includes("New password should be different")) {
      toast.showError("같은 비밀번호로는 변경할 수 없어요", "이전과 다른 비밀번호를 입력해주세요.");
    } else {
      toast.showError("로그인에 실패했어요", "잠시 후 다시 시도해주세요.");
    }

    setResetPasswordLoading(false);

  };

  const handleSendEmail = async () => {
    setErrors((prev) => ({ ...prev, email: undefined }));

    if (!values.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요." }));
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "유효한 이메일 주소를 입력해주세요.",
      }));
      return;
    }

    const { data } = await getUserByEmail(values.email);

    if (!data) {
      setErrors((prev) => ({ ...prev, email: "가입되어 있지 않은 이메일이에요." }));
      return;
    }


    setSendMailLoading(true);

    const sent = await send(values.email);

    if (sent) {
      setTimeLeft(TIMER_DURATION);
      setEmailStatus("sent");
    } else if (magicLinkError) {
      toast.showError("이메일 전송 실패", "잠시 후 다시 시도해주세요.");
    }

    setSendMailLoading(false);
  };

  useEffect(() => {
    if (access_token && refresh_token) {
      setAuthSession(access_token as string, refresh_token as string).then(
        (ok) => {
          if (!ok) {
            Alert.alert("오류", "세션 설정에 실패했습니다.");
          }
        }
      );
    }
  }, [access_token, refresh_token]);

  useEffect(() => {
    if (success) {
      setEmailStatus("verified");
      setIsVerified(true);
    }
  }, [success]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEmailStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleReset = () => {
    setEmailStatus("initial");
    setTimeLeft(0);
    setErrors((prev) => ({ ...prev, email: undefined }));
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
    >
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.loginLink}>
          <IconSymbol size={24} name="chevron.left" color={"#181D27"} />
          <Text style={[styles.loginText, { color: isDark ? "#fff" : "#000" }]}>
            {"비밀번호 찾기"}
          </Text>
        </TouchableOpacity>
      </Link>
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        비밀번호를 잊으셨나요?
      </Text>
      <Text style={[styles.subTitle, { color: isDark ? "#fff" : "#535862" }]}>
        가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드릴게요
      </Text>
      <ValidatedInput
        label="이메일"
        placeholder="이메일을 입력해주세요"
        value={values.email}
        onChangeText={(text) => setValue("email", text)}
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={emailStatus !== "verified"}
      />
      <View style={{ marginBottom: 8 }}>
        {emailStatus === "verified" && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#12b76a", textAlign: "center" }}>
              인증을 완료했어요
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              <Text onPress={handleReset} style={{ color: "#535862" }}>
                재입력
              </Text>
            </View>
          </View>
        )}
        {emailStatus === "expired" && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#f44336",
                textAlign: "center",
              }}
            >
              이메일 인증 유효 시간이 만료되었어요
            </Text>
          </View>
        )}
        {emailStatus === "sent" && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#535862",
                textAlign: "center",
              }}
            >
              재설정 메일을 보냈어요
            </Text>
            <Text style={{ textAlign: "center", color: "#000" }}>
              남은 시간: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        )}
      </View>
      {emailStatus !== "verified" && (
          <TouchableOpacity disabled={emailStatus === "sent" || sendMailLoading} onPress={handleSendEmail}>
            <Text
              disabled={emailStatus === "sent" || sendMailLoading}
              style={[
                styles.sendEmail,
                emailStatus === "sent" && { color: "#535862" },
              ]}
            >
              재설정 메일 보내기
            </Text>
          </TouchableOpacity>
        )}
      <ValidatedInput
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        value={values.password}
        onChangeText={(text) => setValue("password", text)}
        secureTextEntry
        error={errors.password}
      />
      <Text style={{ color: "#535862", marginBottom: 8, fontSize: 12 }}>
        비밀번호는 8-16자리의 영문 대소문자, 숫자, 특수문자를 조합하여
        설정해주세요.
      </Text>
      <ValidatedInput
        label="비밀번호 확인"
        placeholder="비밀번호를 입력해주세요"
        value={values.passwordConfirm}
        onChangeText={(text) => setValue("passwordConfirm", text)}
        secureTextEntry
        error={errors.passwordConfirm}
      />
      <LongButton
        title={"새 비밀번호로 로그인하기"}
        loading={resetPasswordLoading}
        onPress={handleResetPassword}

      />
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
