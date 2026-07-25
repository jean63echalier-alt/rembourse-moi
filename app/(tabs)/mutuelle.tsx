import * as Haptics from 'expo-haptics';
import { Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChangeMutuelleFlow } from '@/components/mutuelle/ChangeMutuelleFlow';
import { ContractScanFlow } from '@/components/mutuelle/ContractScanFlow';
import { CoverageDiagnosticCard } from '@/components/mutuelle/CoverageDiagnosticCard';
import { GuaranteeProgress } from '@/components/mutuelle/GuaranteeProgress';
import { OfferCard } from '@/components/mutuelle/OfferCard';
import { useProfile } from '@/context/ProfileContext';
import { useReimbursements } from '@/context/ReimbursementContext';
import { mutuelleOffers } from '@/data/mockData';
import { buildCoverageDiagnostic } from '@/lib/reimbursementEngine';
import type { MutuelleOffer } from '@/types';

export default function MutuelleScreen() {
  const { profile, profiles, setProfileId } = useProfile();
  const { reimbursements } = useReimbursements();
  const [selectedOffer, setSelectedOffer] = useState<MutuelleOffer | null>(null);

  const diagnostic = buildCoverageDiagnostic(profile, reimbursements);
  const verdicts = new Set(diagnostic.map((d) => d.verdict));
  const recommendedOffers = mutuelleOffers.filter((offer) =>
    offer.bestFor.some((v) => verdicts.has(v))
  );

  function selectProfile(id: string) {
    Haptics.selectionAsync();
    setProfileId(id);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-neutral-900 mt-4 mb-5">Ma mutuelle</Text>

        <View className="flex-row mb-6">
          {profiles.map((p) => {
            const active = p.id === profile.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => selectProfile(p.id)}
                className={`mr-2.5 items-center justify-center w-14 h-14 rounded-full border-2 ${
                  active ? 'border-primary-500 bg-primary-50' : 'border-transparent bg-white'
                }`}
              >
                <Text className="text-2xl">{p.emoji}</Text>
              </Pressable>
            );
          })}
        </View>

        <View className="rounded-xl2 bg-white border border-neutral-100 p-5 mb-5 shadow-sm shadow-black/5">
          <Text className="text-xs text-neutral-500 mb-0.5">Contrat de {profile.name}</Text>
          <Text className="text-base font-bold text-neutral-900 mb-0.5">
            {profile.contract.insurerName} — {profile.contract.formule}
          </Text>
          <Text className="text-xs text-neutral-400 mb-4">
            {profile.contract.monthlyPrice} €/mois · adhérent depuis {profile.contract.memberSince}
          </Text>

          {profile.contract.guarantees.length === 0 ? (
            <Text className="text-sm text-neutral-400">
              Aucune garantie renseignée pour ce contrat. Scannez le contrat pour l&apos;analyser.
            </Text>
          ) : (
            profile.contract.guarantees.map((guarantee) => (
              <GuaranteeProgress
                key={guarantee.id}
                member={profile}
                guarantee={guarantee}
                reimbursements={reimbursements}
              />
            ))
          )}
        </View>

        <Text className="text-base font-bold text-neutral-900 mb-3">
          Analyse du contrat (IA & OCR)
        </Text>
        <View className="mb-7">
          <ContractScanFlow member={profile} />
        </View>

        <Text className="text-base font-bold text-neutral-900 mb-1">Diagnostic de couverture</Text>
        <Text className="text-sm text-neutral-500 mb-3">
          Comparaison de vos dépenses réelles avec vos garanties actuelles.
        </Text>
        {diagnostic.length === 0 ? (
          <Text className="text-sm text-neutral-400 mb-7">
            Pas encore assez de remboursements pour établir un diagnostic.
          </Text>
        ) : (
          <View className="mb-7">
            {diagnostic.map((line) => (
              <CoverageDiagnosticCard key={line.category} line={line} />
            ))}
          </View>
        )}

        <View className="flex-row items-center mb-1">
          <Sparkles color="#18AE8F" size={16} />
          <Text className="text-base font-bold text-neutral-900 ml-1.5">Recommandations</Text>
        </View>
        <Text className="text-sm text-neutral-500 mb-3">
          Changez de mutuelle en 1 clic — résiliation automatique de l&apos;ancien contrat grâce à
          la loi RIA.
        </Text>
        {recommendedOffers.length === 0 ? (
          <Text className="text-sm text-neutral-400">
            Votre contrat actuel est bien adapté, aucun changement recommandé pour le moment.
          </Text>
        ) : (
          recommendedOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onChange={() => setSelectedOffer(offer)} />
          ))
        )}
      </ScrollView>

      {selectedOffer && (
        <ChangeMutuelleFlow
          member={profile}
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </SafeAreaView>
  );
}
