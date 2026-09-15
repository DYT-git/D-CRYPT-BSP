'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Calendar, Users, Image as ImageIcon, IndianRupee, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',             labelKey: 'Home',              fallbackBn: 'হোম',              icon: Home },
  { href: '/puja',         labelKey: 'Durga Puja 2026',   fallbackBn: 'দুর্গাপূজা ২০২৬',   icon: Calendar },
  { href: '/committee',    labelKey: 'Committee Members', fallbackBn: 'কমিটি',            icon: Users },
  { href: '/gallery',      labelKey: 'Gallery',           fallbackBn: 'গ্যালারি',          icon: ImageIcon },
  { href: '/transparency', labelKey: 'Financials',        fallbackBn: 'হিসাব নিকাশ',      icon: IndianRupee },
];

export default function Navbar() {
  const { lang, changeLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('#corner-menu') && !e.target.closest('#menu-btn')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <>
      {/* ═══ TOP-LEFT: Fixed Club Logo & Name Badge (Hackspire style) ═══ */}
      <div className="fixed top-3 sm:top-5 left-3 sm:left-5 z-50 flex items-center gap-2.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-all shrink-0 ${
            isHome
              ? 'bg-[#11192E]/80 backdrop-blur-md border border-white/20 text-white shadow-md'
              : 'bg-white/95 backdrop-blur-md border border-brand-maroon/20 text-brand-maroon shadow-md'
          }`}>
            <span className="text-base font-bold leading-none">ॐ</span>
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className={`font-black tracking-wide text-[11px] uppercase transition-colors ${
              isHome
                ? 'text-white'
                : 'text-brand-dark'
            }`} style={{ textShadow: isHome ? '0 1px 8px rgba(0,0,0,0.8)' : 'none' }}>
              Bansdroni Sonali Park
            </span>
            <span className={`text-[9px] font-medium tracking-wider transition-colors ${
              isHome
                ? 'text-white/70'
                : 'text-brand-maroon font-semibold'
            }`} style={{ textShadow: isHome ? '0 1px 6px rgba(0,0,0,0.7)' : 'none' }}>
              CLUB & PUJA COMMITTEE
            </span>
          </div>
        </Link>
      </div>

      {/* ═══ TOP-RIGHT: Fixed Lang Switcher & Hamburger Button ═══ */}
      <div className="fixed top-3 sm:top-5 right-3 sm:right-5 z-50 flex items-center gap-1.5 sm:gap-2">
        <div className={`flex items-center p-0.5 rounded-full backdrop-blur-md shadow-md text-[11px] font-bold transition-all ${
          isHome
            ? 'bg-[#11192E]/80 border border-white/20 text-white'
            : 'bg-white/95 border border-stone-200 text-stone-700'
        }`}>
          <button
            onClick={() => changeLanguage('bn')}
            className={`px-2 sm:px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              lang === 'bn'
                ? 'bg-brand-maroon text-white shadow-xs'
                : isHome ? 'text-white/70 hover:text-white' : 'text-stone-500 hover:text-brand-maroon'
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`px-2 sm:px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-brand-maroon text-white shadow-xs'
                : isHome ? 'text-white/70 hover:text-white' : 'text-stone-500 hover:text-brand-maroon'
            }`}
          >
            EN
          </button>
        </div>

        <button
          id="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer ${
            isHome
              ? 'bg-[#11192E]/80 backdrop-blur-md border border-white/20 text-white hover:bg-[#11192E]'
              : 'bg-white/95 backdrop-blur-md border border-brand-maroon/20 text-brand-dark hover:bg-brand-saffron/20 shadow-md'
          }`}
          aria-label="Open menu"
        >
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* ═══ MOBILE BACKDROP DIMMING OVERLAY ═══ */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ═══ CORNER POPUP MENU (Fixed & Adaptive) ═══ */}
      <div
        id="corner-menu"
        className={`fixed top-[56px] sm:top-[70px] right-3 sm:right-5 z-50 w-[calc(100vw-24px)] max-w-[280px] sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-3.5 pb-2.5 border-b border-gray-100 flex items-center gap-2">
          <span className="text-brand-maroon text-base">ॐ</span>
          <div>
            <p className="text-[11px] font-black tracking-wider text-brand-dark uppercase">Sonali Park</p>
            <p className="text-[9px] text-brand-dark/40 tracking-wide">Bansdroni • Club & Puja</p>
          </div>
        </div>

        <nav className="py-1.5">
          {NAV_LINKS.map(({ href, labelKey, fallbackBn, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold transition-colors group ${
                  active
                    ? 'bg-brand-maroon text-white font-bold'
                    : 'text-brand-dark hover:bg-brand-saffron/30 hover:text-brand-maroon'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${
                  active ? 'text-white' : 'text-brand-maroon/70 group-hover:text-brand-maroon'
                }`} />
                <span>{lang === 'bn' ? fallbackBn : t(labelKey)}</span>
                <ChevronRight className={`w-3 h-3 ml-auto transition-colors ${
                  active ? 'text-white/70' : 'text-gray-300 group-hover:text-brand-maroon'
                }`} />
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-1.5 bg-gray-50/50">
          <span className="text-[10px] text-gray-400 font-medium mr-1">Lang:</span>
          <button
            onClick={() => changeLanguage('bn')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
              lang === 'bn' ? 'bg-brand-maroon text-white shadow-sm' : 'text-brand-dark/60 hover:text-brand-maroon'
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
              lang === 'en' ? 'bg-brand-maroon text-white shadow-sm' : 'text-brand-dark/60 hover:text-brand-maroon'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </>
  );
}
