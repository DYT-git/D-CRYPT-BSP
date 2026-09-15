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
  const { lang, changeLanguage, t, b, toDigits, formatDate } = useLanguage();
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
      timeGreeting: b('✨ শুভ শারদ প্রভাত', '✨ Auspicious Autumn Morning'),
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
      timeGreeting: b('✨ শারদীয়ার শুভ অপরাহ্ন', '✨ Blessed Festive Afternoon'),
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
      timeGreeting: b('✨ শারদ সান্ধ্য বন্দনা', '✨ Divine Evening Invocation'),
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
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
                {b('দুর্গাপূজা ২০২৬ →', 'Durga Puja 2026 →')}
              </Link>
              <Link
                href="/transparency"
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-stone-950/60 hover:bg-white text-rose-100 hover:text-stone-900 border border-white/25 transition-all shadow-xl hover:-translate-y-0.5 backdrop-blur-md whitespace-nowrap"
              >
                {b('হিসাব নিকাশ', 'Financial Accounts')}
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
                <span>{b('মণ্ডপ প্রস্তুতি চলছে', 'Pandal Work in Progress')}</span>
              </span>

              <a
                href="https://maps.google.com/?q=Bansdroni+Sonali+Park+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-rose-300/30 text-xs text-rose-100 hover:bg-white hover:text-stone-900 hover:border-white transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.5)] group"
              >
                <span className="text-xs group-hover:scale-110 transition-transform">📍</span>
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
              {b('দুর্গাপূজা ২০২৬ →', 'Durga Puja 2026 →')}
            </Link>
            <Link
              href="/transparency"
              className="py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm bg-white hover:bg-stone-50 active:scale-[0.98] text-stone-800 border border-stone-300/80 transition-all shadow-2xs flex items-center justify-center text-center whitespace-nowrap"
            >
              {b('হিসাব নিকাশ', 'Financial Accounts')}
            </Link>
          </div>

          {/* Countdown Container Card */}
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
                <span>{b('মণ্ডপ প্রস্তুতি চলছে', 'Pandal Work in Progress')}</span>
              </span>

              <a
                href="https://maps.google.com/?q=Bansdroni+Sonali+Park+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-[11px] text-stone-700 hover:text-brand-maroon transition-colors shadow-2xs"
              >
                <span className="text-xs">📍</span>
                <span>{b('মেট্রো থেকে ৫ মিনিট', '5 mins from Metro')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <audio ref={audioRef} loop src={settings?.dhakAudio || '/assets/dhak.mp3'} />

      {/* ══════════════════════════════════════════════════════════════
          TRADITIONAL BENGALI CALLIGRAPHIC KOLKA ALPANA SEAM
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
                {b('শারদ থিম ২০২৬', 'Festive Theme 2026')}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-2 tracking-tight">
                {settings.themeTitle || b('"অতীতের আয়নায় আগামী"', '"Reflections of the Past, Visions of the Future"')}
              </h2>
              <p className="text-rose-100/90 text-sm sm:text-base italic mb-6">
                {settings.themeSubtitle || b('(Reflections of the Past, Visions of the Future)', '(Reflections of the Past, Visions of the Future)')}
              </p>

              {/* Artist Squircles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-base shrink-0">🏛️</div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-rose-200 font-bold block">{b('মণ্ডপ শিল্পী', 'Pandal Artist')}</span>
                    <span className="text-sm font-semibold text-white/95">{settings.pandalArtist || b('শিল্প নিকেতন', 'Shilpa Niketan')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-base shrink-0">🎨</div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-rose-200 font-bold block">{b('প্রতিমা শিল্পী', 'Idol Sculptor')}</span>
                    <span className="text-sm font-semibold text-white/95">{settings.idolArtist || b('সৌমেন পাল', 'Soumen Paul')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-base shrink-0">💡</div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-rose-200 font-bold block">{b('আলোকসজ্জা', 'Illumination')}</span>
                    <span className="text-sm font-semibold text-white/95">{settings.lightingArtist || b('রয়েল লাইটস', 'Royal Lights')}</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/puja"
              className="w-full md:w-auto shrink-0 bg-white hover:bg-stone-900 text-brand-maroon hover:text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:-translate-y-1 text-center text-sm sm:text-base border border-white/20 whitespace-nowrap"
            >
              {b('সম্পূর্ণ থিম পরিক্রমা →', 'Explore Full Theme →')}
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
              Festival Calendar • {toDigits(selectedYear)}
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              {b('শারদীয়া দুর্গোৎসব', 'Sharadiya Durga Puja')} <span className="text-brand-maroon">{b('সময়সূচি', 'Schedule')}</span>
            </h2>
            <p className={`text-sm sm:text-base ${curr.textSub} mt-2 leading-relaxed max-w-2xl`}>
              {b(
                'মহাষষ্ঠী থেকে বিজয়া দশমী — পুজোর প্রতিটি দিন আনন্দ আর ভক্তিতে মুখরিত সোনালী পার্কে',
                'From Maha Shashti to Bijoya Dashami — Celebrate each day with joy and devotion at Sonali Park.'
              )}
            </p>
          </div>
          <Link
            href="/puja"
            className="w-full sm:w-auto justify-center shrink-0 inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-brand-maroon text-brand-maroon hover:text-white border border-brand-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
          >
            {b('সম্পূর্ণ নির্ঘণ্ট ও সূচি →', 'Full Schedule & Rituals →')}
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
                      <span className="text-lg sm:text-xl font-black leading-none">{toDigits(eventDate.getDate())}</span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5">
                        {eventDate.toLocaleString(lang === 'bn' ? 'bn-IN' : 'en-US', { month: 'short' })}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      {b('দিন', 'Day')} {toDigits(i + 1)}
                    </span>
                  </div>

                  <h3 className={`text-sm sm:text-base font-bold ${curr.textHead} leading-snug mb-1.5 sm:mb-2 group-hover:text-brand-maroon transition-colors`}>
                    {t(event.title)}
                  </h3>
                  <p className={`${curr.textSub} text-xs leading-relaxed line-clamp-3 mb-3 sm:mb-4`}>
                    {event.text}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-semibold text-brand-maroon">
                  <span>{b('সময়সূচি দেখুন', 'View Timings')}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
          {data.events.length === 0 && (
            <div className={`col-span-full text-center py-12 ${curr.cardBg} rounded-2xl border border-dashed border-stone-300`}>
              <p className={curr.textMuted}>{b('সূচি শীঘ্রই আপডেট করা হবে...', 'Schedule will be updated shortly...')}</p>
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
              Moments & Archives • {toDigits(selectedYear)}
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
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-brand-maroon text-brand-maroon hover:text-white border border-brand-maroon/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
            >
              {b('পুরো অ্যালবাম →', 'View All Photos →')}
            </Link>
          </div>
        </div>

        {data.gallery.length === 0 ? (
          <div className={`text-center py-12 ${curr.textMuted} ${curr.cardBg} rounded-2xl border border-dashed border-stone-300`}>
            {b('গ্যালারিতে এখনো কোনো ছবি যোগ করা হয়নি।', 'No gallery photos uploaded yet.')}
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

      {/* ═══ 4. TWIN PILLARS (Editorial 2-Column Split Header) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-end mb-8 sm:mb-12 pb-5 sm:pb-6 border-b border-stone-200/70">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
              {b('আমাদের পরিচয় ও দুই স্তম্ভ', 'Our Community Pillars')}
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              {b('আমাদের পরিচয় ও', 'Our Identity &')} <span className="text-brand-maroon">{b('দুই স্তম্ভ', 'Two Pillars')}</span>
            </h2>
          </div>
          <div className="lg:col-span-6 lg:border-l lg:border-stone-300/80 lg:pl-6">
            <p className={`text-sm sm:text-base ${curr.textSub} leading-relaxed font-light`}>
              {b(
                'আমাদের পাড়ার সমস্ত কর্মকাণ্ড দুটি সুনির্দিষ্ট শাখার মাধ্যমে পরিচালিত হয় — একটি নাগরিক উন্নয়ন ও নিরাপত্তা নিশ্চিত করে, অন্যটি আমাদের সংস্কৃতি, ঐতিহ্য ও উৎসবের প্রাণকেন্দ্র।',
                'All community affairs are stewarded through two distinct pillars — one dedicated to civic welfare and infrastructure, the other the heartbeat of our culture, traditions, and celebrations.'
              )}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Pillar 1: Unnayan Samiti */}
          <div className={`group relative ${curr.cardBg} rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-rose-500/20 hover:border-rose-500/40 flex flex-col justify-between`}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

            <div>
              <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-6">
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shrink-0">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" /></svg>
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold ${curr.textHead} leading-tight`}>{b('সোনালী পার্ক', 'Sonali Park')}</h3>
                  <span className="text-rose-600 font-bold text-base sm:text-lg">{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-stone-400 font-semibold mt-0.5">{b('নাগরিক উন্নয়ন ও সেবা', 'Civic Development Committee')}</span>
                </div>
              </div>

              <p className={`${curr.textSub} mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base`}>
                {b(
                  'উন্নয়ন সমিতি হলো আমাদের পাড়ার অভিভাবক। রাস্তাঘাট, নিরাপত্তা, পরিচ্ছন্নতা এবং নাগরিকদের দৈনন্দিন সুবিধা-অসুবিধা দেখার দায়িত্ব এই শাখার।',
                  'The Unnayan Samiti oversees civic welfare, neighborhood security, clean roads, and daily citizen amenities.'
                )}
              </p>

              {/* Bento Sub-cards */}
              <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-rose-500/5 border border-rose-500/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>{b('নাগরিক কল্যাণ ও নিরাপত্তা', 'Civic Welfare & Security')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-rose-500/5 border border-rose-500/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>{b('রাস্তাঘাট ও আলোক পরিকাঠামো', 'Roads & Street Infrastructure')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-rose-500/5 border border-rose-500/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>{b('পরিবেশ পরিচ্ছন্নতা ও বৃক্ষরোপণ', 'Cleanliness, Sanitation & Greenery')}</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/committee"
              className="inline-flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-rose-500/10 hover:bg-brand-maroon text-rose-600 hover:text-white font-bold text-sm transition-all duration-200 border border-rose-500/25 shadow-sm"
            >
              {b('উন্নয়ন কমিটির সদস্যবৃন্দ দেখুন →', 'View Development Committee →')}
            </Link>
          </div>

          {/* Pillar 2: Sonali Sangha */}
          <div className={`group relative ${curr.cardBg} rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-stone-200/80 hover:border-brand-maroon/40 flex flex-col justify-between`}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/40 to-transparent" />

            <div>
              <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-6">
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center text-brand-maroon shadow-sm group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300 shrink-0">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold ${curr.textHead} leading-tight`}>{b('সোনালী সঙ্ঘ', 'Sonali Sangha')}</h3>
                  <span className="text-brand-maroon font-bold text-base sm:text-lg">{b('ক্লাব ও দুর্গোৎসব', 'Club & Festivities')}</span>
                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-stone-400 font-semibold mt-0.5">{b('সংস্কৃতি ও উৎসব', 'Cultural Club & Festivities')}</span>
                </div>
              </div>

              <p className={`${curr.textSub} mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base`}>
                {b(
                  'সোনালী সঙ্ঘ হলো আমাদের সংস্কৃতি ও আনন্দের উৎসব। দুর্গাপূজা থেকে শুরু করে খেলাধুলা ও রক্তদান — সবকিছুর আয়োজন করে এই ক্লাব।',
                  'Sonali Sangha is the spirit of culture and joy — organizing Durga Puja celebrations, sports tournaments, and humanitarian welfare drives.'
                )}
              </p>

              {/* Bento Sub-cards */}
              <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-brand-maroon/5 border border-brand-maroon/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-brand-maroon/15 text-brand-maroon flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>{b('শারদীয়া দুর্গোৎসব ও মেলা', 'Sharadiya Durga Puja & Festive Fair')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-brand-maroon/5 border border-brand-maroon/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-brand-maroon/15 text-brand-maroon flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>{b('রক্তদান ও সমাজসেবা শিবির', 'Blood Donation & Social Welfare Camps')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-brand-maroon/5 border border-brand-maroon/15">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl bg-brand-maroon/15 text-brand-maroon flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                  <div>
                    <span className={`font-semibold text-xs sm:text-sm ${curr.textHead}`}>{b('বার্ষিক ক্রীড়া ও সাংস্কৃতিক সন্ধ্যা', 'Annual Sports & Cultural Evenings')}</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/puja"
              className="inline-flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-brand-maroon/10 hover:bg-brand-maroon text-brand-maroon hover:text-white font-bold text-sm transition-all duration-200 border border-brand-maroon/25 shadow-sm"
            >
              {b('উৎসব ও পুজো পরিক্রমা →', 'Explore Puja Celebrations →')}
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
              {b('অফিশিয়াল বুলেটিন', 'Official Bulletin')}
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl font-serif font-bold ${curr.textHead} tracking-tight leading-tight`}>
              {b('পাড়ার জরুরি', 'Community')} <span className="text-brand-maroon">{b('বিজ্ঞপ্তি ও নোটিস', 'Notices & Circulars')}</span>
            </h2>
            <p className={`text-sm sm:text-base ${curr.textSub} mt-2 leading-relaxed max-w-2xl`}>
              {b(
                'সোনালী পার্কের সমস্ত সাম্প্রতিক বিজ্ঞপ্তি, চাঁদা সংগ্রহের তথ্য ও নাগরিক নির্দেশিকা এক নজরে',
                'Recent community notices, announcements, and essential citizen circulars at a glance.'
              )}
            </p>
          </div>
          <div className="shrink-0 text-xs font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-stone-100 text-stone-700 border border-stone-200 shadow-sm">
            {b('সক্রিয় বিজ্ঞপ্তি', 'Active Notices')}: {toDigits(notices.length)} {b('টি', '')}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {notices.length > 0 ? notices.map(notice => (
            <div
              key={notice.id}
              className={`group relative ${curr.cardBg} p-5 sm:p-7 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-200/80 hover:border-brand-maroon/30 overflow-hidden hover:-translate-y-1`}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full bg-brand-maroon/10 text-brand-maroon border border-brand-maroon/20">
                  📌 {b('বিজ্ঞপ্তি', 'Notice')}
                </span>
                <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 sm:px-3 py-1 rounded-full border border-stone-200">
                  {formatDate(notice.date, lang)}
                </span>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${curr.textHead} mb-2 leading-snug group-hover:text-brand-maroon transition-colors`}>{t(notice.title)}</h3>
              <p className={`${curr.textSub} text-xs sm:text-sm leading-relaxed`}>{notice.text}</p>
            </div>
          )) : (
            <div className={`col-span-2 text-center py-12 ${curr.textMuted} ${curr.cardBg} rounded-3xl border border-dashed border-stone-300`}>
              {b('এই বছরের কোনো নোটিশ নেই।', 'No active notices published for this year.')}
            </div>
          )}
        </div>
      </section>

      {/* ═══ 6. VISITOR INFORMATION / FAQ (Stately Center with Emerald Accent) ═══ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-14 sm:my-20">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            {b('দর্শনার্থীদের সহায়তা ও তথ্য', 'Visitor Information & Assistance')}
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
              className={`group ${curr.cardBg} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border ${openFaq === i ? 'border-brand-maroon/30 shadow-brand-maroon/5' : 'border-stone-200/80 hover:border-stone-300'}`}
            >
              <button
                className={`w-full px-4 sm:px-6 py-3.5 sm:py-5 text-left flex justify-between items-center gap-3 sm:gap-4 font-bold ${curr.textHead} focus:outline-none cursor-pointer`}
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
