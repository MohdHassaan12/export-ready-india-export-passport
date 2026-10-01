import Link from 'next/link';
import { BookOpen, Download, Share2, CheckCircle, Clock, ArrowRight, Package, Globe } from 'lucide-react';

const packs = [
  {
    id: 1,
    name: 'EU CBAM Compliance Pack',
    product: 'SS 316 Pump Impeller',
    batch: 'BATCH-2026-0918',
    buyer: 'Müller Industrial Systems, DE',
    regulation: 'EU CBAM / EU ETS',
    created: '20 Sep 2026',
    status: 'Draft',
    statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
    docs: 6,
    missing: 1,
    passportHref: '/passport/APC-PUMP-316-042/BATCH-2026-0918',
  },
  {
    id: 2,
    name: 'ISO 9001 Quality Pack',
    product: 'Motor Bracket Assembly',
    batch: 'BATCH-2026-0901',
    buyer: 'Bosch Supplier Network, DE',
    regulation: 'ISO 9001:2015',
    created: '15 Sep 2026',
    status: 'Ready',
    statusColor: 'bg-green-100 text-green-800 border-green-200',
    docs: 4,
    missing: 0,
    passportHref: '/passport/MBA-007/BATCH-2026-0901',
  },
  {
    id: 3,
    name: 'BIS Compliance Pack',
    product: 'Hydraulic Fitting Set',
    batch: 'BATCH-2026-0887',
    buyer: 'Parker Hannifin, UK',
    regulation: 'BIS IS 319',
    created: '02 Sep 2026',
    status: 'Submitted',
    statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
    docs: 5,
    missing: 0,
    passportHref: '/passport/HFS-012/BATCH-2026-0887',
  },
  {
    id: 4,
    name: 'REACH / RoHS Declaration Pack',
    product: 'Precision Shaft Coupling',
    batch: 'BATCH-2026-0876',
    buyer: 'Siemens Procurement, DE',
    regulation: 'EU REACH / RoHS',
    created: '14 Sep 2026',
    status: 'In progress',
    statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
    docs: 3,
    missing: 2,
    passportHref: '/passport/PSC-019/BATCH-2026-0876',
  },
];

export default function CompliancePacks() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Compliance</p>
          <h1 className="text-2xl font-bold text-slate-900">Compliance Packs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Regulatory document bundles for each buyer and product batch</p>
        </div>
        <span className="demo-badge bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Demo Data</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packs.map((pack) => (
          <div key={pack.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${pack.statusColor}`}>{pack.status}</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">{pack.name}</h2>
            <p className="text-xs text-slate-500">{pack.product}</p>
            <p className="text-xs text-slate-400 font-mono mb-3">{pack.batch}</p>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
              <div>
                <p className="font-semibold text-slate-400 uppercase tracking-wide text-xs mb-0.5">Buyer</p>
                <p className="text-slate-700 font-medium">{pack.buyer}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400 uppercase tracking-wide text-xs mb-0.5">Regulation</p>
                <p className="text-slate-700 font-medium">{pack.regulation}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400 uppercase tracking-wide text-xs mb-0.5">Documents</p>
                <p className="text-slate-700 font-medium">{pack.docs} attached{pack.missing > 0 && <span className="text-red-600 ml-1">· {pack.missing} missing</span>}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-400 uppercase tracking-wide text-xs mb-0.5">Created</p>
                <p className="text-slate-700 font-medium">{pack.created}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={pack.passportHref} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" /> View Passport
              </Link>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center">Demo data — fictional compliance packs. All data shown is fictional demo data.</p>
    </div>
  );
}
