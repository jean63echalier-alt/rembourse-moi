import { CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';

import type { CoverageDiagnosticLine, CoverageVerdict } from '@/types';

const VERDICT_CONFIG: Record<
  CoverageVerdict,
  { Icon: typeof TrendingUp; color: string; bg: string; text: string; label: string }
> = {
  'sous-couverture': { Icon: TrendingUp, color: '#DC2626', bg: 'bg-red-50', text: 'text-red-700', label: 'Sous-couverture' },
  'sur-couverture': { Icon: TrendingDown, color: '#D97706', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Sur-couverture' },
  adaptee: { Icon: CheckCircle2, color: '#16A34A', bg: 'bg-green-50', text: 'text-green-700', label: 'Bien adaptée' },
};

export function CoverageDiagnosticCard({ line }: { line: CoverageDiagnosticLine }) {
  const config = VERDICT_CONFIG[line.verdict];
  const Icon = config.Icon;

  return (
    <View className="rounded-xl2 bg-white border border-neutral-100 p-4 mb-3 shadow-sm shadow-black/5">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-bold text-neutral-900">{line.category}</Text>
        <View className={`flex-row items-center rounded-full px-2.5 py-1 ${config.bg}`}>
          <Icon color={config.color} size={12} />
          <Text className={`text-[11px] font-semibold ml-1 ${config.text}`}>{config.label}</Text>
        </View>
      </View>
      <Text className="text-xs text-neutral-500 mb-1.5">
        Dépensé cette année : {line.spentThisYear.toFixed(0)} € · Remboursé :{' '}
        {line.reimbursedThisYear.toFixed(0)} €
      </Text>
      <Text className="text-xs text-neutral-600 leading-4">{line.message}</Text>
    </View>
  );
}
