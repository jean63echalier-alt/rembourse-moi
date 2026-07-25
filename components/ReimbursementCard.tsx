import * as Haptics from 'expo-haptics';
import { Bell, CheckCircle2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { isReimbursementOverdue } from '@/lib/reimbursementEngine';
import type { Reimbursement } from '@/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export function ReimbursementCard({
  item,
  onRelance,
}: {
  item: Reimbursement;
  onRelance?: (id: string) => void;
}) {
  const overdue = isReimbursementOverdue(item);

  function relance() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onRelance?.(item.id);
  }

  return (
    <View className="rounded-2xl bg-white border border-neutral-100 px-4 py-3.5 mb-3 shadow-sm shadow-black/5">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-semibold text-neutral-900">{item.provider}</Text>
          <Text className="text-sm text-neutral-500 mt-0.5">
            {item.category} · {formatDate(item.date)}
          </Text>
        </View>
        <StatusBadge status={item.status} amount={item.reimbursedAmount} overdue={overdue} />
      </View>

      {overdue &&
        onRelance &&
        (item.reminderSentAt ? (
          <View className="flex-row items-center mt-3 pt-3 border-t border-neutral-100">
            <CheckCircle2 color="#9CA3AF" size={14} />
            <Text className="text-xs text-neutral-400 ml-1.5">
              Relance envoyée le {formatDate(item.reminderSentAt)}
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={relance}
            className="flex-row items-center justify-center mt-3 pt-3 border-t border-neutral-100 py-1 active:opacity-60"
          >
            <Bell color="#EA580C" size={14} />
            <Text className="text-xs font-semibold text-orange-600 ml-1.5">
              Relancer la mutuelle
            </Text>
          </Pressable>
        ))}
    </View>
  );
}
