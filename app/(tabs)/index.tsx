import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReimbursementCard } from '@/components/ReimbursementCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useProfile } from '@/context/ProfileContext';
import { medecineDouceBudget, recentReimbursements, yearlyRecovered } from '@/data/mockData';

export default function HomeScreen() {
  const { profile, profiles, setProfileId } = useProfile();

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
                onPress={() => setProfileId(p.id)}
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
          <Text className="text-sm font-medium text-neutral-500 mb-1">Récupéré cette année</Text>
          <Text className="text-3xl font-extrabold text-primary-600 mb-4">
            {yearlyRecovered} €
          </Text>
          <ProgressBar
            label={medecineDouceBudget.label}
            used={medecineDouceBudget.used}
            total={medecineDouceBudget.total}
            unit={medecineDouceBudget.unit}
          />
        </View>

        <Pressable
          onPress={() => router.push('/scan')}
          className="rounded-xl2 bg-primary-500 py-4 items-center mb-7 active:bg-primary-600"
        >
          <Text className="text-white text-base font-bold">➕ Scanner une facture</Text>
        </Pressable>

        <Text className="text-base font-bold text-neutral-900 mb-3">
          Suivi des remboursements récents
        </Text>
        {recentReimbursements.map((item) => (
          <ReimbursementCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
