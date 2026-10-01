'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Files, Users, Package, ShieldCheck, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';

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
    <aside className="w-60 bg-slate-900 text-white flex flex-col h-full shrink-0 border-r border-slate-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center shadow">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">ExportReady</h1>
            <p className="text-slate-400 text-xs mt-0.5">Compliance evidence</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.label === 'Missing Evidence' && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">4</span>
                  )}
                  {item.label === 'Buyer Requests' && (
                    <span className="bg-amber-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">2</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Company info */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">AP</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Apex Precision Components Pvt. Ltd.</p>
            <p className="text-xs text-slate-400 truncate">Pune, Maharashtra, India</p>
            <p className="text-xs text-slate-500 truncate">Demo account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
