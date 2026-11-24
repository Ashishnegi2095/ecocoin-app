import { ArrowRight, BadgeCheck, CircleHelp, CreditCard, LockKeyhole, QrCode, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EcoCard } from '../components/EcoCard';
import { useDemo } from '../state/DemoContext';
import { coinsToRupees } from '../config/rewards';

export function EcoCardPage() {
  const { profile, balance, totalEarned, totalRedeemed } = useDemo();
  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">YOUR REWARDS, YOUR WAY</div><h1>Meet your <em>EcoCard.</em></h1><p>A digital membership card for the good you do — and the places you’ll go.</p></div></div>
    <div className="ecocard-layout"><div className="ecocard-showcase"><div className="eco-card-label"><CreditCard size={16} /> DIGITAL MEMBER CARD <span>DEMO</span></div><EcoCard name={profile.name} number={profile.cardNumber} balance={balance} large /><div className="card-secure-note"><LockKeyhole size={15} /> Demo card details are stored only in this browser.</div></div><div className="ecocard-details"><div className="member-status"><span><BadgeCheck size={20} /></span><div><strong>EcoCoin member</strong><small>Active demo membership</small></div><i>ACTIVE</i></div><h2>Good choices,<br /><em>always in your pocket.</em></h2><p>Your EcoCard is where your simulated recycling rewards come together. Use your balance for eligible trip discounts.</p><div className="card-detail-stats"><div><span>Total earned</span><strong>{totalEarned.toLocaleString('en-IN')} <small>EC</small></strong></div><div><span>Total redeemed</span><strong>{totalRedeemed.toLocaleString('en-IN')} <small>EC</small></strong></div><div><span>Reward value</span><strong>₹{coinsToRupees(balance).toLocaleString('en-IN')}</strong></div></div><div className="qr-info"><span><QrCode size={18} /></span><p><strong>QR visual identifier</strong><small>Decorative, not scannable. No physical card is connected.</small></p><CircleHelp size={17} /></div><Link to="/travel" className="button button-primary full-button">Use EcoCoins on a trip <ArrowRight size={16} /></Link></div></div>
    <section className="ecocard-note"><Sparkles size={20} /><div><strong>Your good habits add up.</strong><p>Every eligible deposit in the simulator credits this same EcoCard balance, across your dashboard and wallet.</p></div><Link to="/recycle">Try a demo deposit <ArrowRight size={15} /></Link></section>
  </div>;
}
