import { ArrowUpRight, Coins, Leaf, ReceiptText, Recycle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { TransactionList } from '../components/TransactionList';
import { coinsToRupees } from '../config/rewards';
import { useDemo } from '../state/DemoContext';

export function WalletPage() {
  const { balance, totalEarned, totalRedeemed, transactions } = useDemo();
  return <div className="page-stack">
    <div className="page-heading heading-with-action"><div><div className="eyebrow">YOUR REWARDS, AT A GLANCE</div><h1>Eco wallet</h1><p>A clear view of what you’ve earned and where it can take you.</p></div><Link className="button button-primary" to="/travel"><Sparkles size={16} /> Explore travel rewards</Link></div>
    <section className="wallet-hero"><div><span className="wallet-kicker"><Coins size={16} /> AVAILABLE BALANCE</span><div className="wallet-total">{balance.toLocaleString('en-IN')} <small>EC</small></div><p>Worth <strong>₹{coinsToRupees(balance).toLocaleString('en-IN')}</strong> toward your next trip <span>·</span> 100 EC = ₹50</p><Link to="/recycle" className="wallet-hero-link">Earn more EcoCoins <ArrowUpRight size={16} /></Link></div><div className="wallet-ring"><div><Leaf size={29} /><strong>GROWING</strong><small>one good habit<br />at a time</small></div></div><div className="wallet-glow" /></section>
    <div className="stats-grid wallet-stats"><StatCard icon={<ArrowUpRight size={19} />} label="Total earned" value={`${totalEarned.toLocaleString('en-IN')} EC`} note="From simulated recycling" /><StatCard icon={<ReceiptText size={19} />} label="Total redeemed" value={`${totalRedeemed.toLocaleString('en-IN')} EC`} note={`₹${coinsToRupees(totalRedeemed).toLocaleString('en-IN')} in trip rewards`} tone="amber" /><StatCard icon={<Recycle size={19} />} label="Recent activity" value={`${transactions.length}`} note="Recycling, booking & rewards" tone="blue" /></div>
    <section className="panel"><div className="panel-heading"><div><h2>All transactions</h2><p>Every earning and redemption, in one place.</p></div><span className="transaction-count">{transactions.length} entries</span></div><TransactionList transactions={transactions} /></section>
  </div>;
}
