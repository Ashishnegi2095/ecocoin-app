import { supabase } from './supabase';

export async function getDashboard() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Please sign in again.');
  const [{ data: profile, error: pErr }, { data: wallet, error: wErr }, { data: deposits, error: dErr }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', userData.user.id).single(),
      supabase.from('wallets').select('*').eq('user_id', userData.user.id).single(),
      supabase.from('deposits').select('*').eq('user_id', userData.user.id).order('created_at', { ascending: false }).limit(5)
    ]);
  if (pErr) throw pErr;
  if (wErr) throw wErr;
  if (dErr) throw dErr;
  return { profile, wallet, deposits: deposits || [] };
}

export async function simulateDeposit(machineCode: string, material: 'PET' | 'FILM', weightKg: number, itemCount: number) {
  const { data, error } = await supabase.rpc('simulate_deposit', {
    p_machine_code: machineCode,
    p_material: material,
    p_weight_kg: weightKg,
    p_item_count: itemCount
  });
  if (error) throw error;
  return data;
}

export async function redeemReward(rewardId: string) {
  const { data, error } = await supabase.rpc('redeem_reward', { p_reward_id: rewardId });
  if (error) throw error;
  return data;
}
