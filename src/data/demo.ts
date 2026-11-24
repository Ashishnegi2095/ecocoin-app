import { INITIAL_REWARD_RATES } from '../config/rewards';
import type { DemoState } from '../types';

const day = (offset: number, hour: number) => {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  date.setHours(hour, 20, 0, 0);
  return date.toISOString();
};

export const INITIAL_DEMO_STATE: DemoState = {
  profile: { name: 'Aarav Sharma', cardNumber: 'ECO  ·  2849  ·  7316' },
  balance: 1240,
  totalEarned: 1440,
  totalRedeemed: 200,
  totalWeightKg: 14.4,
  rates: { ...INITIAL_REWARD_RATES },
  machineStatus: 'Online',
  transactions: [
    { id: 'EC-24061', type: 'recycling', description: 'Plastic · Smart recycle', date: day(1, 10), amount: 520, weightKg: 5.2, category: 'plastic', status: 'Completed' },
    { id: 'EC-24048', type: 'recycling', description: 'HDPE · Smart recycle', date: day(3, 15), amount: 360, weightKg: 4.8, category: 'hdpe', status: 'Completed' },
    { id: 'EC-24031', type: 'redemption', description: 'Jaipur weekend · Trip reward', date: day(5, 12), amount: -200, status: 'Demo' },
    { id: 'EC-24019', type: 'recycling', description: 'MLP · Smart recycle', date: day(8, 9), amount: 560, weightKg: 4.4, category: 'mlp', status: 'Completed' },
  ],
  bookings: [
    { id: 'BK-1084', destination: 'Jaipur', date: day(5, 12), price: 7999, coinsRedeemed: 200, payable: 7899 },
  ],
};
