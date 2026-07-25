import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, Clock3, Wallet } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReimbursementCard } from '@/components/ReimbursementCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useProfile } from '@/context/ProfileContext';
import { useReimbursements } from '@/context/ReimbursementContext';
import { MEDECINE_DOUCE_CATEGORY } from '@/data/mockData';
import {
  computeGuaranteeUsage,
  daysUntilYearEnd,
  getExpiringGuarantees,
  getGuaranteeForCategory,
} from '@/lib/reimbursementEngine';

export default function HomeScreen() {
  const { profile, profiles, setProfileId } = useProfile();
  const { reimbursements, sendReminder } = useReimbursements();

  const householdRecovered = reimbursements
    .filter((r) => r.status === 'reimbursed')
    .reduce((sum, r) => sum + r.reimbursedAmount, 0);
  const pendingReimbursements = reimbursements.filter((r) => r.status === 'pending');
  const pendingAmount = pendingReimbursements.reduce((sum, r) => sum + r.reimbursedAmount, 0);
  const reimbursedCount = reimbursements.filter((r) => r.status === 'reimbursed').length;

  const memberReimbursements = reimbursements.filter((r) => r.profileId === profile.id);
  const medecineDouceGuarantee = getGuaranteeForCategory(profile.contract, MEDECINE_DOUCE_CATEGORY);
  const medecineDouceUsage = computeGuaranteeUsage(profile, MEDECINE_DOUCE_CATEGORY, reimbursements);

  const expiringGuarantees = getExpiringGuarantees(profile, reimbursements);
  const daysLeft = daysUntilYearEnd();

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
        <View className="flex-row items-center justify-between mt-4 mb-5">
          <Text className="text-2xl font-bold text-neutral-900">Bonjour {profile.name} 👋</Text>
        </View>

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
          <View className="flex-row items-center mb-1">
            <Wallet color="#18AE8F" size={16} />
            <Text className="text-sm font-medium text-neutral-500 ml-1.5">
              Pouvoir d&apos;achat récupéré cette année (famille)
            </Text>
          </View>
          <Text className="text-3xl font-extrabold text-primary-600 mb-4">
            {householdRecovered.toFixed(0)} €
          </Text>

          <View className="flex-row mb-5">
            <View className="flex-1 rounded-xl bg-amber-50 px-3.5 py-3 mr-2">
              <Text className="text-xs text-amber-700 mb-0.5">En cours</Text>
              <Text className="text-lg font-bold text-amber-700">
                {pendingAmount.toFixed(0)} €
              </Text>
              <Text className="text-[11px] text-amber-600 mt-0.5">
                {pendingReimbursements.length} demande{pendingReimbursements.length > 1 ? 's' : ''}
              </Text>
            </View>
            <View className="flex-1 rounded-xl bg-green-50 px-3.5 py-3 ml-2">
              <Text className="text-xs text-green-700 mb-0.5">Remboursés</Text>
              <Text className="text-lg font-bold text-green-700">{reimbursedCount}</Text>
              <Text className="text-[11px] text-green-600 mt-0.5">dossiers validés</Text>
            </View>
          </View>

          {medecineDouceGuarantee && (
            <ProgressBar
              label={`${medecineDouceGuarantee.label} (${profile.name})`}
              used={medecineDouceUsage.usedSessions}
              total={medecineDouceGuarantee.capSessions ?? 0}
              unit="séances"
            />
          )}
        </View>

        {expiringGuarantees.length > 0 && (
          <View className="rounded-xl2 bg-orange-50 border border-orange-100 p-4 mb-5">
            <View className="flex-row items-center mb-2">
              <AlertTriangle color="#EA580C" size={16} />
              <Text className="text-sm font-bold text-orange-800 ml-1.5">
                Plafonds bientôt périmés
              </Text>
              <View className="flex-row items-center ml-auto">
                <Clock3 color="#EA580C" size={12} />
                <Text className="text-[11px] font-semibold text-orange-700 ml-1">
                  {daysLeft} j restants
                </Text>
              </View>
            </View>
            {expiringGuarantees.map(({ guarantee, usage }) => (
              <Text key={guarantee.id} className="text-xs text-orange-700 mt-1">
                • {guarantee.label} :{' '}
                {guarantee.capType === 'amount'
                  ? `${usage.remainingAmount?.toFixed(0)} € non consommés`
                  : `${usage.remainingSessions} séance${(usage.remainingSessions ?? 0) > 1 ? 's' : ''} non consommée${(usage.remainingSessions ?? 0) > 1 ? 's' : ''}`}{' '}
                avant le 31/12
              </Text>
            ))}
          </View>
        )}

        <Pressable
          onPress={() => router.push('/scan')}
          className="rounded-xl2 bg-primary-500 py-4 items-center mb-7 active:bg-primary-600"
        >
          <Text className="text-white text-base font-bold">➕ Scanner une facture</Text>
        </Pressable>

        <Text className="text-base font-bold text-neutral-900 mb-3">
          Suivi des remboursements de {profile.name}
        </Text>
        {memberReimbursements.length === 0 ? (
          <Text className="text-sm text-neutral-400">Aucun remboursement pour le moment.</Text>
        ) : (
          memberReimbursements.map((item) => (
            <ReimbursementCard key={item.id} item={item} onRelance={sendReminder} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
