'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Calendar, Users, Image as ImageIcon, IndianRupee, ChevronRight, Trophy, Building, Megaphone, Bell, Shield } from 'lucide-react';
import NotificationDrawer from '@/components/NotificationDrawer';
import { ClubCrestIcon, SamitiEmblemIcon } from '@/components/HeritageIcons';

const PUJA_LINKS = [
  { href: '/',             labelBn: 'হোম ও শারদীয়া উৎসব',      labelEn: 'Home & Durga Puja',   icon: Home },
  { href: '/puja',         labelBn: 'সময়সূচি ও নির্ঘণ্ট',        labelEn: 'Schedule & Calendar', icon: Calendar },
  { href: '/notifications', labelBn: 'বিজ্ঞপ্তি ও বুলেটিন',       labelEn: 'Notices & Bulletins', icon: Megaphone },
  { href: '/committee',    labelBn: 'পুজো কমিটি সদস্যবৃন্দ',     labelEn: 'Committee Members',   icon: Users },
  { href: '/gallery',      labelBn: 'ছবি গ্যালারি',              labelEn: 'Photo Gallery',       icon: ImageIcon },
  { href: '/transparency', labelBn: 'হিসাব নিকাশ ও অডিট',      labelEn: 'Accounts & Audit',    icon: IndianRupee },
];

const CLUB_LINKS = [
  { href: '/club#club-overview',  labelBn: 'ক্লাব পরিচিতি',             labelEn: 'Club Overview',      icon: Trophy },
  { href: '/club#club-notices',   labelBn: 'ক্লাব নোটিশ বোর্ড',          labelEn: 'Club Notice Board',  icon: Megaphone },
  { href: '/club#club-committee', labelBn: 'ক্লাব কমিটি পরিষদ',          labelEn: 'Club Committee',     icon: Users },
  { href: '/club#club-gallery',   labelBn: 'ক্রীড়া ও সাংস্কৃতিক গ্যালারি', labelEn: 'Sports & Culture Gallery', icon: ImageIcon },
  { href: '/club#club-finance',   labelBn: 'ক্লাব হিসাব নিকাশ ও অডিট',   labelEn: 'Club Accounts & Audit', icon: IndianRupee },
];

const SAMITI_LINKS = [
  { href: '/samiti#samiti-charter',   labelBn: 'নাগরিক সনদ ও সমিতি',        labelEn: 'Civic Charter',       icon: Building },
  { href: '/samiti#samiti-notices',   labelBn: 'নাগরিক নোটিশ ও বিজ্ঞপ্তি',   labelEn: 'Civic Notice Board',  icon: Megaphone },
  { href: '/samiti#samiti-committee', labelBn: 'পরিচালনা কমিটি',            labelEn: 'Management Committee', icon: Users },
  { href: '/samiti#samiti-gallery',   labelBn: 'উন্নয়ন কাজের গ্যালারি',      labelEn: 'Civic Works Gallery', icon: ImageIcon },
  { href: '/samiti#samiti-finance',   labelBn: 'নাগরিক তহবিল ও অডিট',       labelEn: 'Civic Accounts & Audit', icon: IndianRupee },
];

export default function Navbar() {
  const { lang, changeLanguage, t, b, toDigits } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const isPuja = pathname === '/' || pathname === '/puja';
  const isClub = pathname.startsWith('/club');
  const isSamiti = pathname.startsWith('/samiti');
  const isHome = isPuja;
  const hasDarkHero = pathname === '/' || pathname === '/puja' || pathname.startsWith('/club') || pathname.startsWith('/samiti');
  const currentNavItems = isClub ? CLUB_LINKS : isSamiti ? SAMITI_LINKS : PUJA_LINKS;

  // ═══ REFINED PILLAR-AWARE ADAPTIVE COLOR SYSTEM ═══
  // Active Language Button Color
  const activeLangClass = isClub
    ? (isScrolled
        ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-stone-950 font-black shadow-xs border border-amber-200/60'
        : 'bg-gradient-to-b from-amber-400 to-amber-600 text-stone-950 font-black shadow-[0_2px_8px_rgba(245,158,11,0.6)] border border-amber-200/80')
    : isSamiti
    ? (isScrolled
        ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white font-black shadow-xs border border-emerald-300/40'
        : 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white font-black shadow-[0_2px_8px_rgba(16,185,129,0.6)] border border-emerald-300/60')
    : (isScrolled
        ? 'bg-gradient-to-b from-[#BE123C] to-[#881337] text-white font-black shadow-xs border border-rose-300/40'
        : 'bg-gradient-to-b from-rose-500 to-rose-700 text-white font-black shadow-[0_2px_8px_rgba(225,29,72,0.6)] border border-rose-300/60');

  // Inactive Language Button Color (High contrast in glass view, sleek in black view)
  const inactiveLangClass = isScrolled
    ? 'text-stone-300 hover:text-white font-bold'
    : 'text-stone-100 hover:text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]';

  // Bell Icon Color
  const bellIconClass = isScrolled
    ? (isSamiti ? 'text-emerald-300 hover:text-emerald-100' : 'text-amber-300 hover:text-amber-100')
    : 'text-amber-200 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]';

  // Menu Icon Color
  const menuIconClass = isScrolled
    ? (isSamiti ? 'text-stone-100 hover:text-emerald-300' : 'text-stone-100 hover:text-amber-300')
    : 'text-white hover:text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]';

  const handleItemClick = (e, href) => {
    setMenuOpen(false);
    if (href.includes('#')) {
      const [targetPath, hash] = href.split('#');
      if (pathname === targetPath || (!targetPath && pathname === '/')) {
        const el = document.getElementById(hash);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `#${hash}`);
        }
      }
    }
  };

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
      {/* ═══ FLOATING DUAL-ISLAND LUXURY NAVIGATION BAR (Zero Screen Blackout, 100% Deity Visibility) ═══ */}
      <header className="fixed top-2 sm:top-3.5 left-0 right-0 z-50 pointer-events-none w-full px-2.5 sm:px-4 md:px-6">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2">

          {/* ═══ LEFT ISLAND: Contextual Identity Capsule (Floating Liquid Glass Pill) ═══ */}
          <div className="pointer-events-auto min-w-0 flex items-center flex-1 max-w-[calc(100vw-150px)] sm:max-w-md">
            {isClub ? (
              /* Club Dedicated Brand Badge */
              <Link
                href="/club"
                className={`flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3.5 py-0.5 sm:py-1 rounded-full transition-all duration-300 group min-w-0 active:scale-98 ${
                  isScrolled
                    ? 'bg-[#0E0805]/90 hover:bg-[#0E0805]/95 border border-amber-400/40 backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.15)]'
                    : 'bg-black/30 hover:bg-black/40 border border-white/25 hover:border-white/40 backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isScrolled
                      ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 border border-amber-200/80 text-stone-950 shadow-sm'
                      : 'bg-amber-500/25 backdrop-blur-xs border border-amber-300/50 text-amber-300 shadow-xs'
                  }`}
                >
                  <ClubCrestIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isScrolled ? 'text-stone-950' : 'text-amber-300 drop-shadow-xs'}`} />
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="font-serif font-black uppercase tracking-tight sm:tracking-normal text-[10px] xs:text-[11px] sm:text-xs md:text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] group-hover:text-amber-200 transition-colors truncate">
                    {b('সোনালী সঙ্ঘ ক্লাব', 'Sonali Sangha Club')}
                  </span>
                  <span className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-wider text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] transition-colors truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    <span>{b('রেজি: SO067242', 'Reg: SO067242')}</span>
                  </span>
                </div>
              </Link>
            ) : isSamiti ? (
              /* Samiti Dedicated Brand Badge */
              <Link
                href="/samiti"
                className={`flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3.5 py-0.5 sm:py-1 rounded-full transition-all duration-300 group min-w-0 active:scale-98 ${
                  isScrolled
                    ? 'bg-[#040E08]/90 hover:bg-[#040E08]/95 border border-emerald-400/40 backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.15)]'
                    : 'bg-black/30 hover:bg-black/40 border border-white/25 hover:border-white/40 backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isScrolled
                      ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 border border-emerald-300/80 text-emerald-100 shadow-sm'
                      : 'bg-emerald-500/25 backdrop-blur-xs border border-emerald-300/50 text-emerald-300 shadow-xs'
                  }`}
                >
                  <SamitiEmblemIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isScrolled ? 'text-emerald-100' : 'text-emerald-300 drop-shadow-xs'}`} />
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="font-serif font-black uppercase tracking-tight sm:tracking-normal text-[10px] xs:text-[11px] sm:text-xs md:text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] group-hover:text-emerald-200 transition-colors truncate">
                    {b('উন্নয়ন সমিতি', 'Unnayan Samiti')}
                  </span>
                  <span className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-wider text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] transition-colors truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>{b('রেজি: SO067242', 'Reg: SO067242')}</span>
                  </span>
                </div>
              </Link>
            ) : (
              /* Original Sacred Durga Puja / Master Community Badge */
              <Link
                href="/"
                className={`flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3.5 py-0.5 sm:py-1 rounded-full transition-all duration-300 group min-w-0 active:scale-98 ${
                  isScrolled
                    ? 'bg-[#0E060B]/90 hover:bg-[#0E060B]/95 border border-amber-400/40 backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.15)]'
                    : 'bg-black/30 hover:bg-black/40 border border-white/25 hover:border-white/40 backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isScrolled
                      ? 'bg-gradient-to-br from-[#881337] via-brand-maroon to-[#580B1F] border border-amber-300/70 text-amber-200 shadow-sm'
                      : 'bg-amber-400/25 backdrop-blur-xs border border-amber-300/50 text-amber-200 shadow-xs'
                  }`}
                >
                  <span className="text-[11px] sm:text-xs font-black leading-none text-amber-200 drop-shadow-xs">ॐ</span>
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="font-serif font-black uppercase tracking-tight sm:tracking-normal text-[10px] xs:text-[11px] sm:text-xs md:text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] group-hover:text-amber-200 transition-colors truncate">
                    {b('সোনালী পার্ক অধিবাসীবৃন্দ', 'Sonali Park Adhibasibrinda')}
                  </span>
                  <span className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] font-mono font-bold tracking-wider text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] transition-colors truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                    <span>{b('রেজি: SO067242', 'Reg: SO067242')}</span>
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* ═══ RIGHT ISLAND: Utility Controls Cluster (Floating Liquid Glass Capsule) ═══ */}
          <div
            className={`pointer-events-auto shrink-0 flex items-center gap-1 sm:gap-1.5 p-0.5 sm:p-1 rounded-full transition-all duration-300 ${
              isScrolled
                ? 'bg-[#0E060B]/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.15)]'
                : 'bg-black/30 hover:bg-black/40 backdrop-blur-md backdrop-saturate-150 border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]'
            }`}
          >
            {/* Bell Notification Button */}
            <button
              id="notif-btn"
              type="button"
              onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
              title={
                unreadNotifs > 0
                  ? b(`${toDigits(unreadNotifs)}টি নতুন বিজ্ঞপ্তি`, `${unreadNotifs} new notifications`)
                  : b('বিজ্ঞপ্তি ও নোটিফিকেশন', 'Notifications')
              }
              className="relative w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center rounded-full transition-all active:scale-95 hover:bg-white/15 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className={`w-3.5 h-3.5 transition-colors ${bellIconClass}`} strokeWidth={2} />
              {unreadNotifs > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 bg-rose-600 text-white text-[8.5px] font-black rounded-full flex items-center justify-center border border-stone-900 shadow-xs leading-none">
                  {unreadNotifs > 9 ? '9+' : (lang === 'bn' ? toDigits(unreadNotifs) : unreadNotifs)}
                </span>
              )}
            </button>

            {/* Language Switcher Pill */}
            <div
              className={`flex items-center p-0.5 rounded-full text-[9px] sm:text-[10px] font-bold transition-all ${
                isScrolled ? 'bg-white/10 border border-white/15' : 'bg-black/35 border border-white/20 backdrop-blur-xs'
              }`}
            >
              <button
                onClick={() => changeLanguage('bn')}
                className={`px-1.5 sm:px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  lang === 'bn' ? activeLangClass : inactiveLangClass
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-1.5 sm:px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  lang === 'en' ? activeLangClass : inactiveLangClass
                }`}
              >
                EN
              </button>
            </div>

            {/* Menu Toggle Button */}
            <button
              id="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center transition-all active:scale-90 hover:bg-white/15 cursor-pointer"
              aria-label="Open menu"
            >
              {menuOpen ? (
                <X className={`w-3.5 h-3.5 transition-colors ${menuIconClass}`} />
              ) : (
                <Menu className={`w-3.5 h-3.5 transition-colors ${menuIconClass}`} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══ MOBILE BACKDROP DIMMING OVERLAY ═══ */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ═══ CORNER POPUP MENU (Fixed & Adaptive per Pillar) ═══ */}
      <div
        id="corner-menu"
        className={`fixed top-[44px] sm:top-[52px] right-2.5 sm:right-6 z-50 w-[calc(100vw-20px)] max-w-[280px] sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-3.5 pb-2.5 border-b border-gray-100 flex items-center gap-2">
          <span className="text-brand-maroon text-base">ॐ</span>
          <div>
            <p className="text-[11px] font-black tracking-wider text-brand-dark uppercase">{b('সোনালী পার্ক', 'Sonali Park')}</p>
            <p className="text-[9px] text-brand-dark/40 tracking-wide">
              {isClub
                ? b('সোনালী সঙ্ঘ ক্লাব শাখা', 'Sonali Sangha Club Wing')
                : isSamiti
                ? b('উন্নয়ন সমিতি পরিষদ', 'Unnayan Samiti Wing')
                : b('শারদীয়া দুর্গোৎসব ও ঐতিহ্য', 'Sharadiya Durga Puja & Traditions')}
            </p>
          </div>
        </div>

        {/* 3 Community Pillars Quick Box */}
        <div className="px-3.5 pt-3 pb-2.5 bg-stone-50 border-b border-gray-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
            {b('৩টি মূল শাখা', '3 Community Pillars')}
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`p-2 rounded-xl text-center border transition-all ${
                !isClub && !isSamiti
                  ? 'bg-rose-50 border-rose-200 text-brand-maroon font-bold shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-brand-maroon/30'
              }`}
            >
              <span className="text-base block mb-0.5">🌺</span>
              <span className="text-[10px] font-bold block leading-tight">{b('পূজা', 'Puja')}</span>
            </Link>
            <Link
              href="/club"
              onClick={() => setMenuOpen(false)}
              className={`p-2 rounded-xl text-center border transition-all ${
                isClub
                  ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-amber-500/30'
              }`}
            >
              <span className="text-base block mb-0.5">🏆</span>
              <span className="text-[10px] font-bold block leading-tight">{b('ক্লাব', 'Club')}</span>
            </Link>
            <Link
              href="/samiti"
              onClick={() => setMenuOpen(false)}
              className={`p-2 rounded-xl text-center border transition-all ${
                isSamiti
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold shadow-xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-500/30'
              }`}
            >
              <span className="text-base block mb-0.5">🏛️</span>
              <span className="text-[10px] font-bold block leading-tight">{b('সমিতি', 'Samiti')}</span>
            </Link>
          </div>
        </div>

        <nav className="py-1.5">
          {currentNavItems.map(({ href, labelBn, labelEn, icon: Icon }) => {
            const active = href.includes('#')
              ? false
              : (href === '/' ? pathname === '/' : pathname === href);

            return (
              <a
                key={href}
                href={href}
                onClick={(e) => handleItemClick(e, href)}
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold transition-colors group cursor-pointer ${
                  active
                    ? isClub
                      ? 'bg-amber-600 text-white font-bold'
                      : isSamiti
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-brand-maroon text-white font-bold'
                    : isClub
                    ? 'text-stone-800 hover:bg-amber-50 hover:text-amber-900'
                    : isSamiti
                    ? 'text-stone-800 hover:bg-emerald-50 hover:text-emerald-900'
                    : 'text-stone-800 hover:bg-rose-50 hover:text-brand-maroon'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${
                  active
                    ? 'text-white'
                    : isClub
                    ? 'text-amber-600 group-hover:text-amber-800'
                    : isSamiti
                    ? 'text-emerald-600 group-hover:text-emerald-800'
                    : 'text-brand-maroon/70 group-hover:text-brand-maroon'
                }`} />
                <span>{lang === 'bn' ? labelBn : labelEn}</span>
                <ChevronRight className={`w-3 h-3 ml-auto transition-colors ${
                  active ? 'text-white/70' : 'text-gray-300 group-hover:text-stone-500'
                }`} />
              </a>
            );
          })}
        </nav>

        <div className="p-2.5 border-t border-gray-100 bg-stone-50/80">
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{b('অ্যাডমিন প্যানেল প্রবেশ করুন', 'Access Admin Panel')}</span>
          </Link>
        </div>

        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-1.5 bg-gray-50/50">
          <span className="text-[10px] text-gray-400 font-medium mr-1">{b('ভাষা:', 'Lang:')}</span>
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

      {/* ═══ UNIVERSAL NOTIFICATION DRAWER ═══ */}
      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        onUnreadCountChange={setUnreadNotifs}
      />
    </>
  );
}
