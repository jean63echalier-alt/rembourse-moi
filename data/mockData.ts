import type { FamilyMember, Mutuelle, MutuelleOffer, Reimbursement, ScannedContract, ScannedInvoice } from '@/types';

export const MEDECINE_DOUCE_CATEGORY = 'Ostéopathie';

export const familyMembers: FamilyMember[] = [
  {
    id: 'marie',
    name: 'Marie',
    relation: 'self',
    emoji: '👩',
    color: '#18AE8F',
    email: 'marie.dupont@email.com',
    mutuelleId: 'harmonie',
    mutuelleName: 'Harmonie Mutuelle — Formule Confort',
    mutuelleEmail: 'remboursements@harmonie-mutuelle.fr',
    numeroAdherent: 'HM-2291-004',
    rib: 'FR76 3000 •••• •••• •••• 4582',
    contract: {
      insurerName: 'Harmonie Mutuelle',
      formule: 'Formule Confort',
      memberSince: '2021',
      monthlyPrice: 42,
      guarantees: [
        { id: 'marie-dentaire', category: 'Dentaire', label: 'Soins et prothèses dentaires', reimbursementRate: 50, capType: 'amount', capAmount: 300 },
        { id: 'marie-osteo', category: 'Ostéopathie', label: 'Médecines douces', reimbursementRate: 70, capType: 'sessions', capSessions: 4 },
        { id: 'marie-optique', category: 'Optique', label: 'Monture et verres', reimbursementRate: 100, capType: 'amount', capAmount: 200 },
        { id: 'marie-pharmacie', category: 'Pharmacie', label: 'Médicaments non remboursés Sécu', reimbursementRate: 65, capType: 'none' },
      ],
    },
  },
  {
    id: 'papi',
    name: 'Grand-Père',
    relation: 'grandfather',
    emoji: '👴',
    color: '#3B82F6',
    email: 'papi.dupont@email.com',
    mutuelleId: 'mgen',
    mutuelleName: 'MGEN — Formule Essentielle',
    mutuelleEmail: 'remboursements@mgen.fr',
    numeroAdherent: 'MG-7710-021',
    rib: 'FR76 1820 •••• •••• •••• 1190',
    contract: {
      insurerName: 'MGEN',
      formule: 'Formule Essentielle',
      memberSince: '2019',
      monthlyPrice: 28,
      guarantees: [
        { id: 'papi-specialistes', category: 'Consultations spécialistes', label: 'Consultations chez un spécialiste', reimbursementRate: 100, capType: 'amount', capAmount: 400 },
        { id: 'papi-optique', category: 'Optique', label: 'Monture et verres', reimbursementRate: 60, capType: 'amount', capAmount: 150 },
        { id: 'papi-audio', category: 'Audioprothèses', label: 'Appareillage auditif', reimbursementRate: 100, capType: 'amount', capAmount: 1700 },
        { id: 'papi-osteo', category: 'Ostéopathie', label: 'Médecines douces', reimbursementRate: 50, capType: 'sessions', capSessions: 2 },
      ],
    },
  },
  {
    id: 'mamie',
    name: 'Grand-Mère',
    relation: 'grandmother',
    emoji: '👵',
    color: '#EC4899',
    email: 'mamie.dupont@email.com',
    mutuelleId: 'malakoff',
    mutuelleName: 'Malakoff Humanis — Formule Sérénité',
    mutuelleEmail: 'remboursements@malakoffhumanis.com',
    numeroAdherent: 'MH-5502-018',
    rib: 'FR76 3000 •••• •••• •••• 7734',
    contract: {
      insurerName: 'Malakoff Humanis',
      formule: 'Formule Sérénité',
      memberSince: '2015',
      monthlyPrice: 35,
      guarantees: [
        { id: 'mamie-osteo', category: 'Ostéopathie', label: 'Médecines douces', reimbursementRate: 70, capType: 'sessions', capSessions: 4 },
        { id: 'mamie-dentaire', category: 'Dentaire', label: 'Soins et prothèses dentaires', reimbursementRate: 70, capType: 'amount', capAmount: 500 },
        { id: 'mamie-pharmacie', category: 'Pharmacie', label: 'Médicaments non remboursés Sécu', reimbursementRate: 65, capType: 'none' },
      ],
    },
  },
];

export const recentReimbursements: Reimbursement[] = [
  // Marie
  { id: 'm-r1', profileId: 'marie', provider: 'Dr. Lefebvre', category: 'Dentaire', amount: 90, reimbursedAmount: 45, status: 'reimbursed', date: '2026-07-18' },
  { id: 'm-r2', profileId: 'marie', provider: 'Pharmacie du Centre', category: 'Pharmacie', amount: 70, reimbursedAmount: 70, status: 'pending', date: '2026-07-20' },
  { id: 'm-r3', profileId: 'marie', provider: 'Cabinet Ostéo Bastille', category: 'Ostéopathie', amount: 60, reimbursedAmount: 42, status: 'pending', date: '2026-06-20' },
  { id: 'm-r4', profileId: 'marie', provider: 'Cabinet Ostéo Bastille', category: 'Ostéopathie', amount: 55, reimbursedAmount: 38.5, status: 'reimbursed', date: '2026-05-10' },
  { id: 'm-r5', profileId: 'marie', provider: 'Cabinet Ostéo Bastille', category: 'Ostéopathie', amount: 55, reimbursedAmount: 38.5, status: 'reimbursed', date: '2026-03-02' },
  { id: 'm-r6', profileId: 'marie', provider: 'Cabinet Ostéo Bastille', category: 'Ostéopathie', amount: 55, reimbursedAmount: 38.5, status: 'reimbursed', date: '2026-01-15' },
  { id: 'm-r7', profileId: 'marie', provider: 'Cabinet Ostéo Bastille', category: 'Ostéopathie', amount: 55, reimbursedAmount: 38.5, status: 'reimbursed', date: '2026-02-08' },

  // Grand-Père
  { id: 'p-r1', profileId: 'papi', provider: 'Dr. Bernard — Cardiologue', category: 'Consultations spécialistes', amount: 80, reimbursedAmount: 80, status: 'reimbursed', date: '2026-07-10' },
  { id: 'p-r2', profileId: 'papi', provider: 'Optic 2000', category: 'Optique', amount: 250, reimbursedAmount: 0, status: 'action_required', date: '2026-07-05' },
  { id: 'p-r3', profileId: 'papi', provider: 'Audio Solutions', category: 'Audioprothèses', amount: 1200, reimbursedAmount: 1200, status: 'pending', date: '2026-06-01' },

  // Grand-Mère
  { id: 'g-r1', profileId: 'mamie', provider: 'Dr. Martin', category: 'Ostéopathie', amount: 60, reimbursedAmount: 0, status: 'action_required', date: '2026-07-21' },
  { id: 'g-r2', profileId: 'mamie', provider: 'Dentiste Familial', category: 'Dentaire', amount: 200, reimbursedAmount: 140, status: 'reimbursed', date: '2026-06-15' },
];

export const mutuelles: Mutuelle[] = [
  { id: 'harmonie', name: 'Harmonie Mutuelle', emailRemboursement: 'remboursements@harmonie-mutuelle.fr', logo: '🟢' },
  { id: 'mgen', name: 'MGEN', emailRemboursement: 'remboursements@mgen.fr', logo: '🔵' },
  { id: 'maif', name: 'MAIF Santé', emailRemboursement: 'sante@maif.fr', logo: '⚫️' },
  { id: 'malakoff', name: 'Malakoff Humanis', emailRemboursement: 'remboursements@malakoffhumanis.com', logo: '🟠' },
  { id: 'axa', name: 'AXA Santé', emailRemboursement: 'remboursements@axa.fr', logo: '🔷' },
  { id: 'alan', name: 'Alan', emailRemboursement: 'remboursements@alan.com', logo: '⬛' },
  { id: 'autre', name: 'Autre / Saisie libre', emailRemboursement: '', logo: '➕' },
];

export const mutuelleOffers: MutuelleOffer[] = [
  {
    id: 'alan-green',
    insurerName: 'Alan',
    formule: 'Alan Green',
    monthlyPrice: 24,
    emailRemboursement: 'remboursements@alan.com',
    highlights: ['Tiers payant intégral', 'Remboursement en 24h', '100% digital, sans papier'],
    guarantees: [
      { id: 'alan-dentaire', category: 'Dentaire', label: 'Soins et prothèses dentaires', reimbursementRate: 60, capType: 'amount', capAmount: 350 },
      { id: 'alan-osteo', category: 'Ostéopathie', label: 'Médecines douces', reimbursementRate: 70, capType: 'sessions', capSessions: 3 },
      { id: 'alan-optique', category: 'Optique', label: 'Monture et verres', reimbursementRate: 100, capType: 'amount', capAmount: 150 },
      { id: 'alan-pharmacie', category: 'Pharmacie', label: 'Médicaments non remboursés Sécu', reimbursementRate: 60, capType: 'none' },
    ],
    bestFor: ['sur-couverture'],
  },
  {
    id: 'harmonie-premium',
    insurerName: 'Harmonie Mutuelle',
    formule: 'Formule Premium',
    monthlyPrice: 58,
    emailRemboursement: 'remboursements@harmonie-mutuelle.fr',
    highlights: ['8 séances de médecines douces par an', 'Dentaire renforcé 800€/an', 'Optique jusqu\'à 350€/an'],
    guarantees: [
      { id: 'hp-dentaire', category: 'Dentaire', label: 'Soins et prothèses dentaires', reimbursementRate: 80, capType: 'amount', capAmount: 800 },
      { id: 'hp-osteo', category: 'Ostéopathie', label: 'Médecines douces', reimbursementRate: 80, capType: 'sessions', capSessions: 8 },
      { id: 'hp-optique', category: 'Optique', label: 'Monture et verres', reimbursementRate: 100, capType: 'amount', capAmount: 350 },
      { id: 'hp-pharmacie', category: 'Pharmacie', label: 'Médicaments non remboursés Sécu', reimbursementRate: 80, capType: 'none' },
    ],
    bestFor: ['sous-couverture'],
  },
  {
    id: 'mgen-essentiel-plus',
    insurerName: 'MGEN',
    formule: 'Formule Essentielle+',
    monthlyPrice: 19,
    emailRemboursement: 'remboursements@mgen.fr',
    highlights: ['Couverture de base optimisée', 'Idéal si peu de dépenses santé', 'Sans engagement, résiliable à tout moment'],
    guarantees: [
      { id: 'mep-specialistes', category: 'Consultations spécialistes', label: 'Consultations chez un spécialiste', reimbursementRate: 100, capType: 'amount', capAmount: 300 },
      { id: 'mep-optique', category: 'Optique', label: 'Monture et verres', reimbursementRate: 50, capType: 'amount', capAmount: 100 },
      { id: 'mep-osteo', category: 'Ostéopathie', label: 'Médecines douces', reimbursementRate: 50, capType: 'sessions', capSessions: 2 },
    ],
    bestFor: ['sur-couverture'],
  },
];

export const mockScanResult: ScannedInvoice = {
  provider: 'Dr. Martin - Ostéopathie',
  category: 'Ostéopathie',
  amount: 60,
};

export const mockContractScanResult: ScannedContract = {
  insurerName: 'Harmonie Mutuelle',
  formule: 'Formule Premium',
  monthlyPrice: 58,
  guarantees: mutuelleOffers.find((o) => o.id === 'harmonie-premium')!.guarantees,
};
