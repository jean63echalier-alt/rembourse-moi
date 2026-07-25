import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ProfileProvider } from '@/context/ProfileContext';
import { ReimbursementProvider } from '@/context/ReimbursementContext';

import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <ProfileProvider>
        <ReimbursementProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" />
        </ReimbursementProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
