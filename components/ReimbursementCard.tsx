import { Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Reimbursement } from '@/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export function ReimbursementCard({ item }: { item: Reimbursement }) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-white border border-neutral-100 px-4 py-3.5 mb-3 shadow-sm shadow-black/5">
      <View className="flex-1 pr-3">
        <Text className="text-base font-semibold text-neutral-900">{item.provider}</Text>
        <Text className="text-sm text-neutral-500 mt-0.5">
          {item.category} · {formatDate(item.date)}
        </Text>
      </View>
      <StatusBadge status={item.status} amount={item.reimbursedAmount} />
    </View>
  );
}
