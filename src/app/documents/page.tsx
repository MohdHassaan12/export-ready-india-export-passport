'use client';
import { useState, useMemo } from 'react';
import { FileText, CheckCircle, AlertTriangle, XCircle, Clock, Download, Search, Filter } from 'lucide-react';
import { DOCUMENTS } from '@/lib/data';
import type { DocStatus } from '@/lib/data';

const statusConfig: Record<DocStatus, { color: string; icon: React.ComponentType<{className?: string}> }> = {
  'Verified': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  'Expiring soon': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock },
  'Missing': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  'Partial': { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle },
};

const STATUS_OPTIONS: DocStatus[] = ['Verified', 'Expiring soon', 'Missing', 'Partial'];

export default function Documents() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', ...Array.from(new Set(DOCUMENTS.map(d => d.type)))];

  const filtered = useMemo(() => {
    return DOCUMENTS.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.product.toLowerCase().includes(search.toLowerCase()) ||
        d.supplier.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || d.status === statusFilter;
      const matchType = typeFilter === 'All' || d.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const counts = useMemo(() => {
    const out: Record<string, number> = { All: DOCUMENTS.length };
    DOCUMENTS.forEach(d => { out[d.status] = (out[d.status] || 0) + 1; });
    return out;
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-xs text-charcoal/40 font-semibold uppercase tracking-wider mb-1">Documents</p>
          <h1 className="text-2xl font-bold text-charcoal">Document Library</h1>
          <p className="text-charcoal/60 text-sm mt-0.5">{filtered.length} of {DOCUMENTS.length} documents shown</p>
        </div>
        <span className="demo-badge bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Demo Data</span>
      </div>

      {/* Status pills as filter toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setStatusFilter('All')}
          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${statusFilter === 'All' ? 'bg-charcoal text-white border-slate-900' : 'bg-stone text-charcoal/80 border-charcoal/20 hover:border-charcoal/40'}`}>
          All ({counts['All']})
        </button>
        {STATUS_OPTIONS.map(s => {
          const cfg = statusConfig[s];
          return (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${statusFilter === s ? cfg.color + ' font-bold ring-2 ring-offset-1 ring-current' : cfg.color}`}>
              <cfg.icon className="w-3 h-3" /> {s} ({counts[s] || 0})
            </button>
          );
        })}
      </div>

      {/* Search + type filter */}
      <div className="bg-white rounded-xl border border-charcoal/20 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search document name, product, supplier…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-charcoal/20 rounded-lg bg-sand focus:outline-none focus:ring-2 focus:ring-charcoal/30 focus:bg-white transition" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="text-sm border border-charcoal/20 rounded-lg px-3 py-2 bg-sand text-charcoal/80 focus:outline-none focus:ring-2 focus:ring-charcoal/30">
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-charcoal/20 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand text-charcoal/60 text-xs font-semibold uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3">Document</th>
              <th className="px-5 py-3 hidden md:table-cell">Product</th>
              <th className="px-5 py-3 hidden lg:table-cell">Type</th>
              <th className="px-5 py-3 hidden xl:table-cell">Uploaded</th>
              <th className="px-5 py-3 hidden xl:table-cell">Expires</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {filtered.map(doc => {
              const cfg = statusConfig[doc.status as DocStatus];
              const Icon = cfg.icon;
              return (
                <tr key={doc.id} className="hover:bg-sand group transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 shrink-0 ${doc.status === 'Missing' ? 'text-red-400' : 'text-charcoal/40'}`} />
                      <div>
                        <p className="font-medium text-charcoal/90 text-sm leading-snug">{doc.name}</p>
                        <p className="text-xs text-charcoal/40">{doc.supplier} · {doc.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-xs text-charcoal/60">{doc.product}</td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-xs bg-stone text-charcoal/70 px-2 py-0.5 rounded font-medium border border-charcoal/20">{doc.type}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell text-xs text-charcoal/60">{doc.uploaded}</td>
                  <td className={`px-5 py-3.5 hidden xl:table-cell text-xs font-medium ${doc.status === 'Expiring soon' ? 'text-orange-600' : 'text-charcoal/60'}`}>{doc.expires}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-semibold ${cfg.color}`}>
                      <Icon className="w-3 h-3" /> {doc.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {doc.status !== 'Missing' && (
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-charcoal/40 hover:text-charcoal/80 p-1 rounded hover:bg-stone">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-charcoal/40 py-10">No documents match your filters.</p>
        )}
      </div>
      <p className="text-xs text-charcoal/40 mt-4 text-center">Demo data — fictional documents.</p>
    </div>
  );
}
