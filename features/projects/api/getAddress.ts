export type ReverseGeocodeResult = {
  address: string;
  isRoadAddress: boolean;
};

export const getAddress = async (
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> => {
  try {
    const response = await fetch(
      `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${longitude},${latitude}&output=json&orders=roadaddr,addr`,
      {
        method: "GET",
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.EXPO_PUBLIC_NCP_API_KEY_ID!,
          "X-NCP-APIGW-API-KEY": process.env.EXPO_PUBLIC_NCP_API_KEY!,
        },
      }
    );

    const data = await response.json();
    const { results } = data;

    if (!results || results.length === 0) {
      throw new Error("No address results found");
    }

    const roadAddress = results.find((item: any) => item.name === "roadaddr");
    const jibunAddress = results.find((item: any) => item.name === "addr");

    if (
      roadAddress &&
      roadAddress.region?.area1 &&
      roadAddress.region?.area2 &&
      roadAddress.region?.area3 &&
      roadAddress.land?.name &&
      roadAddress.land?.number1
    ) {
      const address = `${roadAddress.region.area1.name} ${roadAddress.region.area2.name} ${roadAddress.region.area3.name} ${roadAddress.land.name} ${roadAddress.land.number1}${roadAddress.land.number2 ? `-${roadAddress.land.number2}` : ""}`;
      return { address, isRoadAddress: true };
    }

    if (
      jibunAddress &&
      jibunAddress.region?.area1 &&
      jibunAddress.region?.area2 &&
      jibunAddress.region?.area3 &&
      jibunAddress.land?.number1
    ) {
      const address = `${jibunAddress.region.area1.name} ${jibunAddress.region.area2.name} ${jibunAddress.region.area3.name} ${jibunAddress.land.number1}${jibunAddress.land.number2 ? `-${jibunAddress.land.number2}` : ""}`;
      return { address, isRoadAddress: false };
    }

    throw new Error("Incomplete address info");

  } catch (error) {
    console.error("주소 변환 실패:", error);
    throw error;
  }
};