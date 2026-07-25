import { ArrowRightLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import type { MutuelleOffer } from '@/types';

export function OfferCard({ offer, onChange }: { offer: MutuelleOffer; onChange: () => void }) {
  return (
    <View className="rounded-xl2 bg-white border border-neutral-100 p-4 mb-3 shadow-sm shadow-black/5">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-base font-bold text-neutral-900">{offer.insurerName}</Text>
        <Text className="text-sm font-bold text-primary-600">{offer.monthlyPrice} €/mois</Text>
      </View>
      <Text className="text-xs text-neutral-500 mb-3">{offer.formule}</Text>
      {offer.highlights.map((highlight) => (
        <Text key={highlight} className="text-xs text-neutral-600 mb-1">
          ✓ {highlight}
        </Text>
      ))}
      <Pressable
        onPress={onChange}
        className="flex-row items-center justify-center rounded-xl bg-primary-50 py-3 mt-3 active:bg-primary-100"
      >
        <ArrowRightLeft color="#18AE8F" size={15} />
        <Text className="text-primary-700 font-semibold ml-2">Changer pour cette offre</Text>
      </Pressable>
    </View>
  );
}
