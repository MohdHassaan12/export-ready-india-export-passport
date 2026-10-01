'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, FileText, Files, Users, Package, AlertCircle, BookOpen } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: FileText, label: 'Buyer Requests', href: '/requests' },
  { icon: AlertCircle, label: 'Missing Evidence', href: '/missing' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: Files, label: 'Documents', href: '/documents' },
  { icon: Users, label: 'Suppliers', href: '/suppliers' },
  { icon: BookOpen, label: 'Compliance Packs', href: '/compliance' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col h-full shrink-0 border-r border-slate-200">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-start">
        <Image src="/logo-full.png" alt="ExportReady Logo" width={180} height={45} className="w-auto h-8 object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.label === 'Missing Evidence' && (
                    <span className="bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">4</span>
                  )}
                  {item.label === 'Buyer Requests' && (
                    <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">2</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Company info */}
      <div className="px-5 py-5 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-slate-600">AP</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">Apex Precision</p>
            <p className="text-xs text-slate-500 truncate">Demo account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
