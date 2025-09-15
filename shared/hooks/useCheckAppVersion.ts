import Constants from "expo-constants";
import { useEffect } from "react";
import {
  getLatestAppVersion,
  checkCodePushUpdate,
  redirectToAppStore,
} from "../api/version";
import { Alert, Platform } from "react-native";

const parseVersion = (v: string) => {
  return v.split(".").map((n) => parseInt(n, 10));
};
const isVersionLessThan = (a: string, b: string) => {
  const [A1 = 0, A2 = 0, A3 = 0] = parseVersion(a);
  const [B1 = 0, B2 = 0, B3 = 0] = parseVersion(b);
  if (A1 !== B1) return A1 < B1;
  if (A2 !== B2) return A2 < B2;
  return A3 < B3;
};

export const useCheckAppVersion = () => {
  useEffect(() => {
    const currentVersion = Constants.expoConfig?.version as string;
    console.log("현재 앱 버전:", currentVersion);

    getLatestAppVersion(Platform.OS).then(
      (latestAppVersionInfo) => {
        console.log("최신 앱 버전 정보:", latestAppVersionInfo);
        if (
          latestAppVersionInfo.forceUpdate &&
          isVersionLessThan(currentVersion, latestAppVersionInfo.minSupportedVersion)
        ) {
          Alert.alert(
            "업데이트 필요",
            "최신 버전으로 업데이트해야 정상적으로 이용할 수 있습니다.",
            [
              {
                text: "업데이트",
                onPress: () => redirectToAppStore(),
              },
              {
                text: "취소",
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        } else {
          checkCodePushUpdate();
        }
      }
    );
  }, []);
};
