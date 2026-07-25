import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Landmark, Plus, UserPlus } from 'lucide-react-native';

import { MutuelleSelector, type MutuelleFields } from '@/components/MutuelleSelector';
import { useReimbursements } from '@/context/ReimbursementContext';
import type { FamilyMember } from '@/types';

const AVATAR_COLORS = ['#18AE8F', '#3B82F6', '#EC4899', '#F59E0B', '#8B5CF6', '#06B6D4'];

const emptyMutuelle: MutuelleFields = {
  mutuelleId: '',
  mutuelleName: '',
  mutuelleEmail: '',
  numeroAdherent: '',
};

type FormMode = { type: 'add' } | { type: 'edit'; id: string };

export default function FamilyScreen() {
  const { familyMembers: members, addFamilyMember, updateFamilyMember } = useReimbursements();
  const [mode, setMode] = useState<FormMode | null>(null);
  const [name, setName] = useState('');
  const [rib, setRib] = useState('');
  const [mutuelleFields, setMutuelleFields] = useState<MutuelleFields>(emptyMutuelle);

  function openAdd() {
    setMode({ type: 'add' });
    setName('');
    setRib('');
    setMutuelleFields(emptyMutuelle);
  }

  function openEdit(member: FamilyMember) {
    setMode({ type: 'edit', id: member.id });
    setName(member.name);
    setRib(member.rib);
    setMutuelleFields({
      mutuelleId: member.mutuelleId,
      mutuelleName: member.mutuelleName,
      mutuelleEmail: member.mutuelleEmail,
      numeroAdherent: member.numeroAdherent,
    });
  }

  function closeForm() {
    setMode(null);
  }

  function save() {
    if (!name.trim()) return;

    if (mode?.type === 'edit') {
      updateFamilyMember(mode.id, {
        name: name.trim(),
        rib: rib.trim(),
        mutuelleId: mutuelleFields.mutuelleId,
        mutuelleName: mutuelleFields.mutuelleName,
        mutuelleEmail: mutuelleFields.mutuelleEmail,
        numeroAdherent: mutuelleFields.numeroAdherent,
      });
    } else {
      const color = AVATAR_COLORS[members.length % AVATAR_COLORS.length];
      addFamilyMember({
        name: name.trim(),
        relation: 'parent',
        emoji: '🧑',
        color,
        rib: rib.trim() || 'Non renseigné',
        mutuelleId: mutuelleFields.mutuelleId || 'autre',
        mutuelleName: mutuelleFields.mutuelleName || 'Contrat à renseigner',
        mutuelleEmail: mutuelleFields.mutuelleEmail,
        numeroAdherent: mutuelleFields.numeroAdherent || '—',
        contract: {
          insurerName: mutuelleFields.mutuelleName || 'À définir',
          formule: 'Formule à compléter',
          memberSince: new Date().getFullYear().toString(),
          monthlyPrice: 0,
          guarantees: [],
        },
      });
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closeForm();
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-neutral-900 mt-4 mb-1">Mes proches</Text>
        <Text className="text-sm text-neutral-500 mb-6">
          Chaque proche a son propre contrat et son propre RIB, pour un routage 100% automatisé.
        </Text>

        {members.map((member) => (
          <View key={member.id}>
            <Pressable
              onPress={() => openEdit(member)}
              className="rounded-xl2 bg-white border border-neutral-100 p-4 mb-3 shadow-sm shadow-black/5"
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3.5"
                  style={{ backgroundColor: `${member.color}20` }}
                >
                  <Text className="text-2xl">{member.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-neutral-900">{member.name}</Text>
                  <Text className="text-sm text-neutral-500 mt-0.5">{member.mutuelleName}</Text>
                  <Text className="text-xs text-neutral-400 mt-0.5">
                    N° adhérent {member.numeroAdherent}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center mt-3 pt-3 border-t border-neutral-100">
                <Landmark color="#9CA3AF" size={13} />
                <Text className="text-xs text-neutral-500 ml-1.5">RIB dédié : {member.rib}</Text>
              </View>
            </Pressable>

            {mode?.type === 'edit' && mode.id === member.id && (
              <View className="rounded-xl2 bg-white border border-neutral-100 p-4 mb-3 -mt-2 shadow-sm shadow-black/5">
                <Text className="text-sm font-semibold text-neutral-700 mb-1.5">Nom du proche</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#9CA3AF"
                  className="rounded-xl border border-neutral-200 px-3.5 py-3 text-neutral-900 mb-3.5"
                />
                <MutuelleSelector value={mutuelleFields} onChange={setMutuelleFields} />
                <Text className="text-sm font-semibold text-neutral-700 mb-1.5">
                  RIB / IBAN dédié
                </Text>
                <TextInput
                  value={rib}
                  onChangeText={setRib}
                  placeholder="Ex : FR76 3000 •••• •••• •••• 4582"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                  className="rounded-xl border border-neutral-200 px-3.5 py-3 text-neutral-900 mb-4"
                />
                <View className="flex-row">
                  <Pressable
                    onPress={save}
                    className="flex-1 flex-row items-center justify-center rounded-xl bg-primary-500 py-3 mr-2 active:bg-primary-600"
                  >
                    <Text className="text-white font-bold">Enregistrer</Text>
                  </Pressable>
                  <Pressable
                    onPress={closeForm}
                    className="flex-1 items-center justify-center rounded-xl bg-neutral-100 py-3 ml-2"
                  >
                    <Text className="text-neutral-600 font-semibold">Annuler</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ))}

        {mode === null && (
          <Pressable
            onPress={openAdd}
            className="flex-row items-center justify-center rounded-xl2 border-2 border-dashed border-neutral-300 py-4 mt-2"
          >
            <UserPlus color="#18AE8F" size={18} />
            <Text className="text-primary-600 font-semibold ml-2">Ajouter un proche</Text>
          </Pressable>
        )}

        {mode?.type === 'add' && (
          <View className="rounded-xl2 bg-white border border-neutral-100 p-4 mt-2 shadow-sm shadow-black/5">
            <Text className="text-sm font-semibold text-neutral-700 mb-1.5">Nom du proche</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex : Papa"
              placeholderTextColor="#9CA3AF"
              className="rounded-xl border border-neutral-200 px-3.5 py-3 text-neutral-900 mb-3.5"
            />
            <MutuelleSelector value={mutuelleFields} onChange={setMutuelleFields} />
            <Text className="text-sm font-semibold text-neutral-700 mb-1.5">RIB / IBAN dédié</Text>
            <TextInput
              value={rib}
              onChangeText={setRib}
              placeholder="Ex : FR76 3000 •••• •••• •••• 4582"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              className="rounded-xl border border-neutral-200 px-3.5 py-3 text-neutral-900 mb-4"
            />
            <View className="flex-row">
              <Pressable
                onPress={save}
                className="flex-1 flex-row items-center justify-center rounded-xl bg-primary-500 py-3 mr-2 active:bg-primary-600"
              >
                <Plus color="white" size={16} />
                <Text className="text-white font-bold ml-1.5">Ajouter</Text>
              </Pressable>
              <Pressable
                onPress={closeForm}
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
