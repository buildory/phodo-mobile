import { useRef, useEffect } from "react";
import { Camera } from "@mj-studio/react-native-naver-map";

export const useMapCameraInit = (location: { latitude: number; longitude: number } | null, setCamera: (cam: Camera) => void) => {
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (!location || hasMovedRef.current) return;
    hasMovedRef.current = true;

    setCamera({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 7,
    });
  }, [location]);
};
