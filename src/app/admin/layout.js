'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard, Settings, Image as ImageIcon, Megaphone, Camera,
  CalendarDays, Users, Wallet, LogOut, ChevronRight, Menu, X,
  ExternalLink, ShieldCheck
} from 'lucide-react';

const navGroups = [
  {
    titleBn: 'সাধারণ বিবরণী',
    titleEn: 'OVERVIEW',
    items: [
      { nameBn: 'ড্যাশবোর্ড', nameEn: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    titleBn: 'উৎসব ও বিষয়বস্তু',
    titleEn: 'FESTIVAL & CONTENT',
    items: [
      { nameBn: 'গ্লোবাল সেটিংস', nameEn: 'Global Settings', path: '/admin/settings', icon: Settings },
      { nameBn: 'ফটো গ্যালারি', nameEn: 'Gallery Archives', path: '/admin/gallery', icon: Camera },
      { nameBn: 'পূজা নির্ঘণ্ট', nameEn: 'Puja Schedule', path: '/admin/timeline', icon: CalendarDays },
      { nameBn: 'মিডিয়া ও ব্যানার', nameEn: 'Assets & Media', path: '/admin/media', icon: ImageIcon },
    ]
  },
  {
    titleBn: 'সমাজ ও নথিপত্র',
    titleEn: 'COMMUNITY & RECORDS',
    items: [
      { nameBn: 'নোটিশ বোর্ড', nameEn: 'Notice Board', path: '/admin/notices', icon: Megaphone },
      { nameBn: 'কমিটি তালিকা', nameEn: 'Committee Roster', path: '/admin/committee', icon: Users },
      { nameBn: 'বাজেট ও অডিট', nameEn: 'Budget & Audit', path: '/admin/finance', icon: Wallet },
    ]
  }
];

function SidebarContent({ pathname, user, onNavigate, onClose }) {
  const { lang, b } = useLanguage();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex flex-col h-full bg-white text-stone-800">
      {/* Header with Emblem & Close Button */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5 group min-w-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-brand-maroon text-white shadow-md border border-brand-maroon/30 group-hover:scale-105 transition-transform">
            <span className="text-base font-bold leading-none">ॐ</span>
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-black tracking-wide text-[11px] uppercase text-stone-900 truncate">
              Bansdroni Sonali Park
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-brand-maroon uppercase truncate">
              CLUB & PUJA COMMITTEE
            </span>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
            title={lang === 'bn' ? 'মেনু বন্ধ করুন' : 'Close Menu'}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.titleEn}>
            <p className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              {lang === 'bn' ? group.titleBn : group.titleEn}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onNavigate}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                      active
                        ? 'bg-stone-100 text-stone-900 font-semibold'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        active ? 'text-brand-maroon' : 'text-stone-400'
                      }`} />
                      <span className="truncate">
                        {lang === 'bn' ? item.nameBn : item.nameEn}
                      </span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-stone-100">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/60">
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.image ? (
              <img src={user.image} alt={user.name || 'User'} className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-stone-200" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-maroon text-white flex items-center justify-center text-xs font-bold shrink-0">
                {(user?.name || user?.email || 'A')[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-stone-900 truncate leading-tight">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-stone-400 truncate leading-tight mt-0.5">
                {user?.email || 'Super Admin'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title={lang === 'bn' ? 'লগআউট করুন' : 'Sign Out'}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { lang, changeLanguage, b } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  if (pathname === '/admin/login') return children;

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.authenticated) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allItems = navGroups.flatMap(g => g.items);
  const current = allItems.find(n => n.path === pathname);

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col font-sans antialiased text-stone-800">
      {/* ═══ Universal Slide-Over Navigation Drawer (Desktop & Mobile) ═══ */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      <div
        className={`fixed top-0 bottom-0 left-0 w-[82vw] max-w-xs sm:w-80 bg-white z-50 shadow-2xl border-r border-stone-200 transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent
          pathname={pathname}
          user={user}
          onNavigate={() => setMenuOpen(false)}
          onClose={() => setMenuOpen(false)}
        />
      </div>

      {/* ═══ Top Header ═══ */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200/80 h-14 flex items-center justify-between px-3 sm:px-8 z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:border-brand-maroon/40 text-stone-700 hover:text-stone-900 transition-all shadow-2xs cursor-pointer text-xs font-semibold shrink-0"
            title={lang === 'bn' ? 'নেভিগেশন মেনু বার খুলুন (Esc দিয়ে বন্ধ)' : 'Toggle Navigation Menu (Esc to close)'}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4 text-brand-maroon shrink-0" />
            <span className="font-semibold text-xs tracking-tight">
              {lang === 'bn' ? 'মেনু' : 'Menu'}
            </span>
          </button>

          <div className="h-4 w-px bg-stone-200 hidden sm:block" />

          {/* Current Page Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            {current?.icon && (
              <current.icon className="w-4 h-4 text-brand-maroon hidden sm:block shrink-0" />
            )}
            <h1 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
              {lang === 'bn' ? current?.nameBn : current?.nameEn}
            </h1>
          </div>
        </div>

        {/* Right Controls: Language Switcher + Live Portal Link */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher Pill */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200/80 text-xs font-semibold">
            <button
              onClick={() => changeLanguage('bn')}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                lang === 'bn' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                lang === 'en' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              English
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold transition-colors shadow-2xs shrink-0"
            title={lang === 'bn' ? 'ওয়েবসাইট দেখুন' : 'Live Website'}
          >
            <span className="hidden sm:inline">{lang === 'bn' ? 'ওয়েবসাইট দেখুন' : 'Live Website'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </Link>
        </div>
      </header>

      {/* ═══ Page Content Viewport (Unobstructed Full Width) ═══ */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col justify-between">
        <div className="space-y-6">
          {children}
        </div>

        {/* Official Admin Footer */}
        <footer className="mt-16 pt-6 border-t border-stone-200/80 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-3 pb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-semibold text-stone-700">Bansdroni Sonali Park Club & Puja Committee</span>
            <span className="text-stone-300">•</span>
            <span>Official Admin Portal</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'bn' ? 'সুরক্ষিত অ্যাডমিন সেশন' : 'Authorized Secure Session'}</span>
            <span>•</span>
            <span>{lang === 'bn' ? 'বাঁশদ্রোণী, কলকাতা ৭০০০৭০' : 'Bansdroni, Kolkata 700070'}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
