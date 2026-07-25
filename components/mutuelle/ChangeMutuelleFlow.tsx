import * as Haptics from 'expo-haptics';
import { CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

import { useReimbursements } from '@/context/ReimbursementContext';
import type { FamilyMember, MutuelleOffer } from '@/types';

type Step = 'confirm' | 'processing' | 'done';

export function ChangeMutuelleFlow({
  member,
  offer,
  onClose,
}: {
  member: FamilyMember;
  offer: MutuelleOffer;
  onClose: () => void;
}) {
  const { updateFamilyMember } = useReimbursements();
  const [step, setStep] = useState<Step>('confirm');

  function confirm() {
    setStep('processing');
    setTimeout(() => {
      updateFamilyMember(member.id, {
        mutuelleId: offer.id,
        mutuelleName: `${offer.insurerName} — ${offer.formule}`,
        mutuelleEmail: offer.emailRemboursement,
        contract: {
          insurerName: offer.insurerName,
          formule: offer.formule,
          memberSince: new Date().toISOString().slice(0, 10),
          monthlyPrice: offer.monthlyPrice,
          guarantees: offer.guarantees,
        },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep('done');
    }, 1600);
  }

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl p-6" style={{ paddingBottom: 36 }}>
          {step === 'confirm' && (
            <>
              <Text className="text-lg font-bold text-neutral-900 mb-1">
                Changer pour {offer.insurerName}
              </Text>
              <Text className="text-sm text-neutral-500 mb-5">
                Pour {member.name} — {offer.formule} à {offer.monthlyPrice} €/mois
              </Text>
              <View className="flex-row rounded-xl bg-primary-50 px-4 py-3.5 mb-5">
                <ShieldCheck color="#18AE8F" size={18} />
                <Text className="text-xs text-primary-700 ml-2.5 flex-1 leading-4">
                  Grâce à la loi RIA (résiliation infra-annuelle), nous résilions automatiquement
                  l&apos;ancien contrat de {member.name} auprès de {member.contract.insurerName},
                  sans frais ni démarche de votre part.
                </Text>
              </View>
              <Pressable
                onPress={confirm}
                className="rounded-xl2 bg-primary-500 py-4 items-center mb-3 active:bg-primary-600"
              >
                <Text className="text-white text-base font-bold">Confirmer le changement</Text>
              </Pressable>
              <Pressable onPress={onClose} className="items-center py-2">
                <Text className="text-neutral-500 font-medium">Annuler</Text>
              </Pressable>
            </>
          )}

          {step === 'processing' && (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#18AE8F" />
              <Text className="text-neutral-600 font-medium mt-4 text-center px-4">
                Souscription {offer.insurerName} et résiliation de l&apos;ancien contrat...
              </Text>
            </View>
          )}

          {step === 'done' && (
            <View className="items-center py-6">
              <View className="w-16 h-16 rounded-full bg-green-50 items-center justify-center mb-4">
                <CheckCircle2 color="#16A34A" size={36} />
              </View>
              <Text className="text-lg font-bold text-neutral-900 mb-1">Changement effectué</Text>
              <Text className="text-sm text-neutral-500 text-center px-6 mb-6">
                {member.name} est maintenant couvert·e par {offer.insurerName} — {offer.formule}.
                L&apos;ancien contrat a été résilié automatiquement.
              </Text>
              <Pressable
                onPress={onClose}
                className="rounded-xl2 bg-primary-50 px-6 py-3 active:bg-primary-100"
              >
                <Text className="text-primary-700 font-semibold">Terminer</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
