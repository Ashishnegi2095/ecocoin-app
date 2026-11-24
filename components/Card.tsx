import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { C } from '../lib/theme';
export default function Card(props: ViewProps) {
  return <View {...props} style={[s.card, props.style]} />;
}
const s = StyleSheet.create({ card: { backgroundColor: C.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 12 } });
