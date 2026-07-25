import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, UserPlus } from 'lucide-react-native';

import { useReimbursements } from '@/context/ReimbursementContext';

export default function FamilyScreen() {
  const { familyMembers: members, addFamilyMember } = useReimbursements();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [contractNumber, setContractNumber] = useState('');

  function addMember() {
    if (!name.trim()) return;
    addFamilyMember({
      name: name.trim(),
      relation: 'parent',
      emoji: '🧑',
      mutuelle: 'Contrat à renseigner',
      contractNumber: contractNumber.trim() || '—',
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setName('');
    setContractNumber('');
    setAdding(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-neutral-900 mt-4 mb-6">Mes proches</Text>

        {members.map((member) => (
          <View
            key={member.id}
            className="flex-row items-center rounded-xl2 bg-white border border-neutral-100 p-4 mb-3 shadow-sm shadow-black/5"
          >
            <View className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center mr-3.5">
              <Text className="text-2xl">{member.emoji}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-neutral-900">{member.name}</Text>
              <Text className="text-sm text-neutral-500 mt-0.5">{member.mutuelle}</Text>
              <Text className="text-xs text-neutral-400 mt-0.5">
                Contrat {member.contractNumber}
              </Text>
            </View>
          </View>
        ))}

        {!adding && (
          <Pressable
            onPress={() => setAdding(true)}
            className="flex-row items-center justify-center rounded-xl2 border-2 border-dashed border-neutral-300 py-4 mt-2"
          >
            <UserPlus color="#18AE8F" size={18} />
            <Text className="text-primary-600 font-semibold ml-2">Ajouter un proche</Text>
          </Pressable>
        )}

        {adding && (
          <View className="rounded-xl2 bg-white border border-neutral-100 p-4 mt-2 shadow-sm shadow-black/5">
            <Text className="text-sm font-semibold text-neutral-700 mb-1.5">Nom du proche</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex : Papa"
              placeholderTextColor="#9CA3AF"
              className="rounded-xl border border-neutral-200 px-3.5 py-3 text-neutral-900 mb-3.5"
            />
            <Text className="text-sm font-semibold text-neutral-700 mb-1.5">
              N° de contrat mutuelle
            </Text>
            <TextInput
              value={contractNumber}
              onChangeText={setContractNumber}
              placeholder="Ex : HM-2291-020"
              placeholderTextColor="#9CA3AF"
              className="rounded-xl border border-neutral-200 px-3.5 py-3 text-neutral-900 mb-4"
            />
            <View className="flex-row">
              <Pressable
                onPress={addMember}
                className="flex-1 flex-row items-center justify-center rounded-xl bg-primary-500 py-3 mr-2 active:bg-primary-600"
              >
                <Plus color="white" size={16} />
                <Text className="text-white font-bold ml-1.5">Ajouter</Text>
              </Pressable>
              <Pressable
                onPress={() => setAdding(false)}
                className="flex-1 items-center justify-center rounded-xl bg-neutral-100 py-3 ml-2"
              >
                <Text className="text-neutral-600 font-semibold">Annuler</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
