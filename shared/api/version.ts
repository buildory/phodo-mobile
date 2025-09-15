import { Platform, Linking } from 'react-native';
import CodePush, { UpdateCheckRequest, ReleaseHistoryInterface } from '@bravemobile/react-native-code-push';
import { getSupabaseClient } from "@/shared/lib/supabase";
import { toCamel } from "@/shared/lib";

export const getLatestAppVersion = async (
  platform: string
) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('app_versions')
    .select('latest_version, min_supported_version, force_update, store_url')
    .eq('platform', platform)
    .single();

  return data ? toCamel(data) : null;
};

export const checkCodePushUpdate = async() => {
  try {
    console.log('[CodePush] Starting update check...');
    await CodePush.sync(
      {
        installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        updateDialog: true,
      },
      (status) => {
        console.log('[CodePush] Status:', status);
        switch (status) {
          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            console.log('[CodePush] Checking for update...');
            break;
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log('[CodePush] Downloading package...');
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            console.log('[CodePush] Installing update...');
            break;
          case CodePush.SyncStatus.UP_TO_DATE:
            console.log('[CodePush] App is up to date.');
            break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            console.log('[CodePush] Update installed.');
            break;
          case CodePush.SyncStatus.UNKNOWN_ERROR:
            console.log('[CodePush] Unknown error occurred.');
            break;
        }
      }
    );
  } catch (error) {
    console.error('[CodePush] Error during sync:', error);
  }
}

export const redirectToAppStore = () => {
  const storeUrl = Platform.select({
    ios: process.env.EXPO_PUBLIC_APPSTORE_URL,
    android: process.env.EXPO_PUBLIC_PLAYSTORE_URL,
  });
  if (storeUrl) {
    Linking.openURL(storeUrl).catch((err) => {
      console.error('스토어 열기 실패:', err);
    });
  }
};

export const releaseHistoryFetcher = async (
  req: UpdateCheckRequest,
): Promise<ReleaseHistoryInterface> => {
  const platform = Platform.OS;
  const identifier = 'staging';
  const url = `${process.env.EXPO_PUBLIC_MINIO_ENDPOINT}/codepush/histories/${platform}/${identifier}/${req.app_version}.json`;

  const res = await fetch(url, {cache: 'no-store'});
  if (!res.ok) throw new Error(`history ${res.status}`);
  const json = (await res.json()) as ReleaseHistoryInterface;
  return json;
}
