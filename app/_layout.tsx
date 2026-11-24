import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { C } from '../lib/theme';
export default function Layout() {
  return <>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerStyle: { backgroundColor: C.bg }, headerTintColor: C.ink, contentStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="index" options={{ title: 'EcoCoin', headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Welcome to EcoCoin' }} />
      <Stack.Screen name="register" options={{ title: 'Create account' }} />
    </Stack>
  </>;
}
