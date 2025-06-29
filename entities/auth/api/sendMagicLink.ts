import { getSupabaseClient } from "@/shared/lib/supabase";

type SendAuthLinkParams = {
  email: string;
  redirectUrl: string;
  type?: string;
};

export const sendMagicLink = async ({ email, redirectUrl, type }: SendAuthLinkParams) => {
  const supabase = getSupabaseClient();
  
  const fullRedirectUrl = type
    ? `${redirectUrl}?email=${encodeURIComponent(email)}&type=${encodeURIComponent(type)}`
    : `${redirectUrl}?email=${encodeURIComponent(email)}`;

  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: fullRedirectUrl,
    },
  });
};