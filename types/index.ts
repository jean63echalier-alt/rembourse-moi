export type ReimbursementStatus = 'reimbursed' | 'pending' | 'action_required';

export type ProfileRelation = 'self' | 'grandfather' | 'grandmother' | 'parent' | 'child';

export type GuaranteeCapType = 'amount' | 'sessions' | 'none';

export interface GuaranteeLine {
  id: string;
  category: string;
  label: string;
  /** Taux de prise en charge, en pourcentage du montant payé (0-100). */
  reimbursementRate: number;
  capType: GuaranteeCapType;
  /** Plafond annuel en euros, si capType === 'amount'. */
  capAmount?: number;
  /** Plafond annuel en séances, si capType === 'sessions'. */
  capSessions?: number;
}

export interface MutuelleContractInfo {
  insurerName: string;
  formule: string;
  memberSince: string;
  monthlyPrice: number;
  guarantees: GuaranteeLine[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: ProfileRelation;
  emoji: string;
  color: string;
  email?: string;
  mutuelleId: string;
  mutuelleName: string;
  mutuelleEmail: string;
  numeroAdherent: string;
  /** RIB / IBAN partiellement masqué, isolé par proche pour un routage automatisé. */
  rib: string;
  contract: MutuelleContractInfo;
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
  /** Horodatage de la dernière relance envoyée à la mutuelle, si applicable. */
  reminderSentAt?: string;
}

export interface BudgetProgress {
  label: string;
  used: number;
  total: number;
  unit: '€' | 'séances';
}

export interface Mutuelle {
  id: string;
  name: string;
  emailRemboursement: string;
  logo: string;
}

export interface ScannedInvoice {
  provider: string;
  category: string;
  amount: number;
}

export interface ReimbursementEstimate {
  estimatedReimbursement: number;
  resteACharge: number;
  reimbursementRate: number;
  capReached: boolean;
  guarantee?: GuaranteeLine;
}

export interface GuaranteeUsage {
  usedAmount: number;
  usedSessions: number;
  remainingAmount: number | null;
  remainingSessions: number | null;
  pctUsed: number | null;
}

export interface ScannedContract {
  insurerName: string;
  formule: string;
  monthlyPrice: number;
  guarantees: GuaranteeLine[];
}

export type CoverageVerdict = 'sur-couverture' | 'sous-couverture' | 'adaptee';

export interface CoverageDiagnosticLine {
  category: string;
  spentThisYear: number;
  reimbursedThisYear: number;
  capAmount?: number;
  capSessions?: number;
  pctUsed: number | null;
  verdict: CoverageVerdict;
  message: string;
}

export interface MutuelleOffer {
  id: string;
  insurerName: string;
  formule: string;
  monthlyPrice: number;
  emailRemboursement: string;
  highlights: string[];
  guarantees: GuaranteeLine[];
  bestFor: CoverageVerdict[];
}
