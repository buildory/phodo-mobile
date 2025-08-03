import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";

export const usePushNotificationListeners = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
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
          default:
            break;
        }
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
};
