import { getSupabaseClient } from "@/shared/lib/supabase";
import { PortfolioImage } from '../model/user.types';

interface UploadPortfolioImageParams {
  userId: string;
  profileType: 'photographer' | 'model';
  imageFile: File;
  title?: string;
}

export async function uploadPortfolioImage({
  userId,
  profileType,
  imageFile,
  title,
}: UploadPortfolioImageParams): Promise<PortfolioImage> {
  const supabase = getSupabaseClient();
  
  // 현재 이미지 개수 확인 (최대 6개 제한)
  const { data: existingImages, error: countError } = await supabase
    .from('portfolio_images')
    .select('id')
    .eq('user_id', userId)
    .eq('type', profileType);

  if (countError) {
    throw new Error(`이미지 개수 확인에 실패했습니다: ${countError.message}`);
  }

  const currentCount = existingImages?.length || 0;
  
  if (currentCount >= 6) {
    throw new Error('포트폴리오 이미지는 최대 6개까지 업로드할 수 있습니다.');
  }

  // 파일명 생성
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `portfolio_${userId}_${Date.now()}.${fileExt}`;
  
  const filePath = `portfolio-images/${fileName}`;

  // Storage에 이미지 업로드
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('portfolio-images')
    .upload(filePath, imageFile);

  if (uploadError) {
    throw new Error(`이미지 업로드에 실패했습니다: ${uploadError.message}`);
  }

  // Public URL 생성
  const { data: { publicUrl } } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(filePath);

  // DB에 포트폴리오 이미지 정보 저장
  const { data: dbData, error: dbError } = await supabase
    .from('portfolio_images')
    .insert({
      user_id: userId,
      type: profileType,
      image_url: publicUrl,
      order_index: currentCount + 1,
      title: title || undefined,
      description: undefined,
    })
    .select()
    .single();

  if (dbError) {
    throw new Error(`DB 저장에 실패했습니다: ${dbError.message}`);
  }

  // PortfolioImage 객체 반환
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
