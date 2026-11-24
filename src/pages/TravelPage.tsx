import { useState } from 'react';
import { ArrowRight, Check, Compass, MapPin, Minus, Plus, Sparkles, TicketCheck, X } from 'lucide-react';
import { coinsToRupees } from '../config/rewards';
import { useDemo } from '../state/DemoContext';
import { useToast } from '../components/ToastContext';

type Destination = { name: string; region: string; duration: string; price: number; image: string; tag: string; description: string };
const trips: Destination[] = [
  { name: 'Udaipur', region: 'Rajasthan', duration: '3 nights · 4 days', price: 8499, tag: 'SLOW TRAVEL', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=85', description: 'Quiet mornings by the lake, winding old-city lanes, and the kind of sunset you wish you could keep.' },
  { name: 'Munnar', region: 'Kerala', duration: '4 nights · 5 days', price: 12900, tag: 'NATURE PICK', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=85', description: 'Take the slower road through tea country, misty ridgelines, and green that goes on and on.' },
  { name: 'Jaipur', region: 'Rajasthan', duration: '2 nights · 3 days', price: 7999, tag: 'CULTURE', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=85', description: 'A few days among pink-hued facades, lively bazaars, and stories in every courtyard.' },
  { name: 'Rishikesh', region: 'Uttarakhand', duration: '2 nights · 3 days', price: 6499, tag: 'FIND YOUR FLOW', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=85', description: 'Find a little stillness beside the river, beneath the foothills, away from the everyday.' },
];

export function TravelPage() {
  const { balance, redeemForBooking } = useDemo();
  const notify = useToast();
  const [selected, setSelected] = useState<Destination>(trips[0]);
  const [points, setPoints] = useState(String(Math.min(balance, 200)));
  const [receipt, setReceipt] = useState<{ id: string; destination: string; price: number; points: number; payable: number } | null>(null);
  const maxPoints = Math.min(balance, selected.price * 2);
  const parsedPoints = points === '' ? 0 : Number(points);
  const validPoints = Number.isFinite(parsedPoints) && parsedPoints >= 0 && parsedPoints <= maxPoints;
  const discount = validPoints ? coinsToRupees(parsedPoints) : 0;
  const payable = Math.max(0, Math.round((selected.price - discount) * 100) / 100);

  function chooseTrip(trip: Destination) {
    setSelected(trip);
    setPoints(String(Math.min(balance, trip.price * 2, 200)));
  }
  function confirmBooking() {
    if (!validPoints || payable < 0 || parsedPoints > balance || parsedPoints * .5 > selected.price) {
      notify('Please check your EcoCoin redemption amount.');
      return;
    }
    const booking = redeemForBooking(selected.name, selected.price, parsedPoints);
    setReceipt({ id: booking.id, destination: booking.destination, price: booking.price, points: booking.coinsRedeemed, payable: booking.payable });
    notify(`Demo booking created for ${booking.destination}.`);
  }

  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">YOUR GOOD HABITS, GOING PLACES</div><h1>A little more <em>getaway.</em></h1><p>Choose somewhere lovely, then let your EcoCoins take a little off the top.</p></div><div className="travel-balance"><span><Sparkles size={16} /> YOUR AVAILABLE EC</span><strong>{balance.toLocaleString('en-IN')} <small>EC</small></strong></div></div>
    <div className="demo-alert"><TicketCheck size={17} /><span><strong>Demo bookings only.</strong> Destinations and prices are examples. No reservations or payments are processed.</span></div>
    <div className="travel-layout"><section className="travel-results"><div className="travel-section-heading"><div><h2>Find your next somewhere</h2><p>Thoughtful escapes to put on your list.</p></div><span>{trips.length} handpicked trips</span></div><div className="travel-card-grid">{trips.map(trip => <button key={trip.name} className={`travel-card ${selected.name === trip.name ? 'trip-selected' : ''}`} onClick={() => chooseTrip(trip)} aria-pressed={selected.name === trip.name}><span className="trip-image"><img src={trip.image} alt="" /><span className="trip-badge">{trip.tag}</span><span className="trip-check">{selected.name === trip.name ? <Check size={15} /> : null}</span></span><span className="trip-card-copy"><strong>{trip.name}</strong><small><MapPin size={12} /> {trip.region} <i>·</i> {trip.duration}</small><span className="trip-price">₹{trip.price.toLocaleString('en-IN')} <small>/ person</small></span></span></button>)}</div>
      <div className="selected-trip-detail"><div className="selected-trip-image"><img src={selected.image} alt={`${selected.name} landscape`} /><span><Compass size={15} /> A LITTLE ROOM TO ROAM</span></div><div className="selected-trip-copy"><span className="eyebrow">YOUR SELECTED ESCAPE</span><h2>{selected.name}, {selected.region}</h2><p>{selected.description}</p><div className="trip-detail-meta"><span><MapPin size={14} /> {selected.region}</span><span><Compass size={14} /> {selected.duration}</span></div></div></div>
    </section>
    <aside className="panel redemption-panel"><div className="redemption-heading"><span className="redemption-icon"><Sparkles size={18} /></span><span><h2>Make it yours</h2><small>Demo booking summary</small></span><span className="demo-mini">DEMO</span></div><div className="price-breakdown"><div><span>{selected.name} getaway</span><strong>₹{selected.price.toLocaleString('en-IN')}</strong></div><div className="coin-control-label"><span>Use EcoCoins</span><span>100 EC = ₹50</span></div><div className="coin-input-row"><button onClick={() => setPoints(String(Math.max(0, Math.round((parsedPoints - 100) * 100) / 100)))} aria-label="Redeem 100 fewer EcoCoins" disabled={!validPoints || parsedPoints < 100}><Minus size={15} /></button><label className="coin-field"><input aria-label="EcoCoins to redeem" type="number" min="0" max={maxPoints} step="0.01" value={points} onChange={event => setPoints(event.target.value)} /><span>EC</span></label><button onClick={() => setPoints(String(Math.min(maxPoints, Math.round((parsedPoints + 100) * 100) / 100)))} aria-label="Redeem 100 more EcoCoins" disabled={!validPoints || parsedPoints >= maxPoints}><Plus size={15} /></button></div><div className="max-points-row"><span>Up to {maxPoints.toLocaleString('en-IN')} EC available</span><button onClick={() => setPoints(String(maxPoints))}>Use maximum</button></div>{!validPoints && <div className="redemption-error">Enter up to {maxPoints.toLocaleString('en-IN')} EC, within your available balance.</div>}<div className="discount-row"><span>EcoCoin trip discount</span><strong>− ₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div><div className="payable-row"><span>You pay <small>DEMO</small></span><strong>₹{payable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div><div className="eligible-note">Your discount can’t exceed the eligible trip price.</div></div><button className="button button-primary full-button booking-button" onClick={confirmBooking} disabled={!validPoints}><span>Confirm demo booking</span><ArrowRight size={16} /></button><div className="booking-protection"><Check size={14} /> EcoCoins are only deducted after confirmation.</div></aside></div>
    {receipt && <div className="dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setReceipt(null); }}><div className="receipt-dialog booking-receipt" role="dialog" aria-modal="true" aria-labelledby="booking-receipt-title"><button className="dialog-close" onClick={() => setReceipt(null)} aria-label="Close booking receipt"><X size={19} /></button><div className="receipt-success"><TicketCheck size={29} /></div><div className="eyebrow">DEMO BOOKING CREATED</div><h2 id="booking-receipt-title">A little getaway is on the list.</h2><p>This is a demo booking only. Nothing has been reserved or charged.</p><div className="booking-receipt-place"><MapPin size={16} /><strong>{receipt.destination}</strong><span>DEMO BOOKING</span></div><div className="receipt-details"><span>Booking ID <strong>{receipt.id}</strong></span><span>Example trip price <strong>₹{receipt.price.toLocaleString('en-IN')}</strong></span><span>EcoCoins redeemed <strong>{receipt.points.toLocaleString('en-IN')} EC (₹{(receipt.points * .5).toFixed(2)})</strong></span><span>Example payable <strong>₹{receipt.payable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span></div><button className="button button-primary full-button" onClick={() => setReceipt(null)}>All set <Check size={16} /></button></div></div>}
  </div>;
}
