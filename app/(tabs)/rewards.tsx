import React, { useCallback, useState } from 'react';
import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { redeemReward } from '../../lib/api';
import { C } from '../../lib/theme';

export default function Rewards() {
  const [items, setItems] = useState<any[]>([]);
  const load = useCallback(async () => {
    const { data, error } = await supabase.from('rewards').select('*').eq('active', true).order('cost_coins');
    if (error) Alert.alert('Could not load rewards', error.message); else setItems(data || []);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  async function redeem(id: string, name: string) {
    Alert.alert('Redeem reward?', `Redeem ${name}? Coins will be deducted from your wallet.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Redeem', onPress: async () => {
        try { const result: any = await redeemReward(id); Alert.alert('Redemption successful', `Your redemption code: ${result.redemption_code}`); }
        catch (e: any) { Alert.alert('Redemption failed', e.message); }
      }}
    ]);
  }
  return <ScrollView style={s.page} contentContainerStyle={{ padding: 18 }}>
    <Text style={s.title}>Reward Store 🎁</Text>
    <Text style={s.sub}>Exchange your EcoCoins for useful rewards.</Text>
    {items.map(item => <Card key={item.id}><Text style={s.name}>{item.name}</Text><Text style={s.desc}>{item.description}</Text><View style={s.row}><Text style={s.cost}>{item.cost_coins} EC</Text><View style={{ width: 125 }}><Button title="Redeem" onPress={() => redeem(item.id, item.name)} /></View></View></Card>)}
    {items.length === 0 && <Card><Text style={s.sub}>No rewards are available yet. Ask the administrator to add rewards.</Text></Card>}
  </ScrollView>;
}
const s = StyleSheet.create({ page: { flex: 1, backgroundColor: C.bg }, title: { fontSize: 26, fontWeight: '900', color: C.ink }, sub: { color: C.muted, marginVertical: 8 }, name: { fontSize: 18, fontWeight: '800', color: C.ink }, desc: { color: C.muted, marginVertical: 8 }, row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, cost: { color: C.green, fontWeight: '900', fontSize: 18 } });
