import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { cn } from "@/shared/lib";

type Props = {
  label?: string;
  error?: string | null;
  isDark?: boolean;
  height?: number;
} & TextInputProps;

export default function ValidatedInput({
  label,
  error,
  isDark = false,
  height = 50,
  ...props
}: Props) {
  return (
    <View className="gap-8">
      {label && (
        <Text className="label1-medium text-fg-neutral-solid">
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        editable={props.editable ? props.editable : true}
        className={cn(
          "px-16 py-14 rounded rounded-8 border",
          error ? "border-stroke-critical" : "border-stroke-field")}
        style={{ height }}
        placeholderTextColor={"#b0b3ba"}
        {...props}
      />
      {error && <Text className="text-fg-critical-solid caption1-regular">{error}</Text>}
    </View>
  );
};
