import { View, StyleSheet } from "react-native";
import Badge from "@/shared/ui/Badge";
import { IconSymbol } from "@/shared/ui/IconSymbol";

export function RecruitTypeBadge({selected, onSelect}) {
  return (
    <View style={styles.badgeContainer}>
      <Badge
        size={"lg"}
        className={`rounded-full ${selected === 'photographer' ? 'bg-bg-layer-default-pressed' : 'bg-bg-layer-default'}`}
        onPress={() =>  onSelect?.(selected === 'photographer' ? null : 'photographer')}
        label={"작가 구인"}
        icon={selected === 'photographer' ? <IconSymbol size={12} name="check" color={"#000"} /> : null}
      />
      <Badge
        size={"lg"}
        className={`rounded-full ${selected === 'model' ? 'bg-bg-layer-default-pressed' : 'bg-bg-layer-default'}`}
        onPress={() =>  onSelect?.(selected === 'model' ? null : 'model')}
        label={"모델 구인"}
        icon={selected === 'model' ? <IconSymbol size={12} name="check" color={"#000"} /> : null}
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
