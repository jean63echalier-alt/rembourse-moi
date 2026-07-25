import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, FileText, ScanLine } from 'lucide-react-native';

import { mockScanResult } from '@/data/mockData';

type ScanState = 'idle' | 'scanning' | 'result' | 'sent';

export default function ScanScreen() {
  const [state, setState] = useState<ScanState>('idle');

  function simulateScan() {
    setState('scanning');
    setTimeout(() => setState('result'), 1800);
  }

  function reset() {
    setState('idle');
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-neutral-900 mt-4 mb-6">Scanner une facture</Text>

        {state === 'idle' && (
          <>
            <View className="rounded-xl2 border-2 border-dashed border-neutral-300 bg-white items-center justify-center py-16 mb-6">
              <ScanLine color="#9CA3AF" size={40} />
              <Text className="text-neutral-500 text-sm mt-3 px-8 text-center">
                Prenez une photo ou glissez-déposez votre facture ici
              </Text>
            </View>

            <Pressable
              onPress={simulateScan}
              className="rounded-xl2 bg-primary-500 py-4 items-center active:bg-primary-600"
            >
              <Text className="text-white text-base font-bold">
                Simuler le scan d&apos;une facture d&apos;ostéo (60€)
              </Text>
            </Pressable>
          </>
        )}

        {state === 'scanning' && (
          <View className="items-center justify-center py-24">
            <ActivityIndicator size="large" color="#18AE8F" />
            <Text className="text-neutral-600 font-medium mt-4">Analyse par l&apos;IA...</Text>
          </View>
        )}

        {state === 'result' && (
          <View>
            <View className="rounded-xl2 bg-white border border-neutral-100 p-5 mb-6 shadow-sm shadow-black/5">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
                  <FileText color="#18AE8F" size={20} />
                </View>
                <Text className="text-base font-bold text-neutral-900">Facture détectée</Text>
              </View>

              <View className="mb-3">
                <Text className="text-xs text-neutral-500 mb-0.5">Praticien</Text>
                <Text className="text-base font-semibold text-neutral-900">
                  {mockScanResult.provider}
                </Text>
              </View>
              <View className="mb-3">
                <Text className="text-xs text-neutral-500 mb-0.5">Montant payé</Text>
                <Text className="text-base font-semibold text-neutral-900">
                  {mockScanResult.amount.toFixed(2)} €
                </Text>
              </View>
              <View className="rounded-xl bg-primary-50 px-4 py-3 mt-2">
                <Text className="text-xs text-primary-700 mb-0.5">
                  Estimation remboursement mutuelle
                </Text>
                <Text className="text-xl font-extrabold text-primary-700">
                  {mockScanResult.estimatedReimbursement.toFixed(2)} €
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setState('sent')}
              className="rounded-xl2 bg-primary-500 py-4 items-center mb-3 active:bg-primary-600"
            >
              <Text className="text-white text-base font-bold">
                🚀 Envoyer à la Mutuelle en 1 clic
              </Text>
            </Pressable>
            <Pressable onPress={reset} className="items-center py-2">
              <Text className="text-neutral-500 font-medium">Annuler</Text>
            </Pressable>
          </View>
        )}

        {state === 'sent' && (
          <View className="items-center justify-center py-20">
            <View className="w-16 h-16 rounded-full bg-green-50 items-center justify-center mb-4">
              <CheckCircle2 color="#16A34A" size={36} />
            </View>
            <Text className="text-lg font-bold text-neutral-900 mb-1">Envoyé à la mutuelle</Text>
            <Text className="text-sm text-neutral-500 text-center px-10 mb-6">
              Votre demande de remboursement de {mockScanResult.estimatedReimbursement.toFixed(2)}{' '}
              € est en cours de traitement.
            </Text>
            <Pressable
              onPress={reset}
              className="rounded-xl2 bg-primary-50 px-6 py-3 active:bg-primary-100"
            >
              <Text className="text-primary-700 font-semibold">Scanner une autre facture</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
