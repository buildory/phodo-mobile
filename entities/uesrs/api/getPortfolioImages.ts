import { getSupabaseClient } from "@/shared/lib/supabase";

export interface PortfolioImage {
  id: string;
  url: string;
  name: string;
}

export const getPortfolioImages = async (
  userId: string,
  profileType: 'photographer' | 'model'
): Promise<PortfolioImage[]> => {
  const supabase = getSupabaseClient();
  
  try {
    if (!userId || !profileType) {
      console.warn('포트폴리오 이미지 조회: userId 또는 profileType이 없습니다.');
      return [];
    }

    const folderPath = `${userId}/${profileType}`

    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .list(folderPath);

    if (error) {
      console.error('포트폴리오 이미지 조회 실패:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const portfolioImages: PortfolioImage[] = data
      .filter(file => file.name && !file.name.startsWith('.'))
      .map((file, index) => {
        const storagePath = `${userId}/${profileType}/${file.name}`;
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(storagePath).data.publicUrl;

        return {
          id: `${userId}_${profileType}_${index}`,
          url: publicUrl,
          name: file.name,
        };
      });

    return portfolioImages;
  } catch (error) {
    console.error('포트폴리오 이미지 처리 중 오류:', error)
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
    }
    return [];
  }
}; 