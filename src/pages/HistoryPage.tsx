import { useMemo, useState } from 'react';
import { CalendarDays, Download, Search, SlidersHorizontal, X } from 'lucide-react';
import { TransactionList } from '../components/TransactionList';
import { useDemo } from '../state/DemoContext';

type Filter = 'all' | 'recycling' | 'redemption' | 'booking';

export function HistoryPage() {
  const { transactions } = useDemo();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [period, setPeriod] = useState('all');
  const filtered = useMemo(() => {
    const now = Date.now();
    return transactions.filter(transaction => {
      const matchesType = filter === 'all' || transaction.type === filter;
      const text = `${transaction.id} ${transaction.description} ${transaction.category ?? ''}`.toLowerCase();
      const matchesQuery = text.includes(query.trim().toLowerCase());
      const age = now - new Date(transaction.date).getTime();
      const matchesDate = period === 'all' || (period === '30' ? age <= 30 * 86400000 : period === '90' ? age <= 90 * 86400000 : new Date(transaction.date).getMonth() === new Date().getMonth());
      return matchesType && matchesQuery && matchesDate;
    });
  }, [transactions, query, filter, period]);
  const counts: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All activity' }, { id: 'recycling', label: 'Recycling' }, { id: 'redemption', label: 'Redemptions' }, { id: 'booking', label: 'Bookings' },
  ];
  function exportCsv() {
    const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [['Transaction ID', 'Description', 'Type', 'Date', 'EcoCoins', 'Weight (kg)', 'Status'], ...filtered.map(item => [item.id, item.description, item.type, new Date(item.date).toLocaleString(), item.amount, item.weightKg ?? '', item.status])];
    const csv = rows.map(row => row.map(escape).join(',')).join('\r\n');
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.href = objectUrl;
    link.download = 'ecocoin-activity-demo.csv';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
  return <div className="page-stack">
    <div className="page-heading heading-with-action"><div><div className="eyebrow">EVERY LITTLE THING COUNTS</div><h1>Your activity</h1><p>A searchable record of demo recycling deposits, rewards and trip bookings.</p></div><button className="button button-outline" onClick={exportCsv} disabled={!filtered.length}><Download size={16} /> Export CSV</button></div>
    <section className="panel history-panel"><div className="history-toolbar"><div className="history-search"><Search size={17} /><input type="search" placeholder="Search by activity or ID…" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search transaction history" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}</div><label className="history-period"><CalendarDays size={15} /><select value={period} onChange={event => setPeriod(event.target.value)} aria-label="Filter by date"><option value="all">Any time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="month">This month</option></select></label></div>
      <div className="history-filter-tabs" role="group" aria-label="Filter transactions">{counts.map(item => <button key={item.id} className={filter === item.id ? 'selected' : ''} onClick={() => setFilter(item.id)}>{item.label}<span>{transactions.filter(transaction => item.id === 'all' || transaction.type === item.id).length}</span></button>)}</div>
      <div className="history-results-label"><span><SlidersHorizontal size={14} /> {filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span><span>Showing newest first</span></div>
      <TransactionList transactions={filtered} />
    </section>
  </div>;
}
