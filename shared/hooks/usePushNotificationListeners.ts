import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export const usePushNotificationListeners = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleInitialNotification = async () => {
      try {
        const lastNotificationResponse =
          await Notifications.getLastNotificationResponseAsync();
        if (lastNotificationResponse) {
          const data =
            lastNotificationResponse.notification.request.content.data || {};

          if (data.type === "chat" && data.chat_room_id) {
            setTimeout(() => {
              try {
                router.push(`/(tabs)/chat/${data.chat_room_id}`);
              } catch (error) {
                console.error("❌ 백그라운드 알림 라우팅 실패:", error);
              }
            }, 1000);
          }
        }
      } catch (error) {
        console.error("❌ 백그라운드 알림 처리 실패:", error);
      }
    };

    handleInitialNotification();

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        const data = notification.request.content.data || {};

        switch (data.type) {
          case "shooting":
            queryClient.invalidateQueries({
              queryKey: ["appliedProjects"],
            });
            break;
          case "chat":
            queryClient.invalidateQueries({
              queryKey: ["chatRooms"],
            });
            queryClient.invalidateQueries({
              queryKey: ["chatMessages", data.chat_room_id],
            });
            break;
          default:
            break;
        }
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        const data = response.notification.request.content.data || {};

        if (data.type === "chat" && data.chat_room_id) {
          try {
            router.push(`/(tabs)/chat/${data.chat_room_id}`);
          } catch (error) {
            console.error("❌ 포그라운드 알림 라우팅 실패:", error);
          }
        }

        if (data.type === "shooting" && data.user_id) {
        }
      });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
};
