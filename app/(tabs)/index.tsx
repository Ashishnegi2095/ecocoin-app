import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, StyleSheet } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { getDashboard } from '../../lib/api';
import { C } from '../../lib/theme';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => {
    setRefreshing(true);
    try { setData(await getDashboard()); } catch (e: any) { Alert.alert('Could not load dashboard', e.message); }
    setRefreshing(false);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  return <ScrollView style={s.page} contentContainerStyle={{ padding: 18 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
    <Text style={s.eyebrow}>SMART RECYCLING REWARDS</Text>
    <Text style={s.title}>Hello, {data?.profile?.full_name || 'Recycler'} 👋</Text>
    <Card style={s.balance}>
      <Text style={{ color: '#E7F5EB' }}>YOUR ECOCOIN BALANCE</Text>
      <Text style={s.coins}>{data?.wallet?.balance ?? '—'} <Text style={{ fontSize: 18 }}>EC</Text></Text>
      <Text style={{ color: '#E7F5EB' }}>Every deposit makes a difference.</Text>
    </Card>
    <View style={s.row}>
      <Card style={s.stat}><Text style={s.statNum}>{Number(data?.wallet?.total_weight_kg || 0).toFixed(2)} kg</Text><Text style={s.muted}>Plastic recycled</Text></Card>
      <Card style={s.stat}><Text style={s.statNum}>{data?.wallet?.total_deposits ?? 0}</Text><Text style={s.muted}>Deposits</Text></Card>
    </View>
    <Text style={s.section}>Get started</Text>
    <Button title="Scan a recycling machine" onPress={() => router.push('/(tabs)/scan')} />
    <Button title="Try a demo deposit" secondary onPress={() => router.push('/(tabs)/simulate')} />
    <Text style={s.section}>Recent activity</Text>
    {(data?.deposits || []).length === 0 ? <Card><Text style={s.muted}>No deposits yet. Make your first demo deposit!</Text></Card> :
      data.deposits.map((d: any) => <Card key={d.id}><Text style={s.itemTitle}>{d.material === 'PET' ? 'PET bottles' : 'Plastic film'} · {d.weight_kg} kg</Text><Text style={s.muted}>{new Date(d.created_at).toLocaleString()} · {d.coins_awarded} EC</Text></Card>)}
    <Text style={s.footer}>Your Waste Can Make a Difference. Recycle Today.</Text>
  </ScrollView>;
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.bg }, eyebrow: { color: C.green, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: C.ink, fontSize: 27, fontWeight: '900', marginVertical: 8 },
  balance: { backgroundColor: C.green, borderColor: C.green, padding: 22, marginTop: 12 },
  coins: { color: C.white, fontSize: 38, fontWeight: '900', marginVertical: 8 },
  row: { flexDirection: 'row', gap: 10 }, stat: { flex: 1 }, statNum: { fontSize: 22, fontWeight: '800', color: C.ink }, muted: { color: C.muted, marginTop: 4 },
  section: { fontSize: 18, fontWeight: '800', color: C.ink, marginVertical: 12 }, itemTitle: { color: C.ink, fontWeight: '700' },
  footer: { textAlign: 'center', color: C.green, fontWeight: '700', marginVertical: 20 }
});
