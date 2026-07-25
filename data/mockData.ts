import type {
  BudgetProgress,
  FamilyMember,
  Mutuelle,
  MutuelleContract,
  Profile,
  Reimbursement,
  ScannedInvoice,
} from '@/types';

export const profiles: Profile[] = [
  { id: 'marie', name: 'Marie', relation: 'self', emoji: '👩', color: '#18AE8F' },
  { id: 'papi', name: 'Grand-Père', relation: 'grandfather', emoji: '👴', color: '#3B82F6' },
  { id: 'mamie', name: 'Grand-Mère', relation: 'grandmother', emoji: '👵', color: '#EC4899' },
];

export const yearlyRecovered = 340;

export const MEDECINE_DOUCE_CATEGORY = 'Ostéopathie';
export const OPTIQUE_CATEGORY = 'Optique';

export const medecineDouceBudget: BudgetProgress = {
  label: 'Médecines douces',
  used: 150,
  total: 200,
  unit: '€',
};

export const recentReimbursements: Reimbursement[] = [
  {
    id: 'r1',
    profileId: 'marie',
    provider: 'Dr. Lefebvre',
    category: 'Dentaire',
    amount: 90,
    reimbursedAmount: 45,
    status: 'reimbursed',
    date: '2026-07-18',
  },
  {
    id: 'r2',
    profileId: 'marie',
    provider: 'Pharmacie du Centre',
    category: 'Pharmacie',
    amount: 70,
    reimbursedAmount: 70,
    status: 'pending',
    date: '2026-07-20',
  },
  {
    id: 'r3',
    profileId: 'mamie',
    provider: 'Dr. Martin',
    category: 'Ostéopathie',
    amount: 60,
    reimbursedAmount: 0,
    status: 'action_required',
    date: '2026-07-21',
  },
];

export const mutuelle: MutuelleContract = {
  name: 'Harmonie Mutuelle',
  formule: 'Formule Confort',
  memberSince: '2021',
  medecineDouce: { used: 3, total: 4 },
  optique: { used: 0, total: 200 },
};

export const mutuelles: Mutuelle[] = [
  { id: 'harmonie', name: 'Harmonie Mutuelle', emailRemboursement: 'remboursements@harmonie-mutuelle.fr', logo: '🟢' },
  { id: 'mgen', name: 'MGEN', emailRemboursement: 'remboursements@mgen.fr', logo: '🔵' },
  { id: 'maif', name: 'MAIF Santé', emailRemboursement: 'sante@maif.fr', logo: '⚫️' },
  { id: 'malakoff', name: 'Malakoff Humanis', emailRemboursement: 'remboursements@malakoffhumanis.com', logo: '🟠' },
  { id: 'axa', name: 'AXA Santé', emailRemboursement: 'remboursements@axa.fr', logo: '🔷' },
  { id: 'alan', name: 'Alan', emailRemboursement: 'remboursements@alan.com', logo: '⬛' },
  { id: 'autre', name: 'Autre / Saisie libre', emailRemboursement: '', logo: '➕' },
];

export const familyMembers: FamilyMember[] = [
  {
    id: 'marie',
    name: 'Marie (Mes soins)',
    relation: 'self',
    emoji: '👩',
    mutuelleId: 'harmonie',
    mutuelleName: 'Harmonie Mutuelle',
    mutuelleEmail: 'remboursements@harmonie-mutuelle.fr',
    numeroAdherent: 'HM-2291-004',
  },
  {
    id: 'papi',
    name: 'Papa',
    relation: 'grandfather',
    emoji: '👴',
    mutuelleId: 'harmonie',
    mutuelleName: 'Harmonie Mutuelle',
    mutuelleEmail: 'remboursements@harmonie-mutuelle.fr',
    numeroAdherent: 'HM-2291-011',
  },
  {
    id: 'mamie',
    name: 'Maman',
    relation: 'grandmother',
    emoji: '👵',
    mutuelleId: 'harmonie',
    mutuelleName: 'Harmonie Mutuelle',
    mutuelleEmail: 'remboursements@harmonie-mutuelle.fr',
    numeroAdherent: 'HM-2291-012',
  },
];

export const mockScanResult: ScannedInvoice = {
  provider: 'Dr. Martin - Ostéopathie',
  category: 'Ostéopathie',
  amount: 60.0,
  estimatedReimbursement: 45.0,
};
