import { useState } from "react";
import { Alert } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { signInWithGoogle } from "@/entities/auth/api";

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginWithGoogle = async () => {
    setLoading(true);
      try {
        await GoogleSignin.hasPlayServices()
        const userInfo = await GoogleSignin.signIn()
        
        if (userInfo.data?.idToken) {
            const { data, error } = await signInWithGoogle(userInfo.data?.idToken)
  
          if (error) {
            console.error('로그인 실패: ', error.message)
          } else if(data?.session) {
            router.replace("/(tabs)");
          } else {
            Alert.alert("오류", "세션 없음");
          }
        } else {
          throw new Error('ID token missing from Google response')
        }
      } catch (error: any) {
        console.error(error)
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
