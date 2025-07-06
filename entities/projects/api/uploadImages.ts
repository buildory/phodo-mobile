import * as FileSystem from "expo-file-system";
import { getSupabaseClient } from "@/shared/lib/supabase";

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const uploadImages = async ({
  uris,
  projectId,
}: {
  uris: string[];
  projectId: string;
}) => {
  const supabase = getSupabaseClient();

  for (let i = 0; i < uris.length; i++) {
    try {
      const uri = uris[i];

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const arrayBuffer = base64ToArrayBuffer(base64);
      const fileName = `project_${projectId}_${Date.now()}_${i}.jpg`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from("concept-images")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (storageError || !storageData) {
        console.error("❗ Storage 업로드 실패:", storageError);
        throw new Error("이미지 업로드 실패");
      }

      const publicUrl = supabase.storage
        .from("concept-images")
        .getPublicUrl(storageData.path).data.publicUrl;

      const { error: dbError } = await supabase
        .from("concept_images")
        .insert({
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
  }
};
