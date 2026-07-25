import { Text, View } from 'react-native';

import { computeGuaranteeUsage } from '@/lib/reimbursementEngine';
import type { FamilyMember, GuaranteeLine, Reimbursement } from '@/types';

export function GuaranteeProgress({
  member,
  guarantee,
  reimbursements,
}: {
  member: FamilyMember;
  guarantee: GuaranteeLine;
  reimbursements: Reimbursement[];
}) {
  const usage = computeGuaranteeUsage(member, guarantee.category, reimbursements);
  const pct = usage.pctUsed != null ? Math.round(usage.pctUsed * 100) : null;

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-sm font-medium text-neutral-600">{guarantee.label}</Text>
        <Text className="text-xs font-semibold text-neutral-900">
          {guarantee.reimbursementRate}% pris en charge
        </Text>
      </View>
      {guarantee.capType === 'none' ? (
        <Text className="text-xs text-neutral-400">Remboursé à l&apos;acte, sans plafond annuel</Text>
      ) : (
        <>
          <View className="h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden mb-1">
            <View className="h-full rounded-full bg-primary-500" style={{ width: `${pct ?? 0}%` }} />
          </View>
          <Text className="text-xs text-neutral-500">
            {guarantee.capType === 'amount'
              ? `${usage.usedAmount.toFixed(0)} € / ${guarantee.capAmount} € utilisés`
              : `${usage.usedSessions} / ${guarantee.capSessions} séances utilisées`}
          </Text>
        </>
      )}
    </View>
  );
}
