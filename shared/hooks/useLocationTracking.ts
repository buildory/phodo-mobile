import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { 
  calculateDistance, 
  getFormattedDistance, 
  isWithinDistance 
} from '@/features/projects/lib/geoUtils';

interface UseLocationTrackingOptions {
  accuracy?: Location.Accuracy;
  timeInterval?: number;
  distanceInterval?: number;
  enabled?: boolean;
}

interface UseLocationTrackingReturn {
  location: Location.LocationObject | null;
  isLocationEnabled: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  isWithinDistance: (targetLat: number, targetLon: number, maxDistance?: number) => boolean;
  getDistance: (targetLat: number, targetLon: number) => number | null;
  getFormattedDistance: (targetLat: number, targetLon: number) => string;
}

export function useLocationTracking(options: UseLocationTrackingOptions = {}): UseLocationTrackingReturn {
  const {
    accuracy = Location.Accuracy.Balanced,
    timeInterval = 10000, // 10초마다
    distanceInterval = 10, // 10m 이동 시에만
    enabled = true
  } = options;

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const isTracking = useRef(false);

  // 위치 권한 요청
  const requestPermission = async () => {
    try {
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setIsLocationEnabled(false);
        setError('위치 권한이 거부되었습니다.');
        return;
      }

      setIsLocationEnabled(true);
      setError(null);
    } catch (err) {
      setError('위치 권한 요청 중 오류가 발생했습니다.');
      console.error('Location permission error:', err);
    }
  };

  // 위치 추적 시작
  const startTracking = async () => {
    if (!enabled || !isLocationEnabled) {
      return;
    }

    try {
      setError(null);
      
      // 현재 위치 가져오기
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy,
      });
      setLocation(currentLocation);

      // 위치 변경 감지 시작
      if (!isTracking.current) {
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy,
            timeInterval,
            distanceInterval,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
        isTracking.current = true;
      }
    } catch (err) {
      setError('위치 추적을 시작할 수 없습니다.');
      console.error('Start tracking error:', err);
    }
  };

  // 위치 추적 중지
  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      isTracking.current = false;
    }
  };

  // 두 위치 간의 거리 확인 (50m 이내인지)
  const isWithinDistanceWrapper = (targetLat: number, targetLon: number, maxDistance: number = 50): boolean => {
    if (!location) return false;
    
    const distance = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      targetLat,
      targetLon
    );
    return distance <= maxDistance;
  };

  // 현재 위치와 목표 위치 간의 거리 반환 (미터)
  const getDistance = (targetLat: number, targetLon: number): number | null => {
    if (!location) return null;
    
    return calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      targetLat,
      targetLon
    );
  };

  // 포맷된 거리 문자열 반환 (예: "150m", "1.2km")
  const getFormattedDistanceWrapper = (targetLat: number, targetLon: number): string => {
    if (!location) return "위치 확인 중...";
    
    return getFormattedDistance(
      location.coords.latitude,
      location.coords.longitude,
      targetLat,
      targetLon
    );
  };

  // 컴포넌트 마운트 시 권한 요청
  useEffect(() => {
    if (enabled) {
      requestPermission();
    }
  }, [enabled]);

  // 권한이 허용되면 위치 추적 시작
  useEffect(() => {
    if (enabled && isLocationEnabled) {
      startTracking();
    }
  }, [enabled, isLocationEnabled]);

  // 앱이 포그라운드로 돌아올 때 위치 추적 재시작
  useEffect(() => {
    const handleAppStateChange = () => {
      if (enabled && isLocationEnabled && !isTracking.current) {
        startTracking();
      }
    };

    // 앱이 활성화될 때마다 위치 추적 상태 확인
    const interval = setInterval(() => {
      if (enabled && isLocationEnabled && !isTracking.current) {
        startTracking();
      }
    }, 10000); // 10초마다 확인

    return () => {
      clearInterval(interval);
    };
  }, [enabled, isLocationEnabled]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    location,
    isLocationEnabled,
    error,
    requestPermission,
    startTracking,
    stopTracking,
    isWithinDistance: isWithinDistanceWrapper,
    getDistance,
    getFormattedDistance: getFormattedDistanceWrapper
  };
}
