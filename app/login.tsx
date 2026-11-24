import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { C } from '../lib/theme';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  async function signIn() {
    if (!email.trim() || !password) return Alert.alert('Missing details', 'Enter email and password.');
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) Alert.alert('Login failed', error.message);
    else router.replace('/(tabs)');
  }
  return <View style={s.page}>
    <Text style={s.logo}>♻ EcoCoin</Text>
    <Text style={s.heading}>Recycle. Earn. Repeat.</Text>
    <Text style={s.sub}>Turn your plastic waste into positive change.</Text>
    <TextInput style={s.input} placeholder="Email address" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
    <TextInput style={s.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
    <Button title="Log in" onPress={signIn} loading={busy} />
    <Pressable onPress={() => router.push('/register')}><Text style={s.link}>New to EcoCoin? Create an account</Text></Pressable>
  </View>;
}
const s = StyleSheet.create({
  page: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: C.bg },
  logo: { fontSize: 34, fontWeight: '900', color: C.green, textAlign: 'center' },
  heading: { fontSize: 23, fontWeight: '800', color: C.ink, textAlign: 'center', marginTop: 16 },
  sub: { color: C.muted, textAlign: 'center', marginBottom: 30, marginTop: 8 },
  input: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, padding: 15, borderRadius: 13, marginBottom: 12 },
  link: { color: C.green, textAlign: 'center', marginTop: 18, fontWeight: '700' }
});
