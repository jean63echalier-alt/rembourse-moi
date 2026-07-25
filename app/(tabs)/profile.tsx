import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { Building2, FileDown, Mail, Pencil, Shield } from 'lucide-react-native';

import { MutuelleSelector, type MutuelleFields } from '@/components/MutuelleSelector';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AVAILABLE_BANKS, useBankSync } from '@/context/BankSyncContext';
import { useProfile } from '@/context/ProfileContext';
import { useReimbursements } from '@/context/ReimbursementContext';
import { MEDECINE_DOUCE_CATEGORY, OPTIQUE_CATEGORY, mutuelle } from '@/data/mockData';
import { generateReimbursementPdf } from '@/lib/generateReimbursementPdf';

export default function ProfileScreen() {
  const { profile } = useProfile();
  const { familyMembers, updateFamilyMember, reimbursements, updateReimbursementStatus } =
    useReimbursements();
  const ownReimbursedItems = reimbursements.filter(
    (r) => r.profileId === profile.id && r.status === 'reimbursed'
  );
  const medecineDouceSeances = ownReimbursedItems.filter(
    (r) => r.category === MEDECINE_DOUCE_CATEGORY
  ).length;
  const optiqueUsed = ownReimbursedItems
    .filter((r) => r.category === OPTIQUE_CATEGORY)
    .reduce((sum, r) => sum + r.reimbursedAmount, 0);
  const { isBankConnected, connectedBankName, connectBank, disconnectBank, checkAutomaticReimbursements } =
    useBankSync();
  const selfMember = familyMembers.find((m) => m.id === profile.id);
  const [editingMutuelle, setEditingMutuelle] = useState(false);
  const [pickingBank, setPickingBank] = useState(false);
  const [syncBanner, setSyncBanner] = useState<string | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [mutuelleFields, setMutuelleFields] = useState<MutuelleFields>({
    mutuelleId: selfMember?.mutuelleId ?? '',
    mutuelleName: selfMember?.mutuelleName ?? '',
    mutuelleEmail: selfMember?.mutuelleEmail ?? '',
    numeroAdherent: selfMember?.numeroAdherent ?? '',
  });

  function openEditMutuelle() {
    if (selfMember) {
      setMutuelleFields({
        mutuelleId: selfMember.mutuelleId,
        mutuelleName: selfMember.mutuelleName,
        mutuelleEmail: selfMember.mutuelleEmail,
        numeroAdherent: selfMember.numeroAdherent,
      });
    }
    setEditingMutuelle(true);
  }

  function saveMutuelle() {
    if (!selfMember) return;
    updateFamilyMember(selfMember.id, mutuelleFields);
    setEditingMutuelle(false);
  }

  function selectBank(name: string) {
    connectBank(name);
    setPickingBank(false);
    Haptics.selectionAsync();
  }

  async function runBankScan() {
    const pending = reimbursements.filter((r) => r.status === 'pending');
    const matchedIds = checkAutomaticReimbursements(pending, familyMembers);
    matchedIds.forEach((id) => updateReimbursementStatus(id, 'reimbursed'));

    if (matchedIds.length > 0) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSyncBanner(
        `${matchedIds.length} remboursement${matchedIds.length > 1 ? 's' : ''} validé${
          matchedIds.length > 1 ? 's' : ''
        } automatiquement 🎉`
      );
    } else {
      setSyncBanner('Aucun nouveau remboursement détecté pour le moment.');
    }
    setTimeout(() => setSyncBanner(null), 4000);
  }

  async function exportPdf() {
    setExportingPdf(true);
    try {
      const ownReimbursements = reimbursements.filter((r) => r.profileId === profile.id);
      const uri = await generateReimbursementPdf({ name: profile.name }, ownReimbursements);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
      }
    } finally {
      setExportingPdf(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-neutral-900 mt-4 mb-6">Mon profil</Text>

        <View className="items-center mb-7">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: `${profile.color}20` }}
          >
            <Text className="text-4xl">{profile.emoji}</Text>
          </View>
          <Text className="text-lg font-bold text-neutral-900">{profile.name}</Text>
          <View className="flex-row items-center mt-1">
            <Mail color="#9CA3AF" size={13} />
            <Text className="text-sm text-neutral-500 ml-1.5">marie.dupont@email.com</Text>
          </View>
        </View>

        <Pressable
          onPress={exportPdf}
          disabled={exportingPdf}
          className="flex-row rounded-xl2 bg-white border border-neutral-100 py-3.5 items-center justify-center mb-5 shadow-sm shadow-black/5 active:bg-neutral-50"
        >
          {exportingPdf ? (
            <ActivityIndicator size="small" color="#18AE8F" />
          ) : (
            <FileDown color="#18AE8F" size={18} />
          )}
          <Text className="text-primary-700 font-semibold ml-2">
            Exporter récapitulatif PDF
          </Text>
        </Pressable>

        <View className="rounded-xl2 bg-white border border-neutral-100 p-5 mb-5 shadow-sm shadow-black/5">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-full bg-primary-50 items-center justify-center mr-3">
                <Shield color="#18AE8F" size={18} />
              </View>
              <View>
                <Text className="text-xs text-neutral-500">Ma mutuelle</Text>
                <Text className="text-base font-bold text-neutral-900">
                  {selfMember?.mutuelleName || mutuelle.name}
                </Text>
              </View>
            </View>
            {!editingMutuelle && (
              <Pressable onPress={openEditMutuelle} className="p-2">
                <Pencil color="#9CA3AF" size={16} />
              </Pressable>
            )}
          </View>

          {editingMutuelle ? (
            <View>
              <MutuelleSelector value={mutuelleFields} onChange={setMutuelleFields} />
              <View className="flex-row">
                <Pressable
                  onPress={saveMutuelle}
                  className="flex-1 items-center justify-center rounded-xl bg-primary-500 py-3 mr-2 active:bg-primary-600"
                >
                  <Text className="text-white font-bold">Enregistrer</Text>
                </Pressable>
                <Pressable
                  onPress={() => setEditingMutuelle(false)}
                  className="flex-1 items-center justify-center rounded-xl bg-neutral-100 py-3 ml-2"
                >
                  <Text className="text-neutral-600 font-semibold">Annuler</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <View className="rounded-full bg-primary-50 self-start px-3 py-1 mb-1">
                <Text className="text-xs font-semibold text-primary-700">
                  N° adhérent {selfMember?.numeroAdherent || '—'}
                </Text>
              </View>
              <Text className="text-xs text-neutral-400 mt-1">
                Adhérent depuis {mutuelle.memberSince}
              </Text>
            </>
          )}
        </View>

        <View className="rounded-xl2 bg-white border border-neutral-100 p-5 shadow-sm shadow-black/5">
          <Text className="text-base font-bold text-neutral-900 mb-4">Mon forfait santé</Text>

          <View className="mb-5">
            <ProgressBar
              label="Médecines douces"
              used={medecineDouceSeances}
              total={mutuelle.medecineDouce.total}
              unit="séances"
            />
          </View>

          <View>
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-sm font-medium text-neutral-600">Optique</Text>
              <Text className="text-sm font-semibold text-neutral-900">
                {mutuelle.optique.total - optiqueUsed} € restants
              </Text>
            </View>
            <View className="h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden">
              <View
                className="h-full rounded-full bg-primary-500"
                style={{
                  width: `${Math.round((optiqueUsed / mutuelle.optique.total) * 100)}%`,
                }}
              />
            </View>
          </View>
        </View>

        <View className="rounded-xl2 bg-white border border-neutral-100 p-5 mt-5 shadow-sm shadow-black/5">
          <View className="flex-row items-center mb-4">
            <View className="w-9 h-9 rounded-full bg-primary-50 items-center justify-center mr-3">
              <Building2 color="#18AE8F" size={18} />
            </View>
            <Text className="text-base font-bold text-neutral-900">Connexion bancaire</Text>
          </View>

          {isBankConnected ? (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-xs text-neutral-500">Banque connectée</Text>
                  <Text className="text-sm font-semibold text-neutral-900">
                    {connectedBankName}
                  </Text>
                </View>
                <Pressable onPress={disconnectBank} className="px-3 py-1.5 rounded-full bg-neutral-100">
                  <Text className="text-xs font-semibold text-neutral-600">Déconnecter</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={runBankScan}
                className="rounded-xl2 bg-primary-500 py-3.5 items-center active:bg-primary-600"
              >
                <Text className="text-white font-bold">🔄 Lancer un scan des opérations</Text>
              </Pressable>
            </>
          ) : pickingBank ? (
            <View>
              {AVAILABLE_BANKS.map((bank) => (
                <Pressable
                  key={bank}
                  onPress={() => selectBank(bank)}
                  className="rounded-xl border border-neutral-200 px-4 py-3 mb-2 active:bg-neutral-50"
                >
                  <Text className="text-sm font-medium text-neutral-800">{bank}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setPickingBank(false)} className="items-center py-2">
                <Text className="text-neutral-500 font-medium">Annuler</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setPickingBank(true)}
              className="rounded-xl2 border-2 border-dashed border-neutral-300 py-3.5 items-center"
            >
              <Text className="text-primary-600 font-semibold">Connecter ma banque</Text>
            </Pressable>
          )}

          {syncBanner && (
            <View className="rounded-xl bg-primary-50 px-4 py-3 mt-3">
              <Text className="text-xs font-semibold text-primary-700">{syncBanner}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
