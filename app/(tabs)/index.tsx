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
  getMarkerImage,
} from "@/features/projects/lib";
import { getAddress } from "@/features/projects/api/getAddress";
import { useLocationTracking } from "@/shared/hooks/useLocationTracking";
import { useMapCameraInit } from "@/features/projects/model/useMapCameraInit";
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
  const [locationError, setLocationError] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "photographer" | "model" | null
  >(null);
  const [camera, setCamera] = useState<Camera>({
    latitude: 36.5,
    longitude: 127.75,
    zoom: 7,
  });

  const { location: myLocation } = useLocationTracking({
    accuracy: 1,
    timeInterval: 3000,
    distanceInterval: 5,
    enabled: true
  });

  const myLocationForMap = myLocation ? {
    latitude: myLocation.coords.latitude,
    longitude: myLocation.coords.longitude
  } : null;

  useMapCameraInit(myLocationForMap, setCamera);

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
const handleCameraIdle = (e: any) => {
  if (timer.current) clearTimeout(timer.current);

  timer.current = setTimeout(async () => {
    try {
      const { address } = await getAddress(e.latitude, e.longitude);
      setLocation((prev) => ({...prev, latitude: e.latitude, longitude: e.longitude, address: address}));
      setLocationError(false);
    } catch (error) {
      setLocation((prev) => ({...prev, address: "주소를 찾을 수 없습니다."}));
      setLocationError(true);
    }
  }, 1500);
};
  useEffect(() => {
    if (projects && projects.length > 0) {
      InteractionManager.runAfterInteractions(() => {
        listSheetRef.current?.open(0);
      });
    }
  }, [projects]);

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
      className="bg-bg-default flex-1"
    >
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        <View className="flex-row items-center absolute top-40 left-20 right-20 z-10" >
          <View className="flex-1 flex-row items-center bg-bg-layer-default rounded-8 p-12">
            <IconSymbol
              size={18}
              name="mappin"
              color={"#717680"}
            />
            <Text className="ml-8 mb-2 body2-regular" numberOfLines={1} ellipsizeMode="tail">
              {location.address}
            </Text>
          </View>
          <Pressable disabled={locationError} className="ml-12 bg-fg-brand rounded-12 p-12" onPress={() => !locationError && createSheetRef.current?.open(0)}>
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
        logoMargin={{bottom: 100}}
      >
        {projects?.map((project) => (
          <View key={project.id} style={{ borderRadius: 8 }}>
            <NaverMapMarkerOverlay
              latitude={project.latitude}
              longitude={project.longitude}
              width={40}
              height={40}
              image={getMarkerImage(
                project.pinDisplay as "bubble" | "always",
                project.recruitType,
                project.userId === profile?.id
                  ? "self"
                  : (project.profiles as any).role === "admin"
                  ? "admin"
                  : project.profiles.gender
              )}
              onTap={() => {
                setSelectedProject(project);
                detailSheetRef.current?.open();
              }}
            />
          </View>
        ))}
        {myLocation?.coords?.latitude && myLocation?.coords?.longitude && (
          <NaverMapMarkerOverlay
            zIndex={100}
            latitude={myLocation.coords.latitude}
            longitude={myLocation.coords.longitude}
            width={24}
            height={24}
            image={require("@/assets/images/markers/my_location_pin.png")}
          />
        )}
      </NaverMapView>

      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View className="flex-1 justify-center items-center">
          <Image source={require("@/assets/images/markers/map_pin.png")} />
        </View>
      </View>

      <View className="absolute bottom-[0px] left-[0px] right-[0px] mb-[15%] items-center" pointerEvents="box-none">
        <Pressable onPress={() => listSheetRef.current?.open(1)}>
          <View className="flex-row gap-6 items-center bg-bg-layer-default rounded-full py-7 px-10">
            <IconSymbol name="line.3.horizontal" size={14} color="black" />
            <Text className="body2-medium">목록보기</Text>
          </View>
        </Pressable>
      </View>
      <Pressable
        onPress={() => {
          if (myLocation) {
            setCamera({
              latitude: myLocation.coords.latitude,
              longitude: myLocation.coords.longitude,
              zoom: (camera.zoom || 7) + Math.random() * 0.001,
            });
          }
        }}
        
        className="absolute right-[13px] top-[60%] bg-bg-layer-floating rounded-full p-8 justify-center items-center"
      >
        <IconSymbol name="crosshair" size={24} color="black" />
      </Pressable>
      <ProjectListSheet
        ref={listSheetRef}
        projects={projects || []}
        selected={selectedType}
        onSelect={setSelectedType}
        myLocation={myLocationForMap}
      />
      {selectedProject && (
        <ProjectDetailSheet ref={detailSheetRef} project={selectedProject} mylocation={myLocationForMap}/>
      )}
      {!locationError && <CreateProjectSheet ref={createSheetRef} location={location}/>} 
    </GestureHandlerRootView>
  );
}
