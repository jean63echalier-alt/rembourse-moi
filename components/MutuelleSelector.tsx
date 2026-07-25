import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { mutuelles } from '@/data/mockData';

export interface MutuelleFields {
  mutuelleId: string;
  mutuelleName: string;
  mutuelleEmail: string;
  numeroAdherent: string;
}

export function MutuelleSelector({
  value,
  onChange,
}: {
  value: MutuelleFields;
  onChange: (value: MutuelleFields) => void;
}) {
  const isAutre = value.mutuelleId === 'autre';

  function selectMutuelle(id: string) {
    const mutuelle = mutuelles.find((m) => m.id === id);
    if (!mutuelle) return;
    onChange({
      ...value,
      mutuelleId: mutuelle.id,
      mutuelleName: mutuelle.id === 'autre' ? '' : mutuelle.name,
      mutuelleEmail: mutuelle.id === 'autre' ? '' : mutuelle.emailRemboursement,
    });
  }

  return (
    <View>
      <Text className="text-sm font-semibold text-neutral-700 mb-1.5">Mutuelle</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 8 }}
        className="mb-3.5"
      >
        {mutuelles.map((m) => {
          const active = m.id === value.mutuelleId;
          return (
            <Pressable
              key={m.id}
              onPress={() => selectMutuelle(m.id)}
              className={`flex-row items-center rounded-full px-3.5 py-2 mr-2 border ${
                active ? 'bg-primary-50 border-primary-500' : 'bg-white border-neutral-200'
              }`}
            >
              <Text className="text-sm mr-1.5">{m.logo}</Text>
              <Text
                className={`text-sm font-medium ${active ? 'text-primary-700' : 'text-neutral-600'}`}
              >
                {m.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {isAutre && (
        <>
          <Text className="text-sm font-semibold text-neutral-700 mb-1.5">Nom de la mutuelle</Text>
          <TextInput
            value={value.mutuelleName}
            onChangeText={(text) => onChange({ ...value, mutuelleName: text })}
            placeholder="Ex : Ma Mutuelle Perso"
            placeholderTextColor="#9CA3AF"
            className="rounded-xl border border-neutral-200 px-3.5 py-3 text-neutral-900 mb-3.5"
          />
          <Text className="text-sm font-semibold text-neutral-700 mb-1.5">
            E-mail de remboursement
          </Text>
          <TextInput
            value={value.mutuelleEmail}
            onChangeText={(text) => onChange({ ...value, mutuelleEmail: text })}
            placeholder="Ex : contact@mamutuelle.fr"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
            className="rounded-xl border border-neutral-200 px-3.5 py-3 text-neutral-900 mb-3.5"
          />
        </>
      )}

      <Text className="text-sm font-semibold text-neutral-700 mb-1.5">N° d&apos;adhérent</Text>
      <TextInput
        value={value.numeroAdherent}
        onChangeText={(text) => onChange({ ...value, numeroAdherent: text })}
        placeholder="Ex : HM-2291-020"
        placeholderTextColor="#9CA3AF"
        className="rounded-xl border border-neutral-200 px-3.5 py-3 text-neutral-900 mb-4"
      />
    </View>
  );
}
