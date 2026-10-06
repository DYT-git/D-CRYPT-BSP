'use client';
import { useState, useRef, useEffect } from 'react';
import { Sun, Sunset, Moon } from 'lucide-react';
import Countdown from "@/components/Countdown";
import HeroParticles from "@/components/HeroParticles";
import { triggerDownload } from "@/utils/download";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  DiyaIcon,
  ShankhaIcon,
  MandapIcon,
  SculptorIcon,
  IlluminationIcon,
  CalendarPlaqueIcon,
  MetroTransitIcon,
  PandalWorkIcon,
  ShashtiBilvaIcon,
  SaptamiNabapatrikaIcon,
  AshtamiDhunuchiIcon,
  NavamiHomaIcon,
  DashamiTrishulIcon,
  ClubCrestIcon,
  SamitiEmblemIcon,
  NoticeScrollIcon,
  SportsBadgeIcon,
  BloodDonationBadgeIcon,
  CulturalStageBadgeIcon,
  CivicShieldBadgeIcon,
  CivicLightBadgeIcon,
  CivicGreeneryBadgeIcon,
  CornerKolka,
  FestiveWaveAccent,
  WashiTapePin,
  BinderHoles,
  TornDeckleEdge,
  DurgaDeviEmblemIcon,
  PanjikaSealBadge,
  CornerFiligree
} from "@/components/HeritageIcons";

export default function HomePage() {
  const { data, settings, selectedYear } = useData();
  const { lang, changeLanguage, t, b, toDigits, formatDate } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  // Time of Day & Mount state
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [isMounted, setIsMounted] = useState(false);

  // Lightbox State
  const [selectedImage, setSelectedImage] = useState(null);
  const galleryScrollRef = useRef(null);

  const scrollGallery = (direction) => {
    if (galleryScrollRef.current) {
      const amount = direction === 'left' ? -380 : 380;
      galleryScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const themes = {
    morning: {
      pageBg: '#FAF7F2',
      heroBg: '#FAF7F2',
      photo: settings?.heroImageMorning || '/assets/durga-morning.png',
      photoFallback: settings?.heroImageFallback || '/assets/durga-hero.png',
      timeGreeting: b('শুভ শারদ প্রভাত', 'Auspicious Autumn Morning'),
      headlinePrefix: b('শারদ প্রাতে ', 'With the Autumn Dawn '),
      headlineHighlight: b('মায়ের আগমন...', "Mother's Divine Arrival..."),
      headline: b('শারদ প্রাতে মায়ের আগমন...', "With the Autumn Dawn Mother's Divine Arrival..."),
      subline: b('আনন্দ আর আলোয় সাজুক ভুবন', 'May Joy and Radiance Fill the World'),
      quote: b('প্রতিটি ভোরে মায়ের আশীর্বাদ, শিউলি ঝরা আগমনীর সুর', "Every dawn carries Mother's divine grace with the fragrant melody of Agomoni"),
      taglineSub: b("শিউলি ঝরা আগমনীর সুর", "Every dawn carries Mother's divine grace"),
      counterHeading: b('মা আসছেন...', 'Mother Durga is Arriving...'),
      counterSub: b('মহাষষ্ঠী ১৬ অক্টোবর ২০২৬', 'Maha Shashti · 16 October 2026'),
      accentColor: '#E11D48',
      badgeClass: 'bg-stone-950/70 text-rose-200 border-rose-300/30 shadow-lg',
      quoteClass: 'text-rose-100 border-[#E11D48]',
      counterGlass: 'bg-[#12070D]/75 border-rose-400/30 text-white',
      isDark: false,
      sectionGalleryBg: 'bg-[#FAF7F2] border-stone-200/70',
      cardBg: 'bg-[#FFFDF9] border border-[#E8DFD1] hover:border-brand-maroon/40 shadow-[0_2px_12px_rgba(28,13,19,0.03)] hover:shadow-[0_8px_24px_rgba(159,18,57,0.09)]',
      textHead: 'text-stone-900',
      textSub: 'text-stone-600',
      textMuted: 'text-stone-500',
    },
    afternoon: {
      pageBg: '#FAF7F2',
      heroBg: '#FAF7F2',
      photo: settings?.heroImageAfternoon || '/assets/durga-afternoon.png',
      photoFallback: settings?.heroImageFallback || '/assets/durga-hero.png',
      timeGreeting: b('শারদীয়ার শুভ অপরাহ্ন', 'Blessed Festive Afternoon'),
      headlinePrefix: b('কাশফুলের দোলায় ', 'In the Sway of Kash Flowers '),
      headlineHighlight: b('পুজোর গন্ধ...', 'Festivity Fills the Air...'),
      headline: b('কাশফুলের দোলায় পুজোর গন্ধ...', 'In the Sway of Kash Flowers Festivity Fills the Air...'),
      subline: b('মেতেছে বাঁশদ্রোণী সোনালী পার্ক', 'Bansdroni Sonali Park Celebrates in Joy'),
      quote: b('লক্ষ কণ্ঠে একই উচ্চারণ — জয় মা দুর্গা', 'A million voices united in devotion — Joy Maa Durga'),
      taglineSub: b("লক্ষ কণ্ঠে একই উচ্চারণ — জয় মা দুর্গা", "A million voices united in devotion — Joy Maa Durga"),
      counterHeading: b('মা আসছেন বাঁশদ্রোণীতে...', 'Mother Durga is Arriving at Sonali Park...'),
      counterSub: b('মহাষষ্ঠী ১৬ অক্টোবর ২০২৬', 'Maha Shashti · 16 October 2026'),
      accentColor: '#E11D48',
      badgeClass: 'bg-stone-950/70 text-rose-200 border-rose-300/30 shadow-lg',
      quoteClass: 'text-rose-100 border-[#E11D48]',
      counterGlass: 'bg-[#12070D]/75 border-rose-400/30 text-white',
      isDark: false,
      sectionGalleryBg: 'bg-[#FAF7F2] border-stone-200/70',
      cardBg: 'bg-[#FFFDF9] border border-[#E8DFD1] hover:border-brand-maroon/40 shadow-[0_2px_12px_rgba(28,13,19,0.03)] hover:shadow-[0_8px_24px_rgba(159,18,57,0.09)]',
      textHead: 'text-stone-900',
      textSub: 'text-stone-600',
      textMuted: 'text-stone-500',
    },
    evening: {
      pageBg: '#FAF7F2',
      heroBg: '#FAF7F2',
      photo: settings?.heroImageEvening || '/assets/durga-evening.png',
      photoFallback: settings?.heroImageFallback || '/assets/durga-hero.png',
      timeGreeting: b('শারদ সান্ধ্য বন্দনা', 'Divine Evening Invocation'),
      headlinePrefix: b('সন্ধ্যা আরতিতে ', 'In the Evening Arati '),
      headlineHighlight: b('আলোর উৎসব...', 'Festival of Sacred Lights...'),
      headline: b('সন্ধ্যা আরতিতে আলোর উৎসব...', 'In the Evening Arati Festival of Sacred Lights...'),
      subline: b('মা অপরূপা সোনালী প্রাঙ্গণে', 'Mother Resplendent at Sonali Park'),
      quote: b('সন্ধ্যাপ্রদীপের শিখায় আরতি, মাগো তোমায় কোটি কোটি প্রণাম', 'In the flame of the evening lamps, our deepest reverence to Mother Durga'),
      taglineSub: b("মা অপরূপা সোনালী প্রাঙ্গণে", "Mother Resplendent in the Evening Glow"),
      counterHeading: b('মা আসছেন বছর ঘুরে...', 'Mother Durga Returns Once More...'),
      counterSub: b('মহাষষ্ঠী ১৬ অক্টোবর ২০২৬', 'Maha Shashti · 16 October 2026'),
      accentColor: '#E11D48',
      badgeClass: 'bg-stone-950/70 text-rose-200 border-rose-300/30 shadow-lg',
      quoteClass: 'text-rose-100 border-[#E11D48]',
      counterGlass: 'bg-[#12070D]/75 border-rose-400/30 text-white',
      isDark: false,
      sectionGalleryBg: 'bg-[#FAF7F2] border-stone-200/70',
      cardBg: 'bg-[#FFFDF9] border border-[#E8DFD1] hover:border-brand-maroon/40 shadow-[0_2px_12px_rgba(28,13,19,0.03)] hover:shadow-[0_8px_24px_rgba(159,18,57,0.09)]',
      textHead: 'text-stone-900',
      textSub: 'text-stone-600',
      textMuted: 'text-stone-500',
    }
  };

  const curr = themes[timeOfDay];



  const notices = data.notices.filter(n => n.year === selectedYear && !n.title?.startsWith('[Club]') && !n.title?.startsWith('[Samiti]'));

  return (
    <main className="min-h-screen transition-colors duration-700 selection:bg-brand-maroon selection:text-white" style={{ backgroundColor: curr.pageBg }}>

      {/* ══════════════════════════════════════════════════════
          HERO FESTIVAL POSTER — 100% Scene with Winged Quotes & Downside Counter
          Maa Durga & Lion in center remain 100% clear and unobstructed
          ══════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden transition-colors duration-700" style={{ backgroundColor: curr.pageBg }}>

        {/* Sacred Festival Deity Frame — 100% Uncropped, Zero Text Obstruction on Any Device */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] overflow-hidden">
          {(['morning', 'afternoon', 'evening']).map((tod) => (
            <div
              key={tod}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: timeOfDay === tod ? 1 : 0 }}
            >
              <img
                src={themes[tod].photo}
                alt="Maa Durga — Sharadiya Durga Puja 2026"
                onError={(e) => { e.currentTarget.src = themes[tod].photoFallback; }}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Time-Aware Atmospheric Floating Particles */}
          <HeroParticles timeOfDay={timeOfDay} />

          {/* ════ DESKTOP WIDE-SCREEN ONLY (>= lg: 1024px+): LEFT WING ════ */}
          <div className="absolute top-24 sm:top-28 md:top-32 lg:top-36 xl:top-40 left-6 sm:left-8 lg:left-14 z-20 hidden lg:block max-w-md pointer-events-none">
            {/* Symmetrical Header Greeting Badge */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wider uppercase backdrop-blur-md pointer-events-auto shadow-md ${curr.badgeClass}`}>
              <PanjikaSealBadge className="w-3.5 h-3.5 text-amber-300" />
              <span>{curr.timeGreeting}</span>
              <span className="opacity-40">·</span>
              <span className="font-serif normal-case tracking-normal text-amber-200 font-bold">{toDigits(2026)}</span>
            </div>

            {/* Dynamic Symmetrical Headline */}
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-serif font-black tracking-tight text-white leading-tight mt-3 sm:mt-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              {settings.heroHeading ? (
                settings.heroHeading
              ) : (
                <>
                  <span>{curr.headlinePrefix}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-200 to-amber-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                    {curr.headlineHighlight}
                  </span>
                </>
              )}
            </h1>
            <p className="text-base md:text-lg text-rose-100/95 font-serif italic mt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {settings.heroSubHeading || curr.subline}
            </p>

            {/* Dynamic Poetic Bengali Quote Inscribed Plaque */}
            <div className="mt-3 sm:mt-4 pl-3.5 pr-4 py-2 rounded-r-2xl bg-gradient-to-r from-stone-950/85 via-stone-950/60 to-transparent backdrop-blur-md border-l-4 border-rose-500 shadow-lg pointer-events-auto max-w-fit">
              <span className="text-xs sm:text-sm md:text-base font-serif italic leading-relaxed text-[#FFF5F6] drop-shadow-sm">
                &ldquo;{curr.quote}&rdquo;
              </span>
            </div>

            {/* CTA Action Buttons (Inspired by Image 1: Pill Button with Circular Arrow Badge) */}
            <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-6 pointer-events-auto">
              <Link
                href="/puja"
                className="btn-tactile-crimson text-white pl-5 sm:pl-6 pr-2 sm:pr-2.5 py-2 sm:py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap inline-flex items-center gap-3 group shadow-[0_4px_16px_rgba(190,18,60,0.45)]"
              >
                <span>{b('দুর্গাপূজা ২০২৬', 'Durga Puja 2026')}</span>
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-brand-maroon flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-0.5 font-bold text-xs sm:text-sm">
                  →
                </span>
              </Link>
              <Link
                href="/transparency"
                className="btn-tactile-parchment pl-5 sm:pl-6 pr-2 sm:pr-2.5 py-2 rounded-full font-semibold text-xs sm:text-sm text-stone-800 hover:text-brand-maroon whitespace-nowrap inline-flex items-center gap-2.5 group"
              >
                <span>{b('হিসাব নিকাশ', 'Financial Accounts')}</span>
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-stone-200/80 group-hover:bg-brand-maroon group-hover:text-white text-stone-700 flex items-center justify-center shadow-2xs transition-all duration-200 text-xs">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* ════ DESKTOP WIDE-SCREEN ONLY (>= lg: 1024px+): RIGHT WING ════ */}
          {curr.taglineSub && (
            <div className="absolute top-28 sm:top-32 md:top-36 lg:top-40 xl:top-48 right-6 sm:right-8 lg:right-14 z-20 hidden lg:block text-right max-w-xs pointer-events-none">
              <div className="inline-block bg-stone-950/60 backdrop-blur-md border border-rose-300/25 px-4 py-2 rounded-2xl shadow-lg">
                <p className="text-xs text-rose-100/90 italic font-serif max-w-[220px] drop-shadow-sm">
                  &ldquo;{curr.taglineSub}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* ════ DESKTOP WIDE-SCREEN ONLY (>= lg: 1024px+): DOWNSIDE COUNTER & BADGES ════ */}
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 inset-x-0 z-20 hidden lg:flex flex-col items-center justify-center text-center px-4 pointer-events-auto">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF8] via-rose-100 to-rose-200 drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] mb-2">
              {(!settings.countdownHeading || settings.countdownHeading === 'মা আসছেন...' || settings.countdownHeading === 'মহাষ্টমী আসতে আর মাত্র')
                ? curr.counterHeading
                : settings.countdownHeading}
            </h2>

            <div className={`inline-flex items-center gap-2 ${curr.counterGlass} border border-amber-400/25 ring-1 ring-white/10 backdrop-blur-xl px-6 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.85)]`}>
              <Countdown targetDate={settings.countdownDate || '2026-10-16T06:00:00+05:30'} variant="pill" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-400/35 text-xs text-amber-100 font-serif font-medium shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                <CalendarPlaqueIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>{curr.counterSub}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-emerald-400/35 text-xs text-emerald-200 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                <PandalWorkIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{b('মণ্ডপ প্রস্তুতি চলছে', 'Pandal Work in Progress')}</span>
              </span>

              <a
                href="https://maps.google.com/?q=Bansdroni+Sonali+Park+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-rose-300/30 text-xs text-rose-100 hover:bg-white hover:text-stone-900 hover:border-white transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.5)] group"
              >
                <MetroTransitIcon className="w-3.5 h-3.5 text-rose-300 group-hover:scale-110 transition-transform" />
                <span>{b('বাঁশদ্রোণী মেট্রো থেকে ৫ মিনিট', '5 mins from Bansdroni Metro')}</span>
              </a>
            </div>
          </div>

          {/* ════ GENTLE TEMPLE ARCH CURVE (SEAMLESS ARCHITECTURAL TRANSITION) ════ */}
          <div className="absolute -bottom-px inset-x-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
            <svg
              viewBox="0 0 1440 48"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-6 sm:h-10 lg:h-12 block transition-colors duration-700"
              style={{ color: curr.pageBg }}
            >
              <path d="M0,0 C380,38 1060,38 1440,0 L1440,48 L0,48 Z" fill="currentColor" />
              <path
                d="M0,0 C380,38 1060,38 1440,0"
                stroke="rgba(159,18,57,0.22)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>

        </div>

        {/* ════ MOBILE & TABLET CONNECTED CULTURAL DASHBOARD (< lg: 1024px) ════
            Standard Native Mobile App Layout: Zero Deity Obstruction, 100% Readable, High-Contrast
            ═══════════════════════════════════════════════════════════════════════════ */}
        <div className="block lg:hidden px-4 sm:px-6 pt-3 pb-6 max-w-2xl mx-auto">
          {/* Greeting Badge */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase backdrop-blur-md ${curr.badgeClass}`}>
              <ShankhaIcon className="w-3 h-3 text-amber-300" />
              <span>{curr.timeGreeting}</span>
              <span className="opacity-40">·</span>
              <span className="font-serif normal-case tracking-normal text-amber-200 font-bold">{toDigits(2026)}</span>
            </div>
            {curr.taglineSub && (
              <span className="text-[10px] text-stone-500 font-serif italic truncate max-w-[150px] sm:max-w-xs">
                &ldquo;{curr.taglineSub}&rdquo;
              </span>
            )}
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl font-serif font-bold leading-tight text-stone-900 tracking-tight">
            {settings.heroHeading ? (
              settings.heroHeading
            ) : (
              <>
                <span>{curr.headlinePrefix}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BE123C] to-[#881337]">
                  {curr.headlineHighlight}
                </span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-1">
            {settings.heroSubHeading || curr.subline}
          </p>

          {/* Poetic Bengali Quote Plaque */}
          <div className="mt-3 pl-3.5 pr-3 py-2 rounded-r-2xl bg-[#FFFDF9] border border-[#E8DFD1]/80 border-l-4 border-l-brand-maroon shadow-2xs">
            <span className="text-xs sm:text-sm font-serif italic leading-relaxed text-stone-800">
              &ldquo;{curr.quote}&rdquo;
            </span>
          </div>

          {/* Full-width Touch Friendly Action Buttons (Tactile 3D Buttons with Image 1 Arrow Coin) */}
          <div className="grid grid-cols-2 gap-2 mt-4 w-full">
            <Link
              href="/puja"
              className="btn-tactile-crimson text-white py-2.5 px-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between text-center whitespace-nowrap group shadow-[0_4px_14px_rgba(190,18,60,0.35)]"
            >
              <span className="truncate">{b('দুর্গাপূজা ২০২৬', 'Durga Puja 2026')}</span>
              <span className="w-5 h-5 rounded-full bg-white text-brand-maroon flex items-center justify-center shadow-xs font-bold text-xs shrink-0 group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
            <Link
              href="/transparency"
              className="btn-tactile-parchment py-2.5 px-2.5 rounded-2xl font-semibold text-xs sm:text-sm text-stone-800 hover:text-brand-maroon flex items-center justify-between text-center whitespace-nowrap group"
            >
              <span className="truncate">{b('হিসাব নিকাশ', 'Accounts')}</span>
              <span className="w-5 h-5 rounded-full bg-stone-200/80 group-hover:bg-brand-maroon group-hover:text-white text-stone-700 flex items-center justify-center text-xs shrink-0 transition-colors">
                →
              </span>
            </Link>
          </div>

          {/* Countdown Container Card */}
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#E8DFD1] shadow-xs relative overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Top Alta Seam */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#BE123C]/50 to-transparent" />

            <h2 className="text-sm sm:text-base font-serif font-bold text-stone-900 mb-2.5 flex items-center justify-center gap-1.5">
              <DiyaIcon className="w-4 h-4 text-amber-600 inline-block animate-gentle-float" />
              <span>
                {(!settings.countdownHeading || settings.countdownHeading === 'মা আসছেন...' || settings.countdownHeading === 'মহাষ্টমী আসতে আর মাত্র')
                  ? curr.counterHeading
                  : settings.countdownHeading}
              </span>
            </h2>

            {/* Live Countdown Festive Boxes */}
            <Countdown targetDate={settings.countdownDate || '2026-10-16T06:00:00+05:30'} variant="festive-boxes" />

            {/* Symmetrical Clustered Status Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-amber-500/30 text-[11px] text-stone-800 font-serif font-medium shadow-2xs">
                <CalendarPlaqueIcon className="w-3 h-3 text-amber-600" />
                <span>{curr.counterSub}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-emerald-500/30 text-[11px] text-emerald-800 font-medium shadow-2xs">
                <PandalWorkIcon className="w-3 h-3 text-emerald-600" />
                <span>{b('মণ্ডপ প্রস্তুতি চলছে', 'Pandal Work in Progress')}</span>
              </span>

              <a
                href="https://maps.google.com/?q=Bansdroni+Sonali+Park+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DFD1] text-[11px] text-stone-700 hover:text-brand-maroon transition-colors shadow-2xs group"
              >
                <MetroTransitIcon className="w-3 h-3 text-stone-600 group-hover:text-brand-maroon transition-colors" />
                <span>{b('মেট্রো থেকে ৫ মিনিট', '5 mins from Metro')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════════════
          TRADITIONAL BENGALI CALLIGRAPHIC KOLKA ALPANA SEAM
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full pt-1 pb-6 sm:pt-3 sm:pb-8 z-20 pointer-events-none overflow-hidden px-2 sm:px-4 select-none">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <svg
            width="100%"
            height="72"
            viewBox="0 0 1000 72"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="w-full max-w-5xl h-10 sm:h-14 md:h-16 transition-all duration-700 filter drop-shadow-[0_2px_8px_rgba(159,18,57,0.14)]"
          >
            <defs>
              <linearGradient id="alpanaLineLeftDay" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9F1239" stopOpacity="0" />
                <stop offset="30%" stopColor="#9F1239" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#9F1239" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#9F1239" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="alpanaLineRightDay" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9F1239" stopOpacity="0.95" />
                <stop offset="30%" stopColor="#9F1239" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#9F1239" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#9F1239" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="alpanaAltaBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="50%" stopColor="#9F1239" />
                <stop offset="100%" stopColor="#BE123C" />
              </linearGradient>
              <linearGradient id="alpanaGoldCore" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>

            {/* Left Flank */}
            <g fill="url(#alpanaAltaBody)">
              <circle cx="65" cy="36" r="1.2" opacity="0.35" />
              <circle cx="76" cy="36" r="1.8" opacity="0.55" />
              <circle cx="89" cy="36" r="2.6" opacity="0.8" />
              <path d="M104 36 L110 32 L117 36 L110 40 Z" fill="url(#alpanaGoldCore)" />
              <circle cx="110" cy="27" r="1.5" opacity="0.7" />
              <circle cx="110" cy="45" r="1.5" opacity="0.7" />
              <path d="M104 36 C96 29 88 27 80 30 C90 31 98 33 104 36 Z" opacity="0.8" />
              <path d="M104 36 C96 43 88 45 80 42 C90 41 98 39 104 36 Z" opacity="0.8" />
            </g>

            <line x1="120" y1="36" x2="350" y2="36" stroke="url(#alpanaLineLeftDay)" strokeWidth="1.5" strokeLinecap="round" />

            <g transform="translate(260, 36)" fill="url(#alpanaAltaBody)">
              <circle cx="-9" cy="0" r="1.4" opacity="0.6" />
              <circle cx="9" cy="0" r="1.4" opacity="0.6" />
              <path d="M0 -4 L4 0 L0 4 L-4 0 Z" fill="url(#alpanaGoldCore)" />
            </g>

            {/* Central Symmetrical Lotus Mandala */}
            <g id="centerAlpanaUnit">
              <path d="M500 13 C494 22 494 26 500 31 C506 26 506 22 500 13 Z" fill="url(#alpanaAltaBody)" />
              <circle cx="500" cy="22" r="1.8" fill="url(#alpanaGoldCore)" />

              <g fill="url(#alpanaAltaBody)">
                <circle cx="500" cy="27" r="3.2" fill="url(#alpanaGoldCore)" />
                <circle cx="488" cy="28.5" r="2.6" />
                <circle cx="512" cy="28.5" r="2.6" />
                <circle cx="477" cy="32" r="2.2" />
                <circle cx="523" cy="32" r="2.2" />
                <circle cx="468" cy="37" r="1.8" />
                <circle cx="532" cy="37" r="1.8" />
                <circle cx="460" cy="43" r="1.4" opacity="0.75" />
                <circle cx="540" cy="43" r="1.4" opacity="0.75" />
              </g>

              {/* Kolka Scrolls */}
              <path
                d="M500 48 C493 48 480 46 472 35 C464 23 472 14 485 15 C496 16 500 24 494 31 C489 36 482 34 481 29 C480 26.5 483 24.5 485.5 25.5 C487 26.2 486 28 484 28 C482.5 28 482 26 483.5 25 C480 26 480 32 485 33 C492 34 496 26 490 20 C482 12 468 20 475 32 C481 42 493 44 500 45 Z"
                fill="url(#alpanaAltaBody)"
              />
              <circle cx="485" cy="25" r="1.8" fill="url(#alpanaGoldCore)" />

              <path
                d="M500 48 C507 48 520 46 528 35 C536 23 528 14 515 15 C504 16 500 24 506 31 C511 36 518 34 519 29 C520 26.5 517 24.5 514.5 25.5 C513 26.2 514 28 516 28 C517.5 28 518 26 516.5 25 C520 26 520 32 515 33 C508 34 504 26 510 20 C518 12 532 20 525 32 C519 42 507 44 500 45 Z"
                fill="url(#alpanaAltaBody)"
              />
              <circle cx="515" cy="25" r="1.8" fill="url(#alpanaGoldCore)" />

              {/* Wings */}
              <g fill="url(#alpanaAltaBody)">
                <path d="M466 32 C446 22 416 19 372 26 C398 26 434 29 456 37 Z" />
                <path d="M462 38 C434 32 392 34 338 39 C384 40 430 42 454 44 Z" />
                <circle cx="330" cy="39" r="2.6" fill="url(#alpanaGoldCore)" />
                <path d="M534 32 C554 22 584 19 628 26 C602 26 566 29 544 37 Z" />
                <path d="M538 38 C566 32 608 34 662 39 C616 40 570 42 546 44 Z" />
                <circle cx="670" cy="39" r="2.6" fill="url(#alpanaGoldCore)" />
              </g>

              {/* Pedestal */}
              <g fill="url(#alpanaAltaBody)">
                <circle cx="500" cy="56" r="2.2" fill="url(#alpanaGoldCore)" />
              </g>
            </g>

            {/* Right Flank */}
            <g transform="translate(740, 36)" fill="url(#alpanaAltaBody)">
              <path d="M0 -4 L4 0 L0 4 L-4 0 Z" fill="url(#alpanaGoldCore)" />
              <circle cx="-9" cy="0" r="1.4" opacity="0.6" />
              <circle cx="9" cy="0" r="1.4" opacity="0.6" />
            </g>

            <line x1="650" y1="36" x2="880" y2="36" stroke="url(#alpanaLineRightDay)" strokeWidth="1.5" strokeLinecap="round" />

            <g fill="url(#alpanaAltaBody)">
              <path d="M896 36 C904 29 912 27 920 30 C910 31 902 33 896 36 Z" opacity="0.8" />
              <path d="M896 36 C904 43 912 45 920 42 C910 41 902 39 896 36 Z" opacity="0.8" />
              <path d="M896 36 L890 32 L883 36 L890 40 Z" fill="url(#alpanaGoldCore)" />
              <circle cx="890" cy="27" r="1.5" opacity="0.7" />
              <circle cx="890" cy="45" r="1.5" opacity="0.7" />
              <circle cx="911" cy="36" r="2.6" opacity="0.8" />
              <circle cx="924" cy="36" r="1.8" opacity="0.55" />
              <circle cx="935" cy="36" r="1.2" opacity="0.35" />
            </g>
          </svg>
        </div>
      </div>

      {/* ═══ DEV: Time switcher (desktop only, dev only) ═══ */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-6 left-6 z-40 hidden md:flex gap-1.5 bg-[#11192E]/85 backdrop-blur-md border border-white/20 p-1.5 rounded-full shadow-lg" title="Theme Tester">
          <button onClick={() => setTimeOfDay('morning')} className={`p-1.5 rounded-full transition-colors ${timeOfDay === 'morning' ? 'bg-orange-400 text-white shadow' : 'text-white/60 hover:bg-white/15'}`}><Sun className="w-3.5 h-3.5" /></button>
          <button onClick={() => setTimeOfDay('afternoon')} className={`p-1.5 rounded-full transition-colors ${timeOfDay === 'afternoon' ? 'bg-brand-maroon text-white shadow' : 'text-white/60 hover:bg-white/15'}`}><Sunset className="w-3.5 h-3.5" /></button>
          <button onClick={() => setTimeOfDay('evening')} className={`p-1.5 rounded-full transition-colors ${timeOfDay === 'evening' ? 'bg-indigo-500 text-white shadow' : 'text-white/60 hover:bg-white/15'}`}><Moon className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* ═══ 1. THEME SHOWCASE (Compact Sandalwood Ivory Pavilion) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-7 mb-12 sm:mb-16 relative z-10">
        <div className="rounded-3xl bg-[#FFFDF9] text-stone-900 shadow-[0_8px_28px_rgba(28,13,19,0.06)] hover:shadow-[0_14px_36px_rgba(159,18,57,0.08)] border border-[#E5DAC8] relative overflow-hidden group transition-all duration-300">
          {/* Top Fine Alta & Gold Ribbon Seam */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-maroon via-amber-400 to-brand-maroon" />

          {/* Subtle Ambient Watermark in Gold Tint */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 opacity-[0.035] pointer-events-none text-stone-900">
            <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
              {[...Array(6)].map((_, i) => (
                <ellipse key={i} cx="100" cy="100" rx="40" ry="90" transform={`rotate(${i * 30} 100 100)`} />
              ))}
            </svg>
          </div>

          <div className="relative z-10 p-5 sm:p-7 lg:p-8">
            {/* Top Header Row with Badge & Sub-label */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-800 text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                <DurgaDeviEmblemIcon className="w-3.5 h-3.5 text-rose-700" />
                <span>{b('শারদ থিম পরিক্রমা ২০২৬ • ৭৪তম বর্ষ', 'Curated Theme 2026 • 74th Year')}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 font-serif font-medium shadow-2xs">
                <DiyaIcon className="w-3.5 h-3.5 text-amber-700" />
                <span>{b('বাঁশদ্রোণী সোনালী পার্ক প্যাভিলিয়ন', 'Bansdroni Sonali Park Pavilion')}</span>
              </span>
            </div>

            {/* Center Display: Theme Title & Concept */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-5 sm:mb-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-stone-900 leading-[1.2] tracking-tight">
                  <span className="text-brand-maroon">&ldquo;</span>
                  {settings.themeTitle ? (
                    <span className="text-stone-900">{settings.themeTitle.replace(/^["'“]/, '').replace(/["'”]$/, '')}</span>
                  ) : (
                    <span className="text-stone-900">{b('অতীতের আয়নায় আগামী', 'Reflections of the Past, Visions of the Future')}</span>
                  )}
                  <span className="text-brand-maroon">&rdquo;</span>
                </h2>
                <div className="my-2">
                  <FestiveWaveAccent className="w-16 h-1.5 text-amber-500" />
                </div>
                <p className="text-stone-600 text-xs sm:text-sm font-serif italic leading-relaxed">
                  {b(
                    'ঐতিহ্যের শিকড় ছুঁয়ে আধুনিক শিল্পকলার দিগন্তে — বাঁশদ্রোণী সোনালী পার্কের ৭৪তম বর্ষের এক অনন্য নান্দনিক স্থাপত্য ভাবনা ও সৃষ্টিশীল মেলবন্ধন।',
                    'Bridging ancestral heritage with visionary contemporary architecture — a sacred artistic tribute in our 74th glorious year.'
                  )}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/puja"
                  className="btn-tactile-crimson text-white pl-5 sm:pl-6 pr-2 sm:pr-2.5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap inline-flex items-center gap-2.5 group shadow-md"
                >
                  <span>{b('সম্পূর্ণ থিম পরিক্রমা ও দর্শন', 'Explore Full Theme & Pandal')}</span>
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-brand-maroon flex items-center justify-center text-xs sm:text-sm font-bold shadow-xs transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* 3 Artisan Dossier Plaques (Sleek, Compact Museum Cameos) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 sm:pt-5 border-t border-stone-200/80">
              <div className="group/art flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#E8DFD1] hover:border-amber-400/70 shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 shadow-2xs group-hover/art:scale-105 group-hover/art:bg-amber-100 transition-all text-amber-700">
                  <MandapIcon className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-brand-maroon font-bold font-serif block">
                    {b('মণ্ডপ শিল্পী', 'Pandal Architect')}
                  </span>
                  <span className="text-xs sm:text-sm font-serif font-black text-stone-900 tracking-tight block truncate">
                    {settings.pandalArtist || b('শিল্প নিকেতন', 'Shilpa Niketan')}
                  </span>
                </div>
              </div>

              <div className="group/art flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#E8DFD1] hover:border-amber-400/70 shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 shadow-2xs group-hover/art:scale-105 group-hover/art:bg-amber-100 transition-all text-amber-700">
                  <SculptorIcon className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-brand-maroon font-bold font-serif block">
                    {b('প্রতিমা শিল্পী', 'Divine Sculptor')}
                  </span>
                  <span className="text-xs sm:text-sm font-serif font-black text-stone-900 tracking-tight block truncate">
                    {settings.idolArtist || b('সনাতন রুদ্র পাল', 'Sanatan Rudra Paul')}
                  </span>
                </div>
              </div>

              <div className="group/art flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#E8DFD1] hover:border-amber-400/70 shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 shadow-2xs group-hover/art:scale-105 group-hover/art:bg-amber-100 transition-all text-amber-700">
                  <IlluminationIcon className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-brand-maroon font-bold font-serif block">
                    {b('আলোকসজ্জা', 'Illumination')}
                  </span>
                  <span className="text-xs sm:text-sm font-serif font-black text-stone-900 tracking-tight block truncate">
                    {settings.lightingArtist || b('দাস ইলেকট্রিক', 'Das Electric')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. FESTIVAL CALENDAR PREVIEW (Authentic Panjika Calendar Leaves) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
              <DiyaIcon className="w-3.5 h-3.5 text-rose-700" />
              <span>{b('শারদীয়া পঞ্জিকা ক্যালেন্ডার ২০২৬', 'Sharad Panjika Calendar 2026')}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              {b('শারদীয়া দুর্গোৎসব', 'Sharadiya Durga Puja')} <span className="text-brand-maroon">{b('দিনপঞ্জি ও নির্ঘণ্ট', 'Calendar')}</span>
            </h2>
            <p className={`text-sm sm:text-base ${curr.textSub} mt-2 leading-relaxed max-w-2xl`}>
              {b(
                'মহাষষ্ঠী থেকে বিজয়া দশমী — প্রতিটি পূজাদিনের বিশেষ আচার, শুভ সময় ও প্রধান উৎসব সূচি',
                'From Maha Shashti to Bijoya Dashami — Daily auspicious ritual timings and festive schedule.'
              )}
            </p>
          </div>
          <Link
            href="/puja"
            className="w-full sm:w-auto justify-center shrink-0 inline-flex items-center gap-3 pl-5 sm:pl-6 pr-2.5 py-2 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
          >
            <span>{b('সম্পূর্ণ নির্ঘণ্ট ও সূচি', 'Full Schedule & Rituals')}</span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
              →
            </span>
          </Link>
        </div>

        {/* 5 Authentic Panjika Calendar Leaves */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {[
            {
              tithiBn: 'মহাষষ্ঠী',
              tithiEn: 'Maha Shashti',
              weekdayBn: 'শুক্রবার',
              weekdayEn: 'Friday',
              dateNumBn: '১৬',
              dateNumEn: '16',
              monthBn: 'অক্টোবর ২০২৬',
              monthEn: 'Oct 2026',
              ceremonyBn: 'কল্পারম্ভ, দেবীর বোধন ও অধিবাস',
              ceremonyEn: 'Kalparambha, Bodhon & Adhibas',
              rituals: [
                { timeBn: 'সকাল ৮:০০', timeEn: '8:00 AM', labelBn: 'কল্পারম্ভ ও বিহিত পূজা', labelEn: 'Kalparambha & Puja' },
                { timeBn: 'সন্ধ্যা ৬:৩০', timeEn: '6:30 PM', labelBn: 'দেবীর বোধন ও আমন্ত্রণ', labelEn: 'Bodhon & Adhibas' },
              ],
              headerGrad: 'from-[#9F1239] to-[#881337]',
              dateColor: 'text-[#9F1239]',
              Icon: ShashtiBilvaIcon,
            },
            {
              tithiBn: 'মহাসপ্তমী',
              tithiEn: 'Maha Saptami',
              weekdayBn: 'শনিবার',
              weekdayEn: 'Saturday',
              dateNumBn: '১৭',
              dateNumEn: '17',
              monthBn: 'অক্টোবর ২০২৬',
              monthEn: 'Oct 2026',
              ceremonyBn: 'নবপত্রিকা স্নান ও সপ্তমী বিহিত পূজা',
              ceremonyEn: 'Nabapatrika Snan & Puja',
              rituals: [
                { timeBn: 'ভোর ৬:৩০', timeEn: '6:30 AM', labelBn: 'গঙ্গায় নবপত্রিকা স্নান', labelEn: 'Nabapatrika Holy Snan' },
                { timeBn: 'সকাল ১০:০০', timeEn: '10:00 AM', labelBn: 'সার্বজনীন পুষ্পাঞ্জলি', labelEn: 'Community Pushpanjali' },
              ],
              headerGrad: 'from-emerald-700 to-emerald-900',
              dateColor: 'text-emerald-800',
              Icon: SaptamiNabapatrikaIcon,
            },
            {
              tithiBn: 'মহাষ্টমী',
              tithiEn: 'Maha Ashtami',
              weekdayBn: 'রবিবার',
              weekdayEn: 'Sunday',
              dateNumBn: '১৮',
              dateNumEn: '18',
              monthBn: 'অক্টোবর ২০২৬',
              monthEn: 'Oct 2026',
              ceremonyBn: 'পুষ্পাঞ্জলি, কুমারী পূজা ও সন্ধিপূজা',
              ceremonyEn: 'Pushpanjali, Kumari & Sandhi Puja',
              rituals: [
                { timeBn: 'সকাল ৯:৪৫', timeEn: '9:45 AM', labelBn: 'মহাষ্টমীর পুষ্পাঞ্জলি', labelEn: 'Maha Ashtami Anjali' },
                { timeBn: 'সন্ধ্যা', timeEn: 'Evening', labelBn: 'সন্ধিপূজা ও ১০৮ প্রদীপ', labelEn: 'Sandhi Puja & 108 Lamps' },
              ],
              headerGrad: 'from-amber-700 to-amber-900',
              dateColor: 'text-amber-800',
              Icon: AshtamiDhunuchiIcon,
            },
            {
              tithiBn: 'মহানবমী',
              tithiEn: 'Maha Navami',
              weekdayBn: 'সোমবার',
              weekdayEn: 'Monday',
              dateNumBn: '১৯',
              dateNumEn: '19',
              monthBn: 'অক্টোবর ২০২৬',
              monthEn: 'Oct 2026',
              ceremonyBn: 'মহাহোম, যজ্ঞ ও মহাভোগ বিতরণ',
              ceremonyEn: 'Maha Homa & Bhog Distribution',
              rituals: [
                { timeBn: 'সকাল ১১:০০', timeEn: '11:00 AM', labelBn: 'মহাহোম ও নবমী যজ্ঞ', labelEn: 'Maha Homa & Yajna' },
                { timeBn: 'দুপুর ১:০০', timeEn: '1:00 PM', labelBn: 'সার্বজনীন মহাভোগ বিতরণ', labelEn: 'Community Mahabhog' },
              ],
              headerGrad: 'from-orange-700 to-orange-900',
              dateColor: 'text-orange-800',
              Icon: NavamiHomaIcon,
            },
            {
              tithiBn: 'বিজয়া দশমী',
              tithiEn: 'Bijoya Dashami',
              weekdayBn: 'মঙ্গলবার',
              weekdayEn: 'Tuesday',
              dateNumBn: '২০',
              dateNumEn: '20',
              monthBn: 'অক্টোবর ২০২৬',
              monthEn: 'Oct 2026',
              ceremonyBn: 'দর্পণ বিসর্জন, সিঁদুর খেলা ও বরণ',
              ceremonyEn: 'Darpan Bisarjan & Sindoor Khela',
              rituals: [
                { timeBn: 'সকাল ৯:৪৫', timeEn: '9:45 AM', labelBn: 'দর্পণ বিসর্জন ও সমাপন', labelEn: 'Darpan Bisarjan' },
                { timeBn: 'সকাল ১০:৩০', timeEn: '10:30 AM', labelBn: 'সিঁদুর খেলা ও দেবী বরণ', labelEn: 'Sindoor Khela & Baran' },
              ],
              headerGrad: 'from-rose-900 to-[#500619]',
              dateColor: 'text-rose-900',
              Icon: DashamiTrishulIcon,
            },
          ].map((c, i) => (
            <Link
              key={i}
              href="/puja"
              className="group relative bg-[#FFFDF9] rounded-2xl border border-[#E5DAC8] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* 1. TOP CALENDAR BINDING HEADER BAR */}
              <div className={`px-3.5 py-2.5 bg-gradient-to-r ${c.headerGrad} text-white flex items-center justify-between shadow-xs`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/40 border border-white/60" />
                  <span className="font-serif font-bold text-xs tracking-wide">
                    {b(c.tithiBn, c.tithiEn)}
                  </span>
                </div>
                <span className="text-[11px] font-sans font-medium text-amber-200">
                  {b(c.weekdayBn, c.weekdayEn)}
                </span>
              </div>

              {/* 2. CALENDAR DATE LEAF BODY */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Date Display */}
                  <div className="flex items-baseline justify-between gap-2 border-b border-stone-200/60 pb-3 mb-3">
                    <div>
                      <span className={`text-3xl sm:text-4xl font-serif font-black ${c.dateColor} leading-none block tabular-nums`}>
                        {b(c.dateNumBn, c.dateNumEn)}
                      </span>
                      <span className="text-[11px] font-serif font-semibold text-stone-500 uppercase tracking-wider block mt-1">
                        {b(c.monthBn, c.monthEn)}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-stone-100/90 border border-stone-200/80 flex items-center justify-center text-stone-700 group-hover:scale-105 transition-transform shrink-0">
                      <c.Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Occasion / Ceremony Title (NON-REPETITIVE!) */}
                  <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 group-hover:text-brand-maroon transition-colors leading-snug line-clamp-2">
                    {b(c.ceremonyBn, c.ceremonyEn)}
                  </h3>

                  <div className="my-2">
                    <FestiveWaveAccent className="w-12 h-1.5 text-amber-500/80" />
                  </div>

                  {/* 2 Clean Timing Highlights (100% visible, ZERO truncation!) */}
                  <div className="space-y-1.5 my-3">
                    {c.rituals.map((r, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50/90 px-2.5 py-1.5 rounded-lg border border-stone-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="font-bold text-stone-900 shrink-0 font-serif">{b(r.timeBn, r.timeEn)}</span>
                        <span className="text-stone-400">·</span>
                        <span className="truncate text-stone-600">{b(r.labelBn, r.labelEn)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. CALENDAR FOOTER LINK */}
                <div className="pt-3 border-t border-dashed border-stone-200 flex items-center justify-between text-xs font-bold text-brand-maroon group-hover:translate-x-0.5 transition-transform">
                  <span>{b('পূজা নির্ঘণ্ট দেখুন', 'Full Rituals')}</span>
                  <span className="w-5 h-5 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs transition-colors">
                    →
                  </span>
                </div>
              </div>

              {/* Perforated bottom tear-off deckle edge */}
              <div className="w-full opacity-60">
                <TornDeckleEdge className="w-full text-stone-200 h-1.5 block" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 3. GLIMPSES GALLERY (Unified Editorial Controls & No Scrollbar) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-5 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
              <DiyaIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>Moments & Archives • {toDigits(selectedYear)}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              {b('স্মৃতির পাতা থেকে', 'Memories & Moments')} <span className="text-brand-maroon">{b('ফটোগ্রাফি', 'Gallery')}</span>
            </h2>
            <p className={`text-sm sm:text-base ${curr.textSub} mt-2 leading-relaxed max-w-2xl`}>
              {b(
                'বিগত বছরগুলোর আবেগ, ধুনুচি নাচ, আলোকসজ্জা ও মায়ের অপরূপ রূপের রঙিন অ্যালবাম',
                'Cherished moments of festivity, sacred rituals, dazzling illumination, and divine celebrations.'
              )}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollGallery('left')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-stone-200 bg-white hover:bg-brand-maroon text-stone-700 hover:text-white transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => scrollGallery('right')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-stone-200 bg-white hover:bg-brand-maroon text-stone-700 hover:text-white transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-2 py-1.5 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
            >
              <span>{b('পুরো অ্যালবাম', 'View All Photos')}</span>
              <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </Link>
          </div>
        </div>

        {data.gallery.length === 0 ? (
          <div className={`text-center py-14 ${curr.cardBg} rounded-2xl border border-dashed border-stone-300 flex flex-col items-center justify-center gap-2.5`}>
            <DiyaIcon className="w-8 h-8 text-amber-500" />
            <p className={`font-serif text-sm sm:text-base ${curr.textSub}`}>
              {b('গ্যালারিতে এখনো কোনো ছবি যোগ করা হয়নি। উৎসবের সুন্দর মুহূর্তগুলো শীঘ্রই যোগ করা হবে।', 'No gallery photos uploaded yet. Festive moments will be added soon.')}
            </p>
          </div>
        ) : (
          <div
            ref={galleryScrollRef}
            className="relative w-full overflow-x-auto flex gap-4 sm:gap-6 py-3 snap-x snap-mandatory scroll-smooth scrollbar-hide no-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {(data.gallery.filter(g => g.year === selectedYear).length > 0
              ? data.gallery.filter(g => g.year === selectedYear)
              : data.gallery).slice(0, 10).map((img, i) => (
              <div
                key={i}
                className={`relative h-64 sm:h-76 md:h-84 w-[75vw] max-w-[280px] sm:w-88 md:w-96 shrink-0 rounded-3xl overflow-hidden shadow-md hover:shadow-xl border transition-all duration-300 snap-center group cursor-pointer ${
                  curr.isDark ? 'border-white/10 hover:border-brand-maroon/50' : 'border-stone-200/80 hover:border-brand-maroon/40'
                }`}
                onClick={() => setSelectedImage(img)}
              >
                {/* Pinned Moment Badge */}
                <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                  <WashiTapePin text={b(`স্মৃতি #${toDigits(i + 1)}`, `Moment #${i + 1}`)} variant="amber" className="text-[9px]" />
                </div>

                <img
                  src={img.src}
                  alt={img.title || 'Durga Puja Moment'}
                  onError={(e) => { e.currentTarget.src = '/assets/durga-hero.png'; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Frosted Vignette & Action Pill */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1224]/95 via-[#0B1224]/30 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <p className="text-white font-bold text-sm truncate mb-3">{img.title || b('বাঁশদ্রোণী সোনালী পার্ক', 'Bansdroni Sonali Park')}</p>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 bg-black/50 hover:bg-brand-maroon text-white backdrop-blur-md border border-white/20 px-4 py-2 rounded-full font-bold transition-all duration-200 w-max text-xs shadow-md cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerDownload(img.src, `${img.title || 'durga-puja-moment'}.jpg`);
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    {b('ডাউনলোড', 'Download')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-[#0B1224]/90 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-50 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img src={selectedImage.src} alt={selectedImage.title} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            <div className="mt-4 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-white text-2xl font-bold">{selectedImage.title}</h3>
              <button
                type="button"
                onClick={() => triggerDownload(selectedImage.src, `${selectedImage.title || 'durga-puja-moment'}.jpg`)}
                className="mt-4 inline-flex items-center gap-2 bg-brand-maroon text-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-brand-maroon transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {b('সম্পূর্ণ ছবি ডাউনলোড', 'Download Full Size')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 4. PUJA NOTICES (Live Bulletins & Circulars) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
              <NoticeScrollIcon className="w-3.5 h-3.5 text-rose-700" />
              <span>{b('শারদীয়া বুলেটিন', 'Puja Bulletins')}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              {b('পূজা নোটিশ ও', 'Puja')} <span className="text-brand-maroon">{b('বিজ্ঞপ্তি', 'Notices')}</span>
            </h2>
            <p className={`text-sm sm:text-base ${curr.textSub} mt-2 leading-relaxed max-w-2xl`}>
              {b(
                'শারদীয়া দুর্গোৎসবের সমস্ত আনুষ্ঠানিক বিজ্ঞপ্তি, সময়সূচি পরিবর্তন, অঞ্জলি ও সাংস্কৃতিক নির্দেশিকা',
                'Official Durga Puja notices, ritual announcements, pushpanjali guidelines, and event updates.'
              )}
            </p>
          </div>
          <div className="shrink-0 text-xs font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-stone-100 text-stone-700 border border-stone-200 shadow-sm">
            {b('সক্রিয় বিজ্ঞপ্তি', 'Active Notices')}: {toDigits(notices.length)} {b('টি', '')}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-7 sm:gap-9 pt-5 sm:pt-6">
          {notices.length > 0 ? notices.map((notice, idx) => (
            <div
              key={notice.id || idx}
              className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_8px_24px_rgba(28,13,19,0.05)] hover:shadow-[0_18px_38px_rgba(159,18,57,0.12)] rounded-3xl pt-8 pb-5 pl-9 sm:pl-12 pr-6 sm:pr-8 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image 3: Pinned Textured Washi Tape on Top Center (Zero clipping) */}
              <div className="absolute -top-3.5 left-8 sm:left-10 z-20">
                <WashiTapePin text={b(`বিজ্ঞপ্তি নং ০${idx + 1} • ২০২৬`, `Notice #${idx + 1} • 2026`)} variant="amber" />
              </div>

              {/* Image 3: Left Perforated Spiral Binder Margin */}
              <div className="absolute left-2.5 sm:left-3 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
                <BinderHoles count={5} />
              </div>

              {/* Top Alta Seam */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-maroon/10 text-brand-maroon border border-brand-maroon/20 font-serif shadow-2xs">
                  <NoticeScrollIcon className="w-3.5 h-3.5 text-brand-maroon" />
                  <span>{b('জরুরি ঘোষণা', 'Official Circular')}</span>
                </span>
                <span className="text-[11px] font-medium text-stone-600 bg-stone-100/90 px-2.5 py-0.5 rounded-full border border-stone-200">
                  {formatDate(notice.date, lang)}
                </span>
              </div>

              {/* Title */}
              <h3 className={`text-base sm:text-lg font-bold ${curr.textHead} mb-1 leading-snug group-hover:text-brand-maroon transition-colors`}>
                {t(notice.title?.replace(/^\[Puja\]\s*/, ''))}
              </h3>

              {/* Image 2 Wave Accent */}
              <div className="mb-2.5">
                <FestiveWaveAccent className="w-12 h-1.5 text-amber-500/80" />
              </div>

              {/* Body */}
              <p className={`${curr.textSub} text-xs sm:text-sm leading-relaxed mb-4`}>
                {notice.text}
              </p>

              {/* Image 3: Torn Paper Deckle Bottom Edge */}
              <div className="pt-2 -mx-4 -mb-3 opacity-80">
                <TornDeckleEdge className="w-full text-stone-200/90 h-2 block" />
              </div>
            </div>
          )) : (
            <div className="col-span-2 relative text-center py-14 px-6 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] flex flex-col items-center justify-center gap-3">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <WashiTapePin text={b("শারদীয়া বুলেটিন বোর্ড", "Notice Board")} />
              </div>
              <NoticeScrollIcon className="w-9 h-9 text-brand-maroon" />
              <p className={`font-serif text-sm sm:text-base ${curr.textSub} max-w-md`}>
                {b('এই বছরের কোনো নতুন নোটিশ প্রকাশিত হয়নি। সমস্ত নিয়মিত আপডেট এখানে দেখতে পাবেন।', 'No new notices published for this year yet. All regular circulars will appear here.')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ 5. VISIT OUR OTHER PORTALS (Compact Redesigned Bento Cards) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
              <ShankhaIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>{b('অন্যান্য পোর্টাল ও বিভাগ', 'Sister Portals & Wings')}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              {b('আমাদের অন্যান্য বিভাগ', 'Explore Our Other')} <span className="text-brand-maroon">{b('দেখুন', 'Portals')}</span>
            </h2>
            <p className={`text-sm sm:text-base ${curr.textSub} mt-2 leading-relaxed max-w-2xl`}>
              {b(
                'বাঁশদ্রোণী সোনালী পার্কের ক্লাব এবং নাগরিক উন্নয়ন সমিতির আলাদা নিবেদিত পেজগুলো ঘুরে দেখুন — যেখানে পাবেন নিজস্ব কার্যনির্বাহী কমিটি, আর্থিক হিসাব ও নির্দিষ্ট নোটিশ।',
                'Visit our dedicated portals for Bansdroni Sonali Sangha and Sonali Park Unnayan Samiti — featuring dedicated leadership, accounts, and announcements.'
              )}
            </p>
          </div>
          <Link
            href="/committee"
            className="shrink-0 text-xs font-bold pl-4 sm:pl-5 pr-2 py-1.5 rounded-full btn-tactile-parchment text-stone-800 hover:text-brand-maroon transition-all duration-200 flex items-center gap-2 group shadow-xs"
          >
            <span>{b('সকল কমিটির তালিকা', 'View All Committees')}</span>
            <span className="w-5 h-5 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
              →
            </span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-7 sm:gap-9 pt-5 sm:pt-6">
          {/* Wing 1: Bansdroni Sonali Sangha (Club) */}
          <div className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_8px_24px_rgba(28,13,19,0.05)] hover:shadow-[0_18px_38px_rgba(159,18,57,0.12)] rounded-3xl pt-8 pb-5 pl-9 sm:pl-12 pr-6 sm:pr-8 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            {/* Pinned Textured Washi Tape on Top Center */}
            <div className="absolute -top-3.5 left-8 sm:left-10 z-20">
              <WashiTapePin text={b("ক্লাব ও ক্রীড়া পরিষদ • রেজি: SO067242", "Club & Sports Wing • Reg: SO067242")} variant="amber" />
            </div>

            {/* Left Perforated Spiral Binder Margin */}
            <div className="absolute left-2.5 sm:left-3 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
              <BinderHoles count={5} />
            </div>

            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                    <ClubCrestIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className={`text-lg sm:text-xl font-bold ${curr.textHead} leading-tight group-hover:text-brand-maroon transition-colors`}>
                      {b('বাঁশদ্রোণী সোনালী সঙ্ঘ', 'Bansdroni Sonali Sangha')}
                    </h3>
                    <span className="text-xs text-stone-500 font-medium block mt-0.5">
                      {b('ক্লাব, ক্রীড়া ও যুবকল্যাণ', 'Club, Sports & Youth Welfare')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Image 2 Wave Accent */}
              <div className="mb-3">
                <FestiveWaveAccent className="w-14 h-1.5 text-amber-500" />
              </div>

              <p className={`${curr.textSub} text-xs sm:text-sm leading-relaxed mb-4`}>
                {b(
                  'আমাদের সংস্কৃতি, আনন্দ ও ক্রীড়া উৎসবের প্রাণকেন্দ্র। ফুটবল, ক্রিকেট টুর্নামেন্ট, রক্তদান শিবির ও সারা বছর সমাজসেবামূলক কর্মকাণ্ড আয়োজন করে এই ক্লাব।',
                  'The athletic and cultural heartbeat of Sonali Park. Hosting seasonal tournaments, blood donation camps, and humanitarian social welfare.'
                )}
              </p>

              {/* Compact Highlight Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-stone-700 text-[11px] font-medium border border-[#E8DFD1]">
                  <SportsBadgeIcon className="w-3.5 h-3.5 text-stone-600" />
                  <span>{b('বার্ষিক ক্রীড়া প্রতিযোগিতা', 'Annual Sports')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-stone-700 text-[11px] font-medium border border-[#E8DFD1]">
                  <BloodDonationBadgeIcon className="w-3.5 h-3.5 text-rose-600" />
                  <span>{b('রক্তদান শিবির', 'Blood Donation')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-stone-700 text-[11px] font-medium border border-[#E8DFD1]">
                  <CulturalStageBadgeIcon className="w-3.5 h-3.5 text-amber-700" />
                  <span>{b('সাংস্কৃতিক সন্ধ্যা', 'Cultural Evenings')}</span>
                </span>
              </div>
            </div>

            <div>
              <Link
                href="/club"
                className="btn-tactile-parchment inline-flex items-center justify-between w-full py-2.5 sm:py-3 pl-4 sm:pl-5 pr-2.5 sm:pr-3 rounded-2xl text-stone-800 hover:text-brand-maroon font-bold text-xs sm:text-sm transition-all duration-200 group/btn shadow-xs mb-3"
              >
                <span>{b('সোনালী সঙ্ঘ পেজ দেখুন', 'Visit Sonali Sangha Portal')}</span>
                <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover/btn:bg-brand-maroon text-brand-maroon group-hover/btn:text-white flex items-center justify-center text-xs font-bold transition-colors">
                  →
                </span>
              </Link>
              {/* Torn Deckle Edge */}
              <div className="-mx-4 -mb-3 opacity-80">
                <TornDeckleEdge className="w-full text-stone-200/90 h-2 block" />
              </div>
            </div>
          </div>

          {/* Wing 2: Sonali Park Unnayan Samiti */}
          <div className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_8px_24px_rgba(28,13,19,0.05)] hover:shadow-[0_18px_38px_rgba(159,18,57,0.12)] rounded-3xl pt-8 pb-5 pl-9 sm:pl-12 pr-6 sm:pr-8 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            {/* Pinned Textured Washi Tape on Top Center */}
            <div className="absolute -top-3.5 left-8 sm:left-10 z-20">
              <WashiTapePin text={b("নাগরিক উন্নয়ন ও সেবা • রেজিস্টার্ড RWA", "Civic Welfare & Registered RWA")} variant="emerald" />
            </div>

            {/* Left Perforated Spiral Binder Margin */}
            <div className="absolute left-2.5 sm:left-3 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
              <BinderHoles count={5} />
            </div>

            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                    <SamitiEmblemIcon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className={`text-lg sm:text-xl font-bold ${curr.textHead} leading-tight group-hover:text-brand-maroon transition-colors`}>
                      {b('সোনালী পার্ক উন্নয়ন সমিতি', 'Sonali Park Unnayan Samiti')}
                    </h3>
                    <span className="text-xs text-stone-500 font-medium block mt-0.5">
                      {b('নাগরিক উন্নয়ন ও সেবা পরিষদ', 'Civic Development & Residents Welfare')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Image 2 Wave Accent */}
              <div className="mb-3">
                <FestiveWaveAccent className="w-14 h-1.5 text-emerald-600" />
              </div>

              <p className={`${curr.textSub} text-xs sm:text-sm leading-relaxed mb-4`}>
                {b(
                  'আমাদের পাড়ার অভিভাবক ও পরিচালন পরিষদ। রাস্তাঘাট সংস্কার, আলোক পরিকাঠামো, পরিচ্ছন্নতা, ড্রেনেজ ও নাগরিকদের দৈনন্দিন স্বাচ্ছন্দ্য রক্ষায় সার্বক্ষণিক নিবেদিত।',
                  'The civic guardian and registered RWA of our locality. Stewarding security, paved roads, lighting, sanitation, and neighborhood development.'
                )}
              </p>

              {/* Compact Highlight Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-stone-700 text-[11px] font-medium border border-[#E8DFD1]">
                  <CivicShieldBadgeIcon className="w-3.5 h-3.5 text-stone-600" />
                  <span>{b('নাগরিক নিরাপত্তা ও সিসিটিভি', 'Security & CCTV')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-stone-700 text-[11px] font-medium border border-[#E8DFD1]">
                  <CivicLightBadgeIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>{b('রাস্তাঘাট ও আলোক পরিকাঠামো', 'Roads & Lights')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-stone-700 text-[11px] font-medium border border-[#E8DFD1]">
                  <CivicGreeneryBadgeIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{b('পরিবেশ পরিচ্ছন্নতা ও বৃক্ষরোপণ', 'Sanitation & Greenery')}</span>
                </span>
              </div>
            </div>

            <div>
              <Link
                href="/samiti"
                className="btn-tactile-parchment inline-flex items-center justify-between w-full py-2.5 sm:py-3 pl-4 sm:pl-5 pr-2.5 sm:pr-3 rounded-2xl text-stone-800 hover:text-brand-maroon font-bold text-xs sm:text-sm transition-all duration-200 group/btn shadow-xs mb-3"
              >
                <span>{b('উন্নয়ন সমিতি পেজ দেখুন', 'Visit Unnayan Samiti Portal')}</span>
                <span className="w-6 h-6 rounded-full bg-emerald-600/10 group-hover/btn:bg-emerald-600 text-emerald-700 group-hover/btn:text-white flex items-center justify-center text-xs font-bold transition-colors">
                  →
                </span>
              </Link>
              {/* Torn Deckle Edge */}
              <div className="-mx-4 -mb-3 opacity-80">
                <TornDeckleEdge className="w-full text-stone-200/90 h-2 block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. VISITOR INFORMATION / FAQ (Stately Center with Emerald Accent) ═══ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <DiyaIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>{b('দর্শনার্থীদের সহায়তা ও তথ্য', 'Visitor Information & Assistance')}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
            {b('দর্শনার্থীদের সাধারণ', 'Frequently Asked')} <span className="text-brand-maroon">{b('জিজ্ঞাসা ও FAQ', 'Questions (FAQ)')}</span>
          </h2>
          <p className={`text-sm sm:text-base ${curr.textSub} mt-2 sm:mt-3 leading-relaxed`}>
            {b(
              'বাঁশদ্রোণী সোনালী পার্ক মণ্ডপে আসার আগে প্রয়োজনীয় দিকনির্দেশনা, অঞ্জলির সময় ও পার্কিং সংক্রান্ত তথ্য',
              'Essential visitor guidelines, anjali timings, transit directions, and pandal assistance.'
            )}
          </p>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {[
            {
              tag: b('পার্কিং', 'Parking'),
              q: b('পুজো প্রাঙ্গণে কি গাড়ি রাখার ব্যবস্থা আছে?', 'Is parking available near the Puja pandal?'),
              a: b(
                'হ্যাঁ, প্যান্ডেলের কাছাকাছি নির্দিষ্ট স্থানে টু-হুইলার এবং ফোর-হুইলার পার্কিংয়ের ব্যবস্থা থাকে। তবে ভিড়ের সময় কিছুটা হেঁটে আসতে হতে পারে, তাই পাবলিক ট্রান্সপোর্ট ব্যবহার করার পরামর্শ দেওয়া হচ্ছে।',
                'Yes, designated two-wheeler and four-wheeler parking spaces are available near the venue. Public transport is recommended during peak festival hours.'
              )
            },
            {
              tag: b('সময়সূচি', 'Timings'),
              q: b('পুষ্পাঞ্জলি এবং আরতির সময় কখন?', 'What are the timings for Pushpanjali and Arati?'),
              a: b(
                'মহাষ্টমীর দিন সকাল ৭টা থেকে পুষ্পাঞ্জলি শুরু হয়। প্রতিদিন সন্ধ্যায় ৬:৩০ থেকে সন্ধারতি ও আরতির আয়োজন থাকে। বিস্তারিত সময়সূচি আমাদের "পূজা নির্ঘণ্ট" পাতায় দেখতে পারেন।',
                'Morning Pushpanjali begins from 7:00 AM on Maha Ashtami. Daily evening Sandhyarati commences at 6:30 PM. See our Festival Schedule for complete details.'
              )
            },
            {
              tag: b('সহজ প্রবেশ্যতা', 'Accessibility'),
              q: b('বয়স্ক এবং বিশেষ চাহিদাসম্পন্ন দর্শনার্থীদের জন্য কি ব্যবস্থা আছে?', 'Are there facilities for senior citizens and differently-abled visitors?'),
              a: b(
                'বয়স্ক মানুষ, গর্ভবতী মহিলা এবং হুইলচেয়ার ব্যবহারকারীদের জন্য আমাদের অগ্রাধিকার দর্শন লেন ও বসার বিশেষ ব্যবস্থা রয়েছে। আমাদের স্বেচ্ছাসেবকরা সর্বক্ষণ সাহায্যে প্রস্তুত।',
                'Priority darshan lanes, wheelchair-friendly entry, and designated seating are arranged for senior citizens, expectant mothers, and differently-abled visitors.'
              )
            },
            {
              tag: b('দিকনির্দেশনা', 'Directions'),
              q: b('মেট্রো দিয়ে কীভাবে পৌঁছানো যায়?', 'How do I reach the pandal via Kolkata Metro?'),
              a: b(
                'সবচেয়ে কাছের মেট্রো স্টেশন হলো "মাস্টারদা সূর্য সেন" (বাঁশদ্রোণী)। সেখান থেকে অটো বা টোটোয় মাত্র ৫ মিনিটে সোনালী পার্কে পৌঁছানো যায়।',
                'The nearest metro station is Masterda Surya Sen (Bansdroni). From the metro exit, toto or auto-rickshaws reach Sonali Park in just 5 minutes.'
              )
            }
          ].map((faq, i) => (
            <div
              key={i}
              className={`group card-tactile-parchment rounded-2xl overflow-hidden transition-all duration-200 ${openFaq === i ? 'border-brand-maroon/40 ring-1 ring-brand-maroon/25' : 'border-[#E8DFD1] hover:border-brand-maroon/30'}`}
            >
              <button
                className={`w-full px-4 sm:px-6 py-3.5 sm:py-5 text-left flex justify-between items-center gap-3 sm:gap-4 font-bold ${curr.textHead} focus:outline-none cursor-pointer`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base md:text-lg">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#FAF7F2] text-stone-700 border border-[#E8DFD1] shrink-0 font-serif">
                    {faq.tag}
                  </span>
                  <span className="group-hover:text-brand-maroon transition-colors">{faq.q}</span>
                </span>
                <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 shrink-0 transition-transform duration-300 group-hover:text-brand-maroon ${openFaq === i ? 'rotate-180 bg-brand-maroon/10 text-brand-maroon border-brand-maroon/30' : ''}`}>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              {openFaq === i && (
                <div className={`px-4 sm:px-6 pb-4 sm:pb-6 ${curr.textSub} leading-relaxed border-t ${curr.isDark ? 'border-white/10' : 'border-stone-100'} pt-3.5 sm:pt-4 text-xs sm:text-sm md:text-base`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
