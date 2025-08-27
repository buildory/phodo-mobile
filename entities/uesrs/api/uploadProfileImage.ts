import { getSupabaseClient } from "@/shared/lib/supabase";
import { uploadToMinio, deleteFromMinio } from "@/shared/api/s3";
import { ExtendedProfile } from "../model/user.types";

interface UploadProfileImageParams {
  userId: string;
  imageUri: string;
}

export async function uploadProfileImage({
  userId,
  imageUri,
}: UploadProfileImageParams): Promise<{ publicUrl: string; updatedProfile: ExtendedProfile }> {
  const supabase = getSupabaseClient();
  
  // 기존 프로필 이미지 URL 가져오기
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('profile_image')
    .eq('id', userId)
    .single();

  // 기존 파일이 MinIO에 있다면 삭제
  if (existingProfile?.profile_image && typeof existingProfile.profile_image === 'string') {
    try {
      const existingUrl = existingProfile.profile_image;
      const urlParts = existingUrl.split('/');
      const existingKey = urlParts.slice(-2).join('/');
      
      await deleteFromMinio({
        bucket: "profile-images",
        key: existingKey
      });
    } catch (error) {
      // 기존 파일 삭제 실패는 무시
    }
  }
  
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const fileName = `profile_${userId}_${timestamp}_${randomSuffix}.jpg`;
  const key = `${userId}/${fileName}`;

  // MinIO에 이미지 업로드
  const publicUrl = await uploadToMinio({
    bucket: "profile-images",
    key: key,
    uri: imageUri,
    mime: "image/jpeg"
  });

  // 프로필 테이블에 이미지 URL 업데이트
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({ profile_image: publicUrl })
    .eq('id', userId)
    .select('*')
    .single();

  if (updateError) {
    throw new Error(`프로필 이미지 업데이트에 실패했습니다: ${updateError.message}`);
  }

  // Supabase 데이터를 ExtendedProfile 형식으로 변환
  const convertedProfile: ExtendedProfile = {
    id: updatedProfile.id as string,
    email: updatedProfile.email as string,
    nickname: updatedProfile.nickname as string,
    gender: updatedProfile.gender as string | undefined,
    profileImage: updatedProfile.profile_image as string | undefined,
    pushToken: updatedProfile.push_token as string | null | undefined,
    createdAt: updatedProfile.created_at as string | undefined,
  };

  return { 
    publicUrl, 
    updatedProfile: convertedProfile
  };
} 