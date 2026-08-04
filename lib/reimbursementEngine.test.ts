import {
  buildCoverageDiagnostic,
  computeGuaranteeUsage,
  estimateReimbursement,
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
