import { useEffect } from "react";
import * as Notifications from "expo-notifications";

export const usePushNotificationListeners = () => {
  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
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
