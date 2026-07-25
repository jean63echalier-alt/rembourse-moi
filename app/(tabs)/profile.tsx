import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Shield } from 'lucide-react-native';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { useProfile } from '@/context/ProfileContext';
import { mutuelle } from '@/data/mockData';

export default function ProfileScreen() {
  const { profile } = useProfile();

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

        <View className="rounded-xl2 bg-white border border-neutral-100 p-5 mb-5 shadow-sm shadow-black/5">
          <View className="flex-row items-center mb-4">
            <View className="w-9 h-9 rounded-full bg-primary-50 items-center justify-center mr-3">
              <Shield color="#18AE8F" size={18} />
            </View>
            <View>
              <Text className="text-xs text-neutral-500">Ma mutuelle</Text>
              <Text className="text-base font-bold text-neutral-900">{mutuelle.name}</Text>
            </View>
          </View>
          <View className="rounded-full bg-primary-50 self-start px-3 py-1 mb-1">
            <Text className="text-xs font-semibold text-primary-700">{mutuelle.formule}</Text>
          </View>
          <Text className="text-xs text-neutral-400 mt-1">
            Adhérent depuis {mutuelle.memberSince}
          </Text>
        </View>

        <View className="rounded-xl2 bg-white border border-neutral-100 p-5 shadow-sm shadow-black/5">
          <Text className="text-base font-bold text-neutral-900 mb-4">Mon forfait santé</Text>

          <View className="mb-5">
            <ProgressBar
              label="Médecines douces"
              used={mutuelle.medecineDouce.used}
              total={mutuelle.medecineDouce.total}
              unit="séances"
            />
          </View>

          <View>
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-sm font-medium text-neutral-600">Optique</Text>
              <Text className="text-sm font-semibold text-neutral-900">
                {mutuelle.optique.total - mutuelle.optique.used} € restants
              </Text>
            </View>
            <View className="h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden">
              <View
                className="h-full rounded-full bg-primary-500"
                style={{
                  width: `${Math.round((mutuelle.optique.used / mutuelle.optique.total) * 100)}%`,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
