import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { cn } from "@/shared/lib";

export default function LongButton({ title, onPress, loading, disabled = false }) {
  return (
<TouchableOpacity
  activeOpacity={0.9}
  className={cn(
    "mt-20 px-16 py-12 rounded rounded-12",
    loading ? "opacity-60" : "opacity-100",
    disabled ? "bg-bg-disabled" : "bg-fg-brand"
  )}
  onPress={onPress}
  disabled={disabled}
>
  {loading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text
    className={cn( 
      "body1-semiBold text-fg-neutral-inverted text-center",
      disabled ? "text-fg-disabled" : "text-fg-neutral-inverted"
    )}
    >
      {title}
    </Text>
  )}
</TouchableOpacity>
  ); 
}
