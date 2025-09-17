import * as FileSystem from "expo-file-system";
import { getSupabaseClient } from "@/shared/lib/supabase";

const b64ToUint8Array = (b64: string) => {
  const binary = globalThis.atob ? globalThis.atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

type ImageLike =
  | string
  | { uri?: string; path?: string; localUri?: string }
  | { assets?: Array<{ uri?: string; path?: string; localUri?: string }> };

const extractUri = (item: ImageLike): string | null => {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    if ("uri" in item && item.uri) return item.uri!;
    if ("path" in item && (item as any).path) return (item as any).path;
    if ("localUri" in item && (item as any).localUri) return (item as any).localUri;
    if ("assets" in item && Array.isArray(item.assets) && item.assets[0]?.uri) {
      return item.assets[0].uri!;
    }
  }
  return null;
};

export const uploadImages = async ({
  uris,
  projectId,
}: {
  uris: ImageLike[];
  projectId: string;
}) => {
  const supabase = getSupabaseClient();

  const fileUris = uris
    .map(extractUri)
    .filter((u): u is string => typeof u === "string" && !!u);

  if (fileUris.length === 0) throw new Error("업로드할 이미지 URI가 없습니다.");

  await Promise.all(
    fileUris.map(async (uri, i) => {
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const bytes = b64ToUint8Array(base64);
        const arrayBuffer = bytes.buffer;
        const ext = uri.toLowerCase().endsWith(".png") ? "png" : "jpg";
        const fileName = `project_${projectId}_${Date.now()}_${i}.${ext}`;

        const { data: storageData, error: storageError } = await supabase.storage
          .from("concept-images")
          .upload(fileName, arrayBuffer, {
            contentType: ext === "png" ? "image/png" : "image/jpeg",
            upsert: false,
          });

        if (storageError || !storageData) {
          console.error("❗ Storage 업로드 실패:", storageError);
          throw new Error("이미지 업로드 실패");
        }

        const { data: pub } = supabase.storage
          .from("concept-images")
          .getPublicUrl(storageData.path);

        const publicUrl = pub.publicUrl;

        const { error: dbError } = await supabase.from("concept_images").insert({
          project_id: projectId,
          image_url: publicUrl,
          order_index: i,
        });

        if (dbError) {
          console.error("❗ DB 저장 실패:", dbError);
          throw new Error("DB 저장 실패");
        }
      } catch (err) {
        console.error("🔥 이미지 처리 실패:", err);
        throw err;
      }
    })
  );
};
