'use client';
import { useState, useRef, useEffect } from 'react';
import { Sun, Sunset, Moon } from 'lucide-react';
import Countdown from "@/components/Countdown";
import HeroParticles from "@/components/HeroParticles";
import { triggerDownload } from "@/utils/download";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { data, settings, selectedYear } = useData();
  const { lang, changeLanguage, t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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
      timeGreeting: '✨ শুভ শারদ প্রভাত',
      headlinePrefix: 'শারদ প্রাতে ',
      headlineHighlight: 'মায়ের আগমন...',
      headline: 'শারদ প্রাতে মায়ের আগমন...',
      subline: 'আনন্দ আর আলোয় সাজুক ভুবন',
      quote: 'প্রতিটি ভোরে মায়ের আশীর্বাদ, শিউলি ঝরা আগমনীর সুর',
      taglineSub: "Every dawn carries Mother's divine grace",
      counterHeading: 'মা আসছেন...',
      counterSub: 'মহাষষ্ঠী ১৬ অক্টোবর ২০২৬',
      accentColor: '#E11D48',
      badgeClass: 'bg-stone-950/70 text-rose-200 border-rose-300/30 shadow-lg',
      quoteClass: 'text-rose-100 border-[#E11D48]',
      counterGlass: 'bg-[#12070D]/75 border-rose-400/30 text-white',
      isDark: false,
      sectionGalleryBg: 'bg-[#FAF7F2] border-stone-200/70',
      cardBg: 'bg-white border border-stone-200/80 shadow-sm',
      textHead: 'text-stone-900',
      textSub: 'text-stone-600',
      textMuted: 'text-stone-500',
    },
    afternoon: {
      pageBg: '#FAF7F2',
      heroBg: '#FAF7F2',
      photo: settings?.heroImageAfternoon || '/assets/durga-afternoon.png',
      photoFallback: settings?.heroImageFallback || '/assets/durga-hero.png',
      timeGreeting: '✨ শারদীয়ার শুভ অপরাহ্ন',
      headlinePrefix: 'কাশফুলের দোলায় ',
      headlineHighlight: 'পুজোর গন্ধ...',
      headline: 'কাশফুলের দোলায় পুজোর গন্ধ...',
      subline: 'মেতেছে বাঁশদ্রোণী সোনালী পার্ক',
      quote: 'লক্ষ কণ্ঠে একই উচ্চারণ — জয় মা দুর্গা',
      taglineSub: "A million voices united in devotion — Joy Maa Durga",
      counterHeading: 'মা আসছেন বাঁশদ্রোণীতে...',
      counterSub: 'মহাষষ্ঠী ১৬ অক্টোবর ২০২৬',
      accentColor: '#E11D48',
      badgeClass: 'bg-stone-950/70 text-rose-200 border-rose-300/30 shadow-lg',
      quoteClass: 'text-rose-100 border-[#E11D48]',
      counterGlass: 'bg-[#12070D]/75 border-rose-400/30 text-white',
      isDark: false,
      sectionGalleryBg: 'bg-[#FAF7F2] border-stone-200/70',
      cardBg: 'bg-white border border-stone-200/80 shadow-sm',
      textHead: 'text-stone-900',
      textSub: 'text-stone-600',
      textMuted: 'text-stone-500',
    },
    evening: {
      pageBg: '#FAF7F2',
      heroBg: '#FAF7F2',
      photo: settings?.heroImageEvening || '/assets/durga-evening.png',
      photoFallback: settings?.heroImageFallback || '/assets/durga-hero.png',
      timeGreeting: '✨ শারদ সান্ধ্য বন্দনা',
      headlinePrefix: 'সন্ধ্যা আরতিতে ',
      headlineHighlight: 'আলোর উৎসব...',
      headline: 'সন্ধ্যা আরতিতে আলোর উৎসব...',
      subline: 'মা অপরূপা সোনালী প্রাঙ্গণে',
      quote: 'সন্ধ্যাপ্রদীপের শিখায় আরতি, মাগো তোমায় কোটি কোটি প্রণাম',
      taglineSub: "In the evening's celestial glow, Mother is resplendent",
      counterHeading: 'মা আসছেন বছর ঘুরে...',
      counterSub: 'মহাষষ্ঠী ১৬ অক্টোবর ২০২৬',
      accentColor: '#E11D48',
      badgeClass: 'bg-stone-950/70 text-rose-200 border-rose-300/30 shadow-lg',
      quoteClass: 'text-rose-100 border-[#E11D48]',
      counterGlass: 'bg-[#12070D]/75 border-rose-400/30 text-white',
      isDark: false,
      sectionGalleryBg: 'bg-[#FAF7F2] border-stone-200/70',
      cardBg: 'bg-white border border-stone-200/80 shadow-sm',
      textHead: 'text-stone-900',
      textSub: 'text-stone-600',
      textMuted: 'text-stone-500',
    }
  };

  const curr = themes[timeOfDay];

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const notices = data.notices.filter(n => n.year === selectedYear);

  return (
    <main className="min-h-screen transition-colors duration-700 selection:bg-brand-maroon selection:text-white" style={{ backgroundColor: curr.pageBg }}>

      {/* ══════════════════════════════════════════════════════
          HERO FESTIVAL POSTER — 100% Scene with Winged Quotes & Downside Counter
          Maa Durga & Lion in center remain 100% clear and unobstructed
          ══════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden transition-colors duration-700" style={{ backgroundColor: curr.pageBg }}>

        {/* Sacred Festival Deity Frame — 100% Uncropped, Zero Text Obstruction on Any Device */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/9] overflow-hidden">
          {(['morning', 'afternoon', 'evening']).map((tod) => (
            <div
              key={tod}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: timeOfDay === tod ? 1 : 0 }}
            >
              <img
                src={themes[tod].photo}
                alt="Maa Durga — Sharadiya Durga Puja 2026"
                className="w-full h-full object-cover object-top sm:object-center"
                onError={(e) => { e.currentTarget.src = themes[tod].photoFallback; }}
              />
            </div>
          ))}

          {/* Desktop Edge Vignettes — Only on Desktop (>= lg) for High Wing Contrast while keeping Deity Pristine */}
          <div className="absolute inset-0 pointer-events-none z-[2] hidden lg:block" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 32%, transparent 60%)' }} />
          <div className="absolute inset-0 pointer-events-none z-[2] hidden lg:block" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.12) 25%, transparent 50%)' }} />
          <div className="absolute inset-0 pointer-events-none z-[2] hidden lg:block" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 22%, transparent 45%)' }} />

          {/* Soft Mobile Bottom Shadow to ground the temple arch */}
          <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-[2] block lg:hidden" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)' }} />

          {/* Hero Ambient Particle Engine (Zero-Lag Canvas: Kashful & Golden Embers) */}
          <HeroParticles timeOfDay={timeOfDay} />

          {/* ════ DESKTOP WIDE-SCREEN ONLY (>= lg: 1024px+): LEFT WING ════ */}
          <div className="absolute top-28 sm:top-32 md:top-36 lg:top-40 xl:top-48 left-6 sm:left-8 lg:left-14 max-w-sm md:max-w-md lg:max-w-lg z-20 pointer-events-none hidden lg:block">
            {/* Dynamic Time Greeting Badge */}
            <div className={`inline-flex items-center gap-2 mb-2 sm:mb-3 px-3.5 py-1.5 rounded-full border text-[11px] sm:text-xs font-bold tracking-wider uppercase pointer-events-auto backdrop-blur-md ${curr.badgeClass}`}>
              <span>{curr.timeGreeting}</span>
              <span className="opacity-40">·</span>
              <span className="font-serif normal-case tracking-normal text-amber-200 font-bold">২০২৬</span>
            </div>

            {/* Main Headline for the Time of Day */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              {settings.heroHeading ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF8] via-rose-100 to-rose-200">
                  {settings.heroHeading}
                </span>
              ) : (
                <>
                  <span className="text-[#FFFDF8]">{curr.headlinePrefix}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-300 to-amber-100 drop-shadow-[0_2px_12px_rgba(190,24,93,0.5)]">
                    {curr.headlineHighlight}
                  </span>
                </>
              )}
            </h1>
            <p className="text-base md:text-lg text-rose-100/95 font-serif italic mt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {settings.heroSubHeading || curr.subline}
            </p>

            {/* Dynamic Poetic Bengali Quote Inscribed Plaque */}
            <div className="mt-3 sm:mt-4 pl-3.5 pr-4 py-2 rounded-r-2xl bg-gradient-to-r from-stone-950/80 via-stone-950/50 to-transparent backdrop-blur-md border-l-4 border-rose-500 shadow-lg pointer-events-auto max-w-fit">
              <span className="text-xs sm:text-sm md:text-base font-serif italic leading-relaxed text-[#FFF5F6] drop-shadow-sm">
                &ldquo;{curr.quote}&rdquo;
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 sm:mt-6 pointer-events-auto">
              <Link
                href="/puja"
                className="bg-gradient-to-r from-[#BE123C] to-[#881337] hover:from-[#E11D48] hover:to-[#9F1239] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-[0_4px_20px_rgba(190,18,60,0.45)] hover:shadow-[0_6px_25px_rgba(225,29,72,0.6)] hover:-translate-y-0.5 border border-rose-300/30 whitespace-nowrap"
              >
                দুর্গাপূজা ২০২৬ →
              </Link>
              <Link
                href="/transparency"
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-stone-950/60 hover:bg-white text-rose-100 hover:text-stone-900 border border-white/25 transition-all shadow-xl hover:-translate-y-0.5 backdrop-blur-md whitespace-nowrap"
              >
                হিসাব নিকাশ
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
                <span className="text-amber-300 text-xs">📅</span>
                <span>{curr.counterSub}</span>
              </span>

              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-emerald-400/35 text-xs text-emerald-200 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>মণ্ডপ প্রস্তুতি চলছে</span>
              </span>

              <a
                href="https://maps.google.com/?q=Bansdroni+Sonali+Park+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-rose-300/30 text-xs text-rose-100 hover:bg-white hover:text-stone-900 hover:border-white transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.5)] group"
              >
                <span className="text-xs group-hover:scale-110 transition-transform">📍</span>
                <span>বাঁশদ্রোণী মেট্রো থেকে ৫ মিনিট</span>
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
              <span>{curr.timeGreeting}</span>
              <span className="opacity-40">·</span>
              <span className="font-serif normal-case tracking-normal text-amber-200 font-bold">২০২৬</span>
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
          <div className="mt-3 pl-3 pr-3 py-2 rounded-r-2xl bg-stone-900/5 border-l-4 border-brand-maroon shadow-2xs">
            <span className="text-xs sm:text-sm font-serif italic leading-relaxed text-stone-800">
              &ldquo;{curr.quote}&rdquo;
            </span>
          </div>

          {/* Full-width Touch Friendly Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-4 w-full">
            <Link
              href="/puja"
              className="bg-gradient-to-r from-[#BE123C] to-[#881337] hover:from-[#E11D48] hover:to-[#9F1239] active:scale-[0.98] text-white py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-[0_4px_14px_rgba(190,18,60,0.35)] border border-rose-300/30 flex items-center justify-center text-center whitespace-nowrap"
            >
              দুর্গাপূজা ২০২৬ →
            </Link>
            <Link
              href="/transparency"
              className="py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm bg-white hover:bg-stone-50 active:scale-[0.98] text-stone-800 border border-stone-300/80 transition-all shadow-2xs flex items-center justify-center text-center whitespace-nowrap"
            >
              হিসাব নিকাশ
            </Link>
          </div>

          {/* Countdown & Diya Container Card */}
          <div className="mt-4 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col items-center justify-center text-center">
            <h2 className="text-sm sm:text-base font-serif font-bold text-stone-900 mb-2">
              {(!settings.countdownHeading || settings.countdownHeading === 'মা আসছেন...' || settings.countdownHeading === 'মহাষ্টমী আসতে আর মাত্র')
                ? curr.counterHeading
                : settings.countdownHeading}
            </h2>

            {/* Live Countdown Pill */}
            <div className={`inline-flex items-center gap-1.5 ${curr.counterGlass} border border-amber-400/25 ring-1 ring-white/10 backdrop-blur-xl px-4 sm:px-6 py-2 rounded-full shadow-md max-w-full overflow-hidden`}>
              <Countdown targetDate={settings.countdownDate || '2026-10-16T06:00:00+05:30'} variant="pill" />
            </div>

            {/* Symmetrical Clustered Status Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-amber-400/50 text-[11px] text-stone-800 font-serif font-medium shadow-2xs">
                <span className="text-amber-500 text-xs">📅</span>
                <span>{curr.counterSub}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-emerald-500/40 text-[11px] text-emerald-800 font-medium shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>মণ্ডপ প্রস্তুতি চলছে</span>
              </span>

              <a
                href="https://maps.google.com/?q=Bansdroni+Sonali+Park+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-[11px] text-stone-700 hover:text-brand-maroon transition-colors shadow-2xs"
              >
                <span className="text-xs">📍</span>
                <span>মেট্রো থেকে ৫ মিনিট</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <audio ref={audioRef} loop src={settings?.dhakAudio || '/assets/dhak.mp3'} />

      {/* ══════════════════════════════════════════════════════════════
          TRADITIONAL BENGALI CALLIGRAPHIC KOLKA ALPANA SEAM
          Handcrafted brushstroke dynamics, sacred Durga Trinayan lotus crest,
          9-pearl Bindu Mala, double-layer lace filigree & gold core accents
          ══════════════════════════════════════════════════════════════ */}
      <div className="relative w-full pt-2 pb-8 sm:pt-3 sm:pb-10 z-20 pointer-events-none overflow-hidden px-4 select-none">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <svg
            width="100%"
            height="72"
            viewBox="0 0 1000 72"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="w-full max-w-5xl transition-all duration-700 filter drop-shadow-[0_2px_8px_rgba(159,18,57,0.14)]"
          >
            <defs>
              {/* Symmetrical Left & Right Hairline Gradients */}
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

              {/* Alta Maroon Body Palette */}
              <linearGradient id="alpanaAltaBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="50%" stopColor="#9F1239" />
                <stop offset="100%" stopColor="#BE123C" />
              </linearGradient>

              {/* Sonali Shimmer Gold Core */}
              <linearGradient id="alpanaGoldCore" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>

            {/* ═══════════ LEFT FLANK (SYMMETRICAL FINIAL & LINE) ═══════════ */}
            {/* Left Terminal Lotus Bud Finial */}
            <g fill="url(#alpanaAltaBody)">
              <circle cx="65" cy="36" r="1.2" opacity="0.35" />
              <circle cx="76" cy="36" r="1.8" opacity="0.55" />
              <circle cx="89" cy="36" r="2.6" opacity="0.8" />
              <path d="M104 36 C96 29 88 27 80 30 C90 31 98 33 104 36 Z" opacity="0.8" />
              <path d="M104 36 C96 43 88 45 80 42 C90 41 98 39 104 36 Z" opacity="0.8" />
              <path d="M104 36 L110 32 L117 36 L110 40 Z" fill="url(#alpanaGoldCore)" />
              <circle cx="110" cy="27" r="1.5" opacity="0.7" />
              <circle cx="110" cy="45" r="1.5" opacity="0.7" />
            </g>

            {/* Left Hairline Rule */}
            <line
              x1="120"
              y1="36"
              x2="350"
              y2="36"
              stroke="url(#alpanaLineLeftDay)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Left Intermediate Jewel Accent */}
            <g transform="translate(260, 36)" fill="url(#alpanaAltaBody)">
              <path d="M0 -4 L4 0 L0 4 L-4 0 Z" fill="url(#alpanaGoldCore)" />
              <circle cx="-9" cy="0" r="1.4" opacity="0.6" />
              <circle cx="9" cy="0" r="1.4" opacity="0.6" />
            </g>

            {/* ═══════════ CENTER CALLIGRAPHIC BENGALI ALPANA ═══════════ */}
            <g id="center-motif">
              {/* 1. SACRED DURGA TRINAYAN / LOTUS CREST */}
              <path
                d="M500 4 C496 11 496 18 500 24 C504 18 504 11 500 4 Z"
                fill="url(#alpanaGoldCore)"
              />
              <circle cx="500" cy="14" r="1.5" fill="#FAF7F2" opacity="0.95" />
              
              {/* Flanking Lotus Petals */}
              <path
                d="M497 12 C490 9 487 15 491 21 C494 20 496 17 497 12 Z"
                fill="url(#alpanaAltaBody)"
                opacity="0.9"
              />
              <path
                d="M503 12 C510 9 513 15 509 21 C506 20 504 17 503 12 Z"
                fill="url(#alpanaAltaBody)"
                opacity="0.9"
              />

              {/* 2. ARCHED BINDU CROWN (9 Graduated Pearl Jewels) */}
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

              {/* Delicate Filigree Rays above Bindu Mala */}
              <path
                d="M466 33 C482 23 518 23 534 33"
                stroke="url(#alpanaAltaBody)"
                strokeWidth="0.8"
                strokeDasharray="1.5 2.5"
                fill="none"
                opacity="0.5"
              />

              {/* 3. DUAL CALLIGRAPHIC KOLKA SCROLLS (Thick-to-Thin Brush Swells) */}
              {/* Left Kolka Main Body */}
              <path
                d="M500 48 
                   C493 48 480 46 472 35 
                   C464 23 472 14 485 15 
                   C496 16 500 24 494 31 
                   C489 36 482 34 481 29 
                   C480 26.5 483 24.5 485.5 25.5 
                   C487 26.2 486 28 484 28
                   C482.5 28 482 26 483.5 25
                   C480 26 480 32 485 33
                   C492 34 496 26 490 20
                   C482 12 468 20 475 32
                   C481 42 493 44 500 45 Z"
                fill="url(#alpanaAltaBody)"
              />
              <circle cx="485" cy="25" r="1.8" fill="url(#alpanaGoldCore)" />

              {/* Right Kolka Main Body (Exact Symmetrical Mirror) */}
              <path
                d="M500 48 
                   C507 48 520 46 528 35 
                   C536 23 528 14 515 15 
                   C504 16 500 24 506 31 
                   C511 36 518 34 519 29 
                   C520 26.5 517 24.5 514.5 25.5 
                   C513 26.2 514 28 516 28
                   C517.5 28 518 26 516.5 25
                   C520 26 520 32 515 33
                   C508 34 504 26 510 20
                   C518 12 532 20 525 32
                   C519 42 507 44 500 45 Z"
                fill="url(#alpanaAltaBody)"
              />
              <circle cx="515" cy="25" r="1.8" fill="url(#alpanaGoldCore)" />

              {/* 4. RADIATING SHOULDER PETALS (Lace Pearls & Sculpted Leaves) */}
              <g fill="url(#alpanaAltaBody)">
                {/* Left Shoulder */}
                <circle cx="462" cy="23" r="1.2" opacity="0.6" />
                <circle cx="456" cy="29" r="1.4" opacity="0.7" />
                <circle cx="453" cy="36" r="1.6" opacity="0.8" />
                <circle cx="454" cy="43" r="1.4" opacity="0.7" />
                <path d="M468 24 C458 17 447 19 438 23 C448 24 459 26 465 29 Z" />
                <path d="M464 31 C452 27 438 29 426 33 C439 34 453 35 461 37 Z" />
                <path d="M464 38 C452 38 440 43 429 46 C442 45 454 43 462 42 Z" />

                {/* Right Shoulder (Exact Symmetrical Mirror) */}
                <circle cx="538" cy="23" r="1.2" opacity="0.6" />
                <circle cx="544" cy="29" r="1.4" opacity="0.7" />
                <circle cx="547" cy="36" r="1.6" opacity="0.8" />
                <circle cx="546" cy="43" r="1.4" opacity="0.7" />
                <path d="M532 24 C542 17 553 19 562 23 C552 24 541 26 535 29 Z" />
                <path d="M536 31 C548 27 562 29 574 33 C561 34 547 35 539 37 Z" />
                <path d="M536 38 C548 38 560 43 571 46 C558 45 546 43 538 42 Z" />
              </g>

              {/* 5. CALLIGRAPHIC SWEEPING WING PLUMES */}
              {/* Left Wings */}
              <g fill="url(#alpanaAltaBody)">
                <path d="M466 32 C446 22 416 19 372 26 C398 26 434 29 456 37 Z" />
                <path d="M462 38 C434 32 392 34 338 39 C384 40 430 42 454 44 Z" />
                <path d="M464 45 C446 51 418 56 368 53 C400 53 438 50 458 47 Z" />
                <circle cx="330" cy="39" r="2.6" fill="url(#alpanaGoldCore)" />
                <circle cx="320" cy="39" r="1.6" opacity="0.65" />
              </g>

              {/* Right Wings (Exact Symmetrical Mirror) */}
              <g fill="url(#alpanaAltaBody)">
                <path d="M534 32 C554 22 584 19 628 26 C602 26 566 29 544 37 Z" />
                <path d="M538 38 C566 32 608 34 662 39 C616 40 570 42 546 44 Z" />
                <path d="M536 45 C554 51 582 56 632 53 C600 53 562 50 542 47 Z" />
                <circle cx="670" cy="39" r="2.6" fill="url(#alpanaGoldCore)" />
                <circle cx="680" cy="39" r="1.6" opacity="0.65" />
              </g>

              {/* 6. BASE CRADLE & PEDESTAL */}
              <g fill="url(#alpanaAltaBody)">
                <path d="M464 50 C480 56 520 56 536 50 C522 54 478 54 464 50 Z" />
                <path d="M472 54 C485 59 515 59 528 54 C518 57.5 482 57.5 472 54 Z" opacity="0.6" />
                <circle cx="500" cy="56" r="2.2" fill="url(#alpanaGoldCore)" />
                <circle cx="488" cy="53.5" r="1.4" opacity="0.8" />
                <circle cx="512" cy="53.5" r="1.4" opacity="0.8" />
              </g>
            </g>

            {/* ═══════════ RIGHT FLANK (SYMMETRICAL FINIAL & LINE) ═══════════ */}
            {/* Right Intermediate Jewel Accent */}
            <g transform="translate(740, 36)" fill="url(#alpanaAltaBody)">
              <path d="M0 -4 L4 0 L0 4 L-4 0 Z" fill="url(#alpanaGoldCore)" />
              <circle cx="-9" cy="0" r="1.4" opacity="0.6" />
              <circle cx="9" cy="0" r="1.4" opacity="0.6" />
            </g>

            {/* Right Hairline Rule */}
            <line
              x1="650"
              y1="36"
              x2="880"
              y2="36"
              stroke="url(#alpanaLineRightDay)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Right Terminal Lotus Bud Finial (Exact Symmetrical Mirror of Left) */}
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

      {/* ═══ DEV: Time switcher (desktop only) ═══ */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:flex gap-1.5 bg-[#11192E]/85 backdrop-blur-md border border-white/20 p-1.5 rounded-full shadow-lg" title="Theme Tester">
        <button onClick={() => setTimeOfDay('morning')} className={`p-1.5 rounded-full transition-colors ${timeOfDay === 'morning' ? 'bg-orange-400 text-white shadow' : 'text-white/60 hover:bg-white/15'}`}><Sun className="w-3.5 h-3.5" /></button>
        <button onClick={() => setTimeOfDay('afternoon')} className={`p-1.5 rounded-full transition-colors ${timeOfDay === 'afternoon' ? 'bg-brand-maroon text-white shadow' : 'text-white/60 hover:bg-white/15'}`}><Sunset className="w-3.5 h-3.5" /></button>
        <button onClick={() => setTimeOfDay('evening')} className={`p-1.5 rounded-full transition-colors ${timeOfDay === 'evening' ? 'bg-indigo-500 text-white shadow' : 'text-white/60 hover:bg-white/15'}`}><Moon className="w-3.5 h-3.5" /></button>
      </div>


      {/* ═══ 1. THEME SHOWCASE (Bento Hero Card with Authentic Ruby Depth) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-16 sm:mb-20 relative z-10">
        <div className="rounded-3xl overflow-hidden relative bg-gradient-to-br from-brand-maroon via-[#A01135] to-[#7D0925] text-white shadow-2xl border border-white/15 group">
          {/* Subtle Ambient Mandala Background */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <svg viewBox="0 0 400 200" className="w-full h-full" fill="white">
              {[...Array(8)].map((_, i) => (
                <ellipse key={i} cx={i * 60 - 10} cy="100" rx="25" ry="80" opacity="0.5" transform={`rotate(${i * 22} ${i * 60 - 10} 100)`} />
              ))}
            </svg>
          </div>
          {/* Top Subtle Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />

          <div className="relative z-10 p-5 sm:p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 justify-between">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                শারদ থিম ২০২৬
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-2 tracking-tight">
                {settings.themeTitle || '"অতীতের আয়নায় আগামী"'}
              </h2>
              <p className="text-rose-100/90 text-sm sm:text-base italic mb-6">
                {settings.themeSubtitle || '(Reflections of the Past, Visions of the Future)'}
              </p>

              {/* Artist Squircles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-base shrink-0">🏛️</div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-rose-200 font-bold block">মণ্ডপ শিল্পী</span>
                    <span className="text-sm font-semibold text-white/95">{settings.pandalArtist || 'শিল্প নিকেতন'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-base shrink-0">🎨</div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-rose-200 font-bold block">প্রতিমা শিল্পী</span>
                    <span className="text-sm font-semibold text-white/95">{settings.idolArtist || 'সৌমেন পাল'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-base shrink-0">💡</div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-rose-200 font-bold block">আলোকসজ্জা</span>
                    <span className="text-sm font-semibold text-white/95">{settings.lightingArtist || 'রয়েল লাইটস'}</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/puja"
              className="w-full md:w-auto shrink-0 bg-white hover:bg-stone-900 text-brand-maroon hover:text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:-translate-y-1 text-center text-sm sm:text-base border border-white/20"
            >
              সম্পূর্ণ থিম পরিক্রমা →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 2. FESTIVAL SCHEDULE PREVIEW (Left-Right Editorial Flow) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-bold uppercase tracking-widest mb-2.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              Festival Calendar • {selectedYear}
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              শারদীয়া দুর্গোৎসব <span className="text-brand-maroon">সময়সূচি</span>
            </h2>
            <p className={`text-sm sm:text-base ${curr.textSub} mt-2 leading-relaxed max-w-2xl`}>
              মহাষষ্ঠী থেকে বিজয়া দশমী — পুজোর প্রতিটি দিন আনন্দ আর ভক্তিতে মুখরিত সোনালী পার্কে
            </p>
          </div>
          <Link
            href="/puja"
            className="w-full sm:w-auto justify-center shrink-0 inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-brand-maroon text-brand-maroon hover:text-white border border-brand-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
          >
            সম্পূর্ণ নির্ঘণ্ট ও সূচি →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {(data.events.filter(e => e.year === selectedYear).length > 0
            ? data.events.filter(e => e.year === selectedYear)
            : data.events).slice(0, 5).map((event, i) => {
            const eventDate = new Date(event.date + (event.date.includes('T') ? '' : 'T00:00:00'));
            return (
              <div
                key={i}
                className={`group relative ${curr.cardBg} rounded-2xl p-4 sm:p-6 transition-all duration-300 overflow-hidden hover:-translate-y-1.5 hover:shadow-lg border border-stone-200/80 hover:border-brand-maroon/30 flex flex-col justify-between`}
              >
                {/* Radiant Top Highlight */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Floating Date Squircle */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex flex-col items-center justify-center text-brand-maroon group-hover:scale-105 group-hover:bg-brand-maroon group-hover:text-white transition-all duration-300">
                      <span className="text-lg sm:text-xl font-black leading-none">{eventDate.getDate()}</span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5">{eventDate.toLocaleString('bn', { month: 'short' })}</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      দিন {i + 1}
                    </span>
                  </div>

                  <h3 className={`text-sm sm:text-base font-bold ${curr.textHead} leading-snug mb-1.5 sm:mb-2 group-hover:text-brand-maroon transition-colors`}>
                    {event.title}
                  </h3>
                  <p className={`${curr.textSub} text-xs leading-relaxed line-clamp-3 mb-3 sm:mb-4`}>
                    {event.text}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-semibold text-brand-maroon">
                  <span>সময়সূচি দেখুন</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
          {data.events.length === 0 && (
            <div className={`col-span-full text-center py-12 ${curr.cardBg} rounded-2xl border border-dashed border-stone-300`}>
              <p className={curr.textMuted}>সূচি শীঘ্রই আপডেট করা হবে...</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ 3. GLIMPSES GALLERY (Unified Editorial Controls & No Scrollbar) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-5 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-bold uppercase tracking-widest mb-2.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              Moments & Archives • {selectedYear}
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              স্মৃতির পাতা থেকে <span className="text-brand-maroon">ফটোগ্রাফি</span>
            </h2>
            <p className={`text-sm sm:text-base ${curr.textSub} mt-2 leading-relaxed max-w-2xl`}>
              বিগত বছরগুলোর আবেগ, ধুনুচি নাচ, আলোকসজ্জা ও মায়ের অপরূপ রূপের রঙিন অ্যালবাম
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollGallery('left')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-stone-200 bg-white hover:bg-brand-maroon text-stone-700 hover:text-white transition-all duration-200 shadow-sm hover:scale-105"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => scrollGallery('right')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-stone-200 bg-white hover:bg-brand-maroon text-stone-700 hover:text-white transition-all duration-200 shadow-sm hover:scale-105"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-brand-maroon text-brand-maroon hover:text-white border border-brand-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
            >
              পুরো অ্যালবাম →
            </Link>
          </div>
        </div>

        {data.gallery.length === 0 ? (
          <div className={`text-center py-12 ${curr.textMuted} ${curr.cardBg} rounded-2xl border border-dashed border-stone-300`}>
            গ্যালারিতে এখনো কোনো ছবি যোগ করা হয়নি।
          </div>
        ) : (
          /* Container with 100% Hidden Scrollbar across ALL browsers */
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
                <img
                  src={img.src}
                  alt={img.title || 'Durga Puja Moment'}
                  onError={(e) => { e.currentTarget.src = '/assets/durga-hero.png'; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Frosted Vignette & Action Pill */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1224]/95 via-[#0B1224]/30 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <p className="text-white font-bold text-sm truncate mb-3">{img.title || 'বাঁশদ্রোণী সোনালী পার্ক'}</p>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 bg-black/50 hover:bg-brand-maroon text-white backdrop-blur-md border border-white/20 px-4 py-2 rounded-full font-bold transition-all duration-200 w-max text-xs shadow-md cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerDownload(img.src, `${img.title || 'durga-puja-moment'}.jpg`);
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    ডাউনলোড
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
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/30 text-white rounded-full p-2 transition-colors z-50">
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
                Download Full Size
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 4. TWIN PILLARS (Editorial 2-Column Split Header) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-end mb-8 sm:mb-12 pb-5 sm:pb-6 border-b border-stone-200/70">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
              Our Community Pillars
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              আমাদের পরিচয় ও <span className="text-brand-maroon">দুই স্তম্ভ</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:border-l lg:border-stone-300/80 lg:pl-6">
            <p className={`text-sm sm:text-base ${curr.textSub} leading-relaxed font-light`}>
              আমাদের পাড়ার সমস্ত কর্মকাণ্ড দুটি সুনির্দিষ্ট শাখার মাধ্যমে পরিচালিত হয় — একটি নাগরিক উন্নয়ন ও নিরাপত্তা নিশ্চিত করে, অন্যটি আমাদের সংস্কৃতি, ঐতিহ্য ও উৎসবের প্রাণকেন্দ্র।
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Pillar 1: Unnayan Samiti */}
          <div className={`group relative ${curr.cardBg} rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-rose-500/20 hover:border-rose-500/40 flex flex-col justify-between`}>
            {/* Radiant Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

            <div>
              <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-6">
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shrink-0">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" /></svg>
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold ${curr.textHead} leading-tight`}>সোনালী পার্ক</h3>
                  <span className="text-rose-600 font-bold text-base sm:text-lg">উন্নয়ন সমিতি</span>
                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-stone-400 font-semibold mt-0.5">Civic Development Committee</span>
                </div>
              </div>

              <p className={`${curr.textSub} mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base`}>
                উন্নয়ন সমিতি হলো আমাদের পাড়ার অভিভাবক। রাস্তাঘাট, নিরাপত্তা, পরিচ্ছন্নতা এবং নাগরিকদের দৈনন্দিন সুবিধা-অসুবিধা দেখার দায়িত্ব এই শাখার।
              </p>

              {/* Bento Sub-cards */}
              <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-rose-500/5 border border-rose-500/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>নাগরিক কল্যাণ ও নিরাপত্তা</span>
                    <span className="text-xs text-stone-400 ml-2 font-normal hidden sm:inline">Civic Welfare & Security</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-rose-500/5 border border-rose-500/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>রাস্তাঘাট ও আলোক পরিকাঠামো</span>
                    <span className="text-xs text-stone-400 ml-2 font-normal hidden sm:inline">Roads & Street Lighting</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-rose-500/5 border border-rose-500/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>পরিবেশ পরিচ্ছন্নতা ও বৃক্ষরোপণ</span>
                    <span className="text-xs text-stone-400 ml-2 font-normal hidden sm:inline">Cleanliness & Greenery</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/committee"
              className="inline-flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-rose-500/10 hover:bg-brand-maroon text-rose-600 hover:text-white font-bold text-sm transition-all duration-200 border border-rose-500/25 shadow-sm"
            >
              উন্নয়ন কমিটির সদস্যবৃন্দ দেখুন →
            </Link>
          </div>

          {/* Pillar 2: Sonali Sangha */}
          <div className={`group relative ${curr.cardBg} rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-stone-200/80 hover:border-brand-maroon/40 flex flex-col justify-between`}>
            {/* Radiant Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/40 to-transparent" />

            <div>
              <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-6">
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center text-brand-maroon shadow-sm group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300 shrink-0">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold ${curr.textHead} leading-tight`}>সোনালী সঙ্ঘ</h3>
                  <span className="text-brand-maroon font-bold text-base sm:text-lg">ক্লাব ও দুর্গোৎসব</span>
                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-stone-400 font-semibold mt-0.5">Cultural Club & Festivals</span>
                </div>
              </div>

              <p className={`${curr.textSub} mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base`}>
                সোনালী সঙ্ঘ হলো আমাদের সংস্কৃতি ও আনন্দের উৎসব। দুর্গাপূজা থেকে শুরু করে খেলাধুলা ও রক্তদান — সবকিছুর আয়োজন করে এই ক্লাব।
              </p>

              {/* Bento Sub-cards */}
              <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-brand-maroon/5 border border-brand-maroon/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-brand-maroon/15 text-brand-maroon flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>শারদীয়া দুর্গোৎসব ও মেলা</span>
                    <span className="text-xs text-stone-400 ml-2 font-normal hidden sm:inline">Sharadiya Durga Puja</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-brand-maroon/5 border border-brand-maroon/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-brand-maroon/15 text-brand-maroon flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>রক্তদান ও সমাজসেবা শিবির</span>
                    <span className="text-xs text-stone-400 ml-2 font-normal hidden sm:inline">Blood Donation Camp</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-brand-maroon/5 border border-brand-maroon/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-brand-maroon/15 text-brand-maroon flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>বার্ষিক ক্রীড়া ও সাংস্কৃতিক সন্ধ্যা</span>
                    <span className="text-xs text-stone-400 ml-2 font-normal hidden sm:inline">Annual Sports & Cultural Meet</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/puja"
              className="inline-flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-brand-maroon/10 hover:bg-brand-maroon text-brand-maroon hover:text-white font-bold text-sm transition-all duration-200 border border-brand-maroon/25 shadow-sm"
            >
              উৎসব ও পুজো পরিক্রমা →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 5. NOTICE BOARD (Left-Right Split Flow with Live Badge) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-bold uppercase tracking-widest mb-2.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Official Bulletin
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              পাড়ার জরুরি <span className="text-brand-maroon">বিজ্ঞপ্তি ও নোটিস</span>
            </h2>
            <p className={`text-sm sm:text-base ${curr.textSub} mt-2 leading-relaxed max-w-2xl`}>
              সোনালী পার্কের সমস্ত সাম্প্রতিক বিজ্ঞপ্তি, চাঁদা সংগ্রহের তথ্য ও নাগরিক নির্দেশিকা এক নজরে
            </p>
          </div>
          <div className="shrink-0 text-xs font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-stone-100 text-stone-700 border border-stone-200 shadow-sm">
            সক্রিয় বিজ্ঞপ্তি: {notices.length} টি
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {notices.length > 0 ? notices.map(notice => (
            <div
              key={notice.id}
              className={`group relative ${curr.cardBg} p-5 sm:p-7 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-200/80 hover:border-brand-maroon/30 overflow-hidden hover:-translate-y-1`}
            >
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full bg-brand-maroon/10 text-brand-maroon border border-brand-maroon/20">
                  📌 বিজ্ঞপ্তি
                </span>
                <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 sm:px-3 py-1 rounded-full border border-stone-200">
                  {new Date(notice.date + (notice.date.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('bn-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${curr.textHead} mb-2 leading-snug group-hover:text-brand-maroon transition-colors`}>{notice.title}</h3>
              <p className={`${curr.textSub} text-xs sm:text-sm leading-relaxed`}>{notice.text}</p>
            </div>
          )) : (
            <div className={`col-span-2 text-center py-12 ${curr.textMuted} ${curr.cardBg} rounded-3xl border border-dashed border-stone-300`}>
              এই বছরের কোনো নোটিশ নেই।
            </div>
          )}
        </div>
      </section>

      {/* ═══ 6. VISITOR INFORMATION / FAQ (Stately Center with Emerald Accent) ═══ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Visitor Information & Assistance
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
            দর্শনার্থীদের সাধারণ <span className="text-brand-maroon">জিজ্ঞাসা ও FAQ</span>
          </h2>
          <p className={`text-sm sm:text-base ${curr.textSub} mt-2 sm:mt-3 leading-relaxed`}>
            বাঁশদ্রোণী সোনালী পার্ক মণ্ডপে আসার আগে প্রয়োজনীয় দিকনির্দেশনা, অঞ্জলির সময় ও পার্কিং সংক্রান্ত তথ্য
          </p>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {[
            {
              tag: "Parking",
              q: "পুজো প্রাঙ্গণে কি গাড়ি রাখার ব্যবস্থা আছে?",
              a: "হ্যাঁ, প্যান্ডেলের কাছাকাছি নির্দিষ্ট স্থানে টু-হুইলার এবং ফোর-হুইলার পার্কিংয়ের ব্যবস্থা থাকে। তবে ভিড়ের সময় কিছুটা হেঁটে আসতে হতে পারে, তাই পাবলিক ট্রান্সপোর্ট ব্যবহার করার পরামর্শ দেওয়া হচ্ছে।"
            },
            {
              tag: "Timings",
              q: "পুষ্পাঞ্জলি এবং আরতির সময় কখন?",
              a: "মহাষ্টমীর দিন সকাল ৭টা থেকে পুষ্পাঞ্জলি শুরু হয়। প্রতিদিন সন্ধ্যায় ৬:৩০ থেকে সন্ধারতি ও আরতির আয়োজন থাকে। বিস্তারিত সময়সূচি আমাদের 'পুজো পরিক্রমা' পাতায় দেখতে পারেন।"
            },
            {
              tag: "Accessibility",
              q: "বয়স্ক এবং বিশেষ চাহিদাসম্পন্ন দর্শনার্থীদের জন্য কি ব্যবস্থা আছে?",
              a: "বয়স্ক মানুষ, গর্ভবতী মহিলা এবং হুইলচেয়ার ব্যবহারকারীদের জন্য আমাদের অগ্রাধিকার দর্শন লেন ও বসার বিশেষ ব্যবস্থা রয়েছে। আমাদের স্বেচ্ছাসেবকরা সর্বক্ষণ সাহায্যে প্রস্তুত।"
            },
            {
              tag: "Directions",
              q: "মেট্রো দিয়ে কীভাবে পৌঁছানো যায়?",
              a: "সবচেয়ে কাছের মেট্রো স্টেশন হলো 'মাস্টারদা সূর্য সেন' (বাঁশদ্রোণী)। সেখান থেকে অটো বা টোটোয় মাত্র ৫ মিনিটে সোনালী পার্কে পৌঁছানো যায়।"
            }
          ].map((faq, i) => (
            <div
              key={i}
              className={`group ${curr.cardBg} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border ${openFaq === i ? 'border-brand-maroon/30 shadow-brand-maroon/5' : 'border-stone-200/80 hover:border-stone-300'}`}
            >
              <button
                className={`w-full px-4 sm:px-6 py-3.5 sm:py-5 text-left flex justify-between items-center gap-3 sm:gap-4 font-bold ${curr.textHead} focus:outline-none`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-lg">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-stone-100 text-stone-600 border border-stone-200 shrink-0">
                    {faq.tag}
                  </span>
                  <span className="group-hover:text-brand-maroon transition-colors">{faq.q}</span>
                </span>
                <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 shrink-0 transition-transform duration-300 group-hover:text-brand-maroon ${openFaq === i ? 'rotate-180 bg-brand-maroon/10 text-brand-maroon border-brand-maroon/30' : ''}`}>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              {openFaq === i && (
                <div className={`px-4 sm:px-6 pb-4 sm:pb-6 ${curr.textSub} leading-relaxed border-t ${curr.isDark ? 'border-white/10' : 'border-stone-100'} pt-3.5 sm:pt-4 text-xs sm:text-base`}>
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
