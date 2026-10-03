'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function PillarSwitcher({ active, variant = 'nav', className = '' }) {
  const pathname = usePathname();
  const { lang, b } = useLanguage();

  // Determine current active pillar
  const currentPillar = active || (
    pathname.startsWith('/club')
      ? 'club'
      : pathname.startsWith('/samiti')
        ? 'samiti'
        : 'puja'
  );

  const pillars = [
    {
      id: 'puja',
      href: '/',
      icon: '🌺',
      labelBn: 'শারদীয়া দুর্গোৎসব',
      shortBn: 'শারদীয়া পূজা',
      labelEn: 'Sharadiya Durga Puja',
      shortEn: 'Durga Puja',
      activeSubtle: 'bg-rose-500/25 text-rose-100 border-rose-300/40 backdrop-blur-sm shadow-xs font-semibold',
      activeGradient: 'bg-gradient-to-r from-rose-700 via-brand-maroon to-[#6B081F] text-white border-rose-400/50 shadow-rose-950/60 ring-1 ring-rose-400/40',
      activeRing: 'ring-rose-400/50',
    },
    {
      id: 'club',
      href: '/club',
      icon: '🏆',
      labelBn: 'সোনালী সঙ্ঘ ক্লাব',
      shortBn: 'সোনালী সঙ্ঘ',
      labelEn: 'Sonali Sangha Club',
      shortEn: 'Sonali Club',
      activeSubtle: 'bg-amber-500/25 text-amber-100 border-amber-300/40 backdrop-blur-sm shadow-xs font-semibold',
      activeGradient: 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white border-amber-400/50 shadow-amber-950/60 ring-1 ring-amber-400/40',
      activeRing: 'ring-amber-400/50',
    },
    {
      id: 'samiti',
      href: '/samiti',
      icon: '🏛️',
      labelBn: 'উন্নয়ন সমিতি',
      shortBn: 'উন্নয়ন সমিতি',
      labelEn: 'Unnayan Samiti',
      shortEn: 'Civic Samiti',
      activeSubtle: 'bg-emerald-500/25 text-emerald-100 border-emerald-300/40 backdrop-blur-sm shadow-xs font-semibold',
      activeGradient: 'bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white border-emerald-400/50 shadow-emerald-950/60 ring-1 ring-emerald-400/40',
      activeRing: 'ring-emerald-400/50',
    },
  ];

  const isNav = variant === 'nav' || variant === 'compact';

  if (isNav) {
    return (
      <nav
        aria-label="3 Community Pillars Navigation"
        className={`flex items-center p-0.5 sm:p-1 rounded-full bg-black/30 hover:bg-black/45 backdrop-blur-md border border-white/15 shadow-sm transition-all duration-300 ${className}`}
      >
        {pillars.map((p) => {
          const isActive = currentPillar === p.id;
          return (
            <Link
              key={p.id}
              href={p.href}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full text-xs transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? `${p.activeSubtle} border z-10`
                  : 'text-white/70 hover:text-white hover:bg-white/10 font-medium'
              }`}
            >
              <span className="text-xs sm:text-sm leading-none">{p.icon}</span>
              <span className="leading-snug hidden lg:inline">
                {lang === 'bn' ? p.labelBn : p.labelEn}
              </span>
              <span className="leading-snug inline lg:hidden">
                {lang === 'bn' ? p.shortBn : p.shortEn}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Mobile / In-Page Section Variant
  return (
    <div className={`w-full flex flex-col items-center pointer-events-auto ${className}`}>
      {/* Little Ambient Header Tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-950/70 backdrop-blur-md border border-white/20 text-rose-200/90 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>{b('পাড়ার ৩টি প্রধান শাখা', '3 Community Pillars')}</span>
        <span className="text-white/40">·</span>
        <span className="text-white/70 font-normal">{b('সরাসরি পেজে যান', 'Explore Wings')}</span>
      </div>

      {/* Pill Toggle Group */}
      <nav
        aria-label="3 Community Pillars Navigation"
        className="flex items-center p-1 sm:p-1.5 rounded-full bg-stone-950/85 backdrop-blur-xl border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-full overflow-x-auto scrollbar-none"
      >
        {pillars.map((p) => {
          const isActive = currentPillar === p.id;
          return (
            <Link
              key={p.id}
              href={p.href}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-300 whitespace-nowrap cursor-pointer ${
                isActive
                  ? `${p.activeGradient} font-bold shadow-lg border scale-[1.02] z-10 ring-1 ${p.activeRing}`
                  : 'text-stone-200 hover:text-white hover:bg-white/10 font-medium'
              }`}
            >
              <span className="text-sm sm:text-base leading-none">{p.icon}</span>
              <span className="leading-snug">
                {lang === 'bn' ? p.labelBn : p.labelEn}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse ml-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

