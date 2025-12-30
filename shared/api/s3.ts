import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as FileSystem from "expo-file-system";
import Constants from 'expo-constants';
import 'react-native-get-random-values';

const getMinioConfig = () => {
  if (process.env.EXPO_PUBLIC_MINIO_REGION) {
    return {
      region: process.env.EXPO_PUBLIC_MINIO_REGION,
      endpoint: process.env.EXPO_PUBLIC_MINIO_ENDPOINT,
      accessKeyId: process.env.EXPO_PUBLIC_MINIO_ACCESS_KEY_ID,
      secretAccessKey: process.env.EXPO_PUBLIC_MINIO_SECRET_ACCESS_KEY,
    };
  }

  const extra = Constants.expoConfig?.extra;
  if (extra?.minio) {
    return {
      region: extra.minio.region,
      endpoint: extra.minio.endpoint,
      accessKeyId: extra.minio.accessKeyId,
      secretAccessKey: extra.minio.secretAccessKey,
    };
  }
  
  throw new Error('MinIO 설정을 찾을 수 없습니다. 환경 변수 또는 app.json을 확인해주세요.');
};

const minioConfig = getMinioConfig();

const s3 = new S3Client({
  region: minioConfig.region,   
  endpoint: minioConfig.endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: minioConfig.accessKeyId,
    secretAccessKey: minioConfig.secretAccessKey,
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
  
    const publicUrl = `${minioConfig.endpoint}/${bucket}/${key}`;
    
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