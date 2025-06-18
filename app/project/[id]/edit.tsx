import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  Image,
} from "react-native";
import {
  NaverMapView,
  NaverMapMarkerOverlay,
  Camera,
} from "@mj-studio/react-native-naver-map";
import { getCurrentUserId } from "@/shared/lib/auth";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import ProjectDetailCard from "@/features/projects/ui/ProjectDetailCard";
import { useProject } from "@/entities/projects/model";
import { getMarkerImage } from "@/features/projects/lib";

const images = [
  {
    id: 1,
    uri: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    uri: "https://picsum.photos/200/300",
  },
  {
    id: 3,
    uri: "https://picsum.photos/200/300",
  },
];

export default function ProjectEditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: project, isLoading } = useProject(String(id));
  const [currentUserId, setCurrentUserId] = useState("");

  const [camera] = useState<Camera>({
    latitude: 35.8714,
    longitude: 128.6014,
    zoom: 18,
  });

  const handleBackWard = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  useEffect(() => {
    (async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <Pressable
        style={{ paddingVertical: 12, paddingHorizontal: 16 }}
        onPress={handleBackWard}
      >
        <IconSymbol size={24} name="x" color={"#181D27"} />
      </Pressable>
      <ScrollView>
        <View style={{ flex: 1, padding: 16 }}>
          {isLoading ? null : <ProjectDetailCard project={project} />}
        </View>
        <View
          style={{
            height: 300,
            borderRadius: 8,
            overflow: "hidden",
            marginHorizontal: 16,
          }}
        >
          <NaverMapView
            camera={camera}
            style={{ width: "100%", height: "100%" }}
            isShowLocationButton={false}
            isExtentBoundedInKorea={true}
            isScrollGesturesEnabled={false}
            isZoomGesturesEnabled={false}
            isRotateGesturesEnabled={false}
            isTiltGesturesEnabled={false}
          >
            <View style={{ borderRadius: 8 }}>
              {project?.latitude && project?.longitude && (
                <NaverMapMarkerOverlay
                  latitude={project?.latitude}
                  longitude={project?.longitude}
                  width={40}
                  height={40}
                  image={getMarkerImage(
                    project.pinDisplay,
                    project.recruitType,
                    project.userId === currentUserId
                      ? "self"
                      : project.profiles.gender
                  )}
                />
              )}
            </View>
          </NaverMapView>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 8 }}
          style={{ marginTop: 16 }}
        >
          {images.map((img, idx) => (
            <Image
              key={idx}
              source={{ uri: img.uri }}
              style={{ width: 100, height: 100, borderRadius: 8 }}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}
