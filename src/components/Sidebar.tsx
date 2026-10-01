'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Home, FileText, Files, Users, Package, AlertCircle, BookOpen, Settings, Moon, Sun, Monitor, ChevronUp } from 'lucide-react';

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
  const [isPrefOpen, setIsPrefOpen] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPrefOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="w-64 bg-cream text-charcoal flex flex-col h-full shrink-0 border-r border-sand">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-sand flex items-center justify-start">
        <Image src="/logo-full.png" alt="ExportReady Logo" width={180} height={45} className="w-auto h-8 object-contain dark:invert" />
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
                      ? 'bg-cream-dark text-terracotta shadow-sm border border-sand'
                      : 'text-charcoal hover:text-terracotta hover:bg-cream-dark border border-transparent'
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-terracotta' : 'text-stone'}`} />
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

      {/* Company info & Preferences Menu */}
      <div className="relative border-t border-sand bg-cream-dark/50 p-4" ref={menuRef}>
        {isPrefOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-4 right-4 bg-white dark:bg-charcoal-light border border-sand shadow-brutal rounded-lg p-2 z-50">
            <div className="px-3 py-2 border-b border-sand mb-2">
              <p className="text-sm font-bold font-serif text-charcoal">Account Preferences</p>
              <p className="text-xs text-stone-500">Theme Settings</p>
            </div>
            
            <div className="space-y-1">
              <button 
                onClick={() => { setTheme('light'); setIsPrefOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${theme === 'light' || (!mounted && systemTheme === 'light') ? 'bg-cream-dark text-terracotta font-semibold' : 'text-charcoal hover:bg-cream'}`}
              >
                <Sun className="w-4 h-4" /> Light
              </button>
              <button 
                onClick={() => { setTheme('dark'); setIsPrefOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${theme === 'dark' || (!mounted && systemTheme === 'dark') ? 'bg-cream-dark text-terracotta font-semibold' : 'text-charcoal hover:bg-cream'}`}
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
              <button 
                onClick={() => { setTheme('system'); setIsPrefOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${theme === 'system' ? 'bg-cream-dark text-terracotta font-semibold' : 'text-charcoal hover:bg-cream'}`}
              >
                <Monitor className="w-4 h-4" /> System
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => setIsPrefOpen(!isPrefOpen)}
          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${isPrefOpen ? 'bg-cream-dark shadow-sm' : 'hover:bg-cream-dark'}`}
        >
          <div className="w-9 h-9 rounded-md bg-white border border-sand shadow-sm flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-charcoal font-serif">AP</span>
          </div>
          <div className="min-w-0 text-left flex-1">
            <p className="text-sm font-bold text-charcoal truncate font-serif">Apex Precision</p>
            <p className="text-xs text-stone-500 truncate">Preferences</p>
          </div>
          <ChevronUp className={`w-4 h-4 text-stone-500 transition-transform ${isPrefOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
}
