import { getSupabaseClient } from "@/shared/lib/supabase";

interface DeletePortfolioImageParams {
  imageId: string;
}

export async function deletePortfolioImage({
  imageId,
}: DeletePortfolioImageParams): Promise<void> {
  const supabase = getSupabaseClient();
  
  // DB에서 포트폴리오 이미지 삭제
  const { error: dbError } = await supabase
    .from('portfolio_images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    throw new Error(`DB 삭제에 실패했습니다: ${dbError.message}`);
  }
} 