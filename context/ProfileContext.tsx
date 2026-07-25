import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useReimbursements } from '@/context/ReimbursementContext';
import type { FamilyMember } from '@/types';

const PROFILE_ID_KEY = '@remboursemoi/profileId';

interface ProfileContextValue {
  profile: FamilyMember;
  setProfileId: (id: string) => void;
  profiles: FamilyMember[];
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { familyMembers } = useReimbursements();
  const [profileId, setProfileIdState] = useState(familyMembers[0]?.id);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_ID_KEY).then((stored) => {
      if (stored && familyMembers.some((m) => m.id === stored)) setProfileIdState(stored);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setProfileId(id: string) {
    setProfileIdState(id);
    AsyncStorage.setItem(PROFILE_ID_KEY, id);
  }

  const value = useMemo<ProfileContextValue>(() => {
    const profile = familyMembers.find((m) => m.id === profileId) ?? familyMembers[0];
    return { profile, setProfileId, profiles: familyMembers };
  }, [profileId, familyMembers]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
