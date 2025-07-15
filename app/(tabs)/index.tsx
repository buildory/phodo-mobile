import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  InteractionManager,
} from "react-native";
import { useProjects } from "@/entities/projects/model";
import {
  NaverMapView,
  NaverMapMarkerOverlay,
  Camera,
} from "@mj-studio/react-native-naver-map";
import ProjectListSheet, {
  ProjectListSheetRef,
} from "@/features/projects/ui/ProjectListSheet";
import ProjectDetailSheet, {
  ProjectDetailSheetRef,
} from "@/features/projects/ui/ProjectDetailSheet";
import CreateProjectSheet, { CreateProjectSheetRef } from "@/features/projects/ui/CreateProjectSheet";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  getDistanceFromLatLonInKm,
  getMarkerImage,
} from "@/features/projects/lib";
import { getAddress } from "@/features/projects/api/getAddress";
import { useWatchLocation } from "@/features/projects/model/useWatchLocation";
import { useMapCameraInit } from "@/features/projects/model/useMapCameraInit";
import { useProjectFormStore } from "@/features/projects/model/useProjectFormStore";  
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { useUpdateProfile } from "@/entities/uesrs/model";
import { useRegisterPushToken } from "@/shared/hooks/useRegisterPushToken";

export default function SearchScreen() {
  const isDark = false;
  const [location, setLocation] = useState({
    address: '',
    latitude: 36.5,
    longitude: 127.75,
    inputLocation: ''

  })
  const { setField } = useProjectFormStore();
  const [selectedType, setSelectedType] = useState<
    "photographer" | "model" | null
  >(null);
  const [camera, setCamera] = useState<Camera>({
    latitude: 36.5,
    longitude: 127.75,
    zoom: 7,
  });



  const myLocation = useWatchLocation();
  useMapCameraInit(myLocation, setCamera);

  const { profile } = useCurrentUserStore();
  const [projectsWithDistance, setProjectsWithDistance] = useState([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const { data: projects } = useProjects({recruitType: selectedType});
  const { expoPushToken } = useRegisterPushToken();
  const { mutate: updateProfile } = useUpdateProfile();

  const timer = useRef<NodeJS.Timeout | null>(null);
  const listSheetRef = useRef<ProjectListSheetRef>(null);
  const detailSheetRef = useRef<ProjectDetailSheetRef>(null);
  const createSheetRef = useRef<CreateProjectSheetRef>(null);

const handleCameraIdle = (e) => {
  if (timer.current) clearTimeout(timer.current);

  timer.current = setTimeout(async () => {
    try {
      const { address } = await getAddress(e.latitude, e.longitude);
      setLocation((prev) => ({...prev, latitude: e.latitude, longitude: e.longitude, address: address}));
    } catch (error) {
      setLocation((prev) => ({...prev, address: "주소를 찾을 수 없습니다."}));
    }
  }, 1500);
};

  useEffect(() => {
    if (!projects || !myLocation) return;

    const updated = projects.map((project) => ({
      ...project,
      distance: getDistanceFromLatLonInKm(
        myLocation.latitude,
        myLocation.longitude,
        project.latitude,
        project.longitude
      ),
    }));

    setProjectsWithDistance(updated);
  }, [projects, myLocation]);

  useEffect(() => {
    if (projectsWithDistance.length > 0) {
      InteractionManager.runAfterInteractions(() => {
        listSheetRef.current?.open(0);
      });
    }
  }, [projectsWithDistance]);

  useEffect(() => {
    if (profile && expoPushToken) {
      updateProfile({
          id: profile.id,
          values: { pushToken: expoPushToken },
        });
    }
  }, [profile, expoPushToken]);

  return (
    <GestureHandlerRootView
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
    >
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        <View style={styles.topOverlay}>
          <View style={styles.textBox}>
            <IconSymbol
              style={styles.icon}
              size={14}
              name="mappin"
              color={"#717680"}
            />
            <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
              {location.address}
            </Text>
          </View>
          <Pressable onPress={() => createSheetRef.current?.open(0)} style={styles.gpsButton}>
            <IconSymbol size={24} name="plus" color={"#ffffff"} />
          </Pressable>
        </View>
      </View>
      <NaverMapView
        style={{ flex: 1 }}
        camera={camera}
        onCameraIdle={handleCameraIdle}
        isShowLocationButton={false}
        isExtentBoundedInKorea={true}
        minZoom={6}
        maxZoom={18}
      >
        {projectsWithDistance.map((project) => (
          <View key={project.id} style={{ borderRadius: 8 }}>
            <NaverMapMarkerOverlay
              latitude={project.latitude}
              longitude={project.longitude}
              width={40}
              height={40}
              image={getMarkerImage(
                project.pinDisplay,
                project.recruitType,
                project.userId === profile?.id
                  ? "self"
                  : project.profiles.gender
              )}
              onTap={() => {
                setSelectedProject(project);
                detailSheetRef.current?.open();
              }}
            />
          </View>
        ))}
        {myLocation?.latitude && myLocation?.longitude && (
          <NaverMapMarkerOverlay
            latitude={myLocation.latitude}
            longitude={myLocation.longitude}
            width={24}
            height={24}
            image={require("@/assets/images/markers/my_location_pin.png")}
          />
        )}
      </NaverMapView>

      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={styles.pinWrapper}>
          <Image source={require("@/assets/images/markers/map_pin.png")} />
        </View>
      </View>

      <View style={styles.researchWrapper} pointerEvents="box-none">
        <Pressable onPress={() => listSheetRef.current?.open(1)}>
          <View style={styles.list}>
            <IconSymbol name="menu" size={14} color="black" />
            <Text>목록보기</Text>
          </View>
        </Pressable>
      </View>
      <Pressable
        onPress={() => {
          if (myLocation) {
            setCamera({
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
              zoom: camera.zoom + Math.random() * 0.001,
            });
          }
        }}
        style={styles.currentLocationButton}
      >
        <IconSymbol name="crosshair" size={24} color="black" />
      </Pressable>
      <ProjectListSheet
        ref={listSheetRef}
        projects={projectsWithDistance}
        selected={selectedType}
        onSelect={setSelectedType}
      />
      {selectedProject && (
        <ProjectDetailSheet ref={detailSheetRef} project={selectedProject} />
      )}
      <CreateProjectSheet ref={createSheetRef} location={location}/> 
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  pinWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  researchWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    marginBottom: "15%",
  },

  list: {
    flexDirection: "row",
    gap: "6",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    elevation: 3,
    shadowColor: "#000",
    borderColor: "#e9eaeb",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  topOverlay: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },

  textBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  icon: {
    width: 14,
    height: 14,
    marginRight: 8,
  },

  address: {
    flex: 1,
    fontSize: 16,
  },

  gpsButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: "black",
    borderRadius: 8,
    elevation: 3,
  },
  currentLocationButton: {
    position: "absolute",
    right: 13,
    top: "60%",
    marginTop: -24,
    backgroundColor: "#fff",
    borderRadius: 24,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
