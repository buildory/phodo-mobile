import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from '@/shared/styles/Colors';

export default function LongButton({ title, onPress, loading }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.button, { opacity: loading ? 0.6 : 1 }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.palette.purple[500],
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
