import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { INITIAL_DEMO_STATE } from '../data/demo';
import { coinsToRupees } from '../config/rewards';
import type { Booking, DemoState, MachineStatus, Transaction, WasteCategory } from '../types';

const STORAGE_KEY = 'ecocoin-demo-v2';
let idSequence = 0;

interface DemoContextValue extends DemoState {
  addRecycle: (category: WasteCategory, weightKg: number, coins: number) => Transaction;
  redeemForBooking: (destination: string, price: number, coins: number) => Booking;
  updateProfile: (name: string) => void;
  updateRate: (category: WasteCategory, rate: number) => void;
  setMachineStatus: (status: MachineStatus) => void;
  resetDemo: (initialBalance?: number) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function readState(): DemoState {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return structuredClone(INITIAL_DEMO_STATE);
  try {
    const parsed: DemoState = JSON.parse(stored);
    if (!parsed.profile || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.bookings)) {
      throw new Error('Stored demo data is incomplete.');
    }
    return parsed;
  } catch (error) {
    console.error('Could not restore EcoCoin demo data:', error);
    return structuredClone(INITIAL_DEMO_STATE);
  }
}

function newId(prefix: string): string {
  idSequence += 1;
  return `${prefix}-${Date.now().toString().slice(-6)}${idSequence.toString().padStart(2, '0')}`;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(readState);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addRecycle = useCallback((category: WasteCategory, weightKg: number, coins: number) => {
    const transaction: Transaction = {
      id: newId('EC'),
      type: 'recycling',
      description: `${category.toUpperCase()} · Smart recycle`,
      date: new Date().toISOString(),
      amount: coins,
      weightKg,
      category,
      status: 'Completed',
    };
    setState(current => ({
      ...current,
      balance: current.balance + coins,
      totalEarned: current.totalEarned + coins,
      totalWeightKg: current.totalWeightKg + weightKg,
      transactions: [transaction, ...current.transactions],
    }));
    return transaction;
  }, []);

  const redeemForBooking = useCallback((destination: string, price: number, coins: number) => {
    const now = new Date().toISOString();
    const bookingId = newId('BK');
    const payable = Math.max(0, Math.round((price - coinsToRupees(coins)) * 100) / 100);
    const booking: Booking = { id: bookingId, destination, date: now, price, coinsRedeemed: coins, payable };
    const transaction: Transaction = {
      id: newId('EC'),
      type: 'redemption',
      description: `${destination} trip reward · ${bookingId}`,
      date: now,
      amount: -coins,
      status: 'Demo',
    };
    const bookingTransaction: Transaction = {
      id: bookingId,
      type: 'booking',
      description: `${destination} · Demo booking`,
      date: now,
      amount: 0,
      status: 'Demo',
    };
    setState(current => ({
      ...current,
      balance: current.balance - coins,
      totalRedeemed: current.totalRedeemed + coins,
      transactions: [bookingTransaction, transaction, ...current.transactions],
      bookings: [booking, ...current.bookings],
    }));
    return booking;
  }, []);

  const value = useMemo<DemoContextValue>(() => ({
    ...state,
    addRecycle,
    redeemForBooking,
    updateProfile: name => setState(current => ({ ...current, profile: { ...current.profile, name } })),
    updateRate: (category, rate) => setState(current => ({ ...current, rates: { ...current.rates, [category]: rate } })),
    setMachineStatus: machineStatus => setState(current => ({ ...current, machineStatus })),
    resetDemo: (initialBalance = INITIAL_DEMO_STATE.balance) => setState({
      ...structuredClone(INITIAL_DEMO_STATE),
      balance: initialBalance,
      totalEarned: initialBalance + INITIAL_DEMO_STATE.totalRedeemed,
    }),
  }), [state, addRecycle, redeemForBooking]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider.');
  return context;
}
