import { useEffect, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

export const useRegisterPushToken = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("phodo", {
          name: "phodo",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
          showBadge: false,
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }

        try {
          const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;

          if (!projectId) {
            throw new Error("Project ID not found");
          }

          const token = (
            await Notifications.getExpoPushTokenAsync({
              projectId,
            })
          ).data;
          setExpoPushToken(token);
        } catch (e) {
          console.error("토큰 발급 중 오류 발생:", e);
        }
      } else {
        //alert("Must use physical device for Push Notifications");
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  return { expoPushToken };
};
