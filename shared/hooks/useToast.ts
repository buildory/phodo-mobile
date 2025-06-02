import Toast from "react-native-toast-message";

export const useToast = () => {
  return {
    showSuccess: (title: string, message?: string) =>
      Toast.show({
        type: "success",
        text1: title,
        text2: message,
      }),
    showError: (title: string, message?: string) =>
      Toast.show({
        type: "error",
        text1: title,
        text2: message,
      }),
    show: Toast.show,
    hide: Toast.hide,
  };
};
