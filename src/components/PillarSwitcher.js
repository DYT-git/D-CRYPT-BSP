'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function PillarSwitcher({ active, variant = 'hero', className = '' }) {
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
      shortBn: 'দুর্গাপূজা',
      labelEn: 'Sharadiya Durga Puja',
      shortEn: 'Durga Puja',
      activeGradient: 'bg-gradient-to-r from-rose-700 via-brand-maroon to-[#6B081F] text-white border-rose-400/40 shadow-rose-950/50',
      activeRing: 'ring-rose-400/50',
    },
    {
      id: 'club',
      href: '/club',
      icon: '🏆',
      labelBn: 'সোনালী সঙ্ঘ (ক্লাব)',
      shortBn: 'সোনালী সঙ্ঘ',
      labelEn: 'Sonali Sangha Club',
      shortEn: 'Club',
      activeGradient: 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white border-amber-400/40 shadow-amber-950/50',
      activeRing: 'ring-amber-400/50',
    },
    {
      id: 'samiti',
      href: '/samiti',
      icon: '🏛️',
      labelBn: 'উন্নয়ন সমিতি (RWA)',
      shortBn: 'উন্নয়ন সমিতি',
      labelEn: 'Unnayan Samiti (RWA)',
      shortEn: 'Civic Samiti',
      activeGradient: 'bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white border-emerald-400/40 shadow-emerald-950/50',
      activeRing: 'ring-emerald-400/50',
    },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 p-1 bg-stone-900/90 backdrop-blur-md rounded-full border border-white/15 ${className}`}>
        {pillars.map((p) => {
          const isActive = currentPillar === p.id;
          return (
            <Link
              key={p.id}
              href={p.href}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                isActive
                  ? `${p.activeGradient} font-bold shadow-md`
                  : 'text-stone-300 hover:text-white hover:bg-white/10 font-medium'
              }`}
            >
              <span>{p.icon}</span>
              <span>{lang === 'bn' ? p.shortBn : p.shortEn}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  // Hero / Standard Nav Variant
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
        className="flex items-center p-1 sm:p-1.5 rounded-full bg-stone-950/80 backdrop-blur-xl border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-full overflow-x-auto scrollbar-none"
      >
        {pillars.map((p) => {
          const isActive = currentPillar === p.id;
          return (
            <Link
              key={p.id}
              href={p.href}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-300 whitespace-nowrap cursor-pointer ${
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
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5 hidden sm:inline-block" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
