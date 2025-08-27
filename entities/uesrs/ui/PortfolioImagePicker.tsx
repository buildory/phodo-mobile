import * as ImagePicker from "expo-image-picker";
import { View, Text, TouchableOpacity, Image, ScrollView, Pressable } from "react-native";
import { IconSymbol } from "@/shared/ui/IconSymbol";

interface PortfolioImagePickerProps {
  images?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  title?: string;
  description?: string;
}

export const PortfolioImagePicker = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 3,
  title = "포트폴리오 이미지",
  description = "이미지를 추가해주세요"
}: PortfolioImagePickerProps) => {

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("권한 필요", "사진 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.8,
      selectionLimit: maxImages - (images?.length || 0),
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);
      const updatedImages = [...(images || []), ...newUris].slice(0, maxImages);
      onImagesChange(updatedImages);
    }
  };

  const removeImage = (index: number) => {
    if (!images) return;
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  // images가 undefined인 경우 빈 배열로 처리
  const safeImages = images || [];

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
        {description} ({safeImages.length} / {maxImages})
      </Text>
      
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
      >
        <Pressable
          style={{
            width: 100,
            height: 100,
            borderWidth: 1,
            borderColor: "#ccc",
            borderStyle: "dashed",
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9f9f9",
          }}
          onPress={pickImage}
        >
          <IconSymbol size={32} name="camera" color={"#181D27"} />
          <Text style={{ color: "#A4A7AE", fontSize: 12, marginTop: 4 }}>
            {safeImages.length} / {maxImages}
          </Text>
        </Pressable>
        
        {safeImages.map((img, idx) => (
          <TouchableOpacity
            key={idx}
            onLongPress={() => removeImage(idx)}
          >
            <Image
              source={{ uri: img }}
              style={{ width: 100, height: 100, borderRadius: 8 }}
            />
            {/* <View style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 20,
              height: 20,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{ color: "white", fontSize: 12 }}>×</Text>
            </View> */}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
