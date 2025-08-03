import { useState } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { signInWithGoogle } from "@/entities/auth/api";
import { createProfile } from "@/entities/uesrs/api/createProfile";
import { getCurrentUser } from "@/entities/uesrs/api";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { useToast } from "@/shared/hooks/useToast";

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { setProfile } = useCurrentUserStore();

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) {
        throw new Error("ID token missing from Google response");
      }

      const { data, error } = await signInWithGoogle(userInfo.data?.idToken);

      if (error || !data?.session) {
        toast.showError(
          "회원가입에 실패했어요",
          "세션에서 유저 정보를 가져올 수 없습니다."
        );
        return;
      }

      const { error: profileError } = await createProfile({
        id: data.user.id,
        email: data.user.email ?? "",
      });

        try {
          const profile = await getCurrentUser();
          setProfile(profile);
        } catch (err) {
          console.error("유저 정보 가져오기 실패:", err);
          toast.showError("로그인 오류", "유저 정보를 불러오는 데 실패했습니다.");
        }

      if (profileError) {
        toast.showError("프로필 생성에 실패했어요", "잠시 후 다시 시도해주세요.");
        return;
      }

      router.replace("/(tabs)");

    } catch (error: any) {
      console.error(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // 사용자가 로그인 취소
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // 로그인 진행 중
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Google Play 서비스 없음
      } else {
        // 기타 에러
      }
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading };
};