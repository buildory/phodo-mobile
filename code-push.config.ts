import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import type {
  CliConfigInterface,
  ReleaseHistoryInterface,
} from '@bravemobile/react-native-code-push';
import fs from 'fs';
import path from 'path';

const s3 = new S3Client({
  region: process.env.EXPO_PUBLIC_MINIO_REGION!,
  endpoint: process.env.EXPO_PUBLIC_MINIO_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_MINIO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.EXPO_PUBLIC_MINIO_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET = 'codepush';
const PUBLIC_BASE = process.env.EXPO_PUBLIC_MINIO_ENDPOINT!;

const withId = (id?: string) => id ?? 'staging';

function safeParseHistory(text?: string): ReleaseHistoryInterface {
  try {
    const parsed = text ? JSON.parse(text) : null;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as ReleaseHistoryInterface;
    }
  } catch {}
  return {};
}

const Config: CliConfigInterface = {
  bundleUploader: async (source, platform, identifier) => {
    const id = withId(identifier);
    const fileName = path.basename(source);
    const key = `bundles/${platform}/${id}/${Date.now()}-${fileName}`;
    const body = fs.readFileSync(source);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: 'application/javascript',
      }),
    );

    const downloadUrl = `${PUBLIC_BASE}/${BUCKET}/${key}`;
    return {downloadUrl};
  },

  getReleaseHistory: async (targetBinaryVersion, platform, identifier) => {
    const id = withId(identifier);
    const key = `histories/${platform}/${id}/${targetBinaryVersion}.json`;
    try {
      const res = await s3.send(
        new GetObjectCommand({Bucket: BUCKET, Key: key}),
      );
      const text = await res.Body?.transformToString();
      return safeParseHistory(text);
    } catch (e: any) {
      if (e?.name === 'NoSuchKey' || e?.$metadata?.httpStatusCode === 404) {
        return {};
      }
      throw e;
    }
  },

  setReleaseHistory: async (
    binaryVersion,
    jsonPath,
    _releaseInfo,
    platform,
    identifier,
  ) => {
    const id = withId(identifier);
    const key = `histories/${platform}/${id}/${binaryVersion}.json`;
    const body = fs.readFileSync(jsonPath);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: 'application/json',
      }),
    );
  },
};

module.exports = Config;
