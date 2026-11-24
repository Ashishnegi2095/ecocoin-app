import { ArrowDownRight, ArrowUpRight, ArrowUpRight as ArrowRight, Leaf, Recycle, Sparkles, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EcoCard } from '../components/EcoCard';
import { StatCard } from '../components/StatCard';
import { TransactionList } from '../components/TransactionList';
import { useDemo } from '../state/DemoContext';
import { coinsToRupees } from '../config/rewards';

const chartData = [
  { month: 'Jun', kg: 1.8 }, { month: 'Jul', kg: 2.4 }, { month: 'Aug', kg: 1.9 },
  { month: 'Sep', kg: 3.1 }, { month: 'Oct', kg: 2.7 }, { month: 'Nov', kg: 2.5 },
];
const destinations = [
  { name: 'Udaipur', subtitle: 'Lakeside calm', img: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=700&q=80', price: '₹8,499' },
  { name: 'Munnar', subtitle: 'Into the green', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80', price: '₹12,900' },
  { name: 'Jaipur', subtitle: 'A royal escape', img: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=700&q=80', price: '₹7,999' },
];

export function DashboardPage() {
  const { profile, balance, totalWeightKg, totalEarned, totalRedeemed, transactions } = useDemo();
  const firstName = profile.name.trim().split(/\s+/)[0] || 'Recycler';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Intl.DateTimeFormat('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()).toUpperCase();
  return <div className="page-stack">
    <div className="page-heading heading-with-action"><div><div className="eyebrow">{today} <span className="tiny-sun">✳</span></div><h1>{greeting}, {firstName} <span className="wave">✦</span></h1><p>Your small steps are adding up to a better tomorrow.</p></div><Link className="button button-primary" to="/recycle"><Recycle size={17} /> Recycle waste</Link></div>
    <section className="stats-grid">
      <StatCard icon={<Wallet size={19} />} label="Available EcoCoins" value={`${balance.toLocaleString('en-IN')} EC`} note={`≈ ₹${coinsToRupees(balance).toLocaleString('en-IN')} in travel rewards`} />
      <StatCard icon={<Recycle size={19} />} label="Waste recycled" value={`${totalWeightKg.toFixed(1)} kg`} note="Giving materials another life" tone="lime" />
      <StatCard icon={<ArrowUpRight size={19} />} label="Coins earned" value={`${totalEarned.toLocaleString('en-IN')} EC`} note="Across all recycling sessions" tone="blue" />
      <StatCard icon={<Sparkles size={19} />} label="Rewards used" value={`${totalRedeemed.toLocaleString('en-IN')} EC`} note="Put toward a greener getaway" tone="amber" />
    </section>
    <section className="dashboard-main-grid">
      <div className="panel impact-panel"><div className="panel-heading"><div><h2>Your impact, in motion</h2><p>A little consistency goes a long way.</p></div><span className="select-chip">Last 6 months <ArrowDownRight size={14} /></span></div>
        <div className="chart-stats"><strong>{totalWeightKg.toFixed(1)} <small>kg</small></strong><span><span className="positive-dot" /> Recycled so far</span></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 6, left: -24, bottom: 0 }}><defs><linearGradient id="impactFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#52a873" stopOpacity={.2} /><stop offset="100%" stopColor="#52a873" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#edf0eb" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#89948b', fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#89948b', fontSize: 11 }} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e6ebe3', fontSize: 12 }} formatter={value => [`${value} kg`, 'Recycled']} /><Area type="monotone" dataKey="kg" stroke="#27804a" strokeWidth={2.5} fill="url(#impactFill)" activeDot={{ r: 5, fill: '#27804a' }} /></AreaChart></ResponsiveContainer></div>
        <div className="chart-footnote"><span><span className="legend-dot" /> Recycled waste</span><span>Every kilogram makes a difference <Leaf size={14} /></span></div>
      </div>
      <div className="card-preview-panel"><div className="panel-heading"><div><h2>Your EcoCard</h2><p>Your rewards, always within reach.</p></div><Link to="/ecocard" className="icon-link" aria-label="View EcoCard"><ArrowRight size={18} /></Link></div>
        <EcoCard name={profile.name} number={profile.cardNumber} balance={balance} />
        <Link to="/wallet" className="underlined-link">View wallet activity <span>↗</span></Link>
      </div>
    </section>
    <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Your latest recycling and rewards activity.</p></div><Link className="text-link" to="/history">View all <ArrowRight size={15} /></Link></div><TransactionList transactions={transactions.slice(0, 4)} /></section>
    <section className="destination-section"><div className="panel-heading"><div><div className="eyebrow">YOUR NEXT CHAPTER</div><h2>Good things are just around the corner</h2><p>Use your EcoCoins to make your next escape a little lighter.</p></div><Link className="text-link" to="/travel">Explore all trips <ArrowRight size={15} /></Link></div>
      <div className="mini-destination-grid">{destinations.map((destination, index) => <Link to="/travel" className="mini-destination" key={destination.name}><img src={destination.img} alt="" /><span className="trip-tag">{index === 0 ? 'NATURE PICK' : index === 1 ? 'SLOW TRAVEL' : 'CULTURE'}</span><div><strong>{destination.name}</strong><span>{destination.subtitle} <b>{destination.price}</b></span></div></Link>)}</div>
    </section>
  </div>;
}
