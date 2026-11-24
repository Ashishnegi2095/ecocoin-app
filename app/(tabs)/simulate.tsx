import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { simulateDeposit } from '../../lib/api';
import { C } from '../../lib/theme';

export default function Simulate() {
  const params = useLocalSearchParams<{ machine?: string }>();
  const [material, setMaterial] = useState<'PET' | 'FILM'>('PET');
  const [weight, setWeight] = useState('1.0');
  const [count, setCount] = useState('5');
  const [busy, setBusy] = useState(false);
  const machine = typeof params.machine === 'string' && params.machine.includes('ECO-') ? params.machine : 'ECO-MATHURA-001';
  async function submit() {
    const w = Number(weight), n = Number(count);
    if (!Number.isFinite(w) || w <= 0 || w > 20 || !Number.isInteger(n) || n < 1 || n > 500) return Alert.alert('Invalid values', 'Weight must be 0–20 kg and item count 1–500.');
    setBusy(true);
    try {
      const result: any = await simulateDeposit(machine, material, w, n);
      Alert.alert('Deposit successful 🎉', `${result.coins_awarded} EcoCoins added to your wallet.`, [{ text: 'View wallet', onPress: () => router.replace('/(tabs)/wallet') }]);
    } catch (e: any) { Alert.alert('Deposit failed', e.message); }
    setBusy(false);
  }
  return <View style={s.page}>
    <Text style={s.title}>Demo deposit</Text>
    <Text style={s.warning}>SIMULATION MODE — values are entered for demonstration and are not measured by real sensors.</Text>
    <Card><Text style={s.label}>Machine</Text><Text style={s.value}>{machine}</Text><Text style={s.muted}>Demo machine · Available</Text></Card>
    <Text style={s.label}>Select plastic category</Text>
    <View style={s.row}>
      <Text onPress={() => setMaterial('PET')} style={[s.choice, material === 'PET' && s.selected]}>♻ PET Bottles</Text>
      <Text onPress={() => setMaterial('FILM')} style={[s.choice, material === 'FILM' && s.selected]}>Plastic Film</Text>
    </View>
    <Text style={s.label}>Sample weight (kg)</Text>
    <TextInput style={s.input} keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
    <Text style={s.label}>Number of items (bottles / bundles)</Text>
    <TextInput style={s.input} keyboardType="number-pad" value={count} onChangeText={setCount} />
    <Card><Text style={s.label}>Prototype reward rate</Text><Text style={s.value}>{material === 'PET' ? '10' : '5'} EC / kg</Text><Text style={s.muted}>Final reward is calculated securely by the database.</Text></Card>
    <Button title="Confirm simulated deposit" onPress={submit} loading={busy} />
  </View>;
}
const s = StyleSheet.create({ page: { flex: 1, padding: 18, backgroundColor: C.bg }, title: { fontSize: 25, fontWeight: '900', color: C.ink, marginBottom: 10 }, warning: { color: '#8A5A00', backgroundColor: '#FFF2D6', padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 12, fontWeight: '700' }, label: { color: C.ink, fontWeight: '700', marginBottom: 7 }, value: { color: C.green, fontWeight: '900', fontSize: 20 }, muted: { color: C.muted, marginTop: 5 }, row: { flexDirection: 'row', gap: 10, marginBottom: 16 }, choice: { flex: 1, textAlign: 'center', padding: 14, borderRadius: 12, backgroundColor: C.white, color: C.ink, overflow: 'hidden', fontWeight: '700' }, selected: { backgroundColor: C.greenLight, borderWidth: 1, borderColor: C.green, color: C.green }, input: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, padding: 14, borderRadius: 12, marginBottom: 14 } });
