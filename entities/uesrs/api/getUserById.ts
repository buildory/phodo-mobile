import { toCamel } from "@/shared/lib";
import { getSupabaseClient } from "@/shared/lib/supabase";
import { ExtendedProfile } from "../model/user.types";

export const getUserById = async (userId: string): Promise<ExtendedProfile | null> => {
  const supabase = getSupabaseClient();

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select(`
      *,
      photographer_profiles(
        *
      ),
      model_profiles(
        *
      ),
      profile_social_accounts(
        *
      )
    `)
    .eq("id", userId)
    .single();

  if (profileError) throw profileError;
  if (!profileData) return null;

  // 데이터 변환 및 조합 (타입 안전성을 위해 any 사용)
  const data = profileData as any;
  const result: ExtendedProfile = {
    ...toCamel(data),
    photographerProfile: data.photographer_profiles 
      ? toCamel(data.photographer_profiles) 
      : undefined,
    modelProfile: data.model_profiles 
      ? toCamel(data.model_profiles) 
      : undefined,
    socialAccounts: data.profile_social_accounts 
      ? [toCamel(data.profile_social_accounts)] 
      : [],
  };

  return result;
};
