'use client';
import { useState, useMemo } from 'react';
import { AlertCircle, Calendar, Send, Check, Clock, User, Filter, ChevronDown } from 'lucide-react';
import { TASKS } from '@/lib/data';
import type { Priority } from '@/lib/data';

const priorityConfig: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-slate-100 text-slate-600 border-slate-200',
};

const statusCfg: Record<string, string> = {
  Pending: 'bg-slate-100 text-slate-600 border-slate-200',
  'Under Review': 'bg-blue-100 text-blue-700 border-blue-200',
  Overdue: 'bg-red-100 text-red-700 border-red-200',
  'Expiring soon': 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function MissingEvidence() {
  const [sent, setSent] = useState<Set<number>>(new Set());
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [ownerFilter, setOwnerFilter] = useState<'All' | 'Supplier' | 'Internal'>('All');

  const filtered = useMemo(() => {
    return TASKS.filter(t => {
      const matchP = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchO = ownerFilter === 'All' || t.ownerType === ownerFilter;
      return matchP && matchO;
    }).sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
    });
  }, [priorityFilter, ownerFilter]);

  const handleSend = (id: number) => {
    const task = TASKS.find(t => t.id === id);
    if (task) {
      setSent(prev => new Set([...prev, id]));
      navigator.clipboard.writeText(
        `URGENT: Missing compliance evidence\n\nPlease provide: ${task.doc}\nProduct: ${task.product}\nBatch: ${task.batch}\nDeadline: ${task.due}\n\nContact: compliance@apexprecision.in`
      );
    }
  };

  const highCount = TASKS.filter(t => t.priority === 'High').length;
  const overdueCount = TASKS.filter(t => t.status === 'Overdue').length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{TASKS.length} actions required before submission</h1>
          <p className="text-slate-500 text-sm mt-0.5">Multiple buyer requests are blocked by missing evidence.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-semibold">{highCount} high priority</span>
            {overdueCount > 0 && <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold">{overdueCount} overdue</span>}
            <span className="demo-badge px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-bold uppercase">Demo Data</span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Priority:</span>
        {(['All', 'High', 'Medium', 'Low'] as const).map(p => (
          <button key={p} onClick={() => setPriorityFilter(p)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${priorityFilter === p
              ? (p === 'High' ? 'bg-red-600 text-white border-red-600' : p === 'Medium' ? 'bg-amber-500 text-white border-amber-500' : p === 'Low' ? 'bg-slate-600 text-white border-slate-600' : 'bg-slate-900 text-white border-slate-900')
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}>
            {p}
          </button>
        ))}
        <span className="text-xs font-semibold text-slate-500 ml-3">Owner:</span>
        {(['All', 'Supplier', 'Internal'] as const).map(o => (
          <button key={o} onClick={() => setOwnerFilter(o)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${ownerFilter === o ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
            {o}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} of {TASKS.length} shown</span>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.map(task => (
          <div key={task.id}
            className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md ${task.status === 'Overdue' ? 'border-red-200 bg-red-50/30' : 'border-slate-200'}`}>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded border text-xs font-bold uppercase ${priorityConfig[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${statusCfg[task.status] || ''}`}>
                  {task.status}
                </span>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{task.doc}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {task.product} · <span className="font-mono">{task.batch}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="font-semibold text-slate-700">{task.owner}</span>
                  <span className="text-slate-400">({task.ownerType})</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Due: <span className={`font-semibold ml-0.5 ${task.status === 'Overdue' ? 'text-red-600' : 'text-slate-700'}`}>{task.due}</span>
                </span>
              </div>
            </div>
            <button onClick={() => handleSend(task.id)} disabled={sent.has(task.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shrink-0 ${sent.has(task.id) ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-900 text-white hover:bg-slate-700 active:scale-95'}`}>
              {sent.has(task.id) ? <><Check className="w-4 h-4" /> Copied!</> : <><Send className="w-4 h-4" /> Send request</>}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No tasks match the selected filters.</div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-5 text-center">Demo data — fictional company and documents.</p>
    </div>
  );
}
