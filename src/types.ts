export type WasteCategory = 'plastic' | 'mlp' | 'hdpe' | 'other';
export type MachineStatus = 'Online' | 'Maintenance';

export interface Profile {
  name: string;
  cardNumber: string;
}

export interface Transaction {
  id: string;
  type: 'recycling' | 'redemption' | 'booking';
  description: string;
  date: string;
  amount: number;
  weightKg?: number;
  category?: WasteCategory;
  status: 'Completed' | 'Demo';
}

export interface Booking {
  id: string;
  destination: string;
  date: string;
  price: number;
  coinsRedeemed: number;
  payable: number;
}

export interface DemoState {
  profile: Profile;
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  totalWeightKg: number;
  rates: Record<WasteCategory, number>;
  machineStatus: MachineStatus;
  transactions: Transaction[];
  bookings: Booking[];
}
