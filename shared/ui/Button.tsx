import { TouchableOpacity, Text, StyleSheet, ActivityIndicator  } from "react-native";
import { Colors } from '@/shared/styles/Colors';

export default function LongButton({ title, onPress, loading, disabled = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.button, { opacity: loading ? 0.6 : 1 }, disabled && { backgroundColor: '#e9eaeb' }]}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.purple[500],
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
