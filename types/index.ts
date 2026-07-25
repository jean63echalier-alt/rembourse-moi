export type ReimbursementStatus = 'reimbursed' | 'pending' | 'action_required';

export type ProfileRelation = 'self' | 'grandfather' | 'grandmother' | 'parent' | 'child';

export interface Profile {
  id: string;
  name: string;
  relation: ProfileRelation;
  emoji: string;
  color: string;
}

export interface Reimbursement {
  id: string;
  profileId: string;
  provider: string;
  category: string;
  amount: number;
  reimbursedAmount: number;
  status: ReimbursementStatus;
  date: string;
}

export interface BudgetProgress {
  label: string;
  used: number;
  total: number;
  unit: '€' | 'séances';
}

export interface MutuelleContract {
  name: string;
  formule: string;
  memberSince: string;
  medecineDouce: { used: number; total: number };
  optique: { used: number; total: number };
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: ProfileRelation;
  emoji: string;
  mutuelle: string;
  contractNumber: string;
}

export interface ScannedInvoice {
  provider: string;
  category: string;
  amount: number;
  estimatedReimbursement: number;
}
