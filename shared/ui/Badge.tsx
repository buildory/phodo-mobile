import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

type BadgeProps = {
  label: string | number;
  color?: string;
  backgroundColor?: string;
  size?: "sm" | "md" | "lg";
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onPress?: () => void;
};

const Badge = ({
  label,
  color = "#fff",
  backgroundColor = "#FF3B30",
  size = "md",
  borderColor,
  borderWidth,
  borderRadius,
  icon,
  iconPosition = "left",
  onPress,
}: BadgeProps) => {
  const sizeStyles = {
    sm: {
      paddingVertical: 4,
      paddingHorizontal: 6,
      fontSize: 12,
      borderRadius: 12,
    },
    md: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      fontSize: 14,
      borderRadius: 14,
    },
    lg: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      fontSize: 16,
      borderRadius: 16,
    },
  }[size];

  const computedRadius = borderRadius ?? sizeStyles.borderRadius;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius: computedRadius,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {icon && iconPosition === "left" && (
        <View style={styles.iconWrapper}>{icon}</View>
      )}
      <View style={styles.labelWrapper}>
        <Text style={[styles.text, { color, fontSize: sizeStyles.fontSize }]}>
          {label}
        </Text>
      </View>
      {icon && iconPosition === "right" && (
        <View style={styles.iconWrapper}>{icon}</View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  labelWrapper: {
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    lineHeight: 18,
  },
  iconWrapper: {
    marginHorizontal: 4,
  },
});

export default Badge;
