import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { C } from '../lib/theme';

export default function Button({ title, onPress, secondary = false, loading = false }: {
  title: string; onPress: () => void; secondary?: boolean; loading?: boolean
}) {
  return <Pressable onPress={onPress} disabled={loading} style={[s.btn, secondary && s.secondary]}>
    {loading ? <ActivityIndicator color={secondary ? C.green : C.white} /> :
      <Text style={[s.text, secondary && { color: C.green }]}>{title}</Text>}
  </Pressable>;
}
const s = StyleSheet.create({
  btn: { backgroundColor: C.green, padding: 15, borderRadius: 14, alignItems: 'center', marginVertical: 5 },
  secondary: { backgroundColor: C.greenLight },
  text: { color: C.white, fontWeight: '700', fontSize: 15 }
});
