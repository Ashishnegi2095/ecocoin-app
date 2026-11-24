import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const RecyclePage = lazy(() => import('./pages/RecyclePage').then(module => ({ default: module.RecyclePage })));
const WalletPage = lazy(() => import('./pages/WalletPage').then(module => ({ default: module.WalletPage })));
const EcoCardPage = lazy(() => import('./pages/EcoCardPage').then(module => ({ default: module.EcoCardPage })));
const TravelPage = lazy(() => import('./pages/TravelPage').then(module => ({ default: module.TravelPage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(module => ({ default: module.HistoryPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));

export default function App() {
  return <Suspense fallback={<div className="page-loading" role="status">Loading your EcoCoin experience…</div>}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/recycle" element={<RecyclePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/ecocard" element={<EcoCardPage />} />
        <Route path="/travel" element={<TravelPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>;
}
