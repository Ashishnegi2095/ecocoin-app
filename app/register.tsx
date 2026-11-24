import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { C } from '../lib/theme';
import Button from '../components/Button';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  async function createAccount() {
    if (!name.trim() || !email.trim() || password.length < 8) return Alert.alert('Check details', 'Enter your name, valid email and a password of at least 8 characters.');
    setBusy(true);
    const { error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim() } } });
    setBusy(false);
    if (error) Alert.alert('Registration failed', error.message);
    else Alert.alert('Account created', 'Check your email if confirmation is enabled, then log in.', [{ text: 'OK', onPress: () => router.replace('/login') }]);
  }
  return <View style={s.page}>
    <Text style={s.title}>Create your EcoCoin account</Text>
    <TextInput style={s.input} placeholder="Full name" value={name} onChangeText={setName} />
    <TextInput style={s.input} placeholder="Email address" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
    <TextInput style={s.input} placeholder="Password (minimum 8 characters)" secureTextEntry value={password} onChangeText={setPassword} />
    <Button title="Create account" onPress={createAccount} loading={busy} />
  </View>;
}
const s = StyleSheet.create({ page: { flex: 1, padding: 24, backgroundColor: C.bg, justifyContent: 'center' }, title: { fontSize: 25, fontWeight: '800', color: C.ink, marginBottom: 25 }, input: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, padding: 15, borderRadius: 13, marginBottom: 12 } });
