// 각도를 라디안으로 변환
const toRad = (value: number) => (value * Math.PI) / 180;

// 미터 단위 거리를 포맷된 문자열로 변환
const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  } else {
    return `${Math.round(meters)} m`;
  }
};

// 하버사인 공식을 사용한 두 지점 간의 거리 계산 (미터 단위)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // 미터 단위
};

// 미터 단위 거리 반환 (숫자) - 기존 호환성을 위한 별칭
export const getDistanceInMeters = calculateDistance;

// 포맷된 거리 문자열 반환 (예: "150m", "1.2km")
export const getFormattedDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return formatDistance(distance);
};

// 기존 호환성을 위한 함수 (getDistanceFromLatLonInKm)
export const getDistanceFromLatLonInKm = getFormattedDistance;

// 두 위치가 지정된 거리 이내에 있는지 확인
export const isWithinDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  maxDistance: number = 50
): boolean => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= maxDistance;
};

// 위치 객체를 사용한 거리 계산 함수들
export const getDistanceFromLocation = (
  location1: { latitude: number; longitude: number },
  location2: { latitude: number; longitude: number }
): number => {
  return calculateDistance(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );
};

export const getFormattedDistanceFromLocation = (
  location1: { latitude: number; longitude: number },
  location2: { latitude: number; longitude: number }
): string => {
  return getFormattedDistance(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );
};

export const isWithinDistanceFromLocation = (
  location1: { latitude: number; longitude: number },
  location2: { latitude: number; longitude: number },
  maxDistance: number = 50
): boolean => {
  return isWithinDistance(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude,
    maxDistance
  );
};
