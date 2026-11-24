import { useState } from 'react';
import { ArrowRight, Check, CircleCheck, Info, LoaderCircle, Recycle, ShieldCheck, Weight, X } from 'lucide-react';
import { calculateCoins, coinsToRupees, WASTE_CATEGORIES } from '../config/rewards';
import { useDemo } from '../state/DemoContext';
import { useToast } from '../components/ToastContext';
import type { WasteCategory } from '../types';

type Receipt = { id: string; category: string; weight: number; coins: number; date: string };

export function RecyclePage() {
  const { rates, balance, machineStatus, addRecycle } = useDemo();
  const notify = useToast();
  const [category, setCategory] = useState<WasteCategory>('plastic');
  const [weight, setWeight] = useState('0.50');
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const selected = WASTE_CATEGORIES.find(item => item.id === category)!;
  const parsedWeight = Number(weight);
  const validWeight = Number.isFinite(parsedWeight) && parsedWeight > 0 && parsedWeight <= 50;
  const earned = validWeight ? calculateCoins(parsedWeight, rates[category]) : 0;

  function submit() {
    if (machineStatus !== 'Online') {
      notify('This demo machine is in maintenance mode.');
      return;
    }
    if (!validWeight) {
      notify('Enter a weight greater than 0 and no more than 50 kg.');
      return;
    }
    setProcessing(true);
    setComplete(false);
    window.setTimeout(() => {
      const transaction = addRecycle(category, parsedWeight, earned);
      setReceipt({ id: transaction.id, category: selected.name, weight: parsedWeight, coins: earned, date: transaction.date });
      setProcessing(false);
      setComplete(true);
      notify(`${earned.toLocaleString('en-IN')} EcoCoins added to your EcoCard.`);
    }, 1900);
  }

  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">ECOCOIN SIMULATOR <span className="demo-inline">DEMO</span></div><h1>Give your waste a <em>second life.</em></h1><p>Choose a material, enter its sample weight, and see your rewards take shape.</p></div></div>
    <div className="demo-alert"><Info size={17} /><span><strong>Simulation mode.</strong> Material detection and weight are entered manually; no physical machine or sensors are connected.</span></div>
    <div className="recycle-layout">
      <section className={`machine-card ${processing ? 'is-processing' : ''}`}>
        <div className="machine-card-header"><div><span className={`online-indicator ${machineStatus === 'Maintenance' ? 'offline' : ''}`} /> MACHINE STATUS <strong>{machineStatus === 'Online' ? 'Online · Ready' : 'Maintenance'}</strong></div><span className="machine-id">ECO · DEMO 001</span></div>
        <div className="machine-stage">
          <div className={`recycling-machine ${processing ? 'machine-working' : ''}`}>
            <div className="machine-top-cap" /><div className="machine-body"><div className="machine-face"><div className="machine-screen-ui"><span>{processing ? 'PROCESSING' : complete ? 'REWARD READY' : 'ECOCOIN SYSTEM'}</span><strong>{processing ? 'Sorting your<br/>materials…' : complete ? 'Nice work!' : 'Recycle for<br/>a little more.'}</strong><div className="screen-indicator"><i /><i /><i /></div></div><div className="machine-slot-bar" /><div className="machine-brand-line"><span>✳</span> ecocoin <b>DEMO</b></div></div><div className="machine-side"><span /><span /><span /><i>SIMULATION</i></div></div>
            <div className="machine-base-block" />
          </div>
          {processing && <div className="processing-orbit"><span /><span /><span /><span /></div>}
          {!processing && <div className="machine-stage-note"><span className="note-check"><Check size={14} /></span> {complete ? 'Deposit simulated successfully' : 'Ready when you are'}</div>}
        </div>
        <div className="machine-footer"><span><ShieldCheck size={15} /> Simulated readings</span><span><span className={`online-indicator ${machineStatus === 'Maintenance' ? 'offline' : ''}`} /> {machineStatus === 'Online' ? 'System ready' : 'Unavailable'}</span></div>
      </section>
      <section className="panel deposit-panel">
        <div className="panel-heading"><div><h2>Start a deposit</h2><p>Select what you’re recycling today.</p></div><div className="deposit-step">01 <span>/ 02</span></div></div>
        <div className="form-label-row"><label>WASTE CATEGORY</label><span>Rates per kg</span></div>
        <div className="waste-options">{WASTE_CATEGORIES.map(item => <button key={item.id} className={`waste-option ${category === item.id ? 'selected' : ''}`} onClick={() => { setCategory(item.id); setComplete(false); }} aria-pressed={category === item.id}><span className={`waste-glyph glyph-${item.id}`}>{item.icon}</span><span className="waste-copy"><strong>{item.name}</strong><small>{item.detail}</small></span><span className="waste-rate">{rates[item.id]}<small> EC/kg</small>{item.id !== 'plastic' && <i>DEMO RATE</i>}</span><span className="select-check">{category === item.id ? <Check size={14} /> : null}</span></button>)}</div>
        <div className="weight-label"><label htmlFor="sample-weight">SAMPLE WEIGHT</label><span>Up to 50 kg</span></div>
        <div className={`weight-control ${weight && !validWeight ? 'invalid' : ''}`}><Weight size={17} /><input id="sample-weight" inputMode="decimal" type="number" min="0.01" max="50" step="0.01" value={weight} onChange={event => { setWeight(event.target.value); setComplete(false); }} aria-describedby="weight-hint" /><span>kg</span></div>
        <div id="weight-hint" className={`field-hint ${weight && !validWeight ? 'error-text' : ''}`}>{weight && !validWeight ? 'Please enter a weight between 0.01 and 50 kg.' : 'Decimals welcome — try 0.25 kg or 1.75 kg.'}</div>
        <div className="reward-calculation"><div><span>Your reward</span><small>{validWeight ? `${parsedWeight.toFixed(2)} kg × ${rates[category]} EC/kg` : 'Enter a valid sample weight'}</small></div><strong>{earned.toLocaleString('en-IN')} <i>EC</i></strong><span className="reward-inr">≈ ₹{coinsToRupees(earned).toFixed(2)}</span></div>
        <button className="button button-primary submit-deposit" onClick={submit} disabled={!validWeight || processing || machineStatus !== 'Online'}>{processing ? <><LoaderCircle className="spin" size={18} /> Processing simulated deposit…</> : <><Recycle size={17} /> {complete ? 'Simulate another deposit' : 'Confirm demo deposit'} <ArrowRight size={16} /></>}</button>
        <div className="available-balance"><span>Your EcoCard balance</span><strong>{balance.toLocaleString('en-IN')} EC <span>→</span> {(balance + earned).toLocaleString('en-IN')} EC</strong></div>
      </section>
    </div>
    <section className="how-machine-works"><div className="eyebrow">A SIMPLE THREE-STEP DEMO</div><div className="mini-steps"><div><b>1</b><span><strong>Select a material</strong><small>Every category has its own demo rate.</small></span></div><div><b>2</b><span><strong>Enter sample weight</strong><small>Use any positive decimal up to 50 kg.</small></span></div><div><b>3</b><span><strong>Get your EcoCoins</strong><small>Your simulated balance updates instantly.</small></span></div></div></section>
    {receipt && <div className="dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setReceipt(null); }}><div className="receipt-dialog" role="dialog" aria-modal="true" aria-labelledby="receipt-title"><button className="dialog-close" onClick={() => setReceipt(null)} aria-label="Close receipt"><X size={19} /></button><div className="receipt-success"><CircleCheck size={31} /></div><div className="eyebrow">DEMO TRANSACTION COMPLETE</div><h2 id="receipt-title">Nice work, {receipt.weight.toFixed(2)} kg recycled.</h2><p>Your demo EcoCoins have been credited to your EcoCard.</p><div className="receipt-coin-total">+{receipt.coins.toLocaleString('en-IN')} <small>EC</small></div><div className="receipt-details"><span>Transaction ID <strong>{receipt.id}</strong></span><span>Material <strong>{receipt.category}</strong></span><span>Reward value <strong>₹{coinsToRupees(receipt.coins).toFixed(2)}</strong></span><span>Date & time <strong>{new Date(receipt.date).toLocaleString('en-IN')}</strong></span></div><button className="button button-primary full-button" onClick={() => setReceipt(null)}>Done <Check size={16} /></button><small className="receipt-footnote">Simulation only · No actual waste has been weighed.</small></div></div>}
  </div>;
}
