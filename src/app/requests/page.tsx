'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FileText, Calendar, Clock, AlertTriangle, ArrowRight, Plus, Filter } from 'lucide-react';
import { BUYER_REQUESTS } from '@/lib/data';

type FilterStatus = 'All' | 'Blocked' | 'In progress' | 'Almost ready' | 'Submitted';

const statusColors: Record<string, string> = {
  'In progress': 'bg-amber-100 text-amber-800 border-amber-200',
  'Blocked': 'bg-red-100 text-red-800 border-red-200',
  'Almost ready': 'bg-green-100 text-green-800 border-green-200',
  'Submitted': 'bg-blue-100 text-blue-800 border-blue-200',
};

function ReadinessBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-green-500' : value >= 70 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-stone rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-bold text-charcoal/70 w-7 text-right">{value}%</span>
    </div>
  );
}

export default function Requests() {
  const [filter, setFilter] = useState<FilterStatus>('All');

  const statuses: FilterStatus[] = ['All', 'Blocked', 'In progress', 'Almost ready', 'Submitted'];
  const filtered = filter === 'All' ? BUYER_REQUESTS : BUYER_REQUESTS.filter(r => r.status === filter);

  const counts: Record<string, number> = {};
  BUYER_REQUESTS.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
        <div>
          <p className="text-xs text-charcoal/40 font-semibold uppercase tracking-wider mb-1">Compliance</p>
          <h1 className="text-2xl font-bold text-charcoal">Buyer Requests</h1>
          <p className="text-charcoal/60 text-sm mt-0.5">Compliance evidence requests from international buyers</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="demo-badge bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Demo Data</span>
          <button className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New request
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <Filter className="w-4 h-4 text-charcoal/40 mt-1.5" />
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${filter === s ? 'bg-charcoal text-white border-slate-900' : 'bg-white text-charcoal/70 border-charcoal/20 hover:border-charcoal/40'}`}>
            {s}{s !== 'All' && counts[s] ? ` (${counts[s]})` : s === 'All' ? ` (${BUYER_REQUESTS.length})` : ''}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map(req => (
          <div key={req.id}
            className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all ${req.status === 'Blocked' ? 'border-red-200' : 'border-charcoal/20'}`}>
            {/* Card header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xl">{req.flag}</span>
                  <h2 className="text-base font-bold text-charcoal">{req.buyer}</h2>
                  <span className="text-sm text-charcoal/40">{req.country}</span>
                </div>
                <p className="text-sm text-charcoal/60">
                  {req.product} · <span className="font-mono text-xs bg-stone px-1.5 py-0.5 rounded border border-charcoal/20 text-charcoal/70">{req.batch}</span>
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${statusColors[req.status] || ''}`}>{req.status}</span>
            </div>

            {/* Blocked alert */}
            {req.blockedBy && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 font-medium">Blocked: {req.blockedBy}</p>
              </div>
            )}

            {/* Meta row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-charcoal/40 font-semibold mb-1">Received</p>
                <p className="flex items-center gap-1 text-xs text-charcoal/80 font-medium"><Calendar className="w-3.5 h-3.5 text-charcoal/40" />{req.received}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal/40 font-semibold mb-1">Deadline</p>
                <p className={`flex items-center gap-1 text-xs font-medium ${req.status === 'Blocked' ? 'text-red-600' : 'text-charcoal/80'}`}>
                  <Clock className="w-3.5 h-3.5" />{req.deadline}
                </p>
              </div>
              <div>
                <p className="text-xs text-charcoal/40 font-semibold mb-1">Readiness</p>
                <ReadinessBar value={req.readiness} />
              </div>
            </div>

            {/* Required docs */}
            <div className="mb-4">
              <p className="text-xs text-charcoal/40 font-semibold mb-2">Required documents</p>
              <div className="flex flex-wrap gap-2">
                {req.requirements.map((r, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-stone text-charcoal/70 border border-charcoal/20 px-2 py-1 rounded-md font-medium">
                    <FileText className="w-3 h-3" />{r}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-charcoal/10">
              <Link href={req.passportHref}
                className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors">
                View Passport <ArrowRight className="w-4 h-4" />
              </Link>
              {req.status === 'Blocked' || req.status === 'In progress' ? (
                <Link href="/missing"
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors">
                  Resolve missing evidence
                </Link>
              ) : null}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-charcoal/40 text-sm">No requests match the selected filter.</div>
        )}
      </div>
      <p className="text-xs text-charcoal/40 mt-5 text-center">Demo data — fictional buyer requests.</p>
    </div>
  );
}
