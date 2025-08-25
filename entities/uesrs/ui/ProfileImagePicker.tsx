import * as ImagePicker from "expo-image-picker";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import { IconSymbol } from "@/shared/ui/IconSymbol";

interface ProfileImagePickerProps {
  imageUri?: string | null;
  onImageChange: (imageUri: string | null) => void;
  title?: string;
  description?: string;
  size?: number;
}

export const ProfileImagePicker = ({ 
  imageUri, 
  onImageChange, 
  title = "프로필 이미지",
  description = "프로필 이미지를 선택해주세요",
  size = 120
}: ProfileImagePickerProps) => {

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("권한 필요", "사진 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1], // 정사각형 비율
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageChange(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    onImageChange(null);
  };

  const imageSize = size;
  const borderRadius = imageSize / 2; // 원형 이미지

  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ alignItems: "center" }}>
        {imageUri ? (
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: borderRadius,
                borderWidth: 3,
                borderColor: "#f0f0f0",
              }}
              resizeMode="cover"
            />
            
            {/* 편집 버튼 */}
            <TouchableOpacity
              onPress={pickImage}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                backgroundColor: "#9E77ED",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "white",
              }}
            >
              <IconSymbol size={16} name="camera" color="white" />
            </TouchableOpacity>
            
            {/* 삭제 버튼 */}
            <TouchableOpacity
              onPress={removeImage}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 24,
                height: 24,
                backgroundColor: "rgba(255, 0, 0, 0.8)",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>×</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Pressable
            style={{
              width: imageSize,
              height: imageSize,
              borderRadius: borderRadius,
              borderWidth: 2,
              borderColor: "#ccc",
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f9f9f9",
            }}
            onPress={pickImage}
          >
            <IconSymbol size={32} name="camera" color={"#9E77ED"} />
            <Text style={{ 
              color: "#9E77ED", 
              fontSize: 12, 
              marginTop: 8,
              textAlign: "center",
              fontWeight: "500"
            }}>
              이미지 선택
            </Text>
          </Pressable>
        )}
        
        {/* 이미지 선택 안내 */}
        {!imageUri && (
          <Text style={{ 
            color: "#999", 
            fontSize: 11, 
            marginTop: 8,
            textAlign: "center"
          }}>
            프로필 이미지를 선택하면 원형으로 표시됩니다
          </Text>
        )}
      </View>
    </View>
  );
};
