import { User } from '../model/type'

export const mapUser = (raw: any): User => ({
    id: raw.id,
    name: raw.full_name,
    avatarUrl: raw.profile_img
  })