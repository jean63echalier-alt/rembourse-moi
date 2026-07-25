import { Text, View } from 'react-native';

interface ProgressBarProps {
  label: string;
  used: number;
  total: number;
  unit?: string;
}

export function ProgressBar({ label, used, total, unit = '€' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((used / total) * 100));

  return (
    <View>
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-sm font-medium text-neutral-600">{label}</Text>
        <Text className="text-sm font-semibold text-neutral-900">
          {used} {unit} / {total} {unit}
        </Text>
      </View>
      <View className="h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden">
        <View
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}
