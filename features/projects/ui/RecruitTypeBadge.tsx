import { View, StyleSheet } from "react-native";
import Badge from "@/shared/ui/Badge";
import { IconSymbol } from "@/shared/ui/IconSymbol";

export function RecruitTypeBadge({selected, onSelect}) {
  return (
    <View style={styles.badgeContainer}>
      <Badge
        onPress={() =>  onSelect?.(selected === 'photographer' ? null : 'photographer')}
        label={"작가 구인"}
        backgroundColor={selected === 'photographer' ? "#f5f5f5" : "#ffffff"}
        color={selected === 'photographer' ? "#535862" : "#000000"}
        borderColor="#E9EAEB"
        borderWidth={1}
        icon={selected === 'photographer' ? <IconSymbol size={12} name="check" color={"#000"} /> : <IconSymbol size={12} name="hash" color={"#000"} />}
      />
      <Badge
          onPress={() =>  onSelect?.(selected === 'model' ? null : 'model')}
        label={"모델 구인"}
        backgroundColor={selected === 'model' ? "#f5f5f5" : "#ffffff"}
        color={selected === 'model' ? "#535862" : "#000000"}
        borderColor="#E9EAEB"
        borderWidth={1}
        icon={selected === 'model' ? <IconSymbol size={12} name="check" color={"#000"} /> : <IconSymbol size={12} name="hash" color={"#000"} />}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  badgeContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingBottom: 20,
    paddingTop: 20,
  },
});
