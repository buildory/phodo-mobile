import { z } from "zod";
import { ProfileSchema, UpdateProfileParamsSchema } from "./user.schema";

export type Profile = z.infer<typeof ProfileSchema>;

export type UpdateProfileParams = {
  id: string;
  values: Partial<z.infer<typeof UpdateProfileParamsSchema>>;
};

export interface BaseProfile {
  id: string;
  email: string;
  nickname: string;
  gender?: string;
  profileImage?: string;
  pushToken?: string | null;
  createdAt?: string;
}

export interface PhotographerProfile {
  profileId: string;
  totalShootings: number;
  totalShootingTime: number;
  avgMatchingSpeed: number;
  introduction?: string;
}

export interface ModelProfile {
  profileId: string;
  totalShootings: number;
  totalShootingTime: number;
  avgMatchingSpeed: number;
  introduction?: string;
}

export interface SocialAccount {
  id: number;
  profileId: string;
  platform: 'instagram' | 'youtube' | 'other';
  url?: string;
  createdAt: string;
}

export interface PortfolioImage {
  id: string;
  user_id: string;
  profile_type: 'photographer' | 'model';
  image_url: string;
  image_order: number;
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ExtendedProfile extends BaseProfile {
  photographerProfile?: PhotographerProfile;
  modelProfile?: ModelProfile;
  profileSocialAccounts?: SocialAccount[];
  portfolioImages?: PortfolioImage[];
  socialAccounts?: SocialAccount[];
}
