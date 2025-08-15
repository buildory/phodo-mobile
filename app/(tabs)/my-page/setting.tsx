import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { cn } from "@/shared/lib";
import "@/shared/styles/global.css";
import { useUpdateProfile } from "@/entities/uesrs/model";
import { useLogout } from "@/features/auth/model/useLogout";
import { useAuth } from "@/shared/providers/AuthProvider";

export default function SettingScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const isDark = false;
  const { logout, error, loading } = useLogout();
  const { user, loading: authLoading } = useAuth();
  const { mutate: updateProfile } = useUpdateProfile();

  const handleLogout = async () => {
    const success = await logout();
    if (success && user?.id) {
      await updateProfile({
        id: user?.id,
        values: { pushToken: null },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-layer-default">
      <View className="mt-10 flex-row items-center px-20 pt-28 pb-12 border-b border-stroke-divider-subtle">
        <TouchableOpacity className="p-8" onPress={() => router.back()}>
          <AntDesign name="close" size={24} color="#181D27" />
        </TouchableOpacity>
        <Text className="heading2-semiBold text-fg-neutral-solid">설정</Text>
        {/* 오른쪽에 공간 확보 */}
        <View style={{ width: 36 }} />
      </View>

      <ScrollView className="flex-1">
        {/* 홍보 배너 섹션 */}
        <View className="px-16 mt-20">
          <TouchableOpacity
            className="p-16 rounded-12 bg-bg-neutral-muted"
            onPress={() =>
              router.push({
                pathname: "/webview",
                params: {
                  title: "나의 사진 점수 테스트",
                  url: "https://phodo-test-hub.vercel.app",
                },
              })
            }
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="body2-bold text-fg-neutral-inverted mb-4">
                  나의 사진 점수 테스트
                </Text>
                <Text className="caption1-regular text-white opacity-90  text-fg-neutral-inverted">
                  AI가 말해주는 내 사진점수는?
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={14} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-20 mt-32">
          <Text className="body1-semiBold text-fg-neutral-solid">
            계정
          </Text>
          <TouchableOpacity
            className="flex-row items-center justify-between py-16 border-b border-stroke-divider-subtle"
          >
            <Text className="body1-regular text-fg-neutral-solid">
              비밀번호 변경
            </Text>
            <FontAwesome name="chevron-right" size={12} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-16 border-b border-stroke-divider-subtle"
          >
            <Text className="body1-regular text-fg-neutral-solid">
              계정 탈퇴
            </Text>
            <FontAwesome name="chevron-right" size={12} color="#999" />
          </TouchableOpacity>
        </View>

        <View className="px-20 mt-32">
          <Text className="body1-semiBold text-fg-neutral-solid">앱 정보</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between py-16 border-b border-stroke-divider-subtle"
            onPress={() =>
              router.push({
                pathname: "/webview",
                params: {
                  title: "채용",
                  url: "https://www.notion.so/recomplete/246b542c84fa806da45cdd4ace4d2ca9",
                },
              })
            }
          >
            <Text className="body1-regular text-fg-neutral-solid">채용</Text>
            <FontAwesome name="chevron-right" size={12} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-16 border-b border-stroke-divider-subtle"
          >
            <Text className="body1-regular text-fg-neutral-solid">
              개인정보처리방침
            </Text>
            <FontAwesome name="chevron-right" size={12} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between py-16 border-b border-stroke-divider-subtle">
            <Text className="body1-regular text-fg-neutral-solid">버전</Text>
            <View className="flex-row items-center">
              <Text className="mr-8 body1-regular text-fg-neutral-muted">
                0.1.0
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="mt-20 px-16">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-bg-neutral-weak px-14 py-9 rounded-10"
            onPress={handleLogout}
            disabled={loading}
          >
            <View className="flex-row items-center">
              <Text className="body2-semiBold text-fg-neutral-muted">
                {loading ? "로그아웃 중..." : "로그아웃"}
              </Text>
              {loading && (
                <ActivityIndicator
                  size="small"
                  color="#FF3B30"
                  className="ml-12"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
