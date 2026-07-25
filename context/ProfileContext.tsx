import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { profiles } from '@/data/mockData';
import type { Profile } from '@/types';

const PROFILE_ID_KEY = '@remboursemoi/profileId';

interface ProfileContextValue {
  profile: Profile;
  setProfileId: (id: string) => void;
  profiles: Profile[];
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileId, setProfileIdState] = useState(profiles[0].id);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_ID_KEY).then((stored) => {
      if (stored && profiles.some((p) => p.id === stored)) setProfileIdState(stored);
    });
  }, []);

  function setProfileId(id: string) {
    setProfileIdState(id);
    AsyncStorage.setItem(PROFILE_ID_KEY, id);
  }

  const value = useMemo<ProfileContextValue>(() => {
    const profile = profiles.find((p) => p.id === profileId) ?? profiles[0];
    return { profile, setProfileId, profiles };
  }, [profileId]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
