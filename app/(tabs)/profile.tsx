import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { C } from '../../lib/theme';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => { supabase.from('profiles').select('*').single().then(({ data, error }) => { if (error) Alert.alert('Profile', error.message); setProfile(data); }); }, []);
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Logout failed', error.message); else router.replace('/login');
  }
  return <View style={s.page}>
    <Text style={s.title}>My Profile</Text>
    <Card><Text style={s.name}>{profile?.full_name || 'EcoCoin User'}</Text><Text style={s.muted}>{profile?.email || ''}</Text><Text style={s.muted}>Role: {profile?.role || 'user'}</Text></Card>
    <Card><Text style={s.heading}>About EcoCoin</Text><Text style={s.muted}>A smart plastic collection and recycling rewards initiative. This version uses simulated deposits.</Text></Card>
    <Button title="Log out" onPress={logout} secondary />
  </View>;
}
const s = StyleSheet.create({ page: { flex: 1, padding: 18, backgroundColor: C.bg }, title: { fontSize: 26, fontWeight: '900', color: C.ink, marginBottom: 16 }, name: { fontSize: 22, fontWeight: '800', color: C.ink }, muted: { color: C.muted, marginTop: 6 }, heading: { fontWeight: '800', color: C.ink, marginBottom: 6 } });
