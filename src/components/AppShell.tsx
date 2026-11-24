import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, CircleHelp, Compass, CreditCard, Grid2X2, History, Leaf, Menu, Recycle, Settings2, Wallet, X } from 'lucide-react';
import { Brand } from './Brand';
import { useDemo } from '../state/DemoContext';
import { ToastProvider } from './ToastContext';

const links = [
  { to: '/dashboard', label: 'Overview', icon: Grid2X2 },
  { to: '/recycle', label: 'Smart recycling', icon: Recycle },
  { to: '/wallet', label: 'Eco wallet', icon: Wallet },
  { to: '/ecocard', label: 'My EcoCard', icon: CreditCard },
  { to: '/travel', label: 'Travel & rewards', icon: Compass },
  { to: '/history', label: 'Activity history', icon: History },
];
const titles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/recycle': 'Smart recycling',
  '/wallet': 'Eco wallet',
  '/ecocard': 'My EcoCard',
  '/travel': 'Travel & rewards',
  '/history': 'Activity history',
  '/settings': 'Demo settings',
};

export function AppShell() {
  const { profile, balance } = useDemo();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  return <ToastProvider><div className="app-shell">
    {open && <button className="mobile-backdrop" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><Brand /><button className="mobile-close icon-button" onClick={() => setOpen(false)} aria-label="Close menu"><X size={19} /></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{to === '/wallet' && <span className="nav-balance">{balance.toLocaleString('en-IN')}</span>}</NavLink>)}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-promo"><div className="promo-icon"><Leaf size={18} /></div><strong>One small action,<br />a greener getaway.</strong><p>Your next trip starts here.</p><NavLink to="/recycle" onClick={() => setOpen(false)}>Recycle now <span>↗</span></NavLink></div>
      <NavLink to="/settings" onClick={() => setOpen(false)} className={({ isActive }) => `nav-link settings-link ${isActive ? 'active' : ''}`}><Settings2 size={18} /><span>Demo settings</span></NavLink>
      <button className="help-link" onClick={() => window.alert('EcoCoin is a frontend-only demonstration. All machine activity and bookings are simulated.') }><CircleHelp size={17} /> Help & demo info</button>
      <div className="sidebar-profile"><span className="avatar">{profile.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><span><strong>{profile.name}</strong><small>EcoCoin member</small></span><ChevronDown size={16} className="profile-chevron" /></div>
    </aside>
    <div className="main-column">
      <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="breadcrumbs"><span>EcoCoin</span><b>/</b><strong>{titles[location.pathname] ?? 'Overview'}</strong></div><div className="topbar-actions"><span className="demo-badge"><span /> DEMO ENVIRONMENT</span><button className="icon-button notification-button" aria-label="Notifications" onClick={() => window.alert('You’re all caught up. Keep recycling to earn more EcoCoins!')}><Bell size={18} /><i /></button><span className="top-avatar">{profile.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span></div></header>
      <motion.main key={location.pathname} className="page-content" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}><Outlet /></motion.main>
    </div>
  </div></ToastProvider>;
}
