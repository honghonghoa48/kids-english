import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="level/[id]" options={{ title: 'Bài học', headerBackTitle: 'Quay lại' }} />
        <Stack.Screen name="lesson/[id]" options={{ title: 'Học từ vựng', headerBackTitle: 'Quay lại' }} />
        <Stack.Screen name="exercise/[id]" options={{ title: 'Bài tập', headerBackTitle: 'Quay lại' }} />
        <Stack.Screen name="game/[id]" options={{ title: 'Mini Game', headerBackTitle: 'Quay lại' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
