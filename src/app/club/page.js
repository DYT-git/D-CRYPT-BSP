'use client';
import { useState, useMemo } from 'react';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Users, Image as ImageIcon, IndianRupee, Trophy, HeartHandshake, ShieldCheck, 
  ArrowRight, Activity, Calendar, Download, Eye, ExternalLink, FileText, 
  Dumbbell, Music, Search, X, ZoomIn, CheckCircle2, ChevronRight, Award,
  Megaphone, Phone
} from 'lucide-react';
import Link from 'next/link';
import { triggerDownload } from '@/utils/download';
import { 
  ClubCrestIcon, 
  SportsBadgeIcon, 
  BloodDonationBadgeIcon, 
  CulturalStageBadgeIcon, 
  FestiveWaveAccent, 
  WashiTapePin, 
  BinderHoles, 
  TornDeckleEdge 
} from '@/components/HeritageIcons';

function parseMemberRole(role) {
  if (!role) return { wing: 'Club', cleanRole: '', phone: '' };
  let wing = 'Club';
  let rest = role;
  if (rest.startsWith('[Club]')) { wing = 'Club'; rest = rest.replace('[Club]', '').trim(); }
  else if (rest.startsWith('[Samiti]')) { wing = 'Samiti'; rest = rest.replace('[Samiti]', '').trim(); }
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

export default function ClubPage() {
  const { data, settings, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();

  // Gallery category filter
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Committee search
  const [searchQuery, setSearchQuery] = useState('');

  // Club Dedicated Notices
  const clubNotices = useMemo(() => {
    const raw = (data.notices && data.notices.length > 0)
      ? data.notices
          .filter(n => n.title && n.title.startsWith('[Club]'))
          .map(n => ({
            ...n,
            title: n.title.replace(/^\[Club\]\s*/, '')
          }))
      : [];

    if (raw.length > 0) return raw;

    // Authentic fallback notices for club
    return [
      {
        id: 'club-notice-1',
        title: b('বার্ষিক ফুটবল ও ক্রিকেট টুর্নামেন্ট ২০২৬ খেলোয়াড় রেজিস্ট্রেশন', 'Annual Sports Tournament 2026 Registration Open'),
        text: b(
          'সোনালী সঙ্ঘের বাৎসরিক ফুটবল ও ক্রিকেট টুর্নামেন্টের দল গঠন প্রক্রিয়া শুরু হয়েছে। পাড়ার আগ্রহী তরুণ ও যুবকদের আগামী ১৫ দিনের মধ্যে ক্লাবের ক্রীড়া সম্পাদকের সাথে যোগাযোগ করার অনুরোধ জানানো হচ্ছে।',
          'Registration is now open for the Annual Football and Cricket Tournament 2026. Neighborhood youth are requested to contact the Club Sports Secretary within the next 15 days.'
        ),
        isUrgent: true,
        year: 2026
      },
      {
        id: 'club-notice-2',
        title: b('স্বেচ্ছায় রক্তদান ও বিনামূল্যে স্বাস্থ্য পরীক্ষা শিবির', 'Voluntary Blood Donation & Free Health Screening Camp'),
        text: b(
          'সোনালী সঙ্ঘ ক্লাবের উদ্যোগে আগামী রবিবার সকাল ৯টা থেকে ক্লাব ভবনে বাৎসরিক রক্তদান ও চক্ষু পরীক্ষা শিবির অনুষ্ঠিত হবে। পাড়ার সকল নাগরিককে অংশগ্রহণ করে এই মহৎ উদ্যোগকে সফল করার আবেদন জানানো হচ্ছে।',
          'A voluntary blood donation camp along with free eye checkups will be held at the club premises next Sunday starting 9:00 AM. All residents are cordially invited to participate.'
        ),
        isUrgent: false,
        year: 2026
      },
      {
        id: 'club-notice-3',
        title: b('সাংস্কৃতিক সন্ধ্যা ও রবীন্দ্র-নজরুল জয়ন্তী মহড়া সময়সূচি', 'Cultural Evening Rehearsal & Audition Schedule'),
        text: b(
          'আসন্ন সাংস্কৃতিক অনুষ্ঠানের জন্য সংগীত, নৃত্য ও নাটক বিভাগের নিয়মিত মহড়া প্রতি মঙ্গলবার ও শুক্রবার সন্ধ্যা ৬টা থেকে ক্লাব মঞ্চে অনুষ্ঠিত হবে।',
          'Regular rehearsals for music, dance, and drama will be held at the club auditorium every Tuesday and Friday at 6:00 PM.'
        ),
        isUrgent: false,
        year: 2026
      }
    ];
  }, [data.notices, b]);

  // Fallback club gallery photos
  const clubGalleryItems = useMemo(() => {
    const raw = (data.gallery && data.gallery.length > 0)
      ? data.gallery.filter(g => g.program === 'Club & Sports' || g.program === 'Annual Sports' || g.program === 'Social Work' || g.program === 'Cultural Event' || g.category === 'Club' || g.category === 'Sports' || g.category === 'Blood Donation')
      : [];

    if (raw.length > 0) return raw;

    // Rich static fallbacks with authentic club photos
    return [
      {
        src: '/assets/durga-hero.png',
        title: b('বার্ষিক ফুটবল টুর্নামেন্ট ২০২৬', 'Annual Football League 2026'),
        category: 'Sports',
        program: 'Annual Sports',
        year: 2026
      },
      {
        src: '/assets/durga-morning.png',
        title: b('স্বেচ্ছায় রক্তদান ও স্বাস্থ্য শিবির', 'Voluntary Blood Donation Camp'),
        category: 'Blood Donation',
        program: 'Social Work',
        year: 2026
      },
      {
        src: '/assets/durga-evening.png',
        title: b('রবীন্দ্র জয়ন্তী ও সাংস্কৃতিক সন্ধ্যা', 'Rabindra Jayanti Cultural Night'),
        category: 'Cultural',
        program: 'Cultural Event',
        year: 2026
      },
      {
        src: '/assets/durga-afternoon.png',
        title: b('বাৎসরিক ক্রীড়া প্রতিযোগিতা ও পুরস্কার বিতরণ', 'Annual Sports Day & Prize Distribution'),
        category: 'Sports',
        program: 'Annual Sports',
        year: 2026
      },
      {
        src: '/assets/durga-hero.jpg',
        title: b('যুব ক্রিকেট চ্যাম্পিয়নশিপ ফাইনাল', 'Youth Cricket Championship Final'),
        category: 'Sports',
        program: 'Annual Sports',
        year: 2025
      }
    ];
  }, [data.gallery, b]);

  // Filtered gallery
  const filteredGallery = useMemo(() => {
    if (activeCategory === 'All') return clubGalleryItems;
    return clubGalleryItems.filter(item => item.category === activeCategory || item.program === activeCategory);
  }, [clubGalleryItems, activeCategory]);

  const openLightbox = (item, idx) => {
    setSelectedImage(item);
    setLightboxIdx(idx);
  };

  const navigateLightbox = (dir) => {
    const next = (lightboxIdx + dir + filteredGallery.length) % filteredGallery.length;
    setSelectedImage(filteredGallery[next]);
    setLightboxIdx(next);
  };

const FALLBACK_CLUB_MEMBERS = [
  { id: 13, name: "রবি জানা (RABI JANA)", role: "[Club] সভাপতি | 7980464187", image: "/assets/avatars/rabi-jana.jpg", year: 2026 },
  { id: 14, name: "ছোটকা দাস (বাপি) (CHOTKA DAS)", role: "[Club] সহঃ সভাপতি | 8910936506", image: "/assets/avatars/vice-president.svg", year: 2026 },
  { id: 15, name: "তরুণ দেবনাথ (TARUN DEBNATH)", role: "[Club] সহঃ সভাপতি | 7890867584", image: "/assets/avatars/vice-president.svg", year: 2026 },
  { id: 16, name: "নৃপেন সাহা (NRIPEN SAHA)", role: "[Club] সম্পাদক | 8777484189", image: "/assets/avatars/nripen-saha.jpg", year: 2026 },
  { id: 17, name: "সুরজিৎ সরকার (SURAJIT SARKAR)", role: "[Club] সহঃ সম্পাদক | 8777581827", image: "/assets/avatars/asst-secretary.svg", year: 2026 },
  { id: 18, name: "অরূপ মল্লিক (ARUP MULLICK)", role: "[Club] সহঃ সম্পাদক | 8777285009", image: "/assets/avatars/asst-secretary.svg", year: 2026 },
  { id: 19, name: "শুভজিৎ মালো (সনু) (SUBHAJIT MALO)", role: "[Club] কোষাধ্যক্ষ | 9123727257", image: "/assets/avatars/subhajit-malo.jpg", year: 2026 },
  { id: 20, name: "অভিষেক চৌধুরী (শিবা) (AVISEK CHOUDHURY)", role: "[Club] সহঃ কোষাধ্যক্ষ | 8013337014", image: "/assets/avatars/asst-treasurer.svg", year: 2026 },
  { id: 21, name: "রবি গোস্বামী (RAVI GOSWAMI)", role: "[Club] সহঃ কোষাধ্যক্ষ | 8240672206", image: "/assets/avatars/asst-treasurer.svg", year: 2026 },
  { id: 22, name: "অমল দাস (বাবাই) (AMAL DAS)", role: "[Club] ক্রীড়া সম্পাদক | 8777368136", image: "/assets/avatars/amal-das.jpg", year: 2026 },
  { id: 23, name: "আকাশ জানা (AKASH JANA)", role: "[Club] সহঃ ক্রীড়া সম্পাদক | 6289640300", image: "/assets/avatars/sports-secretary.svg", year: 2026 },
  { id: 24, name: "অতনু দত্ত (টুটু) (ATANU DUTTA)", role: "[Club] সহঃ ক্রীড়া সম্পাদক | 9339748034", image: "/assets/avatars/sports-secretary.svg", year: 2026 },
  { id: 25, name: "পিংকি কুণ্ডু (PINKI KUNDU)", role: "[Club] সাংস্কৃতিক সম্পাদক | 9874674901", image: "/assets/avatars/cultural-female.svg", year: 2026 },
  { id: 26, name: "স্নেহা ঘোষ (SNEHA GHOSH)", role: "[Club] সাংস্কৃতিক সম্পাদক | 6289860007", image: "/assets/avatars/cultural-female.svg", year: 2026 },
  { id: 27, name: "তরুণ দেবনাথ (TARUN DEBNATH)", role: "[Club] সাংস্কৃতিক সম্পাদক | 7890867584", image: "/assets/avatars/cultural-secretary.svg", year: 2026 },
  { id: 28, name: "দেবাশীষ দেওয়ান (DEBASISH DEWAN)", role: "[Club] সহযোগী সদস্য", image: "/assets/avatars/club-member.svg", year: 2026 },
  { id: 29, name: "সঞ্জয় মণ্ডল (বাবাই) (SANJOY MONDAL)", role: "[Club] সহযোগী সদস্য", image: "/assets/avatars/club-member.svg", year: 2026 }
];

  // Club Committee Members
  const clubCommittee = useMemo(() => {
    let rawClubMembers = (data.members || [])
      .filter(m => m.role && m.role.startsWith('[Club]'));

    if (rawClubMembers.length === 0) {
      rawClubMembers = FALLBACK_CLUB_MEMBERS;
    }

    // Always sort by id ascending so President (Rabi Jana) is strictly #1
    const sortedMembers = [...rawClubMembers].sort((a, b) => (a.id || 0) - (b.id || 0));

    const mapped = sortedMembers.map(m => {
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

    return mapped.filter(m => 
      m.rawName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data.members, searchQuery]);

  // Club Financial Documents
  const clubFinances = useMemo(() => {
    const dynamicFinances = (data.finances || [])
      .filter(f => f.title && f.title.startsWith('[Club]'))
      .map(f => ({
        title: f.title.replace('[Club]', '').trim(),
        year: f.year,
        url: f.url
      }));

    if (dynamicFinances.length > 0) {
      return dynamicFinances;
    }

    return [
      {
        title: b('সোনালী সঙ্ঘ বার্ষিক অডিট ও আর্থিক স্টেটমেন্ট ২০২৫-২৬', 'Sonali Sangha Annual Audit & Accounts 2025-26'),
        year: 2026,
        url: '/sample-audit.pdf'
      },
      {
        title: b('বার্ষিক ক্রীড়া প্রতিযোগিতা ও টুর্নামেন্ট আয়-ব্যয় হিসাব', 'Annual Sports & Tournaments Expenditure Statement'),
        year: 2026,
        url: '/sample-audit.pdf'
      },
      {
        title: b('স্বেচ্ছায় রক্তদান শিবির ও সমাজকল্যাণ তহবিল বিবরণী', 'Blood Donation & Social Welfare Fund Audit'),
        year: 2025,
        url: '/sample-audit.pdf'
      }
    ];
  }, [data.finances, b]);

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-20 sm:pt-24 pb-20 selection:bg-brand-maroon selection:text-white font-sans">
      {/* ═══ INDEPENDENT CLUB HERO BANNER (WITH HERO IMAGE & CONTROLS) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-950 text-white border border-stone-800/80 group">
          {/* Hero Banner Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={settings?.clubHeroImage || '/assets/club-hero-banner.jpg'}
              alt="Bansdroni Sonali Sangha Club Banner"
              className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Cinematic Multi-Layer Gradient Overlays for maximum legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-stone-950/90" />
            <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
          </div>

          {/* Top golden decorative highlight */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent z-10" />

          <div className="relative z-10 px-6 py-14 sm:py-20 md:py-24 lg:px-12 flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Club Registration / Identity Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
              <ClubCrestIcon className="w-4 h-4 text-amber-400" />
              <span>{b('সোনালী সঙ্ঘ • ক্রীড়া, সংস্কৃতি ও যুবকল্যাণ শাখা', 'Sonali Sangha • Sports, Cultural & Youth Wing')}</span>
            </div>

            {/* Club Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white mb-2 leading-tight drop-shadow-md">
              {settings.clubHeroTitle || b('সোনালী সঙ্ঘ', 'Sonali Sangha')} <span className="text-amber-400">{b('ক্লাব', 'Club')}</span>
            </h1>
            <div className="flex justify-center mb-4">
              <FestiveWaveAccent className="w-16 h-2 text-amber-400/90" />
            </div>

            {/* Club Subtitle & Tagline */}
            <p className="text-base sm:text-lg md:text-xl text-stone-200 font-normal max-w-2xl leading-relaxed drop-shadow-sm">
              {settings.clubHeroTagline || b(
                'বাঁশদ্রোণী সোনালী পার্কের সংস্কৃতি, ক্রীড়া ও যুবকল্যাণের প্রাণকেন্দ্র। খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান এবং রক্তদান শিবিরের মাধ্যমে সমাজের সেবায় আমরা নিয়োজিত।',
                'The athletic, cultural, and youth epicenter of Bansdroni Sonali Park. Fostering sporting excellence, cultural unity, and humanitarian welfare since 1952.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 1. CLUB INFRASTRUCTURE & AMENITIES ═══ */}
      <section id="club-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>{b('ক্লাবঘর ও পরিকাঠামো', 'Clubhouse & Infrastructure')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {b('খেলাধুলা, সংস্কৃতি ও', 'Athletics, Culture &')} <span className="text-brand-maroon">{b('সমাজসেবা', 'Youth Epics')}</span>
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            {b(
              'সোনালী পার্কের ক্লাবভবনে আধুনিক সুযোগ-সুবিধা ও ক্রীড়া সরঞ্জাম দিয়ে সজ্জিত একটি প্রাণবন্ত পরিবেশ রয়েছে।',
              'Equipped with modern indoor recreational arenas, gymnasium equipment, and vibrant cultural facilities.'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
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

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
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

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
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

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
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

      {/* ═══ 2. DEDICATED CLUB NOTICE BOARD ═══ */}
      <section id="club-notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-stone-100 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Megaphone className="w-3.5 h-3.5 text-amber-700" />
                <span>{b('ক্লাব বুলেটিন ও বিজ্ঞপ্তি', 'Club Bulletin & Circulars')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('সোনালী সঙ্ঘের জরুরি', 'Sonali Sangha Official')} <span className="text-amber-800">{b('বিজ্ঞপ্তি ও নোটিস', 'Notices & Circulars')}</span>
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                {b('টুর্নামেন্ট, রক্তদান শিবির ও সাংস্কৃতিক কর্মকাণ্ডের সাম্প্রতিক নোটিশ', 'Latest circulars regarding sports schedules, blood donation drives, and cultural programs.')}
              </p>
            </div>
            <div className="shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
              {b('সক্রিয় নোটিশ', 'Active Notices')}: {toDigits(clubNotices.length, lang)} {b('টি', '')}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-5">
            {clubNotices.map((notice, idx) => (
              <div
                key={notice.id || idx}
                className="group relative pt-8 pb-5 pl-8 sm:pl-10 pr-6 rounded-3xl bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_6px_20px_rgba(28,13,19,0.04)] hover:shadow-[0_16px_32px_rgba(217,119,6,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Pinned Washi Tape Header */}
                <div className="absolute -top-3.5 left-6 sm:left-8 z-20">
                  <WashiTapePin text={b(`ক্লাব সার্কুলার নং ০${idx + 1}`, `Club Circular #${idx + 1}`)} variant="amber" />
                </div>

                {/* Left Spiral Binder Holes */}
                <div className="absolute left-2.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
                  <BinderHoles count={4} />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 font-serif shadow-2xs">
                      <ClubCrestIcon className="w-3.5 h-3.5 text-amber-700" />
                      <span>{b('ক্লাব বিজ্ঞপ্তি', 'Club Notice')}</span>
                    </span>
                    {notice.isUrgent && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-2xs">
                        {b('জরুরি', 'Urgent')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base mb-1.5 group-hover:text-amber-900 transition-colors leading-snug">
                    {notice.title}
                  </h3>
                  <div className="mb-2.5">
                    <FestiveWaveAccent className="w-12 h-1.5 text-amber-500/80" />
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line mb-3">
                    {notice.text}
                  </p>
                </div>

                <div>
                  <div className="pt-3 border-t border-[#E8DFD1] flex items-center justify-between text-[11px] text-stone-400">
                    <span>{b('সাল:', 'Year:')} {toDigits(notice.year, lang)}</span>
                    <span className="text-amber-800 font-bold font-serif">{b('সোনালী সঙ্ঘ', 'Sonali Sangha')}</span>
                  </div>
                  {/* Deckle bottom edge */}
                  <div className="-mx-6 -mb-5 mt-2 opacity-80">
                    <TornDeckleEdge className="w-full text-stone-200/90 h-2 block" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. DEDICATED CLUB COMMITTEE ROSTER ═══ */}
      <section id="club-committee" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span>{b('কার্য্যকরী কমিটি • ২০২৬–২০২৮', 'Executive Committee • 2026–2028')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('সোনালী সঙ্ঘের কর্মকর্তা ও পরিচালনা পরিষদ', 'Sonali Sangha Executive Committee')}
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                {b('বাঁশদ্রোণী সোনালী পার্ক ক্লাবের সমাজকল্যাণ ও ক্রীড়া কর্মকাণ্ড পরিচালনার কর্মকর্তা তালিকা', 'Official committee members, conveners and coordinators of Sonali Sangha')}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={b('নাম, ডাকনাম বা পদবী খুঁজুন...', 'Search name, nickname or role...')}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-6">
            {clubCommittee.map((m, idx) => (
              <div
                key={m.id || idx}
                className="group relative p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/70 hover:border-amber-500/40 hover:bg-white hover:shadow-md transition-all flex flex-col items-center justify-between text-center"
              >
                <div className="w-full flex flex-col items-center">
                  {/* Portrait Avatar Frame (Adaptive 4:5 Ratio) */}
                  <div className="relative w-full max-w-[120px] aspect-[4/5] mx-auto rounded-xl overflow-hidden border border-amber-200/80 bg-stone-100 shadow-2xs mb-2.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Name */}
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {m.name}
                  </h4>

                  {/* Nickname & English */}
                  {m.nickname && (
                    <span className="mt-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                      “{m.nickname}”
                    </span>
                  )}
                  {m.englishName && (
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mt-0.5">
                      {m.englishName}
                    </span>
                  )}
                </div>

                {/* Role & Direct Phone Action */}
                <div className="w-full flex flex-col items-center gap-1.5 mt-3 pt-2.5 border-t border-stone-200/60">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[11px] font-bold border border-amber-200/80 leading-tight">
                    {t(m.role)}
                  </span>
                  {m.phone ? (
                    <a
                      href={`tel:+91${m.phone}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 hover:border-emerald-300 text-[10px] font-mono font-bold transition-all shadow-2xs cursor-pointer group/tel"
                      title={b('কল করুন', 'Call')}
                    >
                      <Phone className="w-3 h-3 text-emerald-600 group-hover/tel:scale-110 transition-transform" />
                      <span>{m.phone}</span>
                    </a>
                  ) : (
                    <span className="text-[10px] text-stone-400 font-mono">২০২৬–২০২৮</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. DEDICATED CLUB PHOTO GALLERY (FILTERABLE + LIGHTBOX) ═══ */}
      <section id="club-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                <span>{b('ক্লাব ছবি অ্যালবাম', 'Club Photo Archive')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('ক্রীড়া টুর্নামেন্ট ও সামাজিক অনুষ্ঠান মুহূর্ত', 'Athletic Tournaments & Social Moments')}
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'All', labelBn: 'সব ছবি', labelEn: 'All Photos' },
                { key: 'Sports', labelBn: 'ক্রীড়া', labelEn: 'Sports' },
                { key: 'Blood Donation', labelBn: 'রক্তদান', labelEn: 'Blood Donation' },
                { key: 'Cultural', labelBn: 'সংস্কৃতি', labelEn: 'Cultural' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.key
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {lang === 'bn' ? cat.labelBn : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {filteredGallery.map((img, i) => (
              <div
                key={i}
                onClick={() => openLightbox(img, i)}
                className="group relative rounded-2xl overflow-hidden aspect-video bg-stone-100 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.title || 'Club Event'}
                  onError={(e) => { e.currentTarget.src = '/assets/durga-hero.png'; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      title={b('ছবি ডাউনলোড করুন', 'Download Photo')}
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDownload(img.src, `${img.title || 'club-photo'}.jpg`);
                      }}
                      className="p-2 rounded-full bg-black/60 hover:bg-amber-600 text-white backdrop-blur-md transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/80 text-white inline-block mb-1">
                      {img.category || 'Club'}
                    </span>
                    <h4 className="text-white text-sm font-bold truncate">{img.title}</h4>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. DEDICATED CLUB FINANCIALS & VERIFIED AUDITS ═══ */}
      <section id="club-finance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{b('ক্লাব আর্থিক স্বচ্ছতা ও অডিট', 'Club Financial Transparency')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              {b('ক্লাব তহবিল, ক্রীড়া বাজেট ও', 'Club Accounts, Sports Budget &')} <span className="text-brand-maroon">{b('অডিট রিপোর্ট', 'Audit Statements')}</span>
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {b('সোনালী সঙ্ঘ ক্লাবের বার্ষিক আয়-ব্যয় এবং নিরীক্ষিত হিসাব সবার জন্য উন্মুক্ত।', 'Public audited statements of club subscription funds, tournament sponsorships, and expenditures.')}
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-500/20 text-center">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                {b('মোট বাৎসরিক তহবিল', 'Total Club Collection')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-mono mb-1">
                {toDigits(settings.clubTotalCollection || '₹ ৮,৫০,০০০', lang)}
              </h3>
              <p className="text-[11px] text-stone-500">{b('সদস্য চাঁদা, অনুদান ও স্পনসরশিপ', 'Subscriptions & sponsorships')}</p>
            </div>

            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-500/20 text-center">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
                {b('মোট সামগ্রিক খরচ', 'Total Expenditure')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mb-1">
                {toDigits(settings.clubTotalExpense || '₹ ৭,৯৫,০০০', lang)}
              </h3>
              <p className="text-[11px] text-stone-500">{b('টুর্নামেন্ট, জার্সি, ট্রফি ও সরঞ্জাম', 'Tournaments, trophies & equipment')}</p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-500/20 text-center">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                {b('প্রধান ব্যয়ের খাত', 'Major Expense Head')}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-tight mb-1">
                {b(settings.clubMajorExpenseTitle || 'ক্রীড়া টুর্নামেন্ট ও উৎসব', 'Sports Tournaments & Celebrations')}
              </h3>
              <p className="text-xs font-bold text-amber-700 font-mono">
                {toDigits(settings.clubMajorExpenseAmount || '₹ ৩,৫০,০০০', lang)}
              </p>
            </div>
          </div>

          {/* Audit Documents Download List */}
          <div className="space-y-3">
            {clubFinances.map((doc, idx) => (
              <Link
                key={idx}
                href={`?viewPdf=${encodeURIComponent(doc.url)}&pdfTitle=${encodeURIComponent(doc.title)}`}
                scroll={false}
                className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-brand-maroon/40 hover:bg-white transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 group-hover:text-brand-maroon transition-colors truncate">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-600">
                        {b('অডিট নথি', 'Audit Document')}
                      </span>
                      <span className="text-xs text-stone-400">
                        {b('সাল:', 'Year:')} {toDigits(doc.year, lang)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-maroon/10 text-brand-maroon font-bold text-xs group-hover:bg-brand-maroon group-hover:text-white transition-colors">
                    <span>{b('দেখুন', 'View')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <button
                    type="button"
                    title={b('পিডিএফ ডাউনলোড করুন', 'Download PDF')}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      triggerDownload(doc.url, `${doc.title || 'club-audit'}.pdf`);
                    }}
                    className="p-1.5 rounded-full bg-stone-200/80 hover:bg-brand-maroon hover:text-white text-stone-600 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIGHTBOX MODAL ═══ */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-[#0B1224]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition z-50 border border-white/20">
            <X className="w-5 h-5" />
          </button>
          {filteredGallery.length > 1 && (
            <button onClick={e => { e.stopPropagation(); navigateLightbox(-1); }} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3.5 border border-white/20 transition z-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
            </button>
          )}
          <div className="relative flex flex-col items-center gap-4 max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.title} className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10" />
            <div className="flex items-center justify-between w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-3.5 gap-4">
              <div className="min-w-0">
                <span className="text-amber-300 text-[10px] uppercase tracking-widest font-bold block">
                  {selectedImage.category || 'Club'}
                </span>
                <h3 className="text-white font-bold text-lg truncate mt-0.5">{selectedImage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => triggerDownload(selectedImage.src, `${selectedImage.title || 'club-photo'}.jpg`)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-5 py-2.5 rounded-full font-bold transition-all text-sm shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" /> {b('ডাউনলোড', 'Download')}
              </button>
            </div>
            <span className="text-white/50 text-xs">{toDigits(lightboxIdx + 1, lang)} / {toDigits(filteredGallery.length, lang)}</span>
          </div>
          {filteredGallery.length > 1 && (
            <button onClick={e => { e.stopPropagation(); navigateLightbox(1); }} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3.5 border border-white/20 transition z-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      )}
    </main>
  );
}
