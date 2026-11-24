import { useState } from 'react';
import { AlertTriangle, Check, RotateCcw, Save, Settings2, ShieldAlert, SlidersHorizontal, UserRound } from 'lucide-react';
import { WASTE_CATEGORIES } from '../config/rewards';
import { useDemo } from '../state/DemoContext';
import { useToast } from '../components/ToastContext';
import type { MachineStatus, WasteCategory } from '../types';

export function SettingsPage() {
  const { profile, rates, machineStatus, updateProfile, updateRate, setMachineStatus, resetDemo } = useDemo();
  const notify = useToast();
  const [name, setName] = useState(profile.name);
  const [initialBalance, setInitialBalance] = useState('1240');
  const saveName = () => {
    const clean = name.trim();
    if (!clean || clean.length > 50) {
      notify('Enter a name between 1 and 50 characters.');
      return;
    }
    updateProfile(clean);
    notify('Demo profile updated.');
  };
  function resetWithBalance() {
    const amount = Number(initialBalance);
    if (!Number.isFinite(amount) || amount < 0 || amount > 1000000) {
      notify('Initial balance must be between 0 and 1,000,000 EC.');
      return;
    }
    if (window.confirm(`Reset demo data and set the starting balance to ${amount.toLocaleString('en-IN')} EC? Your demo history will be restored to its original state.`)) {
      resetDemo(amount);
      setName('Aarav Sharma');
      notify('Demo data restored with your chosen starting balance.');
    }
  }
  function resetDefault() {
    if (window.confirm('Restore all original demo data, balances and settings? This replaces saved demo activity in this browser.')) {
      resetDemo();
      setName('Aarav Sharma');
      setInitialBalance('1240');
      notify('Original EcoCoin demo data restored.');
    }
  }
  const machineOptions: MachineStatus[] = ['Online', 'Maintenance'];
  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow"><Settings2 size={13} /> LOCAL DEMO CONTROLS</div><h1>Demo settings</h1><p>Adjust this browser’s demo configuration. Changes are saved locally.</p></div></div>
    <div className="demo-alert settings-warning"><ShieldAlert size={18} /><span><strong>Demo administration only.</strong> These controls do not connect to, or control, any real recycling machine or service.</span></div>
    <div className="settings-layout">
      <section className="panel settings-card"><div className="settings-section-head"><span className="settings-icon"><UserRound size={18} /></span><div><h2>Demo member</h2><p>Update the name displayed across your EcoCoin account.</p></div></div><label className="settings-label" htmlFor="demo-name">MEMBER NAME</label><div className="settings-input-row"><input id="demo-name" maxLength={50} value={name} onChange={event => setName(event.target.value)} /><button className="button button-primary" onClick={saveName}><Save size={15} /> Save name</button></div></section>
      <section className="panel settings-card rates-settings"><div className="settings-section-head"><span className="settings-icon"><SlidersHorizontal size={18} /></span><div><h2>Demo reward rates</h2><p>EcoCoins awarded for each simulated kilogram.</p></div><span className="settings-demo-tag">DEMO RATES</span></div><div className="rates-list">{WASTE_CATEGORIES.map(item => <label className="rate-setting-row" key={item.id}><span className={`waste-glyph glyph-${item.id}`}>{item.icon}</span><span><strong>{item.name}</strong><small>{item.id === 'plastic' ? 'Primary plastic rate' : 'Example rate · Not officially confirmed'}</small></span><span className="rate-input-wrap"><input type="number" min="0" max="10000" step="1" value={rates[item.id]} aria-label={`${item.name} reward rate`} onChange={event => { const rate = Number(event.target.value); if (Number.isFinite(rate) && rate >= 0 && rate <= 10000) updateRate(item.id as WasteCategory, rate); }} /><small>EC / kg</small></span></label>)}</div><div className="settings-footnote"><Check size={14} /> Saved automatically in this browser. Plastic’s default is 100 EC/kg.</div></section>
      <section className="panel settings-card machine-settings"><div className="settings-section-head"><span className="settings-icon"><Settings2 size={18} /></span><div><h2>Simulated machine status</h2><p>Controls whether the deposit demo can be completed.</p></div></div><div className="machine-status-options">{machineOptions.map(option => <button key={option} className={`machine-status-option ${machineStatus === option ? 'chosen' : ''}`} onClick={() => { setMachineStatus(option); notify(`Demo machine set to ${option.toLowerCase()}.`); }}><span className={`online-indicator ${option === 'Maintenance' ? 'offline' : ''}`} /><span><strong>{option === 'Online' ? 'Online · Ready' : 'Maintenance'}</strong><small>{option === 'Online' ? 'Enable simulated recycling deposits.' : 'Pause simulated deposits.'}</small></span>{machineStatus === option && <Check size={17} />}</button>)}</div></section>
      <section className="panel settings-card reset-settings"><div className="settings-section-head"><span className="settings-icon"><RotateCcw size={18} /></span><div><h2>Reset demo data</h2><p>Restore the sample profile, balances and transaction history.</p></div></div><div className="initial-balance-field"><label htmlFor="initial-balance">STARTING BALANCE FOR RESET</label><div><input id="initial-balance" type="number" min="0" max="1000000" step="1" value={initialBalance} onChange={event => setInitialBalance(event.target.value)} /><span>EC</span></div><small>Only applies when restoring the demo, not to your current balance.</small></div><button className="button button-danger-outline" onClick={resetWithBalance}><RotateCcw size={15} /> Reset with this starting balance</button><button className="reset-default-button" onClick={resetDefault}>Restore original demo defaults</button></section>
    </div>
    <div className="settings-disclaimer"><AlertTriangle size={15} /><span>All demo data is stored in this browser’s LocalStorage and is not shared with a backend.</span></div>
  </div>;
}
