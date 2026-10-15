'use client';
import { useState, useMemo } from 'react';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Users, Image as ImageIcon, ShieldCheck, 
  ArrowRight, Download, FileText, 
  Dumbbell, Music, Trophy, HeartHandshake,
  ZoomIn, X, Phone, Megaphone, Camera,
  ChevronLeft, ChevronRight, Share2, Check, Bell,
  Link2
} from 'lucide-react';
import Link from 'next/link';
import { triggerDownload } from '@/utils/download';
import { getImageWing } from '@/utils/gallery';
import { 
  ClubCrestIcon, 
  SportsBadgeIcon, 
  BloodDonationBadgeIcon, 
  CulturalStageBadgeIcon, 
  FestiveWaveAccent, 
  WashiTapePin, 
  BinderHoles, 
  TornDeckleEdge,
  NoticeScrollIcon 
} from '@/components/HeritageIcons';

function parseMemberRole(role) {
  if (!role) return { wing: 'Club', cleanRole: '', phone: '' };
  let wing = 'Club';
  let rest = role;
  if (rest.startsWith('[Club]')) { wing = 'Club'; rest = rest.replace('[Club]', '').trim(); }
  else if (rest.startsWith('[Samiti]') || rest.startsWith('[Samity]')) { wing = 'Samiti'; rest = rest.replace(/^\[(Samiti|Samity)\]/i, '').trim(); }
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

const FALLBACK_CLUB_MEMBERS = [
  { id: 7, name: "রবি জানা (RABI JANA)", role: "[Club] সভাপতি | 7980464187", image: "/assets/avatars/rabi-jana.jpg", year: 2026 },
  { id: 8, name: "ছোটকা দাস (বাপি) (CHOTKA DAS)", role: "[Club] সহঃ সভাপতি | 8910936506", image: "/assets/avatars/vice-president.svg", year: 2026 },
  { id: 9, name: "তরুণ দেবনাথ (TARUN DEBNATH)", role: "[Club] সহঃ সভাপতি | 7890867584", image: "/assets/avatars/vice-president.svg", year: 2026 },
  { id: 10, name: "নৃপেন সাহা (NRIPEN SAHA)", role: "[Club] সম্পাদক | 8777484189", image: "/assets/avatars/nripen-saha.jpg", year: 2026 },
  { id: 11, name: "সুরজিৎ সরকার (SURAJIT SARKAR)", role: "[Club] সহঃ সম্পাদক | 8777581827", image: "/assets/avatars/asst-secretary.svg", year: 2026 },
  { id: 12, name: "অরূপ মল্লিক (ARUP MULLICK)", role: "[Club] সহঃ সম্পাদক | 8777285009", image: "/assets/avatars/asst-secretary.svg", year: 2026 },
  { id: 13, name: "শুভজিৎ মালো (সনু) (SUBHAJIT MALO)", role: "[Club] কোষাধ্যক্ষ | 9123727257", image: "/assets/avatars/subhajit-malo.jpg", year: 2026 },
  { id: 14, name: "অভিষেক চৌধুরী (শিবা) (AVISEK CHOUDHURY)", role: "[Club] সহঃ কোষাধ্যক্ষ | 8013337014", image: "/assets/avatars/asst-treasurer.svg", year: 2026 },
  { id: 15, name: "রবি গোস্বামী (RAVI GOSWAMI)", role: "[Club] সহঃ কোষাধ্যক্ষ | 8240672206", image: "/assets/avatars/asst-treasurer.svg", year: 2026 },
  { id: 16, name: "অমল দাস (বাবাই) (AMAL DAS)", role: "[Club] ক্রীড়া সম্পাদক | 8777368136", image: "/assets/avatars/amal-das.jpg", year: 2026 },
  { id: 17, name: "আকাশ জানা (AKASH JANA)", role: "[Club] সহঃ ক্রীড়া সম্পাদক | 6289640300", image: "/assets/avatars/sports-secretary.svg", year: 2026 },
  { id: 18, name: "অতনু দত্ত (টুটু) (ATANU DUTTA)", role: "[Club] সহঃ ক্রীড়া সম্পাদক | 9339748034", image: "/assets/avatars/sports-secretary.svg", year: 2026 },
  { id: 19, name: "পিংকি কুণ্ডু (PINKI KUNDU)", role: "[Club] সাংস্কৃতিক সম্পাদক | 9874674901", image: "/assets/avatars/cultural-female.svg", year: 2026 },
  { id: 20, name: "স্নেহা ঘোষ (SNEHA GHOSH)", role: "[Club] সাংস্কৃতিক সম্পাদক | 6289860007", image: "/assets/avatars/cultural-female.svg", year: 2026 },
  { id: 21, name: "তরুণ দেবনাথ (TARUN DEBNATH)", role: "[Club] সাংস্কৃতিক সম্পাদক | 7890867584", image: "/assets/avatars/cultural-secretary.svg", year: 2026 },
  { id: 22, name: "দেবাশীষ দেওয়ান (DEBASISH DEWAN)", role: "[Club] সহযোগী সদস্য", image: "/assets/avatars/club-member.svg", year: 2026 },
  { id: 23, name: "সঞ্জয় মণ্ডল (বাবাই) (SANJOY MONDAL)", role: "[Club] সহযোগী সদস্য", image: "/assets/avatars/club-member.svg", year: 2026 }
];

export default function ClubPage() {
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

  // Club Dedicated Notices
  const clubNotices = useMemo(() => {
    const raw = (data.notices && data.notices.length > 0)
      ? data.notices
          .filter(n => n.title && n.title.startsWith('[Club]'))
          .map(n => ({
            ...n,
            title: n.title.replace(/^\[Club\]\s*/, ''),
            pdfUrl: n.pdfUrl || null
          }))
      : [];

    if (raw.length > 0) return raw.slice(0, 5);

    return [
      {
        id: 'club-notice-1',
        title: b('বার্ষিক ফুটবল ও ক্রিকেট টুর্নামেন্ট ২০২৬ খেলোয়াড় রেজিস্ট্রেশন', 'Annual Sports Tournament 2026 Registration Open'),
        text: b(
          'অনুর্ধ্ব-১৯ ও সিনিয়র বিভাগ • সোনালী সঙ্ঘ ময়দান\n\nসোনালী সঙ্ঘের বাৎসরিক ফুটবল ও ক্রিকেট টুর্নামেন্টের দল গঠন প্রক্রিয়া শুরু হয়েছে। পাড়ার আগ্রহী তরুণ ও যুবকদের আগামী ১৫ দিনের মধ্যে ক্লাবের ক্রীড়া সম্পাদকের সাথে যোগাযোগ করার অনুরোধ জানানো হচ্ছে।',
          'U-19 & Senior Category • Sonali Sangha Ground\n\nRegistration is now open for the Annual Football and Cricket Tournament 2026. Neighborhood youth are requested to contact the Club Sports Secretary within the next 15 days.'
        ),
        pdfUrl: null,
        isUrgent: true,
        year: 2026,
        date: '2026-09-18'
      },
      {
        id: 'club-notice-2',
        title: b('স্বেচ্ছায় রক্তদান ও বিনামূল্যে স্বাস্থ্য পরীক্ষা শিবির', 'Voluntary Blood Donation & Free Health Screening Camp'),
        text: b(
          'ক্লাব ভবন প্রাঙ্গণ • সকাল ৯:০০ টা হইতে অপরাহ্ন ২:০০ টা\n\nসোনালী সঙ্ঘ ক্লাবের উদ্যোগে আগামী রবিবার সকাল ৯টা থেকে ক্লাব ভবনে বাৎসরিক রক্তদান ও চক্ষু পরীক্ষা শিবির অনুষ্ঠিত হবে। পাড়ার সকল নাগরিককে অংশগ্রহণ করে এই মহৎ উদ্যোগকে সফল করার আবেদন জানানো হচ্ছে।',
          'Club Premises • 9:00 AM to 2:00 PM\n\nA voluntary blood donation camp along with free eye checkups will be held at the club premises next Sunday starting 9:00 AM. All residents are cordially invited to participate.'
        ),
        pdfUrl: null,
        isUrgent: false,
        year: 2026,
        date: '2026-09-12'
      }
    ];
  }, [data.notices, b]);

  // Notice Handlers
  const prevNotice = () => setActiveNoticeIndex(prev => (prev - 1 + clubNotices.length) % clubNotices.length);
  const nextNotice = () => setActiveNoticeIndex(prev => (prev + 1) % clubNotices.length);

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
    const shareUrl = `${origin}/notifications?wing=Club&id=${encodeURIComponent(notice.id || '')}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedNoticeId(notice.id || 'current');
      setTimeout(() => setCopiedNoticeId(null), 2500);
    }
  };

  // Club gallery photos (All club photos)
  const clubGalleryItems = useMemo(() => {
    const raw = (data.gallery && data.gallery.length > 0)
      ? data.gallery.filter(g => getImageWing(g) === 'Club')
      : [];

    if (raw.length > 0) return raw;

    return [
      {
        src: '/assets/durga-hero.png',
        title: b('বার্ষিক ফুটবল টুর্নামেন্ট ২০২৬', 'Annual Football League 2026'),
        category: 'Sports',
        year: 2026
      },
      {
        src: '/assets/durga-morning.png',
        title: b('স্বেচ্ছায় রক্তদান ও স্বাস্থ্য শিবির', 'Voluntary Blood Donation Camp'),
        category: 'Blood Donation',
        year: 2026
      },
      {
        src: '/assets/durga-evening.png',
        title: b('রবীন্দ্র জয়ন্তী ও সাংস্কৃতিক সন্ধ্যা', 'Rabindra Jayanti Cultural Night'),
        category: 'Cultural',
        year: 2026
      },
      {
        src: '/assets/club-hero-banner.jpg',
        title: b('ক্লাব প্রাঙ্গণ ও নবনির্মিত জিম উদ্বোধন', 'Clubhouse Arena & Gym Inauguration'),
        category: 'Infrastructure',
        year: 2026
      }
    ];
  }, [data.gallery, b]);

  // Gallery Handlers
  const prevGallery = () => setActiveGalleryIndex(prev => (prev - 1 + clubGalleryItems.length) % clubGalleryItems.length);
  const nextGallery = () => setActiveGalleryIndex(prev => (prev + 1) % clubGalleryItems.length);

  const handleGalleryTouchStart = (e) => setTouchStartGallery(e.touches[0].clientX);
  const handleGalleryTouchEnd = (e) => {
    if (!touchStartGallery) return;
    const diff = touchStartGallery - e.changedTouches[0].clientX;
    if (diff > 50) nextGallery();
    if (diff < -50) prevGallery();
    setTouchStartGallery(null);
  };

  // All Club Members
  const allClubMembers = useMemo(() => {
    let rawClubMembers = (data.members || []).filter(m => m.role && m.role.startsWith('[Club]'));
    if (rawClubMembers.length === 0) {
      rawClubMembers = FALLBACK_CLUB_MEMBERS;
    }
    const sorted = [...rawClubMembers].sort((a, b) => (a.id || 0) - (b.id || 0));
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
        image: m.image || '/assets/avatars/club-member.svg'
      };
    });
  }, [data.members]);

  // Member Pagination (4 cards per slide)
  const MEMBERS_PER_PAGE = 4;
  const totalMemberPages = Math.max(1, Math.ceil(allClubMembers.length / MEMBERS_PER_PAGE));
  const currentMemberSlice = allClubMembers.slice(
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

  // Club Financial Documents (Only verified uploaded files, no dummy sample-audit.pdf)
  const clubFinances = useMemo(() => {
    return (data.finances || [])
      .filter(f => f.title && f.title.startsWith('[Club]'))
      .filter(f => f.url && f.url !== '/sample-audit.pdf')
      .map(f => ({
        title: f.title.replace('[Club]', '').trim(),
        year: f.year,
        url: f.url
      }));
  }, [data.finances]);

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-20 sm:pt-24 pb-20 selection:bg-brand-maroon selection:text-white font-sans">
      {/* ═══ INDEPENDENT CLUB HERO BANNER (ATMOSPHERIC HERITAGE LOOK) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-950 text-white border border-stone-800/80 group">
          {/* Hero Banner Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={settings?.clubHeroImage || '/assets/club-hero-banner.jpg'}
              alt="Bansdroni Sonali Sangha Club Banner"
              className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Cinematic Multi-Layer Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-stone-950/90" />
            <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
          </div>

          <div className="relative z-10 px-6 py-14 sm:py-20 md:py-24 lg:px-12 flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Club Registration / Identity Kicker */}
            <div className="inline-flex items-center justify-center gap-2.5 mb-3 text-amber-300 font-serif text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
              <span className="w-5 h-0.5 bg-amber-400/50 rounded-full" />
              <span>{b('রেজি: SO067242 • ক্রীড়া, সংস্কৃতি ও যুবকল্যাণ পরিষদ', 'Reg: SO067242 • Sports, Cultural & Youth Wing')}</span>
              <span className="w-5 h-0.5 bg-amber-400/50 rounded-full" />
            </div>

            {/* Club Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white mb-2 leading-tight drop-shadow-md">
              {lang === 'en' ? (t(settings.clubHeroTitle) || 'Sonali Sangha') : (settings.clubHeroTitle || 'সোনালী সঙ্ঘ')} <span className="text-amber-400">{b('ক্লাব', 'Club')}</span>
            </h1>
            <div className="flex justify-center mb-4">
              <FestiveWaveAccent className="w-16 h-2 text-amber-400/90" />
            </div>

            {/* Club Subtitle & Tagline */}
            <p className="text-base sm:text-lg md:text-xl text-stone-200 font-normal max-w-2xl leading-relaxed drop-shadow-sm mb-2">
              {lang === 'en'
                ? (t(settings.clubHeroTagline) || 'The athletic, cultural, and youth epicenter of Bansdroni Sonali Park. Fostering sporting excellence, cultural unity, and humanitarian welfare.')
                : (settings.clubHeroTagline || 'বাঁশদ্রোণী সোনালী পার্কের সংস্কৃতি, ক্রীড়া ও যুবকল্যাণের প্রাণকেন্দ্র। খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান এবং রক্তদান শিবিরের মাধ্যমে সমাজের সেবায় আমরা নিয়োজিত।')}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 1. CLUB INFRASTRUCTURE & AMENITIES (OVERVIEW) ═══ */}
      <section id="club-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span>{b('ক্লাব কার্যক্রম', 'Club Amenities')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
            {b('খেলাধুলা, সংস্কৃতি ও', 'Athletics, Culture &')} <span className="text-brand-maroon">{b('সমাজসেবা', 'Social Welfare')}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5DAC8] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              {b('ইনডোর গেমস এরিনা', 'Indoor Games Arena')}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {b(
                'টেবিল টেনিস, চ্যাম্পিয়নশিপ স্ট্যান্ডার্ড ক্যারম বোর্ড ও চেস লাউঞ্জ।',
                'Table tennis, professional carrom boards, and chess lounge.'
              )}
            </p>
          </div>

          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5DAC8] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-700 flex items-center justify-center mb-4">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              {b('কমিউনিটি জিম ও ফিটনেস', 'Fitness & Gym Center')}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {b(
                'পাড়ার তরুণ ও যুবকদের জন্য স্বাস্থ্যচর্চা ও শরীরচর্চা কেন্দ্র।',
                'Modern workout equipment and health training for neighborhood youth.'
              )}
            </p>
          </div>

          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5DAC8] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-maroon/10 text-brand-maroon flex items-center justify-center mb-4">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              {b('সাংস্কৃতিক স্টেজ ও মহড়া কক্ষ', 'Cultural Rehearsal Stage')}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {b(
                'নাটক, গান ও নৃত্যানুষ্ঠানের জন্য নিবেদিত মহড়া হল ও মঞ্চ।',
                'Auditorium stage and rehearsal hall for music, theatre, and dance.'
              )}
            </p>
          </div>

          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E5DAC8] shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              {b('সমাজসেবা ও রক্তদান সেল', 'Social Welfare Wing')}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {b(
                'নিয়মিত রক্তদান শিবির, ফ্রি হেলথ ক্যাম্প ও জরুরি অক্সিজেন সহায়তা।',
                'Blood donation camps, free eye clinics, and emergency community aid.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 2. CLUB NOTICES (SIDE-WISE CONTROLLING CAROUSEL) ═══ */}
      <section id="club-notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>{b('ক্লাব বার্তা', 'Club Desk')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
              {b('সোনালী সঙ্ঘের আনুষ্ঠানিক বিজ্ঞপ্তি', 'Sonali Sangha Official Notices')}
            </h2>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
            <Link
              href="/notifications?wing=Club"
              className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-2 py-1.5 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
            >
              <span>{b('সকল ক্লাব নোটিশ দেখুন', 'View All Club Notices')}</span>
              <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </Link>
          </div>
        </div>

        {clubNotices.length === 0 ? (
          <div className="relative text-center py-16 px-6 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] flex flex-col items-center justify-center gap-3 max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <NoticeScrollIcon className="w-7 h-7 text-brand-maroon" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-800">
              {b('কোনো নতুন নোটিশ নেই', 'No Active Notices')}
            </h3>
            <p className="font-serif text-xs sm:text-sm text-stone-600 max-w-md">
              {b('ক্লাবের সমস্ত নিয়মিত আপডেট এখানে সময়মতো প্রকাশ করা হবে।', 'All regular updates and club circulars will be published here in timely order.')}
            </p>
          </div>
        ) : (
          (() => {
            const currentNotice = clubNotices[activeNoticeIndex % clubNotices.length] || clubNotices[0];
            const noticeIdx = (activeNoticeIndex % clubNotices.length) + 1;
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
                    <WashiTapePin text={b(`ক্লাব বিজ্ঞপ্তি নং ০${noticeIdx} • ২০২৬`, `Club Circular #${noticeIdx} • 2026`)} variant="amber" />
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
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-serif shadow-2xs">
                          <ClubCrestIcon className="w-3 h-3 text-amber-700" />
                          <span>{b('সোনালী সঙ্ঘ', 'Sonali Club')}</span>
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
                        {clubNotices.length > 1 && (
                          <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                            {toDigits(noticeIdx)}/{toDigits(clubNotices.length)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notice Title */}
                    <h3 className="text-base sm:text-xl md:text-2xl font-serif font-black text-stone-900 leading-[1.3] tracking-tight">
                      {t(currentNotice.title?.replace(/^\[Club\]\s*/i, ''))}
                    </h3>

                    {/* Festive Wave Accent */}
                    <div className="my-2 sm:my-2.5">
                      <FestiveWaveAccent className="w-14 sm:w-16 h-1.5 text-amber-500" />
                    </div>

                    {/* Notice Body */}
                    <p className="text-stone-700 text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose font-sans whitespace-pre-line mb-4 sm:mb-5">
                      {t(currentNotice.text)}
                    </p>

                    {/* PDF Circular Quick Action Bar */}
                    {currentNotice.pdfUrl && (
                      <div className="flex flex-wrap items-center gap-2.5 mb-5 sm:mb-6">
                        <Link
                          href={`/transparency?wing=Club&viewPdf=${encodeURIComponent(currentNotice.pdfUrl)}&pdfTitle=${encodeURIComponent(currentNotice.title?.replace(/^\[Club\]\s*/i, '') || 'Official Circular')}`}
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
                          onClick={() => triggerDownload(currentNotice.pdfUrl, `${currentNotice.title?.replace(/^\[Club\]\s*/i, '') || 'Club-Notice'}.pdf`)}
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
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{b('সোনালী সঙ্ঘ ক্লাব পরিচালনা পরিষদ কর্তৃক অনুমোদিত', 'Authorized by Sonali Sangha Club Executive')}</span>
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
                        href="/notifications?wing=Club"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-maroon hover:bg-[#881337] text-white shadow-2xs transition-colors cursor-pointer"
                        title={b('সকল ক্লাব নোটিশ দেখুন', 'View Full List of Club Notices')}
                      >
                        <span>{b('সকল ক্লাব নোটিশ', 'All Club Notices')}</span>
                        <span className="text-xs">→</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 2. Harmonized Heritage Pagination Navigation Dock */}
                {clubNotices.length > 1 && (
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
                        {clubNotices.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveNoticeIndex(idx)}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                              (activeNoticeIndex % clubNotices.length) === idx
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
                      {clubNotices.map((n, i) => {
                        const isSelected = (activeNoticeIndex % clubNotices.length) === i;
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
                            {toDigits(i + 1)}. {t(n.title?.replace(/^\[Club\]\s*/i, '')).slice(0, 24)}...
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

      {/* ═══ 3. CLUB COMMITTEE (SIDE-WISE CONTROLLING CAROUSEL) ═══ */}
      <section id="club-committee" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>{b('পরিচালনা পরিষদ', 'Executive Board')}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug`}>
              {b('সোনালী সঙ্ঘের কর্মকর্তা ও পরিষদ', 'Sonali Sangha Executive Council')}
            </h2>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
            <Link
              href="/committee?wing=Club"
              className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-2 py-1.5 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
            >
              <span>{b('সম্পূর্ণ কমিটি ও সকল সদস্য দেখুন (১৭+)', 'View Full Committee (17+ Members)')}</span>
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
                className="group relative p-3.5 sm:p-4 rounded-3xl bg-[#FFFDF9] border border-[#E5DAC8] hover:border-amber-500/50 shadow-2xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between text-center overflow-hidden"
              >
                {/* Top Subtle Amber Glow on Hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500 transition-all duration-500" />

                <div className="w-full flex flex-col items-center">
                  {/* Portrait Avatar Frame */}
                  <div className="relative w-full max-w-[100px] sm:max-w-[120px] aspect-[4/5] mx-auto rounded-2xl overflow-hidden border border-amber-200/80 group-hover:border-amber-400 bg-stone-100 shadow-2xs mb-2.5 flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <img
                      src={m.image}
                      alt={m.name}
                      onError={(e) => { e.currentTarget.src = '/assets/avatars/club-member.svg'; }}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Name */}
                  <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-amber-950 transition-colors" title={lang === 'en' ? tName(m.rawName || m.name) : m.name}>
                    {lang === 'en' ? tName(m.rawName || m.name) : m.name}
                  </h4>

                  {/* Nickname */}
                  {m.nickname && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200 mt-1">
                      “{lang === 'en' ? tNickname(m.nickname) : m.nickname}”
                    </span>
                  )}
                </div>

                {/* Role & Interactive Phone Call Pill */}
                <div className="w-full flex flex-col items-center gap-1.5 mt-3 pt-2.5 border-t border-stone-200/60">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 group-hover:bg-amber-100 text-amber-950 text-[10px] font-bold border border-amber-200 group-hover:border-amber-300 leading-tight truncate max-w-full transition-colors">
                    {tRole(m.role)}
                  </span>
                  {m.phone && (
                    <a
                      href={`tel:+91${m.phone}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100/90 hover:bg-amber-600 hover:text-white text-[10px] text-stone-600 font-mono font-medium border border-stone-200/80 hover:border-amber-600 transition-all shadow-2xs active:scale-95 cursor-pointer"
                      title={b(`কল করুন: ${m.phone}`, `Call: ${m.phone}`)}
                    >
                      <Phone className="w-2.5 h-2.5 text-amber-600 group-hover:text-white transition-colors" />
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
        </div>
      </section>

      {/* ═══ 4. CLUB PHOTO GALLERY (SIDE-WISE CONTROLLING CAROUSEL) ═══ */}
      <section id="club-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>{b('ক্লাব অ্যালবাম', 'Photo Archive')}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug`}>
              {b('ক্রীড়া প্রতিযোগিতা ও স্মরণীয় মুহূর্ত', 'Athletics & Community Moments')}
            </h2>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
            <Link
              href="/gallery?wing=Club"
              className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-2 py-1.5 rounded-full text-xs sm:text-sm font-bold btn-tactile-parchment text-stone-800 hover:text-brand-maroon whitespace-nowrap group shadow-xs"
            >
              <span>{b('সকল ক্লাব ছবি দেখুন', 'View All Club Photos')}</span>
              <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </Link>
          </div>
        </div>

        {clubGalleryItems.length === 0 ? (
          <div className="relative text-center py-16 px-6 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] flex flex-col items-center justify-center gap-3 max-w-2xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <Camera className="w-7 h-7 text-brand-maroon" />
            </div>
            <p className="font-serif text-sm sm:text-base text-stone-600">
              {b('গ্যালারিতে এখনো কোনো ছবি যোগ করা হয়নি।', 'No gallery photos uploaded yet.')}
            </p>
          </div>
        ) : (
          (() => {
            const currentPhoto = clubGalleryItems[activeGalleryIndex % clubGalleryItems.length] || clubGalleryItems[0];
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
                        text={b(`মুহূর্ত #${toDigits((activeGalleryIndex % clubGalleryItems.length) + 1)}`, `Moment #${(activeGalleryIndex % clubGalleryItems.length) + 1}`)}
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
                      alt={currentPhoto.title || 'Club Moment'}
                      onError={(e) => { e.currentTarget.src = '/assets/durga-hero.png'; }}
                      className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500 animate-in fade-in zoom-in-95 duration-300"
                    />

                    {/* Frosted Bottom Info Dock */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-transparent p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-xs font-serif uppercase tracking-wider text-amber-300 font-bold block mb-0.5">
                          {t(currentPhoto.category) || b('ক্লাব মুহূর্ত', 'Club Moments')}
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
                            triggerDownload(currentPhoto.src, `${currentPhoto.title || 'club-photo'}.jpg`);
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
                {clubGalleryItems.length > 1 && (
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
                        {clubGalleryItems.length <= 8 ? (
                          clubGalleryItems.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveGalleryIndex(idx)}
                              className={`transition-all duration-300 rounded-full cursor-pointer ${
                                (activeGalleryIndex % clubGalleryItems.length) === idx
                                  ? 'w-7 sm:w-9 h-2 bg-brand-maroon'
                                  : 'w-2 h-2 bg-amber-900/25 hover:bg-amber-900/40'
                              }`}
                              aria-label={`Go to photo ${idx + 1}`}
                            />
                          ))
                        ) : (
                          <span className="font-serif font-bold text-xs text-stone-700 px-2 py-0.5 tabular-nums">
                            {b(
                              `${toDigits((activeGalleryIndex % clubGalleryItems.length) + 1)} / ${toDigits(clubGalleryItems.length)}`,
                              `${(activeGalleryIndex % clubGalleryItems.length) + 1} of ${clubGalleryItems.length}`
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
                      {clubGalleryItems.map((img, i) => {
                        const isSelected = (activeGalleryIndex % clubGalleryItems.length) === i;
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

      {/* ═══ 5. CLUB FINANCIALS & VERIFIED AUDITS (OVERVIEW) ═══ */}
      <section id="club-finance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#E5DAC8] shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 pb-4 border-b border-stone-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>{b('আর্থিক স্বচ্ছতা', 'Audited Accounts')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
                {b('সোনালী সঙ্ঘের বাজেট ও অডিট রিপোর্ট', 'Sonali Sangha Accounts & Audits')}
              </h2>
            </div>

            <div className="flex items-center justify-end w-full sm:w-auto shrink-0">
              <Link
                href="/transparency?wing=Club"
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
          {clubFinances.length > 0 ? (
            <div className="space-y-3">
              {(showAllPdfs ? clubFinances : clubFinances.slice(0, 2)).map((doc, idx) => (
                <Link
                  key={idx}
                  href={`/transparency?wing=Club&viewPdf=${encodeURIComponent(doc.url)}&pdfTitle=${encodeURIComponent(t(doc.title))}`}
                  className="group flex items-center justify-between p-3.5 sm:p-4.5 rounded-2xl bg-white border border-[#E8DFD1] hover:border-brand-maroon/40 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-700 flex items-center justify-center shrink-0">
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
                        triggerDownload(doc.url, `${doc.title || 'club-audit'}.pdf`);
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
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-1">
                {b('সোনালী সঙ্ঘের নতুন নিরীক্ষিত অডিট রিপোর্ট আপলোড হলে এখানে প্রকাশিত হবে।', 'New Sonali Sangha audit reports will be updated here once verified.')}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
                {b('হিসাব নিরীক্ষা প্রক্রিয়াধীন রয়েছে।', 'Accounts verification is in progress.')}
              </p>
              <div className="mt-4">
                <Link
                  href="/transparency?wing=Club"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>{b('স্বচ্ছতা ও বাজেট বিভাগ দেখুন →', 'View Transparency & Budget →')}</span>
                </Link>
              </div>
            </div>
          )}

          {/* See More / Show Less Toggle Button */}
          {clubFinances.length > 2 && (
            <div className="flex justify-center pt-5">
              <button
                type="button"
                onClick={() => setShowAllPdfs(prev => !prev)}
                className="btn-tactile-parchment inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-stone-700 hover:text-brand-maroon border border-[#E5DAC8] shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span>
                  {showAllPdfs
                    ? b('সংক্ষেপ করুন ↑', 'Show Less ↑')
                    : b(`আরও অডিট নথি দেখুন (${toDigits(clubFinances.length - 2)}টি) ↓`, `See More Audits (${clubFinances.length - 2} More) ↓`)}
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
                <span className="text-amber-300 text-[10px] uppercase tracking-widest font-bold block">
                  {t(selectedImage.category) || 'Club'}
                </span>
                <h3 className="text-white font-bold text-lg truncate mt-0.5">{t(selectedImage.title)}</h3>
              </div>
              <button
                type="button"
                onClick={() => triggerDownload(selectedImage.src, `${selectedImage.title || 'club-photo'}.jpg`)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-5 py-2.5 rounded-full font-bold transition-all text-sm shadow-md cursor-pointer"
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
