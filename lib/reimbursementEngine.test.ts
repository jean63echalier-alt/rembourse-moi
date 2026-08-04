import {
  buildCoverageDiagnostic,
  computeGuaranteeUsage,
  daysUntilYearEnd,
  estimateReimbursement,
  getExpiringGuarantees,
  isReimbursementOverdue,
} from './reimbursementEngine';
import type { FamilyMember, GuaranteeLine, Reimbursement } from '@/types';

function makeGuarantee(overrides: Partial<GuaranteeLine> = {}): GuaranteeLine {
  return {
    id: 'g1',
    category: 'Dentaire',
    label: 'Dentaire',
    reimbursementRate: 70,
    capType: 'amount',
    capAmount: 100,
    ...overrides,
  };
}

function makeMember(guarantees: GuaranteeLine[]): FamilyMember {
  return {
    id: 'member-1',
    name: 'Test',
    relation: 'self',
    emoji: '🙂',
    color: '#000',
    mutuelleId: 'm1',
    mutuelleName: 'MutuelleTest',
    mutuelleEmail: 'contact@mutuelletest.fr',
    numeroAdherent: '123',
    rib: 'FR76XXXX',
    contract: {
      insurerName: 'MutuelleTest',
      formule: 'Essentielle',
      memberSince: '2020-01-01',
      monthlyPrice: 30,
      guarantees,
    },
  };
}

function makeReimbursement(overrides: Partial<Reimbursement> = {}): Reimbursement {
  return {
    id: 'r1',
    profileId: 'member-1',
    provider: 'Dentiste',
    category: 'Dentaire',
    amount: 100,
    reimbursedAmount: 70,
    status: 'reimbursed',
    date: new Date().toISOString(),
    ...overrides,
  };
}

describe('estimateReimbursement', () => {
  it("retourne 0 et le montant complet en reste à charge si aucune garantie ne couvre la catégorie", () => {
    const member = makeMember([]);
    const result = estimateReimbursement('Dentaire', 100, member, []);
    expect(result).toEqual({ estimatedReimbursement: 0, resteACharge: 100, reimbursementRate: 0, capReached: false });
  });

  it('applique le taux de remboursement quand le plafond est loin', () => {
    const member = makeMember([makeGuarantee({ capAmount: 1000 })]);
    const result = estimateReimbursement('Dentaire', 100, member, []);
    expect(result.estimatedReimbursement).toBe(70);
    expect(result.resteACharge).toBe(30);
    expect(result.capReached).toBe(false);
  });

  it('plafonne le remboursement (capType amount) au restant disponible', () => {
    const member = makeMember([makeGuarantee({ capAmount: 50 })]);
    const already = [makeReimbursement({ reimbursedAmount: 30 })];
    const result = estimateReimbursement('Dentaire', 100, member, already);
    expect(result.estimatedReimbursement).toBe(20);
    expect(result.capReached).toBe(true);
  });

  it('renvoie 0 si le plafond en séances est déjà atteint', () => {
    const member = makeMember([makeGuarantee({ capType: 'sessions', capSessions: 1, capAmount: undefined })]);
    const already = [makeReimbursement()];
    const result = estimateReimbursement('Dentaire', 100, member, already);
    expect(result.estimatedReimbursement).toBe(0);
    expect(result.capReached).toBe(true);
  });
});

describe('computeGuaranteeUsage', () => {
  it("ne compte pas un remboursement en attente comme consommant le plafond", () => {
    const member = makeMember([makeGuarantee({ capAmount: 100 })]);
    const reimbursements = [makeReimbursement({ status: 'pending', reimbursedAmount: 0 })];
    const usage = computeGuaranteeUsage(member, 'Dentaire', reimbursements);
    expect(usage.usedAmount).toBe(0);
    expect(usage.remainingAmount).toBe(100);
  });

  it('compte uniquement les remboursements validés', () => {
    const member = makeMember([makeGuarantee({ capAmount: 100 })]);
    const reimbursements = [makeReimbursement({ reimbursedAmount: 40 })];
    const usage = computeGuaranteeUsage(member, 'Dentaire', reimbursements);
    expect(usage.usedAmount).toBe(40);
    expect(usage.remainingAmount).toBe(60);
  });
});

describe('isReimbursementOverdue', () => {
  it('est en retard si en attente depuis plus que le délai', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 15);
    const r = makeReimbursement({ status: 'pending', date: oldDate.toISOString() });
    expect(isReimbursementOverdue(r)).toBe(true);
  });

  it("n'est jamais en retard si déjà remboursé", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 30);
    const r = makeReimbursement({ status: 'reimbursed', date: oldDate.toISOString() });
    expect(isReimbursementOverdue(r)).toBe(false);
  });
});

describe('buildCoverageDiagnostic', () => {
  it('détecte une sous-couverture au-delà de 90% du plafond consommé', () => {
    const member = makeMember([makeGuarantee({ capAmount: 100 })]);
    const reimbursements = [makeReimbursement({ amount: 95, reimbursedAmount: 66.5 })];
    const [line] = buildCoverageDiagnostic(member, reimbursements);
    expect(line.verdict).toBe('sous-couverture');
  });

  it('détecte une sur-couverture en dessous de 20% du plafond utilisé', () => {
    const member = makeMember([makeGuarantee({ capAmount: 1000 })]);
    const reimbursements = [makeReimbursement({ amount: 50, reimbursedAmount: 35 })];
    const [line] = buildCoverageDiagnostic(member, reimbursements);
    expect(line.verdict).toBe('sur-couverture');
  });
});

describe('getExpiringGuarantees', () => {
  const dentaire = makeGuarantee({ id: 'g-dentaire', category: 'Dentaire', capType: 'amount', capAmount: 100 });
  const optique = makeGuarantee({ id: 'g-optique', category: 'Optique', capType: 'amount', capAmount: 50 });
  const kine = makeGuarantee({ id: 'g-kine', category: 'Kine', capType: 'sessions', capAmount: undefined, capSessions: 3 });
  const osteo = makeGuarantee({ id: 'g-osteo', category: 'Osteopathie', capType: 'sessions', capAmount: undefined, capSessions: 2 });
  const consultation = makeGuarantee({ id: 'g-conso', category: 'Consultation', capType: 'none', capAmount: undefined });

  it('inclut une garantie (plafond en montant) avec du reste disponible, avec le bon montant restant', () => {
    const member = makeMember([dentaire]);
    const reimbursements = [makeReimbursement({ category: 'Dentaire', reimbursedAmount: 40 })];
    const result = getExpiringGuarantees(member, reimbursements);
    expect(result).toHaveLength(1);
    expect(result[0].guarantee.category).toBe('Dentaire');
    expect(result[0].usage.remainingAmount).toBe(60);
  });

  it('inclut une garantie (plafond en séances) avec du reste disponible, avec le bon nombre de séances restantes', () => {
    const member = makeMember([kine]);
    const reimbursements = [
      makeReimbursement({ category: 'Kine' }),
      makeReimbursement({ category: 'Kine' }),
    ];
    const result = getExpiringGuarantees(member, reimbursements);
    expect(result).toHaveLength(1);
    expect(result[0].guarantee.category).toBe('Kine');
    expect(result[0].usage.remainingSessions).toBe(1);
  });

  it('exclut une garantie (montant) entièrement consommée', () => {
    const member = makeMember([optique]);
    const reimbursements = [makeReimbursement({ category: 'Optique', reimbursedAmount: 50 })];
    const result = getExpiringGuarantees(member, reimbursements);
    expect(result).toHaveLength(0);
  });

  it('exclut une garantie (séances) entièrement consommée', () => {
    const member = makeMember([osteo]);
    const reimbursements = [
      makeReimbursement({ category: 'Osteopathie' }),
      makeReimbursement({ category: 'Osteopathie' }),
    ];
    const result = getExpiringGuarantees(member, reimbursements);
    expect(result).toHaveLength(0);
  });

  it("exclut une garantie sans plafond exploitable (capType 'none'), même sans consommation", () => {
    const member = makeMember([consultation]);
    const result = getExpiringGuarantees(member, []);
    expect(result).toHaveLength(0);
  });

  it("n'exclut pas une garantie sur la base d'un remboursement encore en attente (pending ne consomme pas le plafond)", () => {
    const member = makeMember([optique]);
    const reimbursements = [makeReimbursement({ category: 'Optique', status: 'pending', reimbursedAmount: 0 })];
    const result = getExpiringGuarantees(member, reimbursements);
    expect(result).toHaveLength(1);
    expect(result[0].usage.remainingAmount).toBe(50);
  });

  it('ne retient que les garanties encore exploitables parmi un contrat mixte', () => {
    const member = makeMember([dentaire, optique, kine, osteo, consultation]);
    const reimbursements = [
      makeReimbursement({ category: 'Dentaire', reimbursedAmount: 40 }), // reste 60 → inclus
      makeReimbursement({ category: 'Optique', reimbursedAmount: 50 }), // reste 0 → exclu
      makeReimbursement({ category: 'Kine' }),
      makeReimbursement({ category: 'Kine' }), // reste 1 séance → inclus
      makeReimbursement({ category: 'Osteopathie' }),
      makeReimbursement({ category: 'Osteopathie' }), // reste 0 séance → exclu
      // Consultation (capType 'none') : toujours exclue, aucun remboursement nécessaire
    ];
    const result = getExpiringGuarantees(member, reimbursements);
    expect(result.map((r) => r.guarantee.category).sort()).toEqual(['Dentaire', 'Kine']);
  });
});

describe('daysUntilYearEnd', () => {
  it('renvoie 0 le 31 décembre (date injectée, indépendante de la date système)', () => {
    const now = new Date(2025, 11, 31);
    expect(daysUntilYearEnd(now)).toBe(0);
  });

  it('renvoie une valeur proche de la fin quand on est le 1er janvier', () => {
    const now = new Date(2025, 0, 1);
    // 2025 n'est pas bissextile : du 1er janvier au 31 décembre il y a 364 jours pleins.
    expect(daysUntilYearEnd(now)).toBe(364);
  });

  it('calcule correctement quelques jours avant la fin de l\'année', () => {
    const now = new Date(2025, 11, 28);
    expect(daysUntilYearEnd(now)).toBe(3);
  });
});
