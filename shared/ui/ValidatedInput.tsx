import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

type Props = {
  label?: string;
  error?: string | null;
  isDark?: boolean;
} & TextInputProps;

export default function ValidatedInput({
  label,
  error,
  isDark = false,
  ...props
}: Props) {
  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
          {label}
        </Text>
      )}
      <TextInput
        editable={props.editable ? props.editable : true}
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#000",
            borderColor: error ? "#f44336" : "#ccc",
          },
        ]}
        placeholderTextColor={isDark ? "#888" : "#999"}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  error: {
    marginTop: 6,
    color: "#f44336",
    fontSize: 13,
  },
});
