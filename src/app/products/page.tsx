'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Package, ArrowRight, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { BATCHES } from '@/lib/data';

const statusColors: Record<string, string> = {
  'Ready': 'text-green-700 bg-green-50 border-green-200',
  'Almost ready': 'text-amber-700 bg-amber-50 border-amber-200',
  'Missing docs': 'text-red-700 bg-red-50 border-red-200',
  'In progress': 'text-charcoal/80 bg-sand border-charcoal/20',
  'Submitted': 'text-blue-700 bg-blue-50 border-blue-200',
};

function ReadinessBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-green-500' : value >= 70 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-stone rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-bold text-charcoal/70 w-7 text-right">{value}%</span>
    </div>
  );
}

type ViewMode = 'card' | 'table';

export default function Products() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  const statuses = ['All', 'Almost ready', 'Missing docs', 'In progress', 'Submitted'];
  const countries = ['All', ...Array.from(new Set(BATCHES.map(b => b.country)))];

  const filtered = useMemo(() => {
    return BATCHES.filter(b => {
      const matchSearch = b.product.toLowerCase().includes(search.toLowerCase()) ||
        b.buyer.toLowerCase().includes(search.toLowerCase()) ||
        b.batch.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchCountry = countryFilter === 'All' || b.country === countryFilter;
      return matchSearch && matchStatus && matchCountry;
    });
  }, [search, statusFilter, countryFilter]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-xs text-charcoal/40 font-semibold uppercase tracking-wider mb-1">Products</p>
          <h1 className="text-2xl font-bold text-charcoal">Product Batches</h1>
          <p className="text-charcoal/60 text-sm mt-0.5">
            {filtered.length} of {BATCHES.length} batches · Avg readiness {Math.round(BATCHES.reduce((s, b) => s + b.readiness, 0) / BATCHES.length)}%
          </p>
        </div>
        <span className="demo-badge bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Demo Data</span>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-xl border border-charcoal/20 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search product, buyer, batch…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-charcoal/20 rounded-lg bg-sand focus:outline-none focus:ring-2 focus:ring-charcoal/30 focus:bg-white transition"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-charcoal/40" />
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter === s ? 'bg-charcoal text-white border-slate-900' : 'bg-white text-charcoal/70 border-charcoal/20 hover:border-charcoal/40'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Country filter */}
        <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}
          className="text-sm border border-charcoal/20 rounded-lg px-3 py-2 bg-sand text-charcoal/80 focus:outline-none focus:ring-2 focus:ring-charcoal/30">
          {countries.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* View toggle */}
        <div className="flex items-center bg-stone rounded-lg p-1 ml-auto">
          {(['card', 'table'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => setViewMode(v)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${viewMode === v ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/60 hover:text-charcoal/80'}`}>
              {v === 'card' ? '⊞ Cards' : '≡ Table'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Card view ── */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map(batch => (
            <div key={batch.id} className="bg-white rounded-xl border border-charcoal/20 shadow-sm p-5 hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-charcoal rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-bold text-charcoal">{batch.product}</h2>
                      <p className="text-xs text-charcoal/60 mt-0.5">{batch.buyer} · {batch.country}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md border text-xs font-semibold shrink-0 ${statusColors[batch.status] || ''}`}>
                      {batch.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-charcoal/40">
                    <span className="font-mono bg-stone px-2 py-0.5 rounded border border-charcoal/20 text-charcoal/70">{batch.batch}</span>
                    <span>{batch.qty}</span>
                    <span>{batch.material}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-charcoal/60">Compliance readiness</span>
                      <span className="text-xs text-charcoal/40">Updated {batch.lastUpdated}</span>
                    </div>
                    <ReadinessBar value={batch.readiness} />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-charcoal/10 flex justify-end">
                <Link href={batch.passportHref}
                  className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors">
                  View Passport <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Table view ── */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-charcoal/20 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand text-charcoal/60 text-xs font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3 hidden md:table-cell">Batch</th>
                <th className="px-5 py-3 hidden lg:table-cell">Buyer</th>
                <th className="px-5 py-3">Readiness</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {filtered.map(batch => (
                <tr key={batch.id} className="hover:bg-sand group transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-charcoal">{batch.product}</p>
                    <p className="text-xs text-charcoal/40">{batch.material} · {batch.qty}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="font-mono text-xs bg-stone px-2 py-1 rounded border border-charcoal/20">{batch.batch}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-xs text-charcoal/60">{batch.buyer} · {batch.country}</td>
                  <td className="px-5 py-3.5 w-36"><ReadinessBar value={batch.readiness} /></td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-md border text-xs font-semibold ${statusColors[batch.status] || ''}`}>{batch.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={batch.passportHref} className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 font-medium flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-sm text-charcoal/40 py-10">No batches match your filters.</p>
          )}
        </div>
      )}

      <p className="text-xs text-charcoal/40 mt-5 text-center">Demo data — fictional company and products.</p>
    </div>
  );
}
