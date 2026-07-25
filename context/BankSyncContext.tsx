import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { FamilyMember, Reimbursement } from '@/types';

const BANK_SYNC_KEY = '@remboursemoi/bankSync';

export const AVAILABLE_BANKS = ['BoursoBank', 'Crédit Agricole', 'BNP Paribas', 'Société Générale'];

interface MockBankTransaction {
  label: string;
  amount: number;
  date: string;
}

// Simule le flux de transactions entrantes qu'une vraie agrégation DSP2 (type Bridge/Powens)
// renverrait — utilisé uniquement par l'algorithme de rapprochement ci-dessous.
const MOCK_TRANSACTIONS: MockBankTransaction[] = [
  { label: 'VIR HARMONIE MUTUELLE', amount: 70, date: new Date().toISOString().slice(0, 10) },
  { label: 'VIR HARMONIE MUTUELLE', amount: 45, date: new Date().toISOString().slice(0, 10) },
  { label: 'VIR CPAM', amount: 22, date: new Date().toISOString().slice(0, 10) },
];

interface BankSyncContextValue {
  isBankConnected: boolean;
  connectedBankName: string | null;
  availableBanks: string[];
  connectBank: (name: string) => void;
  disconnectBank: () => void;
  checkAutomaticReimbursements: (
    pending: Reimbursement[],
    familyMembers: FamilyMember[]
  ) => string[];
}

const BankSyncContext = createContext<BankSyncContextValue | undefined>(undefined);

export function BankSyncProvider({ children }: { children: React.ReactNode }) {
  const [connectedBankName, setConnectedBankName] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(BANK_SYNC_KEY).then((stored) => {
      if (stored) setConnectedBankName(stored);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (connectedBankName) AsyncStorage.setItem(BANK_SYNC_KEY, connectedBankName);
    else AsyncStorage.removeItem(BANK_SYNC_KEY);
  }, [connectedBankName, hydrated]);

  const value = useMemo<BankSyncContextValue>(
    () => ({
      isBankConnected: connectedBankName !== null,
      connectedBankName,
      availableBanks: AVAILABLE_BANKS,
      connectBank: (name) => setConnectedBankName(name),
      disconnectBank: () => setConnectedBankName(null),
      checkAutomaticReimbursements: (pending, familyMembers) => {
        const matched: string[] = [];
        for (const reimbursement of pending) {
          const member = familyMembers.find((m) => m.id === reimbursement.profileId);
          const keyword = member?.mutuelleName?.split(' ')[0]?.toLowerCase();
          const isMatch = MOCK_TRANSACTIONS.some((tx) => {
            const sameAmount = Math.abs(tx.amount - reimbursement.reimbursedAmount) < 0.01;
            const label = tx.label.toLowerCase();
            const sameSource = (!!keyword && label.includes(keyword)) || label.includes('cpam');
            return sameAmount && sameSource;
          });
          if (isMatch) matched.push(reimbursement.id);
        }
        return matched;
      },
    }),
    [connectedBankName]
  );

  return <BankSyncContext.Provider value={value}>{children}</BankSyncContext.Provider>;
}

export function useBankSync() {
  const ctx = useContext(BankSyncContext);
  if (!ctx) throw new Error('useBankSync must be used within a BankSyncProvider');
  return ctx;
}
