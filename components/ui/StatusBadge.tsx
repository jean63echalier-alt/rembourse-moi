import { Text, View } from 'react-native';

import type { ReimbursementStatus } from '@/types';

const CONFIG: Record<
  ReimbursementStatus,
  { emoji: string; label: (amount: number) => string; bg: string; text: string }
> = {
  reimbursed: {
    emoji: '🟢',
    label: (amount) => `Remboursé +${amount}€`,
    bg: 'bg-green-50',
    text: 'text-green-700',
  },
  pending: {
    emoji: '🟡',
    label: (amount) => `En attente ${amount}€`,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  action_required: {
    emoji: '🔴',
    label: () => 'Action requise',
    bg: 'bg-red-50',
    text: 'text-red-700',
  },
};

export function StatusBadge({
  status,
  amount,
}: {
  status: ReimbursementStatus;
  amount: number;
}) {
  const config = CONFIG[status];

  return (
    <View className={`flex-row items-center self-start rounded-full px-3 py-1 ${config.bg}`}>
      <Text className="text-xs mr-1">{config.emoji}</Text>
      <Text className={`text-xs font-semibold ${config.text}`}>{config.label(amount)}</Text>
    </View>
  );
}
