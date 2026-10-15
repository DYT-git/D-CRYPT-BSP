'use client';
import { useState, useRef, useEffect } from 'react';
import { Sun, Sunset, Moon, Bell, Share2, Check, ChevronLeft, ChevronRight, FileText, Download, Link2 } from 'lucide-react';
import Countdown from "@/components/Countdown";
import HeroParticles from "@/components/HeroParticles";
import { triggerDownload } from "@/utils/download";
import { getImageWing } from "@/utils/gallery";
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

  // Time of Day & Mount state
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [isMounted, setIsMounted] = useState(false);

  // Lightbox & Carousel State
  const [selectedImage, setSelectedImage] = useState(null);
  const galleryScrollRef = useRef(null);

  // Calendar Carousel & Day Switcher State
  const [activeCalendarIndex, setActiveCalendarIndex] = useState(0);
  const calendarScrollRef = useRef(null);

  // MLH-Style Gallery Showcase State
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [galleryTouchStart, setGalleryTouchStart] = useState(null);

  // MLH-Style Notice Showcase State
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);
  const [noticeTouchStart, setNoticeTouchStart] = useState(null);
  const [copiedNoticeId, setCopiedNoticeId] = useState(null);

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

  const festivalDays = [
    {
      id: 'shashti',
      tithiBn: 'মহাষষ্ঠী',
      tithiEn: 'Maha Shashti',
      weekdayBn: 'শুক্রবার',
      weekdayEn: 'Friday',
      dateNumBn: '১৬',
      dateNumEn: '16',
      monthBn: 'অক্টোবর ২০২৬',
      monthEn: 'Oct 2026',
      ceremonyBn: 'বোধন, আমন্ত্রণ ও অধিবাস',
      ceremonyEn: 'Bodhon, Amantran & Adhibas',
      panjikaBn: '২৮শে আশ্বিন • ষষ্ঠী রাত্রি ৩/৪৭ পর্যন্ত',
      rituals: [
        { timeBn: 'পূর্বাহ্ণ মধ্যে', timeEn: 'Forenoon', labelBn: 'শ্রী শ্রী দুর্গাষষ্ঠী বিহিত পূজা', labelEn: 'Shashti Vihita Puja' },
        { timeBn: 'সায়ংকালে', timeEn: 'Evening', labelBn: 'দেবীর বোধন, আমন্ত্রণ ও অধিবাস', labelEn: 'Bodhon & Adhibas' },
      ],
      headerGrad: 'from-[#9F1239] to-[#881337]',
      dateColor: 'text-[#9F1239]',
      Icon: ShashtiBilvaIcon,
    },
    {
      id: 'saptami-day1',
      tithiBn: 'মহাসপ্তমী (দিন ১)',
      tithiEn: 'Maha Saptami (Day 1)',
      weekdayBn: 'শনিবার',
      weekdayEn: 'Saturday',
      dateNumBn: '১৭',
      dateNumEn: '17',
      monthBn: 'অক্টোবর ২০২৬',
      monthEn: 'Oct 2026',
      ceremonyBn: 'নবপত্রিকা প্রবেশ ও স্থাপন',
      ceremonyEn: 'Nabapatrika Pravesh & Sthapan',
      panjikaBn: '২৯শে আশ্বিন • সপ্তমী অহোরাত্র',
      rituals: [
        { timeBn: 'সকাল ৭:০৪ গতে', timeEn: 'After 7:04 AM', labelBn: 'নবপত্রিকা প্রবেশ ও স্থাপন', labelEn: 'Nabapatrika Pravesh' },
        { timeBn: 'পূর্বাহ্ণ মধ্যে', timeEn: 'Forenoon', labelBn: 'সপ্তমীবিহিত পূজা প্রশস্তা', labelEn: 'Saptami Vihita Puja' },
      ],
      headerGrad: 'from-emerald-700 to-emerald-900',
      dateColor: 'text-emerald-800',
      Icon: SaptamiNabapatrikaIcon,
    },
    {
      id: 'saptami-day2',
      tithiBn: 'মহাসপ্তমী (দিন ২)',
      tithiEn: 'Maha Saptami (Day 2)',
      weekdayBn: 'রবিবার',
      weekdayEn: 'Sunday',
      dateNumBn: '১৮',
      dateNumEn: '18',
      monthBn: 'অক্টোবর ২০২৬',
      monthEn: 'Oct 2026',
      ceremonyBn: 'মহাষ্টমীর অঞ্জলি ও অধিক পূজা',
      ceremonyEn: 'Maha Ashtami Anjali & Adhik Puja',
      panjikaBn: '৩০শে আশ্বিন • সপ্তমী প্রাতঃ ৫/৫৩ পর্যন্ত',
      specialBadge: 'মহাষ্টমী অঞ্জলি প্রদান',
      specialBadgeEn: 'Maha Ashtami Anjali',
      rituals: [
        { timeBn: 'বিশেষ ঘোষণা', timeEn: 'Special Notice', labelBn: '🌺 মহাষ্টমীর অঞ্জলী প্রদান', labelEn: 'Maha Ashtami Pushpanjali' },
        { timeBn: 'রাত্রি ১০:৫৯', timeEn: '10:59 PM', labelBn: 'দেবীর অর্ধরাত্রি বিহিত পূজা', labelEn: 'Ardharatri Vihita Puja' },
      ],
      headerGrad: 'from-amber-600 to-amber-800',
      dateColor: 'text-amber-800',
      Icon: AshtamiDhunuchiIcon,
    },
    {
      id: 'ashtami',
      tithiBn: 'মহাষ্টমী ও সন্ধিপূজা',
      tithiEn: 'Maha Ashtami & Sandhi Puja',
      weekdayBn: 'সোমবার',
      weekdayEn: 'Monday',
      dateNumBn: '১৯',
      dateNumEn: '19',
      monthBn: 'অক্টোবর ২০২৬',
      monthEn: 'Oct 2026',
      ceremonyBn: 'কল্পারম্ভ ও মহতী সন্ধিপূজা',
      ceremonyEn: 'Kalparambha & Sandhi Puja',
      panjikaBn: '১লা কার্তিক • অষ্টমী দিবা ৭/৫০ পর্যন্ত',
      specialBadge: 'সন্ধিপূজা: দিবা ৭:২৬ - ৮:১৪',
      specialBadgeEn: 'Sandhi Puja: 7:26 - 8:14 AM',
      rituals: [
        { timeBn: 'দিবা ৭:০৫ গতে', timeEn: 'After 7:05 AM', labelBn: 'মহাষ্টম্যাদি কল্পারম্ভ পূজা', labelEn: 'Ashtami Kalparambha' },
        { timeBn: 'দিবা ৭:২৬ – ৮:১৪', timeEn: '7:26 – 8:14 AM', labelBn: 'সন্ধিপূজা (বলিদান ৭:৫০)', labelEn: 'Sandhi Puja (Balidan 7:50 AM)' },
      ],
      headerGrad: 'from-amber-700 to-amber-950',
      dateColor: 'text-amber-800',
      Icon: AshtamiDhunuchiIcon,
    },
    {
      id: 'navami',
      tithiBn: 'মহানবমী',
      tithiEn: 'Maha Navami',
      weekdayBn: 'মঙ্গলবার',
      weekdayEn: 'Tuesday',
      dateNumBn: '২০',
      dateNumEn: '20',
      monthBn: 'অক্টোবর ২০২৬',
      monthEn: 'Oct 2026',
      ceremonyBn: 'বিহিত পূজা ও ব্রত সমাপন',
      ceremonyEn: 'Navami Puja & Vrata Samapan',
      panjikaBn: '২রা কার্তিক • নবমী দিবা ৯/০১ পর্যন্ত',
      rituals: [
        { timeBn: 'পূর্বাহ্ণ মধ্যে', timeEn: 'Forenoon', labelBn: 'মহানবমী কল্পারম্ভ ও বিহিত পূজা', labelEn: 'Navami Kalparambha & Puja' },
        { timeBn: 'পূর্বাহ্ণ মধ্যে', timeEn: 'Forenoon', labelBn: 'দেবীর নবরাত্রিক ব্রত সমাপন', labelEn: 'Navaratrik Vrata Samapan' },
      ],
      headerGrad: 'from-orange-700 to-orange-900',
      dateColor: 'text-orange-800',
      Icon: NavamiHomaIcon,
    },
    {
      id: 'dashami',
      tithiBn: 'বিজয়া দশমী',
      tithiEn: 'Bijoya Dashami',
      weekdayBn: 'বুধবার',
      weekdayEn: 'Wednesday',
      dateNumBn: '২১',
      dateNumEn: '21',
      monthBn: 'অক্টোবর ২০২৬',
      monthEn: 'Oct 2026',
      ceremonyBn: 'অপরাজিতা পূজা, সিঁদুর খেলা ও বিসর্জন',
      ceremonyEn: 'Aparajita Puja & Bisarjan',
      panjikaBn: '৩রা কার্তিক • দশমী দিবা ১০/৪৭ পর্যন্ত',
      rituals: [
        { timeBn: 'পূর্বাহ্ণ মধ্যে', timeEn: 'Forenoon', labelBn: 'অপরাজিতা পূজা ও বিজয়া দশমীকৃত্য', labelEn: 'Aparajita Puja & Rituals' },
        { timeBn: 'কুলাচারানুসারে', timeEn: 'Traditional', labelBn: 'সিঁদুর খেলা ও প্রতিমা বিসর্জন', labelEn: 'Sindoor Khela & Immersion' },
      ],
      headerGrad: 'from-rose-900 to-[#500619]',
      dateColor: 'text-rose-900',
      Icon: DashamiTrishulIcon,
    },
  ];

  const pujaPhotos = (data.gallery || []).filter(g => getImageWing(g) === 'Puja');
  const currentYearPuja = pujaPhotos.filter(g => g.year === selectedYear);
  const galleryList = (currentYearPuja.length > 0 ? currentYearPuja : pujaPhotos).slice(0, 10);

  const nextGallery = () => {
    if (galleryList.length === 0) return;
    setActiveGalleryIndex((prev) => (prev + 1) % galleryList.length);
  };

  const prevGallery = () => {
    if (galleryList.length === 0) return;
    setActiveGalleryIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  const handleGalleryTouchStart = (e) => {
    setGalleryTouchStart(e.touches[0].clientX);
  };

  const handleGalleryTouchEnd = (e) => {
    if (galleryTouchStart === null) return;
    const diff = galleryTouchStart - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextGallery();
    } else if (diff < -45) {
      prevGallery();
    }
    setGalleryTouchStart(null);
  };

  const notices = data.notices.filter(n => n.year === selectedYear && !n.title?.startsWith('[Club]') && !n.title?.startsWith('[Samiti]') && !n.title?.startsWith('[Samity]')).slice(0, 5);

  const nextNotice = () => {
    if (notices.length === 0) return;
    setActiveNoticeIndex((prev) => (prev + 1) % notices.length);
  };

  const prevNotice = () => {
    if (notices.length === 0) return;
    setActiveNoticeIndex((prev) => (prev - 1 + notices.length) % notices.length);
  };

  const handleNoticeTouchStart = (e) => {
    setNoticeTouchStart(e.touches[0].clientX);
  };

  const handleNoticeTouchEnd = (e) => {
    if (noticeTouchStart === null) return;
    const diff = noticeTouchStart - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextNotice();
    } else if (diff < -45) {
      prevNotice();
    }
    setNoticeTouchStart(null);
  };

  const copyNotice = (notice) => {
    if (!notice) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/notifications?wing=puja&id=${encodeURIComponent(notice.id || '')}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedNoticeId(notice.id || 'current');
      setTimeout(() => setCopiedNoticeId(null), 2500);
    }
  };

  return (
    <main className="min-h-screen transition-colors duration-700 selection:bg-brand-maroon selection:text-white" style={{ backgroundColor: curr.pageBg }}>

      {/* ══════════════════════════════════════════════════════
          HERO FESTIVAL POSTER — 100% Scene with Winged Quotes & Downside Counter
          Maa Durga & Lion in center remain 100% clear and unobstructed
          ══════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden transition-colors duration-700" style={{ backgroundColor: curr.pageBg }}>

        {/* Sacred Festival Deity Frame — 100% Uncropped, Zero Text Obstruction on Any Device */}
        <div className="relative w-full aspect-[4/3.8] sm:aspect-[16/10] lg:aspect-[16/9] min-h-[350px] sm:min-h-0 overflow-hidden">
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

          {/* Desktop Left-Wing Scrim (Hidden on mobile to keep top 100% radiant) */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-stone-950/80 via-stone-950/35 to-transparent pointer-events-none z-10 hidden lg:block" />

          {/* Mobile Atmospheric Downside Scrim (Protects text at bottom, leaves top 100% bright & clear) */}
          <div className="absolute inset-x-0 bottom-0 h-48 sm:h-56 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent pointer-events-none z-10 lg:hidden" />

          {/* ════ HERO SACRED INVOCATION WING (MOBILE: DOWNSIDE / DESKTOP: LEFT WING) ════ */}
          <div className="absolute bottom-6 sm:bottom-8 left-3.5 sm:left-6 right-3.5 sm:right-auto lg:top-36 xl:top-40 lg:bottom-auto lg:left-14 lg:max-w-md z-20 max-w-[85vw] sm:max-w-sm pointer-events-none">
            {/* Symmetrical Header Greeting Badge */}
            <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-md pointer-events-auto shadow-md ${curr.badgeClass}`}>
              <PanjikaSealBadge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
              <span>{b('সোনালী পার্ক অধিবাসীবৃন্দ', 'Sonali Park Adhibasibrinda')}</span>
              <span className="opacity-40">·</span>
              <span className="font-serif normal-case tracking-normal text-amber-200 font-bold">{toDigits(2026)}</span>
            </div>

            {/* Dynamic Symmetrical Headline */}
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-black tracking-tight text-white leading-[1.2] mt-1 sm:mt-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              {lang === 'en' ? (
                <>
                  <span>{curr.headlinePrefix}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-200 to-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {curr.headlineHighlight}
                  </span>
                </>
              ) : settings.heroHeading &&
                settings.heroHeading !== 'শারদ প্রাতে মায়ের আগমন...' &&
                settings.heroHeading !== 'শারদ প্রাতে মায়ের আগমন...' ? (
                settings.heroHeading
              ) : (
                <>
                  <span>{curr.headlinePrefix}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-200 to-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {curr.headlineHighlight}
                  </span>
                </>
              )}
            </h1>

            {/* Subline */}
            <p className="text-[11px] sm:text-sm md:text-base lg:text-lg text-rose-100/95 font-serif italic mt-0.5 sm:mt-1 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              {lang === 'en'
                ? curr.subline
                : settings.heroSubHeading &&
                  settings.heroSubHeading !== 'আনন্দ আর আলোয় সাজুক ভুবন।' &&
                  settings.heroSubHeading !== 'আনন্দ আর আলোয় সাজুক ভুবন।' &&
                  settings.heroSubHeading !== 'আনন্দ আর আলোয় সাজুক ভুবন'
                ? settings.heroSubHeading
                : curr.subline}
            </p>

            {/* Dynamic Poetic Bengali Quote Inscribed Plaque ("a small line on left side") */}
            <div className="mt-1.5 sm:mt-3 pl-2.5 sm:pl-3.5 pr-3 sm:pr-4 py-1 sm:py-1.5 rounded-r-xl sm:rounded-r-2xl bg-gradient-to-r from-stone-950/85 via-stone-950/55 to-transparent backdrop-blur-md border-l-[3px] sm:border-l-4 border-rose-500 shadow-md pointer-events-auto max-w-[280px] sm:max-w-fit">
              <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-serif italic leading-relaxed text-[#FFF5F6] drop-shadow-sm line-clamp-2 sm:line-clamp-none">
                &ldquo;{curr.quote}&rdquo;
              </span>
            </div>

            {/* CTA Action Buttons (Desktop Only Inside Frame — On Mobile Shifted Down Before Timer) */}
            <div className="hidden lg:flex flex-wrap items-center gap-3 mt-4 sm:mt-6 pointer-events-auto">
              <Link
                href="/puja"
                className="btn-tactile-crimson text-white pl-5 sm:pl-6 pr-2 sm:pr-2.5 py-2 sm:py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap inline-flex items-center gap-3 group shadow-[0_4px_16px_rgba(190,18,60,0.45)]"
              >
                <span>{b('শ্রী শ্রী দুর্গা পূজা ২০২৬', 'Sri Sri Durga Puja 2026')}</span>
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

        {/* ════ UNIFIED HERITAGE SHARAD COUNTDOWN PAVILION (RESPONSIVE DESKTOP & MOBILE) ════ */}
        <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-10">
          {/* Mobile Only: Touch Friendly Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mb-3.5 w-full lg:hidden">
            <Link
              href="/puja"
              className="btn-tactile-crimson text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between text-center whitespace-nowrap group shadow-[0_4px_16px_rgba(190,18,60,0.35)]"
            >
              <div className="flex items-center gap-1.5 truncate">
                <DurgaDeviEmblemIcon className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                <span className="truncate">{b('শ্রী শ্রী দুর্গা পূজা ২০২৬', 'Sri Sri Durga Puja 2026')}</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-white text-brand-maroon flex items-center justify-center shadow-xs font-bold text-xs shrink-0 group-hover:translate-x-0.5 transition-transform ml-1">
                →
              </span>
            </Link>
            <Link
              href="/transparency"
              className="btn-tactile-parchment py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl font-semibold text-xs sm:text-sm text-stone-800 hover:text-brand-maroon flex items-center justify-between text-center whitespace-nowrap border border-[#E5DAC8] group shadow-2xs"
            >
              <div className="flex items-center gap-1.5 truncate">
                <NoticeScrollIcon className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                <span className="truncate">{b('হিসাব নিকাশ', 'Accounts')}</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-stone-200/80 group-hover:bg-brand-maroon group-hover:text-white text-stone-700 flex items-center justify-center text-xs shrink-0 transition-colors ml-1">
                →
              </span>
            </Link>
          </div>

          {/* The Artisanal Countdown Pavilion Card */}
          <div className="relative pt-6 sm:pt-8 pb-5 sm:pb-7 px-3.5 sm:px-6 md:px-8 rounded-2xl sm:rounded-3xl bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_8px_30px_rgba(28,13,19,0.05)] overflow-hidden flex flex-col items-center justify-center text-center group">
            {/* Top Alta Seam Accent */}
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#BE123C]/60 to-transparent" />

            {/* Decorative Traditional Corner Kolka Watermarks (Desktop only to prevent mobile clutter) */}
            <div className="absolute top-2.5 left-2.5 text-brand-maroon/10 pointer-events-none hidden sm:block">
              <CornerKolka className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="absolute top-2.5 right-2.5 text-brand-maroon/10 pointer-events-none rotate-90 hidden sm:block">
              <CornerKolka className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Kicker Tag / Eyebrow (Mobile-Friendly Pill) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] sm:text-xs font-serif font-bold text-amber-900 uppercase tracking-wider mb-2 sm:mb-2.5 shadow-2xs">
              <DiyaIcon className="w-3.5 h-3.5 text-amber-600 animate-gentle-float shrink-0" />
              <span>{b('সোনালী পার্ক অধিবাসীবৃন্দ • দুর্গোৎসব ২০২৬', 'Sonali Park Adhibasibrinda • Durga Puja 2026')}</span>
            </div>

            {/* Main Heading — Clean, Balanced & Mobile-Optimized */}
            <h2 className="text-lg sm:text-2xl md:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug px-2 max-w-lg">
              {(!settings.countdownHeading || settings.countdownHeading === 'মা আসছেন...' || settings.countdownHeading === 'মহাষ্টমী আসতে আর মাত্র' || lang === 'en')
                ? curr.counterHeading
                : settings.countdownHeading}
            </h2>

            {/* Poetic Subtitle */}
            <p className="text-[11px] sm:text-xs md:text-sm text-stone-500 font-serif italic mt-1 sm:mt-1.5 mb-3 sm:mb-5 max-w-md mx-auto">
              {b('মহিষাসুরমর্দিনীর আবাহনে পুণ্য মুহূর্তের প্রতীক্ষা', 'Awaiting the sacred invocation of Mother Durga')}
            </p>

            {/* Handcrafted Letterpress Countdown Dials */}
            <Countdown targetDate={settings.countdownDate || '2026-10-16T06:00:00+05:30'} variant="festive-boxes" />

            {/* Editorial Status & Logistics Seam */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 mt-4 pt-3.5 border-t border-stone-200/70 w-full max-w-xl text-[11px] sm:text-[13px] text-stone-600 font-medium">
              <span className="inline-flex items-center gap-1.5 text-stone-700">
                <CalendarPlaqueIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{curr.counterSub}</span>
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>{b('মণ্ডপ প্রস্তুতি চলছে', 'Pandal Work in Progress')}</span>
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <a
                href="https://maps.google.com/?q=Bansdroni+Sonali+Park+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-stone-600 hover:text-brand-maroon transition-colors group underline decoration-stone-300 underline-offset-4 hover:decoration-brand-maroon"
              >
                <MetroTransitIcon className="w-3.5 h-3.5 text-stone-500 group-hover:text-brand-maroon transition-colors shrink-0" />
                <span>{b('মেট্রো থেকে ১০ মিনিট', '10 mins from Metro')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* ═══ TRADITIONAL BENGALI KOLKA ACCENT SEAM ═══ */}
      <div className="relative w-full py-4 sm:py-6 flex items-center justify-center select-none pointer-events-none opacity-70">
        <div className="max-w-md w-full px-6 flex items-center justify-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-maroon/20 to-brand-maroon/40" />
          <div className="flex items-center gap-1.5 text-brand-maroon/70">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            <CornerKolka className="w-3.5 h-3.5 text-brand-maroon/80 rotate-45" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-brand-maroon/20 to-brand-maroon/40" />
        </div>
      </div>



      {/* ═══ 1. THEME SHOWCASE (Heritage Notepad Pavilion) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-7 mb-10 sm:mb-16 relative z-10">
        <div className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_8px_24px_rgba(28,13,19,0.05)] hover:shadow-[0_16px_36px_rgba(159,18,57,0.1)] rounded-3xl pt-8 pb-5 pl-10 sm:pl-14 pr-5 sm:pr-8 transition-all duration-300">
          {/* Top Pinned Textured Washi Tape */}
          <div className="absolute -top-3.5 left-7 sm:left-10 z-30 pointer-events-none">
            <WashiTapePin text={b('সোনালী পার্ক অধিবাসীবৃন্দ • শারদ থিম ২০২৬', 'Sonali Park Adhibasibrinda • Curated Theme 2026')} variant="amber" />
          </div>

          {/* Left Perforated Spiral Binder Margin - Authentic 3D Punched Holes */}
          <div className="absolute left-2.5 sm:left-3.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none z-20">
            <BinderHoles count={5} />
          </div>

          {/* Clipped Decorative Background Elements & Deckle Edge */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            {/* Subtle Ambient Watermark */}
            <div className="absolute -right-8 -bottom-8 w-60 h-60 opacity-[0.03] text-stone-900">
              <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
                {[...Array(6)].map((_, i) => (
                  <ellipse key={i} cx="100" cy="100" rx="40" ry="90" transform={`rotate(${i * 30} 100 100)`} />
                ))}
              </svg>
            </div>

            {/* Torn Paper Deckle Bottom Edge */}
            <div className="absolute bottom-0 inset-x-0 opacity-70">
              <TornDeckleEdge className="w-full text-stone-200 h-2 block" />
            </div>
          </div>

          {/* Content Body */}
          <div className="relative z-10 pt-1">
            {/* Center Display: Theme Title & Concept */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 sm:gap-5 mb-4 sm:mb-6">
              <div className="max-w-2xl">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-black text-stone-900 leading-[1.2] tracking-tight">
                  <span className="text-stone-400">&ldquo;</span>
                  {lang === 'en' ? (
                    <span className="text-stone-900">{t(settings.themeTitle) || 'Reflections of the Past, Visions of the Future'}</span>
                  ) : (
                    <span className="text-stone-900">{settings.themeTitle ? settings.themeTitle.replace(/^["'“]/, '').replace(/["'”]$/, '') : 'অতীতের আয়নায় আগামী'}</span>
                  )}
                  <span className="text-stone-400">&rdquo;</span>
                </h2>
                <div className="my-1.5 sm:my-2">
                  <FestiveWaveAccent className="w-14 sm:w-16 h-1.5 text-amber-500" />
                </div>
                <p className="text-stone-600 text-xs sm:text-sm font-serif italic leading-relaxed">
                  {b(
                    'ঐতিহ্য ও আধুনিক শিল্পভাবনার মেলবন্ধনে বাঁশদ্রোণী সোনালী পার্কের বিশেষ মণ্ডপ ও প্রতিমা উপস্থাপনা।',
                    'An artistic balance of sacred tradition and contemporary craftsmanship at Bansdroni Sonali Park.'
                  )}
                </p>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <Link
                  href="/puja"
                  className="btn-tactile-crimson text-white px-4 sm:pl-6 sm:pr-2.5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap flex sm:inline-flex items-center justify-between sm:justify-start gap-2.5 group shadow-md w-full sm:w-auto"
                >
                  <span>{b('সম্পূর্ণ থিম পরিক্রমা ও দর্শন', 'Explore Full Theme & Pandal')}</span>
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-brand-maroon flex items-center justify-center text-xs sm:text-sm font-bold shadow-xs transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-0.5 shrink-0">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* 3 Artisan Dossier Plaques (Sleek 3-Column Compact Mini-Grid on Mobile & Desktop) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 pt-3 sm:pt-4 border-t border-stone-200/80">
              <div className="group/art flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#E8DFD1] hover:border-amber-400/70 shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 shadow-2xs group-hover/art:scale-105 group-hover/art:bg-amber-100 transition-all text-amber-700">
                  <MandapIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-700" />
                </div>
                <div className="min-w-0 w-full">
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-stone-600 font-bold font-serif block truncate">
                    {b('মণ্ডপ শিল্পী', 'Pandal Architect')}
                  </span>
                  <span className="text-[10px] sm:text-sm font-serif font-black text-stone-900 tracking-tight block truncate">
                    {lang === 'en' ? (t(settings.pandalArtist) || 'Shilpa Niketan') : (settings.pandalArtist || 'শিল্প নিকেতন')}
                  </span>
                </div>
              </div>

              <div className="group/art flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#E8DFD1] hover:border-amber-400/70 shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 shadow-2xs group-hover/art:scale-105 group-hover/art:bg-amber-100 transition-all text-amber-700">
                  <SculptorIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-700" />
                </div>
                <div className="min-w-0 w-full">
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-stone-600 font-bold font-serif block truncate">
                    {b('প্রতিমা শিল্পী', 'Divine Sculptor')}
                  </span>
                  <span className="text-[10px] sm:text-sm font-serif font-black text-stone-900 tracking-tight block truncate">
                    {lang === 'en' ? (t(settings.idolArtist) || 'Sanatan Rudra Paul') : (settings.idolArtist || 'সনাতন রুদ্র পাল')}
                  </span>
                </div>
              </div>

              <div className="group/art flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-3 p-1.5 sm:p-3 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#E8DFD1] hover:border-amber-400/70 shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 shadow-2xs group-hover/art:scale-105 group-hover/art:bg-amber-100 transition-all text-amber-700">
                  <IlluminationIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-700" />
                </div>
                <div className="min-w-0 w-full">
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-stone-600 font-bold font-serif block truncate">
                    {b('আলোকসজ্জা', 'Illumination')}
                  </span>
                  <span className="text-[10px] sm:text-sm font-serif font-black text-stone-900 tracking-tight block truncate">
                    {lang === 'en' ? (t(settings.lightingArtist) || 'Das Electric') : (settings.lightingArtist || 'দাস ইলেকট্রিক')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. FESTIVAL CALENDAR PREVIEW (Authentic Panjika Calendar Leaves) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon" />
              <span>{b('সন ১৪৩৩ • ইং ২০২৬ শ্রী শ্রী শারদীয়া দুর্গাপূজা', '1433 Bangabda • 2026 CE Durga Puja')}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-serif font-black ${curr.textHead} tracking-tight leading-snug`}>
              {b('শ্রী শ্রী শারদীয়া দুর্গাপূজার সময় নির্ঘণ্ট', 'Official Sacred Rituals & Timetable')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-serif mt-1">
              {b('পরিচালনায় : সোনালী পার্ক অধিবাসীবৃন্দ • বি/১৩৭, সোনালী পার্ক, বাঁশদ্রোণী, কলকাতা - ৭০০ ০৭০ • রেজি: SO067242', 'Organized by : Sonali Park Adhibasibrinda • B/137, Sonali Park, Kolkata - 700 070 • Reg: SO067242')}
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

        {/* ═══ OFFICIAL 2026 NIRGHANTA HIGHLIGHTS (Agomon, Gomon & Vishesh Drashtavya) ═══ */}
        <div className="mb-6 sm:mb-8 grid sm:grid-cols-12 gap-3 sm:gap-4">
          {/* Left: Agomon & Gomon Badges */}
          <div className="sm:col-span-5 bg-[#FFFDF9] p-3.5 sm:p-4 rounded-2xl border border-[#E5DAC8] shadow-xs flex flex-col justify-center gap-2.5">
            <div className="flex items-center justify-between gap-2 text-stone-800 font-serif text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🐎</span>
                <span className="font-bold text-stone-900">{b('দেবীর ঘোটকে আগমন', 'Arrival on Horse')}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-brand-maroon border border-rose-200/80 text-[11px] font-bold">
                {b('ফল ছত্রভঙ্গ', 'Signifies Turmoil')}
              </span>
            </div>
            <div className="h-px bg-[#E8DFD1]" />
            <div className="flex items-center justify-between gap-2 text-stone-800 font-serif text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">⛵</span>
                <span className="font-bold text-stone-900">{b('দেবীর নৌকায় গমন', 'Departure on Boat')}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold">
                {b('ফল শস্য ও জল বৃদ্ধি', 'Signifies Abundance')}
              </span>
            </div>
          </div>

          {/* Right: VISHESH DRASHTAVYA (Maha Ashtami Anjali Announcement - Royal Festive Crimson & Gold) */}
          <div className="sm:col-span-7 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#881337] via-[#9F1239] to-[#701a2e] p-3.5 sm:p-4 text-white shadow-[0_8px_24px_rgba(159,18,57,0.22)] border border-amber-300/35 flex items-center gap-3.5 group">
            {/* Subtle decorative zari thread at the top */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />

            {/* Auspicious Gold Medallion */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-md border border-amber-100/60 text-xl group-hover:scale-105 transition-transform">
              🌺
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 text-amber-200 border border-amber-300/30 text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                <span>{b('বিশেষ দ্রষ্টব্য • আনুষ্ঠানিক ঘোষণা', 'Important Announcement')}</span>
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-rose-50 mt-1 leading-snug">
                {b('মহাষ্টমীর অঞ্জলী প্রদান ', 'Maha Ashtami Pushpanjali will take place on ')}
                <span className="text-amber-200 font-black underline decoration-amber-300/60 underline-offset-2">
                  {b('১৮ই অক্টোবর, ২০২৬ (রবিবার)', 'Sunday, 18th October 2026')}
                </span>
                {b(' অনুষ্ঠিত হবে', '')}
              </h3>
            </div>
          </div>
        </div>

        {/* 6 Authentic Panjika Calendar Leaves (Mobile: Swipeable Snap Carousel • Desktop: Side-by-side Grid) */}
        <div
          ref={calendarScrollRef}
          onScroll={(e) => {
            const container = e.currentTarget;
            const scrollLeft = container.scrollLeft;
            const itemWidth = container.offsetWidth * 0.8;
            if (itemWidth > 0) {
              const newIdx = Math.round(scrollLeft / itemWidth);
              if (newIdx >= 0 && newIdx < festivalDays.length && newIdx !== activeCalendarIndex) {
                setActiveCalendarIndex(newIdx);
              }
            }
          }}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar gap-3 sm:gap-4 lg:grid lg:grid-cols-6 lg:overflow-visible pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {festivalDays.map((c, i) => (
            <div
              key={c.id || i}
              className="w-[84vw] max-w-[310px] shrink-0 snap-center lg:w-auto lg:shrink flex"
            >
              <Link
                href="/puja"
                className="group relative w-full bg-[#FFFDF9] rounded-2xl border border-[#E5DAC8] shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* 1. COMPACT INTEGRATED CALENDAR HEADER (Tithi, Weekday, Date & Auspicious Icon INSIDE the Card) */}
                <div className={`px-3.5 py-2.5 bg-gradient-to-r ${c.headerGrad} text-white flex items-center justify-between shadow-xs`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center text-amber-200 shrink-0">
                      <c.Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-serif font-black text-sm tracking-wide text-white block leading-tight drop-shadow-xs">
                        {b(c.tithiBn, c.tithiEn)}
                      </span>
                      <span className="text-[10px] font-serif font-medium text-amber-200 block leading-none mt-0.5">
                        {b(c.weekdayBn, c.weekdayEn)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-black text-lg sm:text-xl text-white tabular-nums block leading-tight drop-shadow-2xs">
                      {b(c.dateNumBn, c.dateNumEn)}
                    </span>
                    <span className="text-[9px] font-serif font-semibold text-rose-100/90 uppercase tracking-wider block leading-none">
                      {b(c.monthBn, c.monthEn).split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* 2. COMPACT CALENDAR LEAF BODY (High-Density, Zero Wasted Space, No Redundant Button) */}
                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                  <div>
                    {/* Occasion / Ceremony Title */}
                    <h3 className="text-xs sm:text-[13px] font-serif font-bold text-stone-900 group-hover:text-brand-maroon transition-colors leading-snug line-clamp-2">
                      {b(c.ceremonyBn, c.ceremonyEn)}
                    </h3>

                    {/* Special Badge if present */}
                    {c.specialBadge && (
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-brand-maroon border border-rose-200 text-[10px] font-bold font-serif shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon animate-pulse" />
                          <span>{b(c.specialBadge, c.specialBadgeEn || c.specialBadge)}</span>
                        </span>
                      </div>
                    )}

                    {/* Compact Ritual Timings List */}
                    <div className="space-y-1 mt-2">
                      {c.rituals.map((r, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-1.5 text-[11px] text-stone-700 bg-[#FAF7F2] px-2 py-1 rounded-md border border-[#E8DFD1]/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="font-bold text-stone-900 shrink-0 font-serif">{b(r.timeBn, r.timeEn)}</span>
                          <span className="text-stone-400">·</span>
                          <span className="truncate text-stone-600">{b(r.labelBn, r.labelEn)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Perforated bottom tear-off deckle edge */}
                <div className="w-full opacity-50">
                  <TornDeckleEdge className="w-full text-stone-200 h-1 block" />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Pagination Control Strip (< lg) */}
        <div className="flex lg:hidden items-center justify-between mt-3 px-1">
          <button
            type="button"
            onClick={() => {
              const newIdx = Math.max(0, activeCalendarIndex - 1);
              setActiveCalendarIndex(newIdx);
              if (calendarScrollRef.current) {
                const target = calendarScrollRef.current.children[newIdx];
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            }}
            disabled={activeCalendarIndex === 0}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-serif font-bold text-stone-700 hover:text-brand-maroon disabled:opacity-35 disabled:cursor-not-allowed shadow-2xs"
          >
            ← {b('আগের দিন', 'Prev')}
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {festivalDays.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveCalendarIndex(idx);
                  if (calendarScrollRef.current) {
                    const target = calendarScrollRef.current.children[idx];
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }
                }}
                className={`transition-all duration-300 rounded-full ${
                  activeCalendarIndex === idx
                    ? 'w-6 h-2 bg-brand-maroon'
                    : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to day ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const newIdx = Math.min(festivalDays.length - 1, activeCalendarIndex + 1);
              setActiveCalendarIndex(newIdx);
              if (calendarScrollRef.current) {
                const target = calendarScrollRef.current.children[newIdx];
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }
            }}
            disabled={activeCalendarIndex === festivalDays.length - 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-serif font-bold text-stone-700 hover:text-brand-maroon disabled:opacity-35 disabled:cursor-not-allowed shadow-2xs"
          >
            {b('পরের দিন', 'Next')} →
          </button>
        </div>
      </section>

      {/* ═══ 3. GLIMPSES GALLERY (Unified Editorial Controls & No Scrollbar) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon" />
              <span>{b('আলোকচিত্র সংগ্রহ', 'Photo Archive')}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-serif font-black ${curr.textHead} tracking-tight leading-snug`}>
              {b('উৎসবের মুহূর্ত ও সোনালী স্মৃতি', 'Cherished Moments & Golden Memories')}
            </h2>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
            <Link
              href="/gallery"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 pl-4 sm:pl-5 pr-2 py-1.5 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
            >
              <span>{b('পুরো অ্যালবাম দেখুন', 'View Full Album')}</span>
              <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </Link>
          </div>
        </div>

        {galleryList.length === 0 ? (
          <div className={`text-center py-14 ${curr.cardBg} rounded-2xl border border-dashed border-stone-300 flex flex-col items-center justify-center gap-2.5`}>
            <DiyaIcon className="w-8 h-8 text-amber-500" />
            <p className={`font-serif text-sm sm:text-base ${curr.textSub}`}>
              {b('গ্যালারিতে এখনো কোনো ছবি যোগ করা হয়নি। উৎসবের সুন্দর মুহূর্তগুলো শীঘ্রই যোগ করা হবে।', 'No gallery photos uploaded yet. Festive moments will be added soon.')}
            </p>
          </div>
        ) : (
          (() => {
            const currentPhoto = galleryList[activeGalleryIndex % galleryList.length] || galleryList[0];
            return (
              <div className="w-full max-w-4xl mx-auto">
                {/* 1. MLH-Style Floating Showcase Card */}
                <div
                  className="rounded-3xl bg-white border border-[#E5DAC8] shadow-[0_12px_40px_rgba(28,13,19,0.07)] p-2.5 sm:p-4.5 relative overflow-hidden group transition-all duration-300"
                  onTouchStart={handleGalleryTouchStart}
                  onTouchEnd={handleGalleryTouchEnd}
                >
                  {/* Photo Display Window */}
                  <div
                    className="relative w-full h-64 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden bg-stone-900 cursor-pointer"
                    onClick={() => setSelectedImage(currentPhoto)}
                  >
                    {/* Top Left Washi Moment Tape */}
                    <div className="absolute top-3 left-3 z-20 pointer-events-none">
                      <WashiTapePin
                        text={b(`স্মৃতি #${toDigits((activeGalleryIndex % galleryList.length) + 1)}`, `Moment #${(activeGalleryIndex % galleryList.length) + 1}`)}
                        variant="amber"
                        className="text-[9px] sm:text-[10px]"
                      />
                    </div>

                    {/* Top Right Year Chip */}
                    <div className="absolute top-3 right-3 z-20 pointer-events-none">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-serif font-bold shadow-xs">
                        {toDigits(currentPhoto.year || selectedYear)}
                      </span>
                    </div>

                    <img
                      key={activeGalleryIndex}
                      src={currentPhoto.src}
                      alt={currentPhoto.title || 'Durga Puja Moment'}
                      onError={(e) => { e.currentTarget.src = '/assets/durga-hero.png'; }}
                      className="w-full h-full object-cover filter grayscale-[12%] contrast-[104%] group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-[1.025] transition-all duration-700 ease-out animate-in fade-in zoom-in-95"
                    />

                    {/* Frosted Bottom Info Dock */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-transparent p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-xs font-serif uppercase tracking-wider text-amber-300 font-bold block mb-0.5">
                          {t(currentPhoto.category) || b('উৎসব পরিক্রমা', 'Festival Glimpses')}
                        </span>
                        <h3 className="text-white font-serif font-bold text-sm sm:text-lg md:text-xl truncate drop-shadow-sm">
                          {t(currentPhoto.title) || b('বাঁশদ্রোণী সোনালী পার্ক', 'Bansdroni Sonali Park')}
                        </h3>
                      </div>

                      {/* Action Pills */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-full font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(currentPhoto);
                          }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                          <span>{b('বড় করে দেখুন', 'Zoom')}</span>
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 bg-brand-maroon hover:bg-[#881337] text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-md transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerDownload(currentPhoto.src, `${currentPhoto.title || 'durga-puja-moment'}.jpg`);
                          }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>{b('ডাউনলোড', 'Download')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Harmonized Heritage Pagination Navigation Dock */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
                  {/* Prev Button [ ← ] */}
                  <button
                    type="button"
                    onClick={prevGallery}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                    aria-label="Previous photo"
                  >
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Segmented Indicator Dock with Warm Crimson Active Pill or Counter */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5DAC8] shadow-inner">
                    {galleryList.length <= 8 ? (
                      galleryList.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            (activeGalleryIndex % galleryList.length) === idx
                              ? 'w-7 sm:w-9 h-2 bg-brand-maroon'
                              : 'w-2 h-2 bg-amber-900/25 hover:bg-amber-900/40'
                          }`}
                          aria-label={`Go to photo ${idx + 1}`}
                        />
                      ))
                    ) : (
                      <span className="font-serif font-bold text-xs text-stone-700 px-2 py-0.5 tabular-nums">
                        {b(
                          `${toDigits((activeGalleryIndex % galleryList.length) + 1)} / ${toDigits(galleryList.length)}`,
                          `${(activeGalleryIndex % galleryList.length) + 1} of ${galleryList.length}`
                        )}
                      </span>
                    )}
                  </div>

                  {/* Next Button [ → ] */}
                  <button
                    type="button"
                    onClick={nextGallery}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                    aria-label="Next photo"
                  >
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* 3. Interactive Thumbnail Discovery Strip */}
                <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 mt-4 sm:mt-5 overflow-x-auto py-1 px-2 scrollbar-hide max-w-full">
                  {galleryList.map((img, i) => {
                    const isSelected = (activeGalleryIndex % galleryList.length) === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveGalleryIndex(i)}
                        className={`relative w-12 h-12 sm:w-15 sm:h-15 rounded-xl overflow-hidden shrink-0 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-brand-maroon ring-offset-2 scale-105 shadow-sm opacity-100'
                            : 'opacity-55 hover:opacity-100 border border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <img
                          src={img.src}
                          alt={img.title || ''}
                          onError={(e) => { e.currentTarget.src = '/assets/durga-hero.png'; }}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()
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
              <h3 className="text-white text-2xl font-bold">{t(selectedImage.title)}</h3>
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

      {/* ═══ 4. PUJA NOTICES (MLH-Style Interactive Bulletin Showcase) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon" />
              <span>{b('পাড়ার বার্তা', 'Community Desk')}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-serif font-black ${curr.textHead} tracking-tight leading-snug`}>
              {b('শারদীয়া দুর্গোৎসবের আনুষ্ঠানিক বিজ্ঞপ্তি', 'Official Puja Notices & Announcements')}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold px-3.5 py-1.5 sm:py-2 rounded-full bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs">
              {b('সক্রিয় বিজ্ঞপ্তি', 'Active Bulletins')}: {toDigits(notices.length)} {b('টি', '')}
            </span>
            <button
              type="button"
              onClick={() => {
                const btn = document.getElementById('notif-btn');
                if (btn) btn.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-brand-maroon text-xs font-bold border border-rose-200 transition-all cursor-pointer shadow-2xs"
              title={b('সমস্ত নোটিফিকেশন দেখুন', 'View all announcements')}
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{b('নোটিফিকেশন সেন্টার', 'Alerts')}</span>
            </button>
          </div>
        </div>

        {notices.length === 0 ? (
          <div className="relative text-center py-16 px-6 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] flex flex-col items-center justify-center gap-3 max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <NoticeScrollIcon className="w-7 h-7 text-brand-maroon" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-800">
              {b('কোনো নতুন নোটিশ নেই', 'No Active Notices')}
            </h3>
            <p className={`font-serif text-xs sm:text-sm ${curr.textSub} max-w-md`}>
              {b('এই বছরের সমস্ত নিয়মিত আপডেট এখানে সময়মতো প্রকাশ করা হবে।', 'All regular updates and puja circulars will be published here in timely order.')}
            </p>
          </div>
        ) : (
          (() => {
            const currentNotice = notices[activeNoticeIndex % notices.length] || notices[0];
            const noticeIdx = (activeNoticeIndex % notices.length) + 1;
            const isCopied = copiedNoticeId === (currentNotice.id || 'current');

            return (
              <div className="w-full max-w-3xl lg:max-w-4xl mx-auto pt-4 sm:pt-5">
                {/* 1. MLH-Style Floating Showcase Notice Card with Heritage Notepad Look */}
                <div
                  className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_10px_32px_rgba(28,13,19,0.06)] hover:shadow-[0_18px_48px_rgba(159,18,57,0.1)] rounded-3xl pt-8 pb-5 pl-10 sm:pl-14 pr-5 sm:pr-8 transition-all duration-300 flex flex-col justify-between"
                  onTouchStart={handleNoticeTouchStart}
                  onTouchEnd={handleNoticeTouchEnd}
                >
                  {/* Pinned Textured Washi Tape on Top Center (Zero clipping) */}
                  <div className="absolute -top-3.5 left-7 sm:left-10 z-30 pointer-events-none">
                    <WashiTapePin text={b(`বিজ্ঞপ্তি নং ০${noticeIdx} • ২০২৬`, `Notice #${noticeIdx} • 2026`)} variant="amber" />
                  </div>

                  {/* Left Perforated Spiral Binder Margin - Authentic 3D Punched Holes */}
                  <div className="absolute left-2.5 sm:left-3.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none z-20">
                    <BinderHoles count={5} />
                  </div>

                  {/* Clipped Decorative Background Elements */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    {/* Ambient Background Watermark */}
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.03] text-stone-900">
                      <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
                        {[...Array(6)].map((_, i) => (
                          <ellipse key={i} cx="100" cy="100" rx="40" ry="90" transform={`rotate(${i * 30} 100 100)`} />
                        ))}
                      </svg>
                    </div>

                    {/* Torn Paper Deckle Bottom Edge */}
                    <div className="absolute bottom-0 inset-x-0 opacity-70">
                      <TornDeckleEdge className="w-full text-stone-200 h-2 block" />
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="relative z-10">
                    {/* Top Header Row with Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-stone-700 border border-[#E8DFD1] font-serif shadow-2xs">
                        <NoticeScrollIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-600" />
                        <span>{b('জরুরি ঘোষণা', 'Official Circular')}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] sm:text-xs font-serif font-medium text-stone-600 bg-stone-100/90 px-2.5 py-0.5 rounded-full border border-stone-200/80 shadow-2xs">
                          📅 {formatDate(currentNotice.date, lang)}
                        </span>
                        {notices.length > 1 && (
                          <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                            {toDigits(noticeIdx)}/{toDigits(notices.length)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notice Title */}
                    <h3 className="text-base sm:text-xl md:text-2xl font-serif font-black text-stone-900 leading-[1.3] tracking-tight">
                      {t(currentNotice.title?.replace(/^\[(Puja|Club|Samiti|Samity)\]\s*/i, ''))}
                    </h3>

                    {/* Festive Wave Accent */}
                    <div className="my-2 sm:my-2.5">
                      <FestiveWaveAccent className="w-14 sm:w-16 h-1.5 text-amber-500" />
                    </div>

                    {/* Notice Body */}
                    <p className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose font-sans whitespace-pre-line mb-4 sm:mb-5">
                      {t(currentNotice.text)}
                    </p>

                    {/* PDF Circular Quick Action Bar (Only shown if pdfUrl exists) */}
                    {currentNotice.pdfUrl && (
                      <div className="flex flex-wrap items-center gap-2.5 mb-5 sm:mb-6">
                        <Link
                          href={`?viewPdf=${encodeURIComponent(currentNotice.pdfUrl)}&pdfTitle=${encodeURIComponent(currentNotice.title?.replace(/^\[(Puja|Club|Samiti|Samity)\]\s*/i, '') || 'Official Circular')}`}
                          scroll={false}
                          className="btn-tactile-crimson inline-flex items-center gap-2 py-2 sm:py-2.5 px-4 sm:px-5 rounded-full text-white font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(190,18,60,0.28)] hover:shadow-[0_8px_24px_rgba(190,18,60,0.4)] transition-all cursor-pointer group/pdf"
                        >
                          <FileText className="w-4 h-4 text-amber-200 group-hover/pdf:scale-110 transition-transform" />
                          <span>{b('অফিসিয়াল বিজ্ঞপ্তি PDF দেখুন', 'View Official PDF Circular')}</span>
                          <span className="w-5 h-5 rounded-full bg-white/20 group-hover/pdf:bg-white text-white group-hover/pdf:text-brand-maroon flex items-center justify-center text-xs font-bold transition-colors ml-0.5">
                            →
                          </span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => triggerDownload(currentNotice.pdfUrl, `${currentNotice.title?.replace(/^\[(Puja|Club|Samiti|Samity)\]\s*/i, '') || 'Notice'}.pdf`)}
                          className="btn-tactile-parchment inline-flex items-center gap-1.5 py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-full text-stone-700 hover:text-brand-maroon font-semibold text-xs sm:text-sm border border-[#E5DAC8] shadow-2xs transition-all cursor-pointer"
                          title={b('পিডিএফ ডাউনলোড করুন', 'Download Circular PDF')}
                        >
                          <Download className="w-3.5 h-3.5 text-stone-600 group-hover:text-brand-maroon" />
                          <span>{b('ডাউনলোড', 'Download')}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Footer Meta Row & Action Controls */}
                  <div className="pt-3.5 sm:pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs relative z-10">
                    <span className="text-stone-500 font-serif italic text-[11px] sm:text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{b('সোনালী পার্ক অধিবাসীবৃন্দ কর্তৃক পরিচালিত ও অনুমোদিত', 'Organized & Authorized by Sonali Park Adhibasibrinda')}</span>
                    </span>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => copyNotice(currentNotice)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                        title={b('নোটিশের লিঙ্ক কপি করুন', 'Copy Notice Link')}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                        <span>{isCopied ? b('লিঙ্ক কপি!', 'Link Copied!') : b('লিঙ্ক কপি', 'Copy Link')}</span>
                      </button>

                      <Link
                        href="/notifications"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-maroon hover:bg-[#881337] text-white shadow-2xs transition-colors cursor-pointer"
                        title={b('সমস্ত নোটিশের তালিকা দেখুন', 'View Full List of Notifications')}
                      >
                        <span>{b('সকল নোটিশ তালিকা', 'All Notifications')}</span>
                        <span className="text-xs">→</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 2. Harmonized Heritage Pagination Navigation Dock (Only if > 1 notice) */}
                {notices.length > 1 && (
                  <>
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
                      {/* Prev Button [ ← ] */}
                      <button
                        type="button"
                        onClick={prevNotice}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                        aria-label="Previous notice"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>

                      {/* Segmented Indicator Dock with Warm Crimson Active Pill */}
                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF7F2] border border-[#E5DAC8] shadow-inner">
                        {notices.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveNoticeIndex(idx)}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                              (activeNoticeIndex % notices.length) === idx
                                ? 'w-7 sm:w-9 h-2 bg-brand-maroon'
                                : 'w-2 h-2 bg-amber-900/25 hover:bg-amber-900/40'
                            }`}
                            aria-label={`Go to notice ${idx + 1}`}
                          />
                        ))}
                      </div>

                      {/* Next Button [ → ] */}
                      <button
                        type="button"
                        onClick={nextNotice}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                        aria-label="Next notice"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })()
        )}
      </section>

      {/* ═══ 5. VISIT OUR OTHER PORTALS (Compact Redesigned Bento Cards) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon" />
              <span>{b('পাড়ার চালিকাশক্তি', 'Community Wings')}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-serif font-black ${curr.textHead} tracking-tight leading-snug`}>
              {b('পাড়ার ঐতিহ্য ও সেবার দুই স্তম্ভ', 'The Two Pillars of Heritage & Service')}
            </h2>
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
          <div className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_8px_24px_rgba(28,13,19,0.05)] hover:shadow-[0_18px_38px_rgba(159,18,57,0.12)] rounded-3xl pt-8 pb-5 pl-10 sm:pl-13 pr-6 sm:pr-8 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            {/* Pinned Textured Washi Tape on Top Center */}
            <div className="absolute -top-3.5 left-8 sm:left-10 z-20">
              <WashiTapePin text={b("ক্লাব ও ক্রীড়া পরিষদ • রেজি: SO067242", "Club & Sports Wing • Reg: SO067242")} variant="amber" />
            </div>

            {/* Left Perforated Spiral Binder Margin */}
            <div className="absolute left-2.5 sm:left-3.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none z-10">
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

              {/* Wave Accent */}
              <div className="mb-3">
                <FestiveWaveAccent className="w-14 h-1.5 text-amber-500" />
              </div>

              <p className={`${curr.textSub} text-xs sm:text-sm leading-relaxed mb-4`}>
                {b(
                  'আমাদের সংস্কৃতি, ক্রীড়া ও সামাজিক ঐক্যের প্রাণকেন্দ্র। ফুটবল ও ক্রিকেট প্রতিযোগিতা, রক্তদান শিবির এবং সারা বছর সমাজসেবামূলক কর্মকাণ্ড পরিচালনা করে সোনালী সঙ্ঘ।',
                  'The athletic and cultural heartbeat of our neighborhood. Organizing tournaments, blood donation camps, and community welfare round the year.'
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

          {/* Wing 2: Sonali Park Unnayan Samity */}
          <div className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_8px_24px_rgba(28,13,19,0.05)] hover:shadow-[0_18px_38px_rgba(159,18,57,0.12)] rounded-3xl pt-8 pb-5 pl-10 sm:pl-13 pr-6 sm:pr-8 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            {/* Pinned Textured Washi Tape on Top Center */}
            <div className="absolute -top-3.5 left-8 sm:left-10 z-20">
              <WashiTapePin text={b("নাগরিক উন্নয়ন ও সেবা • রেজিস্টার্ড RWA", "Civic Welfare & Registered RWA")} variant="emerald" />
            </div>

            {/* Left Perforated Spiral Binder Margin */}
            <div className="absolute left-2.5 sm:left-3.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none z-10">
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

              {/* Wave Accent */}
              <div className="mb-3">
                <FestiveWaveAccent className="w-14 h-1.5 text-emerald-600" />
              </div>

              <p className={`${curr.textSub} text-xs sm:text-sm leading-relaxed mb-4`}>
                {b(
                  'সোনালী পার্কের সার্বিক নাগরিক কল্যাণ ও আবাসিক পরিচালন পরিষদ। রাস্তাঘাট সংস্কার, পরিচ্ছন্নতা, পথবাতি ও সিসিটিভি নিরাপত্তায় সর্বক্ষণ নিবেদিত।',
                  'The registered Residents Welfare Association of Sonali Park. Managing infrastructure, security, sanitation, lighting, and community welfare.'
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
    </main>
  );
}
