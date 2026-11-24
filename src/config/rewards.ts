import type { WasteCategory } from '../types';

export const INITIAL_REWARD_RATES: Record<WasteCategory, number> = {
  plastic: 100,
  mlp: 35,
  hdpe: 75,
  other: 20,
};

export const WASTE_CATEGORIES: { id: WasteCategory; name: string; short: string; detail: string; icon: string }[] = [
  { id: 'plastic', name: 'Plastic', short: 'Plastic', detail: 'Bottles, containers & rigid plastics', icon: '♻' },
  { id: 'mlp', name: 'MLP', short: 'MLP', detail: 'Multi-layer wrappers & packaging', icon: '◈' },
  { id: 'hdpe', name: 'HDPE', short: 'HDPE', detail: 'Detergent bottles & sturdy containers', icon: '⬡' },
  { id: 'other', name: 'Other non-biodegradable', short: 'Other', detail: 'Clean, dry non-biodegradable waste', icon: '✳' },
];

export const COIN_VALUE_INR = 0.5;

export function calculateCoins(weightKg: number, ratePerKg: number): number {
  return Math.round(weightKg * ratePerKg * 100) / 100;
}

export function coinsToRupees(coins: number): number {
  return Math.round(coins * COIN_VALUE_INR * 100) / 100;
}
