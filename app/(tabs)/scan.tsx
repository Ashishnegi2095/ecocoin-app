import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { C } from '../../lib/theme';
import Button from '../../components/Button';

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  if (!permission) return <View style={s.center}><Text>Loading camera permission…</Text></View>;
  if (!permission.granted) return <View style={s.center}><Text style={s.title}>Camera access required</Text><Button title="Allow camera" onPress={requestPermission} /></View>;
  return <View style={s.page}>
    <Text style={s.title}>Scan machine QR code</Text>
    <Text style={s.sub}>Point your camera at the EcoCoin machine QR code.</Text>
    <View style={s.cameraWrap}>
      <CameraView style={s.camera} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : ({ data }) => {
          setScanned(true);
          Alert.alert('QR detected', `Code: ${data}`, [
            { text: 'Start demo deposit', onPress: () => router.push({ pathname: '/(tabs)/simulate', params: { machine: data } }) },
            { text: 'Scan again', onPress: () => setScanned(false) }
          ]);
        }} />
    </View>
    <Text style={s.note}>Prototype machine QR: ECO-MATHURA-001</Text>
    <Button title="Open deposit simulator" secondary onPress={() => router.push('/(tabs)/simulate')} />
  </View>;
}
const s = StyleSheet.create({ page: { flex: 1, padding: 18, backgroundColor: C.bg }, center: { flex: 1, justifyContent: 'center', padding: 24 }, title: { fontSize: 23, fontWeight: '800', color: C.ink }, sub: { color: C.muted, marginVertical: 10 }, cameraWrap: { height: 360, overflow: 'hidden', borderRadius: 20, marginVertical: 16 }, camera: { flex: 1 }, note: { textAlign: 'center', color: C.muted, marginBottom: 12 } });
