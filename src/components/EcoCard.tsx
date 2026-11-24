import { QrCode, Wifi } from 'lucide-react';
import { coinsToRupees } from '../config/rewards';

export function EcoCard({ name, number, balance, large = false }: { name: string; number: string; balance: number; large?: boolean }) {
  return <div className={`eco-card ${large ? 'eco-card-large' : ''}`}>
    <div className="eco-card-top"><span><span className="card-leaf">✳</span> eco<span className="card-coin-word">coin</span></span><Wifi size={22} className="card-wifi" /></div>
    <div className="card-chip"><span /></div>
    <div className="card-label">AVAILABLE ECOCOINS</div>
    <div className="card-balance">{balance.toLocaleString('en-IN')} <small>EC</small></div>
    <div className="card-bottom"><div><span className="card-label">CARDHOLDER</span><strong>{name}</strong></div><div><span className="card-label">ECOCARD</span><strong>{number}</strong></div><div className="qr-box" aria-label="Demo QR visual identifier"><QrCode size={large ? 34 : 27} /><i>DEMO</i></div></div>
    <div className="card-value">≈ ₹{coinsToRupees(balance).toLocaleString('en-IN')} reward value</div>
  </div>;
}
