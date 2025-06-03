import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";

export const useWatchLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (loc: LocationObject) => {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      );
    })();

    return () => {
      locationSubscription.current?.remove();
    };
  }, []);

  return location;
};