import { ArrowDownLeft, ArrowUpRight, CalendarDays, Recycle, TicketCheck } from 'lucide-react';
import type { Transaction } from '../types';

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (!transactions.length) return <div className="empty-state"><Recycle size={25} /><strong>No activity yet</strong><span>Your EcoCoin story starts with your first recycling deposit.</span></div>;
  return <div className="transaction-list">{transactions.map(transaction => {
    const incoming = transaction.type === 'recycling';
    const Icon = transaction.type === 'recycling' ? Recycle : transaction.type === 'booking' ? TicketCheck : incoming ? ArrowDownLeft : ArrowUpRight;
    return <div className="transaction-row" key={transaction.id}>
      <span className={`transaction-icon ${incoming ? 'incoming' : transaction.type === 'booking' ? 'booking' : 'outgoing'}`}><Icon size={18} /></span>
      <span className="transaction-main"><strong>{transaction.description}</strong><small><CalendarDays size={12} />{new Date(transaction.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}{transaction.weightKg ? ` · ${transaction.weightKg.toFixed(2)} kg` : ''}</small></span>
      <span className={`transaction-amount ${incoming ? 'positive' : transaction.amount < 0 ? 'negative' : ''}`}>{transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-IN')} {transaction.type === 'booking' ? 'DEMO' : 'EC'}</span>
      <span className={`status-pill ${transaction.status === 'Demo' ? 'demo' : ''}`}>{transaction.status}</span>
    </div>;
  })}</div>;
}
