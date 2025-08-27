import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as FileSystem from "expo-file-system";
import 'react-native-get-random-values';

const s3 = new S3Client({
  region: process.env.EXPO_PUBLIC_MINIO_REGION!,   
  endpoint: process.env.EXPO_PUBLIC_MINIO_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_MINIO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.EXPO_PUBLIC_MINIO_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToMinio({ bucket, key, uri, mime }:{
    bucket:string; key:string; uri:string; mime:string;
  }): Promise<string> {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) throw new Error("파일이 존재하지 않습니다.");
  
    const res = await fetch(uri);
    const body = new Uint8Array(await res.arrayBuffer());
  
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: mime,
    }));
  
    const endpoint = process.env.EXPO_PUBLIC_MINIO_ENDPOINT;
    const publicUrl = `${endpoint}/${bucket}/${key}`;
    
    return publicUrl;
  }

export async function deleteFromMinio({ bucket, key }: {
  bucket: string;
  key: string;
}): Promise<void> {
  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }));
  } catch (error) {
    // 삭제 실패해도 에러를 던지지 않음 (파일이 이미 없을 수 있음)
  }
}