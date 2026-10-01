'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  Package, FileText, CheckCircle, AlertTriangle, TrendingUp,
  Clock, ArrowRight, ShieldCheck, Globe, RefreshCw,
  ChevronUp, ChevronDown, Filter, ArrowUpRight
} from 'lucide-react';
import { BATCHES, TASKS, DOCUMENTS, BUYER_REQUESTS, READINESS_HISTORY, EXPORT_VOLUME, DOC_STATUS_COUNTS } from '@/lib/data';

// ─── helpers ────────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  'Ready': 'bg-green-100 text-green-800 border-green-200',
  'Almost ready': 'bg-amber-100 text-amber-800 border-amber-200',
  'Missing docs': 'bg-red-100 text-red-800 border-red-200',
  'In progress': 'bg-stone text-charcoal/80 border-charcoal/20',
  'Submitted': 'bg-blue-100 text-blue-800 border-blue-200',
};

function ReadinessBar({ value }: { value: number }) {
  const color = value >= 90 ? '#D97706' : value >= 70 ? '#F59E0B' : '#ef4444'; // Terracotta theme
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-cream-dark rounded-full overflow-hidden border border-sand">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-charcoal w-7 text-right font-sans">{value}%</span>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, bg, delta, href }: {
  label: string; value: string; sub: string; icon: React.ComponentType<{className?: string}>;
  color: string; bg: string; delta?: number; href?: string;
}) {
  const content = (
    <div className={`bg-white p-5 rounded-lg border border-sand shadow-sm flex items-start gap-4 hover:shadow-brutal transition-all group ${href ? 'cursor-pointer' : ''}`}>
      <div className={`p-3 rounded-lg ${bg} shrink-0 border border-sand`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-500 font-semibold font-sans">{label}</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <p className="text-2xl font-bold text-charcoal leading-none font-serif">{value}</p>
          {delta !== undefined && (
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${delta >= 0 ? 'text-terracotta' : 'text-red-500'}`}>
              {delta >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
        <p className="text-xs text-stone-400 mt-1">{sub}</p>
      </div>
      {href && <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-charcoal transition-colors mt-0.5" />}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-sand rounded-md px-3 py-2 shadow-brutal text-xs font-sans">
      <p className="font-semibold text-charcoal mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: <span className="font-serif font-semibold">{p.value}{p.unit || ''}</span></p>
      ))}
    </div>
  );
};

// ─── main ────────────────────────────────────────────────────────────────────
type SortKey = 'readiness' | 'product' | 'batch' | 'status';
type SortDir = 'asc' | 'desc';

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortKey, setSortKey] = useState<SortKey>('readiness');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [lastRefresh] = useState(() => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));

  const statuses = ['All', 'Almost ready', 'Missing docs', 'In progress', 'Submitted'];

  const filteredBatches = useMemo(() => {
    let list = [...BATCHES];
    if (statusFilter !== 'All') list = list.filter(b => b.status === statusFilter);
    list.sort((a, b) => {
      let av: string | number = sortKey === 'readiness' ? a.readiness : (a as any)[sortKey];
      let bv: string | number = sortKey === 'readiness' ? b.readiness : (b as any)[sortKey];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
    return list;
  }, [statusFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null;

  const avgReadiness = Math.round(BATCHES.reduce((s, b) => s + b.readiness, 0) / BATCHES.length);
  const highTasks = TASKS.filter(t => t.priority === 'High').length;
  const blockedRequests = BUYER_REQUESTS.filter(r => r.status === 'Blocked').length;
  const missingDocs = DOCUMENTS.filter(d => d.status === 'Missing').length;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <p className="text-xs text-terracotta font-bold uppercase tracking-wider mb-1">Apex Precision Components Pvt. Ltd.</p>
          <h1 className="text-3xl font-bold text-charcoal font-serif">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-0.5">Live compliance readiness overview</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400 flex items-center gap-1 font-medium"><RefreshCw className="w-3 h-3" /> Updated {lastRefresh}</span>
          <span className="bg-terracotta-light/10 border border-terracotta/30 text-terracotta-dark text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide">Demo Data</span>
          <Link href="/requests" className="bg-charcoal text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-terracotta transition-colors shadow-brutal flex items-center gap-2">
            <FileText className="w-4 h-4" /> Create compliance pack
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg. Compliance Readiness" value={`${avgReadiness}%`} sub="Across 8 active batches" icon={ShieldCheck} color="text-terracotta" bg="bg-terracotta-light/10" delta={8} href="/products" />
        <StatCard label="High Priority Tasks" value={`${highTasks}`} sub="Blocking submissions" icon={AlertTriangle} color="text-red-600" bg="bg-red-50" href="/missing" />
        <StatCard label="Blocked Buyer Requests" value={`${blockedRequests}`} sub="Awaiting evidence" icon={Clock} color="text-amber-600" bg="bg-amber-50" href="/requests" />
        <StatCard label="Missing Documents" value={`${missingDocs}`} sub="Across all batches" icon={FileText} color="text-charcoal-lighter" bg="bg-sand" href="/documents" />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Readiness trend */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-sand shadow-sm p-5 hover:border-charcoal/20 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-charcoal font-serif">Compliance Readiness Trend</h2>
              <p className="text-xs text-stone-400 mt-0.5">8-week rolling average</p>
            </div>
            <span className="flex items-center gap-1 text-terracotta text-xs font-bold border border-terracotta/20 bg-terracotta/5 px-2 py-1 rounded-md font-sans">
              <TrendingUp className="w-3 h-3" /> +26% since Aug
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={READINESS_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD3" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#78716C', fontFamily: 'var(--font-inter)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: '#78716C', fontFamily: 'var(--font-inter)' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Area type="monotone" dataKey="readiness" name="Readiness" stroke="#D97706" strokeWidth={2.5} fill="url(#readGrad)" dot={{ r: 4, fill: '#D97706', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} unit="%" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Document status pie */}
        <div className="bg-white rounded-lg border border-sand shadow-sm p-5 hover:border-charcoal/20 transition-colors">
          <h2 className="text-base font-bold text-charcoal mb-1 font-serif">Document Status</h2>
          <p className="text-xs text-stone-400 mb-3">47 documents total</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={DOC_STATUS_COUNTS} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value" stroke="none">
                {DOC_STATUS_COUNTS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CUSTOM_TOOLTIP />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {DOC_STATUS_COUNTS.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span className="text-stone-600 font-medium">{d.name}</span>
                </span>
                <span className="font-bold text-charcoal font-serif">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export volume bar chart */}
      <div className="bg-white rounded-lg border border-sand shadow-sm p-5 mb-6 hover:border-charcoal/20 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-charcoal font-serif">Monthly Export Volume</h2>
            <p className="text-xs text-stone-400 mt-0.5">₹ Lakhs · FY 2026–27</p>
          </div>
          <span className="text-xs font-bold text-charcoal border border-sand bg-cream-light px-2 py-1 rounded-md">₹34.7L in Sep</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={EXPORT_VOLUME} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#78716C', fontFamily: 'var(--font-inter)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#78716C', fontFamily: 'var(--font-inter)' }} axisLine={false} tickLine={false} unit="L" />
            <Tooltip content={<CUSTOM_TOOLTIP />} />
            <Bar dataKey="value" name="Export Value" fill="#1C1917" radius={[2, 2, 0, 0]} unit="L" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Batch table with filters & sort ── */}
      <div className="bg-white rounded-lg border border-sand shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-sand bg-cream-light flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-charcoal font-serif">Export Batches</h2>
            <p className="text-xs text-stone-400">{filteredBatches.length} of {BATCHES.length} shown</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-md text-xs font-bold border transition-all ${statusFilter === s ? 'bg-charcoal text-white border-charcoal shadow-brutal' : 'bg-white text-stone-600 border-sand hover:border-charcoal hover:text-charcoal'}`}
              >{s}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-cream-dark text-stone-500 text-xs font-bold uppercase tracking-wider border-b border-sand">
              <tr>
                <th className="px-5 py-3.5 cursor-pointer hover:text-charcoal transition-colors" onClick={() => handleSort('product')}>
                  <span className="flex items-center gap-1">Product <SortIcon k="product" /></span>
                </th>
                <th className="px-5 py-3.5 hidden md:table-cell cursor-pointer hover:text-charcoal transition-colors" onClick={() => handleSort('batch')}>
                  <span className="flex items-center gap-1">Batch <SortIcon k="batch" /></span>
                </th>
                <th className="px-5 py-3.5 hidden lg:table-cell">Buyer</th>
                <th className="px-5 py-3.5 cursor-pointer hover:text-charcoal transition-colors" onClick={() => handleSort('readiness')}>
                  <span className="flex items-center gap-1">Readiness <SortIcon k="readiness" /></span>
                </th>
                <th className="px-5 py-3.5 cursor-pointer hover:text-charcoal transition-colors" onClick={() => handleSort('status')}>
                  <span className="flex items-center gap-1">Status <SortIcon k="status" /></span>
                </th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-cream-light group transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-charcoal text-sm">{batch.product}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{batch.material}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="font-mono text-xs font-medium bg-sand/30 px-2 py-1 rounded border border-sand text-charcoal">{batch.batch}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-xs text-stone-500">{batch.buyer} · {batch.country}</td>
                  <td className="px-5 py-4 w-36"><ReadinessBar value={batch.readiness} /></td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-md border text-xs font-bold ${statusColors[batch.status] || 'bg-cream-dark text-stone-600 border-sand'}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={batch.passportHref} className="opacity-0 group-hover:opacity-100 transition-opacity text-terracotta text-xs font-bold flex items-center justify-end gap-1 hover:text-terracotta-dark">
                      Passport <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredBatches.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-stone-400 font-medium">No batches match the selected filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
