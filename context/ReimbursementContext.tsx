import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { familyMembers as initialFamilyMembers, recentReimbursements } from '@/data/mockData';
import type { FamilyMember, Reimbursement } from '@/types';

const FAMILY_KEY = '@remboursemoi/familyMembers';
const REIMBURSEMENTS_KEY = '@remboursemoi/reimbursements';

interface ReimbursementContextValue {
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  reimbursements: Reimbursement[];
  addReimbursement: (item: Omit<Reimbursement, 'id'>) => void;
}

const ReimbursementContext = createContext<ReimbursementContextValue | undefined>(undefined);

export function ReimbursementProvider({ children }: { children: React.ReactNode }) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(recentReimbursements);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedFamily, storedReimbursements] = await Promise.all([
          AsyncStorage.getItem(FAMILY_KEY),
          AsyncStorage.getItem(REIMBURSEMENTS_KEY),
        ]);
        if (storedFamily) setFamilyMembers(JSON.parse(storedFamily));
        if (storedReimbursements) setReimbursements(JSON.parse(storedReimbursements));
      } catch {
        // pas de données locales valides, on garde les valeurs mock par défaut
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(FAMILY_KEY, JSON.stringify(familyMembers));
  }, [familyMembers, hydrated]);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(REIMBURSEMENTS_KEY, JSON.stringify(reimbursements));
  }, [reimbursements, hydrated]);

  const value = useMemo<ReimbursementContextValue>(
    () => ({
      familyMembers,
      addFamilyMember: (member) =>
        setFamilyMembers((prev) => [...prev, { ...member, id: `member-${Date.now()}` }]),
      reimbursements,
      addReimbursement: (item) =>
        setReimbursements((prev) => [{ ...item, id: `r-${Date.now()}` }, ...prev]),
    }),
    [familyMembers, reimbursements]
  );

  return (
    <ReimbursementContext.Provider value={value}>{children}</ReimbursementContext.Provider>
  );
}

export function useReimbursements() {
  const ctx = useContext(ReimbursementContext);
  if (!ctx) throw new Error('useReimbursements must be used within a ReimbursementProvider');
  return ctx;
}
