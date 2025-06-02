import { useState, useEffect } from "react";
import {
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
import LongButton from "@/shared/ui/Button";
import { useToast } from "@/shared/hooks/useToast";
import { useFormValidator } from "@/shared/hooks/useFormValidator";
import ValidatedInput from "@/shared/ui/ValidatedInput";
import { validateSignup } from "@/features/auth/lib/validate";
import { getUserByEmail } from "@/entities/uesrs/api/getUserByEmail";

const TIMER_DURATION = 300;

export default function SignUpScreen() {
  const {
    email: initialEmail,
    access_token,
    refresh_token,
  } = useLocalSearchParams();

  const [isVerified, setIsVerified] = useState(false);
  const hasPreFilledEmail =
    typeof initialEmail === "string" && initialEmail.length > 0;
  const [signupLoading, setSignupLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const isDark = false;
  const redirectUrl = process.env.EXPO_PUBLIC_REDIRECT_URL!
    const {
      values,
      setValue,
      errors,
      setErrors,
      validate,
    } = useFormValidator({ email: hasPreFilledEmail ? initialEmail : "", password: "", passwordConfirm: "" }, validateSignup);

  
  const { setAuthSession, success } = useSetSession();
  const { updateUserInfo, error: updateError } = useUpdateUser();
  const { send, error: magicLinkError } = useSendMagicLink({
    defaultRedirectUrl: redirectUrl,
    defaultType: "signup",
  });

  const handleSignup = async () => {
    if (!validate()) return;

    if (!isVerified) {
      setErrors((prev) => ({ ...prev, email: "입력하신 이메일로 인증 링크를 먼저 확인해주세요." }));
      return;
    }

    const result = await updateUserInfo({ password: values.password });

    if (result) {
      router.replace("/(tabs)");
    } else if (updateError) {
      toast.showError("회원가입에 실패했어요", "잠시 후 다시 시도해주세요.");
    }
  };

  const handleSendEmail = async () => {
    if (!values.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요." }));
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setErrors((prev) => ({ ...prev, email: "유효한 이메일 주소를 입력해주세요." }));
      return;
    }

    const { data } = await getUserByEmail(values.email);

    if (data) {
      setErrors((prev) => ({ ...prev, email: "이미 가입된 이메일입니다." }));
      return;
    }

    const sent = await send(values.email);

    if (sent) {
      toast.showSuccess("인증 이메일 발송 완료", "이메일을 확인해주세요!");
      setTimeLeft(TIMER_DURATION);
    } else if (magicLinkError) {
      toast.showError("이메일 전송 실패", "잠시 후 다시 시도해주세요.");
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
      <Text style={[styles.subTitle, { color: isDark ? "#fff" : "#535862" }]}>
        시작하려면 아래 정보를 입력해주세요
      </Text>
        <ValidatedInput
        label="이메일"
        placeholder="이메일을 입력해주세요"
        value={values.email}
        onChangeText={(text) => setValue("email", text)}
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {isVerified ? (
        <Text style={{ marginTop: 8, color: "#12b76a" }}>
          인증을 완료했어요
        </Text>
      ) : timeLeft > 0 ? (
        <>
          <TouchableOpacity onPress={handleSendEmail} disabled={true}>
            <Text style={{textAlign: "center", alignSelf:'flex-end' }}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </Text>
            <Text style={[styles.sendEmail, { opacity: 0.5 }]}>인증 이메일 보내기</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={handleSendEmail}>
          <Text style={styles.sendEmail}>인증 이메일 보내기</Text>
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
      <Text style={{color: '#535862', marginBottom: 8, fontSize: 12}}>
        비밀번호는 8-16자리의 영문 대소문자, 숫자, 특수문자를 조합하여 설정해주세요.
      </Text>
      <ValidatedInput
        label="비밀번호 확인"
        placeholder="비밀번호를 입력해주세요"
        value={values.passwordConfirm}
        onChangeText={(text) => setValue("passwordConfirm", text)}
        secureTextEntry
        error={errors.passwordConfirm}
      />

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
