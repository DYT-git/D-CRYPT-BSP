'use client';
import { useState, useMemo } from 'react';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Users, Image as ImageIcon, ShieldCheck, 
  ArrowRight, Download, FileText, 
  Building, Wrench, Lightbulb, TreePine,
  ZoomIn, X, Phone, Megaphone, Camera,
  ChevronLeft, ChevronRight, Share2, Check, Bell,
  Link2, Compass, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { triggerDownload } from '@/utils/download';
import { getImageWing } from '@/utils/gallery';
import { 
  SamitiEmblemIcon, 
  CivicShieldBadgeIcon, 
  CivicLightBadgeIcon, 
  CivicGreeneryBadgeIcon, 
  FestiveWaveAccent, 
  WashiTapePin, 
  BinderHoles, 
  TornDeckleEdge,
  NoticeScrollIcon 
} from '@/components/HeritageIcons';

function parseMemberRole(role) {
  if (!role) return { wing: 'Samiti', cleanRole: '', phone: '' };
  let wing = 'Samiti';
  let rest = role;
  if (rest.startsWith('[Club]')) { wing = 'Club'; rest = rest.replace('[Club]', '').trim(); }
  else if (rest.startsWith('[Samiti]') || rest.startsWith('[Samity]')) { wing = 'Samiti'; rest = rest.replace(/^\[(Samiti|Samity)\]/, '').trim(); }
  else if (rest.startsWith('[Puja]')) { wing = 'Puja'; rest = rest.replace('[Puja]', '').trim(); }

  let cleanRole = rest;
  let phone = '';
  if (rest.includes('|')) {
    const parts = rest.split('|');
    cleanRole = parts[0].trim();
    phone = parts[1].replace(/phone|tel|m\.|m:/gi, '').trim();
  }
  return { wing, cleanRole, phone };
}

function parseMemberNameDetails(rawName) {
  if (!rawName) return { mainName: '', nickname: '', englishName: '' };
  const parenMatches = [...rawName.matchAll(/\(([^)]+)\)/g)].map(m => m[1].trim());
  let nickname = '';
  let englishName = '';
  parenMatches.forEach(item => {
    if (/[a-zA-Z]/.test(item)) {
      englishName = item;
    } else {
      nickname = item;
    }
  });
  const mainName = rawName.replace(/\([^)]+\)/g, '').trim();
  return { mainName, nickname, englishName };
}

const FALLBACK_SAMITI_MEMBERS = [
  { id: 30, name: "শতদল রায় (SATADAL ROY)", role: "[Samiti] সভাপতি | 9830379574", image: "/assets/avatars/president.svg", year: 2026 },
  { id: 31, name: "সঞ্জয় ঘোষ (SANJOY GHOSH)", role: "[Samiti] সহ-সভাপতি | 9088533055", image: "/assets/avatars/vice-president.svg", year: 2026 },
  { id: 32, name: "সৈকত সাহা (SAIKAT SAHA)", role: "[Samiti] সাধারণ সম্পাদক | 9831065856", image: "/assets/avatars/secretary.svg", year: 2026 },
  { id: 33, name: "অনির্বাণ সাহা (ANIRBAN SAHA)", role: "[Samiti] সহ-সম্পাদক | 9163197141", image: "/assets/avatars/asst-secretary.svg", year: 2026 },
  { id: 34, name: "বিকাশ গুপ্ত (VIKASH GUPTA)", role: "[Samiti] কোষাধ্যক্ষ | 9874222446", image: "/assets/avatars/treasurer.svg", year: 2026 },
  { id: 35, name: "রবি শাহ (RAVI SHAH)", role: "[Samiti] সহ-কোষাধ্যক্ষ | 8910458272", image: "/assets/avatars/asst-treasurer.svg", year: 2026 },
  { id: 36, name: "পরেশ দেবনাথ (PARESH DEBNATH)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 6290269691", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 37, name: "পঙ্কজ সাহা (PANKAJ SAHA)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 9830371671", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 38, name: "সুকুমার মণ্ডল (SUKUMAR MONDAL)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 7439866492", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 39, name: "অরূপ শিকদার (ARUP SIKDER)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 8100563504", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 40, name: "সাহেব হালদার (SAHEB HALDER)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 9748872221", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 41, name: "কাকলী দে (KAKOLI DEY)", role: "[Samiti] সমস্যা ও সমাধান বিভাগ | 8697852566", image: "/assets/avatars/cultural-female.svg", year: 2026 },
  { id: 42, name: "রবি গোস্বামী (RABI GOSWAMI)", role: "[Samiti] সমস্যা ও সমাধান বিভাগ | 8240672206", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 43, name: "সুরজিৎ সরকার (SUROJIT SARKAR)", role: "[Samiti] উন্নয়ন পরিষদ সদস্য | 8777581827", image: "/assets/avatars/samiti-member.svg", year: 2026 }
];

export default function SamitiPage() {
  const { data, settings, selectedYear } = useData();
  const { lang, b, t, tRole, tName, tNickname, toDigits, formatDate } = useLanguage();

  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // 1. Notice carousel state
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);
  const [copiedNoticeId, setCopiedNoticeId] = useState(null);
  const [touchStartNotice, setTouchStartNotice] = useState(null);

  // 2. Member carousel state
  const [activeMemberPage, setActiveMemberPage] = useState(0);
  const [touchStartMember, setTouchStartMember] = useState(null);

  // 3. Gallery carousel state
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [touchStartGallery, setTouchStartGallery] = useState(null);

  // 4. Audit PDF toggle state
  const [showAllPdfs, setShowAllPdfs] = useState(false);

  // Samiti Dedicated Notices
  const samitiNotices = useMemo(() => {
    const raw = (data.notices && data.notices.length > 0)
      ? data.notices
          .filter(n => n.title && (n.title.startsWith('[Samiti]') || n.title.startsWith('[Samity]')))
          .map(n => ({
            ...n,
            title: n.title.replace(/^\[(Samiti|Samity)\]\s*/i, ''),
            pdfUrl: n.pdfUrl || null
          }))
      : [];

    if (raw.length > 0) return raw.slice(0, 5);

    return [
      {
        id: 'samiti-notice-1',
        title: b('বর্ষাপূর্ব পাড়ার পরিচ্ছন্নতা ও ডেঙ্গি প্রতিরোধ স্প্রে অভিযান', 'Pre-Monsoon Cleanliness & Vector Control Spray Drive'),
        text: b(
          'সকল অভ্যন্তরীণ লেন ও প্রাঙ্গণ • সকাল ৮:০০ টা হইতে অপরাহ্ন ১:০০ টা\n\nআসন্ন বর্ষা মৌসুমের পূর্বে সোনালী পার্কের প্রতিটি অভ্যন্তরীণ লেনে ব্লিচিং ও ডেঙ্গি প্রতিরোধে লার্ভিসাইড স্প্রে করা হবে। বাসিন্দাদের যত্রতত্র প্লাস্টিক বর্জ্য বা জল জমিয়ে না রাখার জন্য বিশেষ অনুরোধ জানানো হচ্ছে।',
          'All Neighborhood Lanes • 8:00 AM to 1:00 PM\n\nIntensive sanitation and anti-larval chemical spraying will be conducted across all neighborhood lanes before monsoon. Residents are requested to ensure no water accumulation or plastic waste disposal.'
        ),
        pdfUrl: null,
        isUrgent: true,
        year: 2026,
        date: '2026-09-15'
      },
      {
        id: 'samiti-notice-2',
        title: b('পাড়ার আবাসিকদের বার্ষিক সাধারণ সভা ও নাগরিক সনদ পর্যালোচনা', 'Annual General Meeting of Residents & Civic Charter Review'),
        text: b(
          'কমিউনিটি হল ভবন • অপরাহ্ন ৬:০০ ঘটিকা\n\nউন্নয়ন সমিতির বাৎসরিক সাধারণ সভা (AGM) আগামী মাসে অনুষ্ঠিত হবে। বিগত বছরের অডিট রিপোর্ট পেশ, পাড়ার নতুন সিসিটিভি ক্যামেরা স্থাপন ও রাতের নিরাপত্তা ব্যবস্থা নিয়ে আলোচনা হবে। সকল আবাসিক পরিবারের উপস্থিতি কাম্য।',
          'Community Hall • 6:00 PM Onwards\n\nThe Annual General Meeting (AGM) of Unnayan Samiti will take place next month. Discussion on annual audit presentation, new CCTV surveillance nodes, and neighborhood night guards.'
        ),
        pdfUrl: null,
        isUrgent: false,
        year: 2026,
        date: '2026-09-10'
      }
    ];
  }, [data.notices, b]);

  // Notice Handlers
  const prevNotice = () => setActiveNoticeIndex(prev => (prev - 1 + samitiNotices.length) % samitiNotices.length);
  const nextNotice = () => setActiveNoticeIndex(prev => (prev + 1) % samitiNotices.length);

  const handleNoticeTouchStart = (e) => setTouchStartNotice(e.touches[0].clientX);
  const handleNoticeTouchEnd = (e) => {
    if (!touchStartNotice) return;
    const diff = touchStartNotice - e.changedTouches[0].clientX;
    if (diff > 50) nextNotice();
    if (diff < -50) prevNotice();
    setTouchStartNotice(null);
  };

  const copyNotice = (notice) => {
    if (!notice) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/notifications?wing=Samiti&id=${encodeURIComponent(notice.id || '')}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedNoticeId(notice.id || 'current');
      setTimeout(() => setCopiedNoticeId(null), 2500);
    }
  };

  // Civic gallery photos (All samiti photos)
  const samitiGalleryItems = useMemo(() => {
    const raw = (data.gallery && data.gallery.length > 0)
      ? data.gallery.filter(g => getImageWing(g) === 'Samiti')
      : [];

    if (raw.length > 0) return raw;

    return [
      {
        src: '/assets/durga-hero.png',
        title: b('পাড়ার অভ্যন্তরীণ রাস্তা ও পথবাতি সংস্কার কাজ', 'Neighborhood Lane & Streetlight Maintenance'),
        category: 'Roads',
        year: 2026
      },
      {
        src: '/assets/durga-morning.png',
        title: b('পরিবেশ দিবস উপলক্ষে বাৎসরিক বৃক্ষরোপণ', 'World Environment Day Tree Plantation'),
        category: 'Greenery',
        year: 2026
      },
      {
        src: '/assets/durga-evening.png',
        title: b('পাড়ার বাসিন্দাদের সাধারণ বার্ষিক সভা', 'Annual General Meeting of Residents'),
        category: 'Meetings',
        year: 2026
      },
      {
        src: '/assets/samiti-hero-banner.jpg',
        title: b('সিসিটিভি নজরদারি ব্যবস্থা ও পথবাতি আধুনিকায়ন', 'CCTV Surveillance & LED Streetlights Upgrade'),
        category: 'Security',
        year: 2026
      }
    ];
  }, [data.gallery, b]);

  // Gallery Handlers
  const prevGallery = () => setActiveGalleryIndex(prev => (prev - 1 + samitiGalleryItems.length) % samitiGalleryItems.length);
  const nextGallery = () => setActiveGalleryIndex(prev => (prev + 1) % samitiGalleryItems.length);

  const handleGalleryTouchStart = (e) => setTouchStartGallery(e.touches[0].clientX);
  const handleGalleryTouchEnd = (e) => {
    if (!touchStartGallery) return;
    const diff = touchStartGallery - e.changedTouches[0].clientX;
    if (diff > 50) nextGallery();
    if (diff < -50) prevGallery();
    setTouchStartGallery(null);
  };

  // All Samiti Members
  const allSamitiMembers = useMemo(() => {
    let rawSamitiMembers = (data.members || []).filter(m => m.role && (m.role.startsWith('[Samiti]') || m.role.startsWith('[Samity]')));
    if (rawSamitiMembers.length === 0) {
      rawSamitiMembers = FALLBACK_SAMITI_MEMBERS;
    }
    const sorted = [...rawSamitiMembers].sort((a, b) => (a.id || 0) - (b.id || 0));
    return sorted.map(m => {
      const parsedRole = parseMemberRole(m.role);
      const parsedName = parseMemberNameDetails(m.name);
      return {
        id: m.id,
        name: parsedName.mainName,
        nickname: parsedName.nickname,
        englishName: parsedName.englishName,
        rawName: m.name,
        role: parsedRole.cleanRole,
        phone: parsedRole.phone,
        image: m.image || '/assets/avatars/samiti-member.svg'
      };
    });
  }, [data.members]);

  // Member Pagination (4 cards per slide)
  const MEMBERS_PER_PAGE = 4;
  const totalMemberPages = Math.max(1, Math.ceil(allSamitiMembers.length / MEMBERS_PER_PAGE));
  const currentMemberSlice = allSamitiMembers.slice(
    (activeMemberPage % totalMemberPages) * MEMBERS_PER_PAGE,
    ((activeMemberPage % totalMemberPages) + 1) * MEMBERS_PER_PAGE
  );

  const prevMemberPage = () => setActiveMemberPage(prev => (prev - 1 + totalMemberPages) % totalMemberPages);
  const nextMemberPage = () => setActiveMemberPage(prev => (prev + 1) % totalMemberPages);

  const handleMemberTouchStart = (e) => setTouchStartMember(e.touches[0].clientX);
  const handleMemberTouchEnd = (e) => {
    if (!touchStartMember) return;
    const diff = touchStartMember - e.changedTouches[0].clientX;
    if (diff > 50) nextMemberPage();
    if (diff < -50) prevMemberPage();
    setTouchStartMember(null);
  };

  // Samiti Financial Documents (Only verified uploaded files, no dummy sample-audit.pdf)
  const samitiFinances = useMemo(() => {
    return (data.finances || [])
      .filter(f => f.title && (f.title.startsWith('[Samiti]') || f.title.startsWith('[Samity]')))
      .filter(f => f.url && f.url !== '/sample-audit.pdf')
      .map(f => ({
        title: f.title.replace(/^\[(Samiti|Samity)\]/, '').trim(),
        year: f.year,
        url: f.url
      }));
  }, [data.finances]);

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-20 sm:pt-24 pb-20 selection:bg-brand-maroon selection:text-white font-sans">
      {/* ═══ INDEPENDENT SAMITI HERO BANNER (ATMOSPHERIC HERITAGE LOOK) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-950 text-white border border-stone-800/80 group">
          {/* Hero Banner Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={settings?.samitiHeroImage || '/assets/samiti-hero-banner.jpg'}
              alt="Bansdroni Sonali Park Unnayan Samiti Banner"
              className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Cinematic Multi-Layer Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-stone-950/90" />
            <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
          </div>

          <div className="relative z-10 px-6 py-14 sm:py-20 md:py-24 lg:px-12 flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Samiti Registration / Identity Kicker */}
            <div className="inline-flex items-center justify-center gap-2.5 mb-3 text-emerald-300 font-serif text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
              <span className="w-5 h-0.5 bg-emerald-400/50 rounded-full" />
              <span>{b('রেজি: SO067242 • নাগরিক কল্যাণ ও আবাসিক আরডব্লিউএ শাখা', 'Reg: SO067242 • Civic Development & Residents Welfare Association')}</span>
              <span className="w-5 h-0.5 bg-emerald-400/50 rounded-full" />
            </div>

            {/* Samiti Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white mb-2 leading-tight drop-shadow-md">
              {lang === 'en' ? (t(settings.samitiHeroTitle) || 'Sonali Park') : (settings.samitiHeroTitle || 'সোনালী পার্ক')} <span className="text-emerald-400">{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
            </h1>
            <div className="flex justify-center mb-4">
              <FestiveWaveAccent className="w-16 h-2 text-emerald-400/90" />
            </div>

            {/* Samiti Subtitle & Tagline */}
            <p className="text-base sm:text-lg md:text-xl text-stone-200 font-normal max-w-2xl leading-relaxed drop-shadow-sm mb-2">
              {lang === 'en'
                ? (t(settings.samitiHeroTagline) || 'The registered residents welfare association safeguarding neighborhood security, clean roads, civic drainage, and environmental welfare.')
                : (settings.samitiHeroTagline || 'বাঁশদ্রোণী সোনালী পার্কের নাগরিক পরিষেবা, নিরাপত্তা ও সামগ্রিক উন্নয়নের অভিভাবক। রাস্তাঘাট, পরিচ্ছন্নতা এবং সবুজায়নের মাধ্যমে উন্নত জীবনযাত্রার প্রতিশ্রুতি।')}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 1. SAMITI NOTICES (SIDE-WISE CONTROLLING CAROUSEL) ═══ */}
      <section id="samiti-notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>{b('সমিতির বার্তা', 'Civic Desk')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
              {b('উন্নয়ন সমিতির আনুষ্ঠানিক বিজ্ঞপ্তি', 'Unnayan Samiti Official Notices')}
            </h2>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
            <Link
              href="/notifications?wing=Samiti"
              className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-2 py-1.5 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
            >
              <span>{b('সকল সমিতি নোটিশ দেখুন', 'View All Samiti Notices')}</span>
              <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </Link>
          </div>
        </div>

        {samitiNotices.length === 0 ? (
          <div className="relative text-center py-16 px-6 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] flex flex-col items-center justify-center gap-3 max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <NoticeScrollIcon className="w-7 h-7 text-brand-maroon" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-800">
              {b('কোনো নতুন নোটিশ নেই', 'No Active Notices')}
            </h3>
            <p className="font-serif text-xs sm:text-sm text-stone-600 max-w-md">
              {b('সমিতির সমস্ত নিয়মিত আপডেট এখানে সময়মতো প্রকাশ করা হবে।', 'All regular civic updates and samity circulars will be published here in timely order.')}
            </p>
          </div>
        ) : (
          (() => {
            const currentNotice = samitiNotices[activeNoticeIndex % samitiNotices.length] || samitiNotices[0];
            const noticeIdx = (activeNoticeIndex % samitiNotices.length) + 1;
            const isCopied = copiedNoticeId === (currentNotice.id || 'current');

            return (
              <div className="w-full max-w-3xl lg:max-w-4xl mx-auto pt-2">
                {/* 1. MLH-Style Floating Showcase Notice Card */}
                <div
                  className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_10px_32px_rgba(28,13,19,0.06)] hover:shadow-[0_18px_48px_rgba(159,18,57,0.1)] rounded-3xl pt-8 pb-5 pl-10 sm:pl-14 pr-5 sm:pr-8 transition-all duration-300 flex flex-col justify-between"
                  onTouchStart={handleNoticeTouchStart}
                  onTouchEnd={handleNoticeTouchEnd}
                >
                  {/* Pinned Textured Washi Tape on Top Center */}
                  <div className="absolute -top-3.5 left-7 sm:left-10 z-30 pointer-events-none">
                    <WashiTapePin text={b(`সমিতি বিজ্ঞপ্তি নং ০${noticeIdx} • ২০২৬`, `Samiti Circular #${noticeIdx} • 2026`)} variant="emerald" />
                  </div>

                  {/* Left Perforated Spiral Binder Margin */}
                  <div className="absolute left-2.5 sm:left-3.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none z-20">
                    <BinderHoles count={5} />
                  </div>

                  {/* Clipped Decorative Background Elements */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute bottom-0 inset-x-0 opacity-70">
                      <TornDeckleEdge className="w-full text-stone-200 h-2 block" />
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="relative z-10">
                    {/* Top Header Row with Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-serif shadow-2xs">
                          <SamitiEmblemIcon className="w-3 h-3 text-emerald-700" />
                          <span>{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
                        </span>
                        {currentNotice.isUrgent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-300">
                            <span>{b('জরুরি', 'Urgent')}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] sm:text-xs font-serif font-medium text-stone-600 bg-stone-100/90 px-2.5 py-0.5 rounded-full border border-stone-200/80 shadow-2xs">
                          📅 {formatDate(currentNotice.date, lang)}
                        </span>
                        {samitiNotices.length > 1 && (
                          <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                            {toDigits(noticeIdx)}/{toDigits(samitiNotices.length)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notice Title */}
                    <h3 className="text-base sm:text-xl md:text-2xl font-serif font-black text-stone-900 leading-[1.3] tracking-tight">
                      {t(currentNotice.title?.replace(/^\[Samiti\]\s*/i, ''))}
                    </h3>

                    {/* Festive Wave Accent */}
                    <div className="my-2 sm:my-2.5">
                      <FestiveWaveAccent className="w-14 sm:w-16 h-1.5 text-emerald-600" />
                    </div>

                    {/* Notice Body */}
                    <p className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose font-sans whitespace-pre-line mb-4 sm:mb-5">
                      {t(currentNotice.text)}
                    </p>

                    {/* PDF Circular Quick Action Bar */}
                    {currentNotice.pdfUrl && (
                      <div className="flex flex-wrap items-center gap-2.5 mb-5 sm:mb-6">
                        <Link
                          href={`/transparency?wing=Samiti&viewPdf=${encodeURIComponent(currentNotice.pdfUrl)}&pdfTitle=${encodeURIComponent(currentNotice.title?.replace(/^\[Samiti\]\s*/i, '') || 'Official Circular')}`}
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
                          onClick={() => triggerDownload(currentNotice.pdfUrl, `${currentNotice.title?.replace(/^\[Samiti\]\s*/i, '') || 'Samiti-Notice'}.pdf`)}
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
                      <span className="truncate">{b('বাঁশদ্রোণী সোনালী পার্ক উন্নয়ন সমিতি পরিচালনা পরিষদ কর্তৃক অনুমোদিত', 'Authorized by Bansdroni Sonali Park Unnayan Samiti Executive')}</span>
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
                        href="/notifications?wing=Samiti"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-maroon hover:bg-[#881337] text-white shadow-2xs transition-colors cursor-pointer"
                        title={b('সকল সমিতি নোটিশ দেখুন', 'View Full List of Samiti Notices')}
                      >
                        <span>{b('সকল সমিতি নোটিশ', 'All Samiti Notices')}</span>
                        <span className="text-xs">→</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 2. Harmonized Heritage Pagination Navigation Dock */}
                {samitiNotices.length > 1 && (
                  <>
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
                      <button
                        type="button"
                        onClick={prevNotice}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                        aria-label="Previous notice"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>

                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF7F2] border border-[#E5DAC8] shadow-inner">
                        {samitiNotices.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveNoticeIndex(idx)}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                              (activeNoticeIndex % samitiNotices.length) === idx
                                ? 'w-7 sm:w-9 h-2 bg-brand-maroon'
                                : 'w-2 h-2 bg-amber-900/25 hover:bg-amber-900/40'
                            }`}
                            aria-label={`Go to notice ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={nextNotice}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                        aria-label="Next notice"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    </div>

                    {/* Quick Notice Discovery Strip */}
                    <div className="flex items-center justify-center gap-2 mt-4 overflow-x-auto py-1 px-2 scrollbar-hide max-w-full">
                      {samitiNotices.map((n, i) => {
                        const isSelected = (activeNoticeIndex % samitiNotices.length) === i;
                        return (
                          <button
                            key={n.id || i}
                            onClick={() => setActiveNoticeIndex(i)}
                            className={`px-3 py-1.5 rounded-full text-xs font-serif font-medium transition-all cursor-pointer whitespace-nowrap ${
                              isSelected
                                ? 'bg-brand-maroon text-white font-bold shadow-xs'
                                : 'bg-white border border-[#E5DAC8] text-stone-700 hover:border-brand-maroon/50'
                            }`}
                          >
                            {toDigits(i + 1)}. {t(n.title?.replace(/^\[Samiti\]\s*/i, '')).slice(0, 24)}...
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })()
        )}
      </section>

      {/* ═══ 2. SAMITI COMMITTEE (SIDE-WISE CONTROLLING CAROUSEL) ═══ */}
      <section id="samiti-committee" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
              {b('উন্নয়ন সমিতি পরিচালনা পরিষদ', 'Unnayan Samiti Council')}
            </h2>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
            <Link
              href="/committee?wing=Samiti"
              className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-2 py-1.5 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
            >
              <span>{b('সম্পূর্ণ পরিষদ ও বিভাগসমূহ দেখুন', 'View Full Council & Departments')}</span>
              <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Member Cards Slider Container */}
        <div
          className="relative max-w-5xl mx-auto"
          onTouchStart={handleMemberTouchStart}
          onTouchEnd={handleMemberTouchEnd}
        >
          {/* Active 4-Member Slice Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5 transition-all duration-300">
            {currentMemberSlice.map((m, idx) => (
              <div
                key={m.id || idx}
                className="group relative p-3.5 sm:p-4 rounded-3xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-emerald-500/50 shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between text-center overflow-hidden"
              >
                {/* Top Subtle Emerald Glow on Hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500 transition-all duration-500" />

                <div className="w-full flex flex-col items-center">
                  {/* Portrait Avatar Frame */}
                  <div className="relative w-full max-w-[100px] sm:max-w-[120px] aspect-[4/5] mx-auto rounded-2xl overflow-hidden border border-emerald-200/80 group-hover:border-emerald-400 bg-stone-100 shadow-2xs mb-2.5 flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <img
                      src={m.image}
                      alt={m.name}
                      onError={(e) => { e.currentTarget.src = '/assets/avatars/samiti-member.svg'; }}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Name */}
                  <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-emerald-950 transition-colors" title={lang === 'en' ? tName(m.rawName || m.name) : m.name}>
                    {lang === 'en' ? tName(m.rawName || m.name) : m.name}
                  </h4>

                  {/* Nickname & Sub-language Transliteration */}
                  <div className="flex items-center justify-center gap-1 mt-1 flex-wrap">
                    {m.nickname && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                        “{lang === 'en' ? tNickname(m.nickname) : m.nickname}”
                      </span>
                    )}
                    {lang === 'bn' && m.englishName && (
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                        {m.englishName}
                      </span>
                    )}
                    {lang === 'en' && (
                      <span className="text-[10px] font-serif text-stone-400 tracking-wide block">
                        {m.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Role & Direct Phone Call Pill */}
                <div className="w-full flex flex-col items-center gap-1.5 mt-3 pt-2.5 border-t border-stone-200/60">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 group-hover:bg-emerald-100 text-emerald-950 text-[10px] font-bold border border-emerald-200 group-hover:border-emerald-300 leading-tight truncate max-w-full transition-colors">
                    {tRole(m.role)}
                  </span>
                  {m.phone && (
                    <a
                      href={`tel:+91${m.phone}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100/90 hover:bg-emerald-600 hover:text-white text-[10px] text-stone-600 font-mono font-medium border border-stone-200/80 hover:border-emerald-600 transition-all shadow-2xs active:scale-95 cursor-pointer"
                      title={b(`কল করুন: ${m.phone}`, `Call: ${m.phone}`)}
                    >
                      <Phone className="w-2.5 h-2.5 text-emerald-600 group-hover:text-white transition-colors" />
                      <span>{m.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Harmonized Heritage Pagination Navigation Dock */}
          {totalMemberPages > 1 && (
            <div className="flex flex-col items-center justify-center gap-2.5 mt-6">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={prevMemberPage}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                  aria-label="Previous members"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF7F2] border border-[#E5DAC8] shadow-inner">
                  {Array.from({ length: totalMemberPages }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMemberPage(idx)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        (activeMemberPage % totalMemberPages) === idx
                          ? 'w-7 sm:w-9 h-2 bg-brand-maroon'
                          : 'w-2 h-2 bg-amber-900/25 hover:bg-amber-900/40'
                      }`}
                      aria-label={`Go to member page ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextMemberPage}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                  aria-label="Next members"
                >
                  <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>

              {/* Page Counter Label */}
              <span className="text-[11px] font-mono text-stone-500 bg-white px-2.5 py-0.5 rounded-full border border-stone-200/70 shadow-2xs">
                {b('পরিষদ পাতা', 'Page')} {toDigits(activeMemberPage + 1)} / {toDigits(totalMemberPages)}
              </span>
            </div>
          )}

          {/* ═══ Official Departmental Portfolios Directory (2026 Charter) ═══ */}
          <div className="mt-10 sm:mt-12 pt-8 border-t border-stone-200/60 max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-850 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                {b('বিভাগীয় দায়িত্ব ও পরিচালনা পরিষদ ২০২৬', 'Departmental Portfolios & Councils 2026')}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* 1. Office & Asset Management */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-400/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    {b('অফিস ও সম্পত্তি ব্যবস্থাপনা', 'Office & Asset Management')}
                  </h4>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { name: b('পরেশ দেবনাথ', 'Paresh Debnath'), phone: '6290269691' },
                    { name: b('পঙ্কজ সাহা', 'Pankaj Saha'), phone: '9830371671' },
                    { name: b('সুকুমার মণ্ডল', 'Sukumar Mondal'), phone: '7439866492' },
                    { name: b('বিকাশ গুপ্ত', 'Vikash Gupta'), phone: '9874222446' },
                    { name: b('অরূপ শিকদার', 'Arup Sikder'), phone: '8100563504' },
                    { name: b('সাহেব হালদার', 'Saheb Halder'), phone: '9748872221' },
                  ].map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <span className="font-medium text-stone-800">{p.name}</span>
                      <a href={`tel:+91${p.phone}`} className="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold">
                        <Phone className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{p.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Department of Problems and Solutions */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-400/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    {b('সমস্যা ও সমাধান বিভাগ', 'Department of Problems & Solutions')}
                  </h4>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { name: b('অনির্বাণ সাহা', 'Anirban Saha'), phone: '9163197141' },
                    { name: b('কাকলী দে', 'Kakoli Dey'), phone: '8697852566' },
                    { name: b('রবি গোস্বামী', 'Rabi Goswami'), phone: '8240672206' },
                    { name: b('অরূপ শিকদার', 'Arup Sikder'), phone: '8100563504' },
                    { name: b('রবি শাহ', 'Ravi Shah'), phone: '8910458272' },
                  ].map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <span className="font-medium text-stone-800">{p.name}</span>
                      <a href={`tel:+91${p.phone}`} className="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold">
                        <Phone className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{p.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Cultural and Event Management */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-400/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    {b('সাংস্কৃতিক ও অনুষ্ঠান ব্যবস্থাপনা', 'Cultural & Event Management')}
                  </h4>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { name: b('পরেশ দেবনাথ', 'Paresh Debnath'), phone: '6290269691' },
                    { name: b('অনির্বাণ সাহা', 'Anirban Saha'), phone: '9163197141' },
                  ].map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <span className="font-medium text-stone-800">{p.name}</span>
                      <a href={`tel:+91${p.phone}`} className="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold">
                        <Phone className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{p.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Development Council */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-400/50 transition-colors">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    {b('উন্নয়ন পরিষদ', 'Development Council')}
                  </h4>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { name: b('সৈকত সাহা', 'Saikat Saha'), phone: '9831065856' },
                    { name: b('শতদল রায়', 'Satadal Roy'), phone: '9830379574' },
                    { name: b('সুরজিৎ সরকার', 'Surojit Sarkar'), phone: '8777581827' },
                    { name: b('রবি গোস্বামী', 'Rabi Goswami'), phone: '8240672206' },
                    { name: b('সঞ্জয় ঘোষ', 'Sanjoy Ghosh'), phone: '9088533055' },
                    { name: b('পঙ্কজ সাহা', 'Pankaj Saha'), phone: '9830371671' },
                    { name: b('রবি শাহ', 'Ravi Shah'), phone: '8910458272' },
                  ].map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <span className="font-medium text-stone-800">{p.name}</span>
                      <a href={`tel:+91${p.phone}`} className="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold">
                        <Phone className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{p.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. SAMITI CIVIC GALLERY (SIDE-WISE CONTROLLING CAROUSEL) ═══ */}
      <section id="samiti-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>{b('নাগরিক অ্যালবাম', 'Civic Archive')}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug`}>
              {b('নাগরিক সেবা ও সমাজকল্যাণ চিত্রমালা', 'Civic Welfare & Community Gallery')}
            </h2>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
            <Link
              href="/gallery?wing=Samiti"
              className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-2 py-1.5 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
            >
              <span>{b('সকল সমিতি ছবি দেখুন', 'View All Samiti Photos')}</span>
              <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </Link>
          </div>
        </div>

        {samitiGalleryItems.length === 0 ? (
          <div className="relative text-center py-16 px-6 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] flex flex-col items-center justify-center gap-3 max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <Camera className="w-7 h-7 text-brand-maroon" />
            </div>
            <p className="font-serif text-sm sm:text-base text-stone-600">
              {b('গ্যালারিতে এখনো কোনো ছবি যোগ করা হয়নি।', 'No gallery photos uploaded yet.')}
            </p>
          </div>
        ) : (
          (() => {
            const currentPhoto = samitiGalleryItems[activeGalleryIndex % samitiGalleryItems.length] || samitiGalleryItems[0];
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
                        text={b(`মুহূর্ত #${toDigits((activeGalleryIndex % samitiGalleryItems.length) + 1)}`, `Moment #${(activeGalleryIndex % samitiGalleryItems.length) + 1}`)}
                        variant="emerald"
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
                      alt={currentPhoto.title || 'Civic Moment'}
                      onError={(e) => { e.currentTarget.src = '/assets/durga-hero.png'; }}
                      className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500 animate-in fade-in zoom-in-95 duration-300"
                    />

                    {/* Frosted Bottom Info Dock */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-transparent p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-xs font-serif uppercase tracking-wider text-emerald-300 font-bold block mb-0.5">
                          {t(currentPhoto.category) || b('নাগরিক মুহূর্ত', 'Civic Moments')}
                        </span>
                        <h3 className="text-white font-serif font-bold text-sm sm:text-lg md:text-xl truncate drop-shadow-sm">
                          {t(currentPhoto.title)}
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
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>{b('বড় করে দেখুন', 'Zoom')}</span>
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 bg-brand-maroon hover:bg-[#881337] text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-md transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerDownload(currentPhoto.src, `${currentPhoto.title || 'samiti-photo'}.jpg`);
                          }}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{b('ডাউনলোড', 'Download')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Harmonized Heritage Pagination Navigation Dock */}
                {samitiGalleryItems.length > 1 && (
                  <>
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
                      <button
                        type="button"
                        onClick={prevGallery}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>

                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5DAC8] shadow-inner">
                        {samitiGalleryItems.length <= 8 ? (
                          samitiGalleryItems.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveGalleryIndex(idx)}
                              className={`transition-all duration-300 rounded-full cursor-pointer ${
                                (activeGalleryIndex % samitiGalleryItems.length) === idx
                                  ? 'w-7 sm:w-9 h-2 bg-brand-maroon'
                                  : 'w-2 h-2 bg-amber-900/25 hover:bg-amber-900/40'
                              }`}
                              aria-label={`Go to photo ${idx + 1}`}
                            />
                          ))
                        ) : (
                          <span className="font-serif font-bold text-xs text-stone-700 px-2 py-0.5 tabular-nums">
                            {b(
                              `${toDigits((activeGalleryIndex % samitiGalleryItems.length) + 1)} / ${toDigits(samitiGalleryItems.length)}`,
                              `${(activeGalleryIndex % samitiGalleryItems.length) + 1} of ${samitiGalleryItems.length}`
                            )}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={nextGallery}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-brand-maroon/50 hover:bg-[#FAF7F2] text-stone-700 hover:text-brand-maroon flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    </div>

                    {/* 3. Interactive Thumbnail Discovery Strip */}
                    <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 mt-4 sm:mt-5 overflow-x-auto py-1 px-2 scrollbar-hide max-w-full">
                      {samitiGalleryItems.map((img, i) => {
                        const isSelected = (activeGalleryIndex % samitiGalleryItems.length) === i;
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
                  </>
                )}
              </div>
            );
          })()
        )}
      </section>

      {/* ═══ 5. SAMITI FINANCIALS & VERIFIED AUDITS (OVERVIEW) ═══ */}
      <section id="samiti-finance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#E5DAC8] shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 pb-4 border-b border-stone-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>{b('আর্থিক স্বচ্ছতা', 'Audited Accounts')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
                {b('উন্নয়ন সমিতির বাজেট ও অডিট রিপোর্ট', 'Unnayan Samiti Accounts & Audits')}
              </h2>
            </div>

            <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
              <Link
                href="/transparency?wing=Samiti"
                className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-2 py-1.5 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
              >
                <span>{b('সম্পূর্ণ হিসাব ও অডিট দেখুন', 'View Full Accounts & Audits')}</span>
                <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Audit Documents Download List or Authentic In-Progress State */}
          {samitiFinances.length > 0 ? (
            <div className="space-y-3">
              {(showAllPdfs ? samitiFinances : samitiFinances.slice(0, 2)).map((doc, idx) => (
                <Link
                  key={idx}
                  href={`/transparency?wing=Samiti&viewPdf=${encodeURIComponent(doc.url)}&pdfTitle=${encodeURIComponent(t(doc.title))}`}
                  className="group flex items-center justify-between p-3.5 sm:p-4.5 rounded-2xl bg-white border border-[#E8DFD1] hover:border-brand-maroon/40 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/90 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 group-hover:text-brand-maroon transition-colors truncate">
                        {t(doc.title)}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F2] text-stone-600 border border-[#E8DFD1]">
                          {b('অডিট নথি', 'Audit Document')}
                        </span>
                        <span className="text-xs text-stone-400">
                          {b('সাল:', 'Year:')} {toDigits(doc.year, lang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="btn-tactile-parchment inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-stone-800 group-hover:text-brand-maroon font-bold text-xs">
                      <span>{b('দেখুন', 'View')}</span>
                      <span className="text-xs">→</span>
                    </div>
                    <button
                      type="button"
                      title={b('পিডিএফ ডাউনলোড করুন', 'Download PDF')}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        triggerDownload(doc.url, `${doc.title || 'samiti-audit'}.pdf`);
                      }}
                      className="p-1.5 rounded-full bg-stone-100 hover:bg-brand-maroon hover:text-white text-stone-600 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12 px-4 rounded-2xl bg-white border border-stone-200/80">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-1">
                {b('উন্নয়ন সমিতির নতুন নিরীক্ষিত অডিট রিপোর্ট আপলোড হলে এখানে প্রকাশিত হবে।', 'New Unnayan Samiti audit reports will be updated here once verified.')}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
                {b('হিসাব নিরীক্ষা প্রক্রিয়াধীন রয়েছে।', 'Accounts verification is in progress.')}
              </p>
              <div className="mt-4">
                <Link
                  href="/transparency?wing=Samiti"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>{b('স্বচ্ছতা ও বাজেট বিভাগ দেখুন →', 'View Transparency & Budget →')}</span>
                </Link>
              </div>
            </div>
          )}

          {/* See More / Show Less Toggle Button */}
          {samitiFinances.length > 2 && (
            <div className="flex justify-center pt-5">
              <button
                type="button"
                onClick={() => setShowAllPdfs(prev => !prev)}
                className="btn-tactile-parchment inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-stone-700 hover:text-brand-maroon border border-[#E5DAC8] shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span>
                  {showAllPdfs
                    ? b('সংক্ষেপ করুন ↑', 'Show Less ↑')
                    : b(`আরও অডিট নথি দেখুন (${toDigits(samitiFinances.length - 2)}টি) ↓`, `See More Audits (${samitiFinances.length - 2} More) ↓`)}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ LIGHTBOX MODAL ═══ */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-[#0B1224]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition z-50 border border-white/20 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="relative flex flex-col items-center gap-4 max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.title} className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10" />
            <div className="flex items-center justify-between w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-3.5 gap-4">
              <div className="min-w-0">
                <span className="text-emerald-300 text-[10px] uppercase tracking-widest font-bold block">
                  {t(selectedImage.category) || 'Samiti'}
                </span>
                <h3 className="text-white font-bold text-lg truncate mt-0.5">{t(selectedImage.title)}</h3>
              </div>
              <button
                type="button"
                onClick={() => triggerDownload(selectedImage.src, `${selectedImage.title || 'samity-photo'}.jpg`)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full font-bold transition-all text-sm shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" /> {b('ডাউনলোড', 'Download')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
