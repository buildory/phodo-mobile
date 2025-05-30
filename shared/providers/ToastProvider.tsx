import React from "react";
import Toast, { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";
import { Text, View } from "react-native";

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#4CAF50" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "bold" }}
      text2Style={{ fontSize: 14, color: "#555" }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#F44336" }}
      text1Style={{ fontSize: 16, fontWeight: "bold" }}
      text2Style={{ fontSize: 14, color: "#555" }}
    />
  ),
};

export const ToastProvider = () => <Toast config={toastConfig} />;
