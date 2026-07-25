import type {
  CoverageDiagnosticLine,
  FamilyMember,
  GuaranteeLine,
  GuaranteeUsage,
  Reimbursement,
  ReimbursementEstimate,
} from '@/types';

export const RELANCE_DELAY_DAYS = 10;

function daysBetween(from: Date, to: Date) {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function getGuaranteeForCategory(
  contract: FamilyMember['contract'],
  category: string
): GuaranteeLine | undefined {
  return contract.guarantees.find((g) => g.category === category);
}

/**
 * Calcule ce qui a déjà été consommé sur une garantie, uniquement à partir des
 * remboursements déjà validés (status "reimbursed") — un remboursement en attente
 * ne consomme pas encore le plafond annuel.
 */
export function computeGuaranteeUsage(
  member: FamilyMember,
  category: string,
  reimbursements: Reimbursement[]
): GuaranteeUsage {
  const guarantee = getGuaranteeForCategory(member.contract, category);
  const validated = reimbursements.filter(
    (r) => r.profileId === member.id && r.category === category && r.status === 'reimbursed'
  );

  const usedAmount = validated.reduce((sum, r) => sum + r.reimbursedAmount, 0);
  const usedSessions = validated.length;

  const remainingAmount =
    guarantee?.capType === 'amount' && guarantee.capAmount != null
      ? Math.max(0, guarantee.capAmount - usedAmount)
      : null;
  const remainingSessions =
    guarantee?.capType === 'sessions' && guarantee.capSessions != null
      ? Math.max(0, guarantee.capSessions - usedSessions)
      : null;

  const pctUsed =
    guarantee?.capType === 'amount' && guarantee.capAmount
      ? Math.min(1, usedAmount / guarantee.capAmount)
      : guarantee?.capType === 'sessions' && guarantee.capSessions
        ? Math.min(1, usedSessions / guarantee.capSessions)
        : null;

  return { usedAmount, usedSessions, remainingAmount, remainingSessions, pctUsed };
}

/**
 * Calculateur de reste à charge : estime instantanément ce que la mutuelle va
 * rembourser pour une nouvelle facture, en tenant compte du plafond déjà consommé.
 */
export function estimateReimbursement(
  category: string,
  amountPaid: number,
  member: FamilyMember,
  reimbursements: Reimbursement[]
): ReimbursementEstimate {
  const guarantee = getGuaranteeForCategory(member.contract, category);

  if (!guarantee) {
    return { estimatedReimbursement: 0, resteACharge: amountPaid, reimbursementRate: 0, capReached: false };
  }

  const usage = computeGuaranteeUsage(member, category, reimbursements);
  let estimate = amountPaid * (guarantee.reimbursementRate / 100);
  let capReached = false;

  if (guarantee.capType === 'amount' && usage.remainingAmount != null) {
    if (estimate >= usage.remainingAmount) {
      estimate = usage.remainingAmount;
      capReached = true;
    }
  } else if (guarantee.capType === 'sessions' && usage.remainingSessions != null) {
    if (usage.remainingSessions <= 0) {
      estimate = 0;
      capReached = true;
    }
  }

  estimate = Math.round(estimate * 100) / 100;
  const resteACharge = Math.round((amountPaid - estimate) * 100) / 100;

  return { estimatedReimbursement: estimate, resteACharge, reimbursementRate: guarantee.reimbursementRate, capReached, guarantee };
}

export function daysUntilYearEnd(now: Date = new Date()): number {
  const end = new Date(now.getFullYear(), 11, 31);
  return Math.max(0, daysBetween(now, end));
}

/**
 * Garanties avec un forfait encore disponible cette année — sert de base aux
 * alertes "plafonds périmés" pour inciter à consommer avant la fin de l'année.
 */
export function getExpiringGuarantees(
  member: FamilyMember,
  reimbursements: Reimbursement[]
): { guarantee: GuaranteeLine; usage: GuaranteeUsage }[] {
  return member.contract.guarantees
    .filter((g) => g.capType !== 'none')
    .map((guarantee) => ({ guarantee, usage: computeGuaranteeUsage(member, guarantee.category, reimbursements) }))
    .filter(({ usage }) => (usage.remainingAmount ?? usage.remainingSessions ?? 0) > 0);
}

export function isReimbursementOverdue(
  reimbursement: Reimbursement,
  thresholdDays: number = RELANCE_DELAY_DAYS,
  now: Date = new Date()
): boolean {
  if (reimbursement.status !== 'pending') return false;
  return daysBetween(new Date(reimbursement.date), now) > thresholdDays;
}

/**
 * Diagnostic de couverture : compare les dépenses réelles par catégorie aux
 * garanties du contrat actuel pour détecter un sur-coût (mutuelle trop chère
 * pour ce qui est réellement consommé) ou une sous-couverture (plafond
 * régulièrement atteint).
 */
export function buildCoverageDiagnostic(
  member: FamilyMember,
  reimbursements: Reimbursement[]
): CoverageDiagnosticLine[] {
  const memberReimbursements = reimbursements.filter((r) => r.profileId === member.id);
  const categories = new Set(memberReimbursements.map((r) => r.category));

  const lines: CoverageDiagnosticLine[] = [];

  for (const category of categories) {
    const guarantee = getGuaranteeForCategory(member.contract, category);
    if (!guarantee) continue;

    const forCategory = memberReimbursements.filter((r) => r.category === category);
    const spentThisYear = forCategory.reduce((sum, r) => sum + r.amount, 0);
    const reimbursedThisYear = forCategory
      .filter((r) => r.status === 'reimbursed')
      .reduce((sum, r) => sum + r.reimbursedAmount, 0);

    // Basé sur la dépense réelle (tous statuts confondus), pas seulement sur ce qui a déjà
    // été validé par la mutuelle : un dossier "en attente" qui dépasse déjà le plafond doit
    // être détecté comme une sous-couverture sans attendre le virement.
    const pctUsed =
      guarantee.capType === 'amount' && guarantee.capAmount
        ? spentThisYear / guarantee.capAmount
        : guarantee.capType === 'sessions' && guarantee.capSessions
          ? forCategory.length / guarantee.capSessions
          : null;

    let verdict: CoverageDiagnosticLine['verdict'] = 'adaptee';
    let message = 'Votre garantie actuelle correspond bien à votre consommation.';

    if (pctUsed != null && pctUsed >= 0.9) {
      verdict = 'sous-couverture';
      message = `Vous avez déjà consommé ${Math.round(pctUsed * 100)}% de votre forfait ${category.toLowerCase()}. Une formule plus généreuse éviterait de futurs restes à charge.`;
    } else if (pctUsed != null && pctUsed <= 0.2 && spentThisYear > 0) {
      verdict = 'sur-couverture';
      message = `Vous n'utilisez que ${Math.round(pctUsed * 100)}% de votre forfait ${category.toLowerCase()}. Une formule moins chère couvrirait vos besoins réels.`;
    }

    lines.push({
      category,
      spentThisYear,
      reimbursedThisYear,
      capAmount: guarantee.capType === 'amount' ? guarantee.capAmount : undefined,
      capSessions: guarantee.capType === 'sessions' ? guarantee.capSessions : undefined,
      pctUsed,
      verdict,
      message,
    });
  }

  return lines;
}
