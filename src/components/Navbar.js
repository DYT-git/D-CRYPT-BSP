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

  // Gentle audio chime feedback on bell interaction
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  };

  const isPuja = pathname === '/' || pathname === '/puja';
  const isClub = pathname.startsWith('/club');
  const isSamiti = pathname.startsWith('/samiti');
  const isHome = isPuja;
  const hasDarkHero = pathname === '/' || pathname === '/puja' || pathname.startsWith('/club') || pathname.startsWith('/samiti');
  const currentNavItems = isClub ? CLUB_LINKS : isSamiti ? SAMITI_LINKS : PUJA_LINKS;

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
      {/* ═══ UNIFIED RESPONSIVE TOP BAR (Zero Overlap, Proportionate Scaling & Clean Spacing) ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none w-full">
        <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 pt-2.5 sm:pt-4 flex items-center justify-between gap-1.5 sm:gap-3">

          {/* ═══ LEFT: Contextual Identity Badge (Responsive Sizing, No Screen Overflow) ═══ */}
          <div className="pointer-events-auto min-w-0 flex items-center flex-1 max-w-[calc(100vw-170px)] sm:max-w-none">
            {isClub ? (
              /* Club Dedicated Brand Badge */
              <Link href="/club" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-all shrink-0 bg-white/95 backdrop-blur-md border border-amber-300 text-amber-600">
                  <ClubCrestIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-amber-600" />
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className={`font-black uppercase tracking-tight sm:tracking-normal text-[10.5px] xs:text-[11.5px] sm:text-xs md:text-sm transition-colors truncate ${
                    hasDarkHero ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]' : 'text-stone-900'
                  }`}>
                    {b('সোনালী সঙ্ঘ ক্লাব', 'Sonali Sangha Club')}
                  </span>
                  <span className={`text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-[11px] font-bold tracking-wider transition-colors truncate ${
                    hasDarkHero ? 'text-amber-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]' : 'text-amber-700'
                  }`}>
                    {b('ক্রীড়া ও যুব শাখা', 'Sports & Youth Wing')}
                  </span>
                </div>
              </Link>
            ) : isSamiti ? (
              /* Samiti Dedicated Brand Badge */
              <Link href="/samiti" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-all shrink-0 bg-white/95 backdrop-blur-md border border-emerald-300 text-emerald-600">
                  <SamitiEmblemIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-emerald-600" />
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className={`font-black uppercase tracking-tight sm:tracking-normal text-[10.5px] xs:text-[11.5px] sm:text-xs md:text-sm transition-colors truncate ${
                    hasDarkHero ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]' : 'text-stone-900'
                  }`}>
                    {b('উন্নয়ন সমিতি', 'Unnayan Samiti')}
                  </span>
                  <span className={`text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-[11px] font-bold tracking-wider transition-colors truncate ${
                    hasDarkHero ? 'text-emerald-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]' : 'text-emerald-700'
                  }`}>
                    {b('নাগরিক কল্যাণ (RWA)', 'Civic Welfare & RWA')}
                  </span>
                </div>
              </Link>
            ) : (
              /* Original Sacred Durga Puja / Master Community Badge */
              <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-all shrink-0 bg-white/95 backdrop-blur-md border border-brand-maroon/20 text-brand-maroon">
                  <span className="text-sm sm:text-base md:text-lg font-black leading-none text-brand-maroon">ॐ</span>
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className={`font-black uppercase tracking-tight sm:tracking-normal text-[10.5px] xs:text-[11.5px] sm:text-xs md:text-sm transition-colors truncate ${
                    hasDarkHero ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]' : 'text-stone-900'
                  }`}>
                    {b('বাঁশদ্রোণী সোনালী সঙ্ঘ', 'Bansdroni Sonali Sangha')}
                  </span>
                  <span className={`text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-[11px] font-bold tracking-wider transition-colors truncate ${
                    hasDarkHero ? 'text-amber-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]' : 'text-brand-maroon'
                  }`}>
                    {b('রেজি: SO067242', 'Reg: SO067242')}
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* ═══ RIGHT: Bell Icon + Lang Switcher + Menu Button (Shrink-0, Never Covered) ═══ */}
          <div className="pointer-events-auto shrink-0 flex items-center gap-1.5 sm:gap-2.5">
            {/* Bell Notification Icon (Periodic Ring Animation, Radar Ping Halo & Chime on Click) */}
            <button
              id="notif-btn"
              type="button"
              onClick={() => {
                if (!notifDrawerOpen) playChime();
                setNotifDrawerOpen(!notifDrawerOpen);
              }}
              title={
                unreadNotifs > 0
                  ? b(`${toDigits(unreadNotifs)}টি নতুন বিজ্ঞপ্তি`, `${unreadNotifs} new notifications`)
                  : b('বিজ্ঞপ্তি ও নোটিফিকেশন', 'Notifications')
              }
              className={`group relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-transform active:scale-90 hover:scale-105 cursor-pointer group-hover-bell ${
                hasDarkHero
                  ? 'bg-black/45 hover:bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-300 hover:text-amber-200 shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)]'
                  : 'bg-white/95 hover:bg-stone-50 backdrop-blur-md border border-stone-200 text-stone-700 hover:text-amber-600 shadow-[0_2px_8px_rgba(28,13,19,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]'
              }`}
              aria-label="Notifications"
            >
              <Bell className={`w-4 h-4 sm:w-4.5 sm:h-4.5 fill-amber-400/25 transition-transform ${
                unreadNotifs > 0 ? 'animate-bell-periodic text-amber-300' : ''
              }`} />
              {unreadNotifs > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative min-w-[15px] h-[15px] sm:min-w-[17px] sm:h-[17px] px-0.5 bg-rose-600 text-white text-[8.5px] sm:text-[9.5px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                    {unreadNotifs > 9 ? '9+' : (lang === 'bn' ? toDigits(unreadNotifs) : unreadNotifs)}
                  </span>
                </span>
              )}
            </button>

            {/* Language Switcher Pill (Tactile 3D container with bevel) */}
            <div className="flex items-center p-0.5 rounded-full backdrop-blur-md text-[10px] sm:text-[11px] font-bold transition-all bg-white/95 border border-stone-200/90 shadow-[0_2px_8px_rgba(28,13,19,0.06),inset_0_1px_1px_rgba(255,255,255,0.85)] text-stone-700">
              <button
                onClick={() => changeLanguage('bn')}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-gradient-to-b from-[#BE123C] to-[#881337] text-white shadow-[0_2px_6px_rgba(190,18,60,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]'
                    : 'text-stone-600 hover:text-stone-900 active:scale-95'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-gradient-to-b from-[#BE123C] to-[#881337] text-white shadow-[0_2px_6px_rgba(190,18,60,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]'
                    : 'text-stone-600 hover:text-stone-900 active:scale-95'
                }`}
              >
                EN
              </button>
            </div>

            {/* Menu Toggle Button */}
            <button
              id="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all active:scale-90 hover:scale-105 cursor-pointer bg-white/95 hover:bg-stone-50 backdrop-blur-md border border-stone-200/90 text-stone-800 hover:text-brand-maroon shadow-[0_2px_8px_rgba(28,13,19,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]"
              aria-label="Open menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-stone-800" />}
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
        className={`fixed top-[52px] sm:top-[64px] right-2.5 sm:right-5 z-50 w-[calc(100vw-20px)] max-w-[280px] sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
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
