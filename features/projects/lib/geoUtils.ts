const toRad = (value: number) => (value * Math.PI) / 180;

const getFormattedDistance = (meters: number): string => {
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  } else {
    return `${Math.round(meters)} m`;
  }
};

export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string => {
  const R = 6371; // 지구 반지름 (단위: km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  const formatted = getFormattedDistance(distance * 1000);
  return formatted;
};
