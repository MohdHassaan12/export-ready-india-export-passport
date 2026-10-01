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
    <aside className="w-64 bg-cream text-charcoal flex flex-col h-full shrink-0 border-r border-sand">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-sand flex items-center justify-start">
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
                      ? 'bg-cream-dark text-terracotta-dark shadow-sm border border-sand'
                      : 'text-charcoal-lighter hover:text-charcoal hover:bg-cream-dark border border-transparent'
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-terracotta' : 'text-stone-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.label === 'Missing Evidence' && (
                    <span className="bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center font-sans">4</span>
                  )}
                  {item.label === 'Buyer Requests' && (
                    <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center font-sans">2</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Company info */}
      <div className="px-5 py-5 border-t border-sand bg-cream-dark/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-white border border-sand shadow-sm flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-charcoal font-serif">AP</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-charcoal truncate font-serif">Apex Precision</p>
            <p className="text-xs text-stone-500 truncate">Demo account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
