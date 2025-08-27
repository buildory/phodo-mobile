import { getSupabaseClient } from "@/shared/lib/supabase";
import { PortfolioImage } from "../model/user.types";
  import { toCamel } from "@/shared/lib";
  
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

    const { data, error } = await supabase
      .from('portfolio_images')
      .select('*')
      .eq('user_id', userId)
      .eq('type', profileType)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('포트폴리오 이미지 조회 실패:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return toCamel(data);
  } catch (error) {
    console.error('포트폴리오 이미지 처리 중 오류:', error)
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
    }
    return [];
  }
}; 