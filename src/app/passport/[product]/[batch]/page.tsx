'use client';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, CheckCircle, AlertTriangle, XCircle, FileText, MapPin, Factory, Calendar, Hash, Layers } from 'lucide-react';

const PASSPORTS: Record<string, Record<string, object>> = {
  'APC-PUMP-316-042': {
    'BATCH-2026-0918': {
      productName: 'Stainless-steel pump impeller',
      productCode: 'APC-PUMP-316-042',
      batch: 'BATCH-2026-0918',
      manufacturer: 'Apex Precision Components Pvt. Ltd.',
      location: 'Pune, Maharashtra, India',
      quantity: '2,500 units',
      material: 'Stainless steel SS 316',
      productionDate: '18 September 2026',
      hsCode: '8413.91.90',
      origin: [
        { label: 'Manufactured in India (Pune)', ok: true },
        { label: 'Raw material supplied by Bharat Steel Mills', ok: true },
        { label: 'Invoice BSM-4471 on file', ok: true },
      ],
      materials: [
        { label: 'Stainless steel SS 316', ok: true },
        { label: 'Material certificate available (HN-316-7782)', warn: true },
        { label: 'Recycled-content data: pending verification', err: true },
      ],
      quality: [
        { label: 'Inspection completed', ok: true },
        { label: 'Inspection report available (IR-0918)', ok: true },
        { label: 'ISO 9001 certificate available', ok: true },
      ],
      sustainability: [
        { label: 'Energy data: partially complete', warn: true },
        { label: 'Recycled-content evidence: missing', err: true },
      ],
      timeline: [
        { title: 'Raw material purchased', detail: 'SS 316s bar stock, Bharat Steel Mills — Invoice BSM-4471', date: '10 Sep 2026', ok: true },
        { title: 'Material received', detail: 'Heat HN-316-7782 · MTC verified at goods inward', date: '12 Sep 2026', ok: true },
        { title: 'Production completed', detail: '2,500 units · CNC cell 3 · Heat treatment by Precision Heat Treatment', date: '18 Sep 2026', ok: true },
        { title: 'Inspection passed', detail: 'Dimensions & PMI checks · Report IR-0918', date: '19 Sep 2026', ok: true },
        { title: 'Shipment prepared', detail: 'Packed by EcoPack Solutions · Nhava Sheva → Hamburg', date: '24 Sep 2026', ok: true },
      ],
      documents: [
        { name: 'Mill_Test_Certificate.pdf', type: 'Material', status: 'Verified' },
        { name: 'Inspection_Report_IR-0918.pdf', type: 'Quality', status: 'Verified' },
        { name: 'ISO_9001_Certificate.pdf', type: 'Quality', status: 'Verified' },
        { name: 'Packing_List.pdf', type: 'Shipping', status: 'Verified' },
        { name: 'Recycled_Content_Decl.pdf', type: 'Sustainability', status: 'Missing' },
        { name: 'Energy_Data_2025.xlsx', type: 'Sustainability', status: 'Partial' },
      ],
    },
  },
};

const DEFAULT_PASSPORT = PASSPORTS['APC-PUMP-316-042']['BATCH-2026-0918'] as any;

function StatusDot({ ok, warn, err }: { ok?: boolean; warn?: boolean; err?: boolean }) {
  if (ok) return <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0"><CheckCircle className="w-3 h-3 text-white" /></span>;
  if (warn) return <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center shrink-0"><AlertTriangle className="w-2.5 h-2.5 text-white" /></span>;
  return <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0"><XCircle className="w-3 h-3 text-white" /></span>;
}

export default function ProductPassport() {
  const params = useParams();
  const productCode = (params.product as string) || 'APC-PUMP-316-042';
  const batchCode = (params.batch as string) || 'BATCH-2026-0918';

  const p = (PASSPORTS[productCode]?.[batchCode] as any) ?? DEFAULT_PASSPORT;
  const url = typeof window !== 'undefined' ? window.location.href : `https://exportready.in/passport/${productCode}/${batchCode}`;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div>
          <p className="text-xs text-slate-400 font-mono mb-1">{productCode} · {batchCode}</p>
          <h1 className="text-xl font-bold text-slate-900">Digital Product Passport</h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4" /> Download compliance pack
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
            <Share2 className="w-4 h-4" /> Share passport
          </button>
        </div>
      </div>

      {/* Main passport card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Passport header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-0.5">Digital Product Passport</p>
            <h2 className="text-white font-bold text-lg">{p.productName || 'SS 316 Pump Impeller'}</h2>
          </div>
          <span className="demo-badge bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Demo Data</span>
        </div>

        {/* Product identity grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-b border-slate-100">
          {[
            { label: 'Product', value: p.productName, icon: Layers },
            { label: 'Product code', value: p.productCode, icon: Hash },
            { label: 'Manufacturer', value: p.manufacturer, icon: Factory },
            { label: 'Batch', value: p.batch, icon: Hash },
            { label: 'Location', value: p.location, icon: MapPin },
            { label: 'Production date', value: p.productionDate, icon: Calendar },
            { label: 'Quantity', value: p.quantity, icon: Layers },
            { label: 'Material', value: p.material, icon: Layers },
            { label: 'HS Code', value: p.hsCode, icon: Hash },
          ].map((field, i) => (
            <div key={i} className="px-5 py-3.5 border-r border-b border-slate-100 last:border-r-0">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{field.label}</p>
              <p className="text-sm font-semibold text-slate-800">{field.value}</p>
            </div>
          ))}
        </div>

        {/* QR section */}
        <div className="flex justify-end px-6 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-start gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400 font-mono">/passport/{productCode}</p>
              <p className="text-xs text-slate-400 font-mono">/{batchCode}/DAT</p>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
              <QRCodeSVG value={url} size={72} />
            </div>
          </div>
        </div>

        {/* 4 quadrant sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-slate-100">
          {/* Origin */}
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Origin</h3>
            <ul className="space-y-2">
              {p.origin.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <StatusDot ok={item.ok} warn={item.warn} err={item.err} />
                  <span className="text-slate-700">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Materials</h3>
            <ul className="space-y-2">
              {p.materials.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <StatusDot ok={item.ok} warn={item.warn} err={item.err} />
                  <span className="text-slate-700">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quality */}
          <div className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Quality</h3>
            <ul className="space-y-2">
              {p.quality.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <StatusDot ok={item.ok} warn={item.warn} err={item.err} />
                  <span className="text-slate-700">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sustainability */}
          <div className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Sustainability</h3>
            <ul className="space-y-2">
              {p.sustainability.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <StatusDot ok={item.ok} warn={item.warn} err={item.err} />
                  <span className="text-slate-700">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Traceability Timeline */}
        <div className="border-t border-slate-100 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Traceability Timeline</h3>
          <div className="space-y-0">
            {p.timeline.map((event: any, i: number) => (
              <div key={i} className="flex gap-4 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${event.ok ? 'bg-green-500' : 'bg-amber-400'}`}>
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  {i < p.timeline.length - 1 && <div className="w-px flex-1 bg-green-200 mt-1" />}
                </div>
                <div className="flex-1 pb-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                    <span className="text-xs text-slate-400 shrink-0">{event.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{event.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="border-t border-slate-100 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Attached Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {p.documents.map((doc: any, i: number) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${doc.status === 'Verified' ? 'bg-green-50 border-green-200 text-green-800' : doc.status === 'Missing' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{doc.name}</span>
                <span className="ml-auto shrink-0 text-xs">{doc.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
          <p className="text-xs text-slate-400 text-center">Demo data — fictional company and documents. This passport is not a legal compliance certification.</p>
        </div>
      </div>
    </div>
  );
}
