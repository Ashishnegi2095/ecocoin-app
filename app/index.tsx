import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { C } from '../lib/theme';

export default function Index() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => router.replace(data.session ? '/(tabs)' : '/login'));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      router.replace(session ? '/(tabs)' : '/login');
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
    <ActivityIndicator size="large" color={C.green} />
  </View>;
}
