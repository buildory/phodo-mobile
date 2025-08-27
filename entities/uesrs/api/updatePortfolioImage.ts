import { getSupabaseClient } from "@/shared/lib/supabase";
import { PortfolioImage } from '../model/user.types';

interface UpdatePortfolioImageParams {
  imageId: string;
  title?: string;
}

export async function updatePortfolioImage({
  imageId,
  title,
}: UpdatePortfolioImageParams): Promise<PortfolioImage> {
  const supabase = getSupabaseClient();
  
  if (!title) {
    throw new Error('제목은 필수입니다.');
  }

  // DB에서 포트폴리오 이미지 정보 업데이트
  const { data: dbData, error: dbError } = await supabase
    .from('portfolio_images')
    .update({
      title: title,
      updated_at: new Date().toISOString(),
    })
    .eq('id', imageId)
    .select()
    .single();

  if (dbError) {
    throw new Error(`DB 업데이트에 실패했습니다: ${dbError.message}`);
  }

  // 업데이트된 PortfolioImage 객체 반환
  const portfolioImage: PortfolioImage = {
    id: dbData.id as string,
    userId: dbData.user_id as string,
    profileType: dbData.type as 'photographer' | 'model',
    imageUrl: dbData.image_url as string,
    imageOrder: dbData.order_index as number,
    title: dbData.title as string | undefined,
    description: dbData.description as string | undefined,
    createdAt: dbData.created_at as string || new Date().toISOString(),
    updatedAt: dbData.updated_at as string || new Date().toISOString(),
  };

  return portfolioImage;
}
