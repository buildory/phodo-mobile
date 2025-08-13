import { create } from 'zustand';
import { ExtendedProfile } from './user.types';

interface CurrentUserStore {
  profile: ExtendedProfile | null;
  setProfile: (profile: ExtendedProfile) => void;
  clearProfile: () => void;
}

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));