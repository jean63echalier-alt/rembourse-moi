import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon, CheckCircle2, FileText } from 'lucide-react-native';

import { useProfile } from '@/context/ProfileContext';
import { useReimbursements } from '@/context/ReimbursementContext';
import { mockScanResult } from '@/data/mockData';

type ScanState = 'camera' | 'scanning' | 'result' | 'sent';

export default function ScanScreen() {
  const [state, setState] = useState<ScanState>('camera');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const { profile } = useProfile();
  const { addReimbursement } = useReimbursements();

  async function capture() {
    if (!cameraRef.current) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await cameraRef.current.takePictureAsync({ quality: 0.5 });
    setState('scanning');
    setTimeout(() => setState('result'), 1800);
  }

  function reset() {
    setState('camera');
  }

  async function sendToMutuelle() {
    addReimbursement({
      profileId: profile.id,
      provider: mockScanResult.provider,
      category: mockScanResult.category,
      amount: mockScanResult.amount,
      reimbursedAmount: mockScanResult.estimatedReimbursement,
      status: 'pending',
      date: new Date().toISOString().slice(0, 10),
    });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setState('sent');
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-neutral-900 mt-4 mb-6">Scanner une facture</Text>

        {state === 'camera' && (
          <>
            {!permission ? (
              <View className="items-center justify-center py-24">
                <ActivityIndicator size="large" color="#18AE8F" />
              </View>
            ) : !permission.granted ? (
              <View className="rounded-xl2 border-2 border-dashed border-neutral-300 bg-white items-center justify-center py-16 mb-6 px-8">
                <CameraIcon color="#9CA3AF" size={40} />
                <Text className="text-neutral-500 text-sm mt-3 mb-5 text-center">
                  L&apos;accès à la caméra est nécessaire pour scanner vos factures.
                </Text>
                <Pressable
                  onPress={requestPermission}
                  className="rounded-xl2 bg-primary-500 px-6 py-3 active:bg-primary-600"
                >
                  <Text className="text-white font-bold">Autoriser la caméra</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View className="rounded-xl2 overflow-hidden mb-6 bg-black" style={{ height: 420 }}>
                  <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
                    <View className="flex-1 items-center justify-center px-8">
                      <View className="w-full aspect-[3/4] max-h-full border-2 border-white/80 rounded-2xl border-dashed" />
                      <Text className="text-white text-xs text-center mt-4 bg-black/40 px-3 py-1.5 rounded-full">
                        Cadrez la facture dans le rectangle
                      </Text>
                    </View>
                  </CameraView>
                </View>

                <Pressable
                  onPress={capture}
                  className="rounded-xl2 bg-primary-500 py-4 items-center active:bg-primary-600"
                >
                  <Text className="text-white text-base font-bold">📷 Prendre la photo</Text>
                </Pressable>
              </>
            )}
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
              onPress={sendToMutuelle}
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
