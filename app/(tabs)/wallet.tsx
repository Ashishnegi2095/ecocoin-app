import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Card from '../../components/Card';
import { supabase } from '../../lib/supabase';
import { C } from '../../lib/theme';

export default function Wallet() {
  const [wallet, setWallet] = useState<any>(null);
  const [tx, setTx] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => {
    setRefreshing(true);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      const [{ data: w, error: we }, { data: t, error: te }] = await Promise.all([
        supabase.from('wallets').select('*').eq('user_id', u.user.id).single(),
        supabase.from('coin_transactions').select('*').eq('user_id', u.user.id).order('created_at', { ascending: false }).limit(50)
      ]);
      if (we || te) Alert.alert('Wallet error', (we || te)?.message);
      setWallet(w); setTx(t || []);
    }
    setRefreshing(false);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  return <ScrollView style={s.page} contentContainerStyle={{ padding: 18 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
    <Text style={s.title}>My Eco Wallet</Text>
    <Card style={s.balance}><Text style={{ color: '#E8F5EC' }}>AVAILABLE BALANCE</Text><Text style={s.coins}>{wallet?.balance ?? '—'} EC</Text><Text style={{ color: '#E8F5EC' }}>Total weight: {wallet?.total_weight_kg ?? 0} kg</Text></Card>
    <Text style={s.heading}>Transaction history</Text>
    {tx.length === 0 ? <Card><Text style={{ color: C.muted }}>No transactions yet.</Text></Card> : tx.map(t => <Card key={t.id}><View style={s.row}><Text style={s.kind}>{t.type.replace('_', ' ')}</Text><Text style={[s.amount, t.amount >= 0 ? { color: C.green } : { color: C.red }]}>{t.amount > 0 ? '+' : ''}{t.amount} EC</Text></View><Text style={s.muted}>{t.description || 'EcoCoin transaction'} · {new Date(t.created_at).toLocaleString()}</Text></Card>)}
  </ScrollView>;
}
const s = StyleSheet.create({ page: { flex: 1, backgroundColor: C.bg }, title: { fontSize: 26, fontWeight: '900', color: C.ink, marginBottom: 14 }, balance: { backgroundColor: C.green, borderColor: C.green, padding: 22 }, coins: { fontSize: 36, color: C.white, fontWeight: '900', marginVertical: 10 }, heading: { fontSize: 18, fontWeight: '800', color: C.ink, marginVertical: 14 }, row: { flexDirection: 'row', justifyContent: 'space-between' }, kind: { fontWeight: '700', color: C.ink, textTransform: 'capitalize' }, amount: { fontWeight: '900' }, muted: { color: C.muted, fontSize: 12, marginTop: 6 } });
