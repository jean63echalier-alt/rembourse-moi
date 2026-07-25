import React, { createContext, useContext, useMemo, useState } from 'react';

import { profiles } from '@/data/mockData';
import type { Profile } from '@/types';

interface ProfileContextValue {
  profile: Profile;
  setProfileId: (id: string) => void;
  profiles: Profile[];
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileId, setProfileId] = useState(profiles[0].id);

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
