import { useMutation } from "@tanstack/react-query";
import { createNotification } from "../api/createNotification";
import type { CreateNotificationParams } from "../model/notification.types";

export const useCreateNotification = () => {
  return useMutation({
    mutationFn: (params: CreateNotificationParams) => createNotification(params),
  });
};
