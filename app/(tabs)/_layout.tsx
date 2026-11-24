import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../../lib/theme';
export default function TabLayout() {
  return <Tabs screenOptions={{ headerStyle: { backgroundColor: C.bg }, headerTintColor: C.ink, tabBarActiveTintColor: C.green, tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 } }}>
    <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: ({ color, size }) => <Ionicons name="scan-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="wallet" options={{ title: 'Wallet', tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="rewards" options={{ title: 'Rewards', tabBarIcon: ({ color, size }) => <Ionicons name="gift-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="simulate" options={{ href: null }} />
  </Tabs>;
}
