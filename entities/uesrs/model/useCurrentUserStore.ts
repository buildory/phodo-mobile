import { create } from 'zustand';

interface CurrentUserProfile {
  id: string;
  email: string;
  nickname: string;
  gender: string;
  profileImage: string;
  pushToken: string;
}

interface CurrentUserStore {
  profile: CurrentUserProfile | null;
  setProfile: (profile: CurrentUserProfile) => void;
  clearProfile: () => void;
}

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));