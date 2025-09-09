import Badge from "@/shared/ui/Badge";
import { View } from "react-native";

export function RecruitTypeInfoBadge({
  recruitType,
  pinDisplay,
}: {
  recruitType: string;
  pinDisplay: string;
}) {
  return (
    <View className="flex flex-row items-center gap-6">
      <Badge
        label={recruitType === "model" ? "모델 구인" : "작가 구인"}
        className="border border-stroke-info rounded-6"
        textClassName="text-fg-info-solid label2-medium"
      />
      <Badge
        label={pinDisplay === "always" ? "상시 촬영" : "버블 촬영"}
        className="border-0"
        textClassName="text-fg-info-solid label2-medium"
      />
    </View>
  );
}
