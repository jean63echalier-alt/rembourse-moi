import * as Haptics from 'expo-haptics';
import { CheckCircle2, FileScan } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useReimbursements } from '@/context/ReimbursementContext';
import { mockContractScanResult } from '@/data/mockData';
import type { FamilyMember } from '@/types';

type Step = 'idle' | 'scanning' | 'result' | 'applied';

export function ContractScanFlow({ member }: { member: FamilyMember }) {
  const { updateFamilyMember } = useReimbursements();
  const [step, setStep] = useState<Step>('idle');

  function startScan() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep('scanning');
    setTimeout(() => setStep('result'), 1600);
  }

  function apply() {
    updateFamilyMember(member.id, {
      contract: {
        insurerName: mockContractScanResult.insurerName,
        formule: mockContractScanResult.formule,
        memberSince: member.contract.memberSince,
        monthlyPrice: mockContractScanResult.monthlyPrice,
        guarantees: mockContractScanResult.guarantees,
      },
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep('applied');
  }

  if (step === 'idle') {
    return (
      <Pressable
        onPress={startScan}
        className="flex-row items-center justify-center rounded-xl2 border-2 border-dashed border-neutral-300 py-4"
      >
        <FileScan color="#18AE8F" size={18} />
        <Text className="text-primary-600 font-semibold ml-2">
          Scanner le contrat de {member.name} (PDF / photo)
        </Text>
      </Pressable>
    );
  }

  if (step === 'scanning') {
    return (
      <View className="items-center py-8">
        <ActivityIndicator size="large" color="#18AE8F" />
        <Text className="text-neutral-600 font-medium mt-3">
          Lecture du tableau de garanties par l&apos;IA...
        </Text>
      </View>
    );
  }

  if (step === 'applied') {
    return (
      <View className="rounded-xl2 bg-green-50 px-4 py-3.5 flex-row items-center">
        <CheckCircle2 color="#16A34A" size={18} />
        <Text className="text-sm font-semibold text-green-700 ml-2">
          Contrat mis à jour pour {member.name}
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-xl2 bg-white border border-neutral-100 p-4 shadow-sm shadow-black/5">
      <Text className="text-sm font-bold text-neutral-900 mb-1">
        {mockContractScanResult.insurerName} — {mockContractScanResult.formule}
      </Text>
      <Text className="text-xs text-neutral-500 mb-3">
        {mockContractScanResult.guarantees.length} garanties détectées
      </Text>
      {mockContractScanResult.guarantees.map((g) => (
        <Text key={g.id} className="text-xs text-neutral-600 mb-1">
          • {g.label} — {g.reimbursementRate}%{' '}
          {g.capType === 'amount'
            ? `(jusqu'à ${g.capAmount} €/an)`
            : g.capType === 'sessions'
              ? `(${g.capSessions} séances/an)`
              : ''}
        </Text>
      ))}
      <View className="flex-row mt-4">
        <Pressable
          onPress={apply}
          className="flex-1 items-center justify-center rounded-xl bg-primary-500 py-3 mr-2 active:bg-primary-600"
        >
          <Text className="text-white font-bold">Appliquer à mon profil</Text>
        </Pressable>
        <Pressable
          onPress={() => setStep('idle')}
          className="flex-1 items-center justify-center rounded-xl bg-neutral-100 py-3 ml-2"
        >
          <Text className="text-neutral-600 font-semibold">Annuler</Text>
        </Pressable>
      </View>
    </View>
  );
}
