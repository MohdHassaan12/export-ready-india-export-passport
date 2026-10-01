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
  'In progress': 'bg-slate-100 text-slate-700 border-slate-200',
  'Submitted': 'bg-blue-100 text-blue-800 border-blue-200',
};

function ReadinessBar({ value }: { value: number }) {
  const color = value >= 90 ? '#22c55e' : value >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-slate-600 w-7 text-right">{value}%</span>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, bg, delta, href }: {
  label: string; value: string; sub: string; icon: React.ComponentType<{className?: string}>;
  color: string; bg: string; delta?: number; href?: string;
}) {
  const content = (
    <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-all group ${href ? 'cursor-pointer' : ''}`}>
      <div className={`p-3 rounded-xl ${bg} shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-semibold">{label}</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
          {delta !== undefined && (
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {delta >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {Math.abs(delta)}%
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
      </div>
      {href && <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-0.5" />}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}{p.unit || ''}</p>
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Apex Precision Components Pvt. Ltd.</p>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Live compliance readiness overview</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Updated {lastRefresh}</span>
          <span className="demo-badge bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ml-2">Demo Data</span>
          <Link href="/requests" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2 ml-2">
            <FileText className="w-4 h-4" /> Create compliance pack
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg. Compliance Readiness" value={`${avgReadiness}%`} sub="Across 8 active batches" icon={ShieldCheck} color="text-green-600" bg="bg-green-50" delta={8} href="/products" />
        <StatCard label="High Priority Tasks" value={`${highTasks}`} sub="Blocking submissions" icon={AlertTriangle} color="text-red-600" bg="bg-red-50" href="/missing" />
        <StatCard label="Blocked Buyer Requests" value={`${blockedRequests}`} sub="Awaiting evidence" icon={Clock} color="text-orange-600" bg="bg-orange-50" href="/requests" />
        <StatCard label="Missing Documents" value={`${missingDocs}`} sub="Across all batches" icon={FileText} color="text-amber-600" bg="bg-amber-50" href="/documents" />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Readiness trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Compliance Readiness Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">8-week rolling average</p>
            </div>
            <span className="flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +26% since Aug
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={READINESS_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Area type="monotone" dataKey="readiness" name="Readiness" stroke="#22c55e" strokeWidth={2.5} fill="url(#readGrad)" dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} unit="%" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Document status pie */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Document Status</h2>
          <p className="text-xs text-slate-400 mb-3">47 documents total</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={DOC_STATUS_COUNTS} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                {DOC_STATUS_COUNTS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CUSTOM_TOOLTIP />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {DOC_STATUS_COUNTS.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </span>
                <span className="font-semibold text-slate-800">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export volume bar chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Monthly Export Volume</h2>
            <p className="text-xs text-slate-400 mt-0.5">₹ Lakhs · FY 2026–27</p>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">₹34.7L in Sep</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={EXPORT_VOLUME} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="L" />
            <Tooltip content={<CUSTOM_TOOLTIP />} />
            <Bar dataKey="value" name="Export Value" fill="#6366f1" radius={[4, 4, 0, 0]} unit="L" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Batch table with filters & sort ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Export Batches</h2>
            <p className="text-xs text-slate-400">{filteredBatches.length} of {BATCHES.length} shown</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${statusFilter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
              >{s}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 cursor-pointer hover:text-slate-800" onClick={() => handleSort('product')}>
                  <span className="flex items-center gap-1">Product <SortIcon k="product" /></span>
                </th>
                <th className="px-5 py-3 hidden md:table-cell cursor-pointer hover:text-slate-800" onClick={() => handleSort('batch')}>
                  <span className="flex items-center gap-1">Batch <SortIcon k="batch" /></span>
                </th>
                <th className="px-5 py-3 hidden lg:table-cell">Buyer</th>
                <th className="px-5 py-3 cursor-pointer hover:text-slate-800" onClick={() => handleSort('readiness')}>
                  <span className="flex items-center gap-1">Readiness <SortIcon k="readiness" /></span>
                </th>
                <th className="px-5 py-3 cursor-pointer hover:text-slate-800" onClick={() => handleSort('status')}>
                  <span className="flex items-center gap-1">Status <SortIcon k="status" /></span>
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50 group transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900 text-sm">{batch.product}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{batch.material}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-600">{batch.batch}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-xs text-slate-500">{batch.buyer} · {batch.country}</td>
                  <td className="px-5 py-3.5 w-36"><ReadinessBar value={batch.readiness} /></td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-md border text-xs font-semibold ${statusColors[batch.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={batch.passportHref} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-700">
                      Passport <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredBatches.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">No batches match the selected filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
