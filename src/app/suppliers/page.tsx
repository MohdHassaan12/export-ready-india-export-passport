'use client';
import { useState, useMemo } from 'react';
import { Users, MapPin, FileText, CheckCircle, AlertTriangle, Clock, Plus, Search, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { SUPPLIERS } from '@/lib/data';
import type { SupplierStatus } from '@/lib/data';

const statusConfig: Record<SupplierStatus, { color: string; icon: React.ComponentType<{className?: string}>; bar: string }> = {
  'Verified': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, bar: '#22c55e' },
  'Needs review': { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle, bar: '#f59e0b' },
  'Expiring soon': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock, bar: '#f97316' },
};

export default function Suppliers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SupplierStatus | 'All'>('All');
  const [showChart, setShowChart] = useState(false);

  const filtered = useMemo(() => {
    return SUPPLIERS.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const spendData = SUPPLIERS.map(s => ({
    name: s.name.split(' ').slice(0, 2).join(' '),
    spend: parseFloat((s.spendValue / 100000).toFixed(1)),
    color: statusConfig[s.status as SupplierStatus].bar,
  })).sort((a, b) => b.spend - a.spend);

  const totSpend = SUPPLIERS.reduce((s, sup) => s + sup.spendValue, 0);
  const statusCounts = { Verified: 0, 'Needs review': 0, 'Expiring soon': 0 };
  SUPPLIERS.forEach(s => { statusCounts[s.status as keyof typeof statusCounts]++; });

  const CUSTOM_TOOLTIP = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-charcoal/20 rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold text-charcoal/80">{payload[0]?.payload?.name}</p>
        <p className="text-charcoal/60 mt-0.5">₹{payload[0]?.value}L / yr</p>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
        <div>
          <p className="text-xs text-charcoal/40 font-semibold uppercase tracking-wider mb-1">Supply Chain</p>
          <h1 className="text-2xl font-bold text-charcoal">Suppliers</h1>
          <p className="text-charcoal/60 text-sm mt-0.5">Total annual spend: ₹{(totSpend / 100000).toFixed(1)}L across {SUPPLIERS.length} partners</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="demo-badge bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Demo Data</span>
          <button onClick={() => setShowChart(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${showChart ? 'bg-charcoal text-white border-slate-900' : 'bg-white text-charcoal/80 border-charcoal/20 hover:border-charcoal/40'}`}>
            <BarChart2 className="w-4 h-4" /> {showChart ? 'Hide chart' : 'Spend chart'}
          </button>
          <button className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add supplier
          </button>
        </div>
      </div>

      {/* Status summary */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={() => setStatusFilter('All')}
          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${statusFilter === 'All' ? 'bg-charcoal text-white border-slate-900' : 'bg-stone text-charcoal/80 border-charcoal/20'}`}>
          All ({SUPPLIERS.length})
        </button>
        {(Object.entries(statusCounts) as [SupplierStatus, number][]).map(([s, count]) => {
          const cfg = statusConfig[s];
          return (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${statusFilter === s ? cfg.color + ' ring-2 ring-offset-1 ring-current' : cfg.color}`}>
              <cfg.icon className="w-3 h-3" /> {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Spend chart */}
      {showChart && (
        <div className="bg-white rounded-xl border border-charcoal/20 shadow-sm p-5 mb-5">
          <h3 className="text-sm font-bold text-charcoal mb-3">Annual Spend by Supplier (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={spendData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="L" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                {spendData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search supplier name, role, location…"
          className="w-full pl-9 pr-3 py-2.5 text-sm border border-charcoal/20 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-charcoal/30 transition" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-charcoal/20 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand text-charcoal/60 text-xs font-semibold uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3">Supplier</th>
              <th className="px-5 py-3 hidden md:table-cell">Role</th>
              <th className="px-5 py-3 hidden lg:table-cell">Location</th>
              <th className="px-5 py-3 text-center">Docs</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 hidden xl:table-cell">Since</th>
              <th className="px-5 py-3 hidden xl:table-cell text-right">Annual Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {filtered.map(supplier => {
              const cfg = statusConfig[supplier.status as SupplierStatus];
              const Icon = cfg.icon;
              return (
                <tr key={supplier.id} className="hover:bg-sand group cursor-pointer transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-charcoal/70">{supplier.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">{supplier.name}</p>
                        <p className="text-xs text-charcoal/40 mt-0.5">{supplier.contact}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-sm text-charcoal/70">{supplier.role}</td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-xs text-charcoal/60"><MapPin className="w-3 h-3" />{supplier.location}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-stone text-charcoal/80 text-xs font-semibold px-2 py-1 rounded-md border border-charcoal/20">
                      <FileText className="w-3 h-3" />{supplier.docs}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${cfg.color}`}>
                      <Icon className="w-3 h-3" />{supplier.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell text-xs text-charcoal/60">{supplier.since}</td>
                  <td className="px-5 py-4 hidden xl:table-cell text-right">
                    <span className="font-bold text-charcoal/80 text-sm">{supplier.spend}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-charcoal/40 py-10">No suppliers match your filters.</p>
        )}
      </div>
      <p className="text-xs text-charcoal/40 mt-4 text-center">Demo data — fictional suppliers.</p>
    </div>
  );
}
