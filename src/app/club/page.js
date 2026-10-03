'use client';
import { useState, useMemo } from 'react';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import PillarSwitcher from "@/components/PillarSwitcher";
import { 
  Users, Image as ImageIcon, IndianRupee, Trophy, HeartHandshake, ShieldCheck, 
  ArrowRight, Activity, Calendar, Download, Eye, ExternalLink, FileText, 
  Dumbbell, Music, Search, X, ZoomIn, CheckCircle2, ChevronRight, Award
} from 'lucide-react';
import Link from 'next/link';
import { triggerDownload } from '@/utils/download';

export default function ClubPage() {
  const { data, settings, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();

  // Gallery category filter
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Committee search
  const [searchQuery, setSearchQuery] = useState('');

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

  // Club Committee Members
  const clubCommittee = useMemo(() => {
    const dynamicClubMembers = (data.members || [])
      .filter(m => m.role && m.role.startsWith('[Club]'))
      .map(m => ({
        name: m.name,
        role: m.role.replace('[Club]', '').trim(),
        image: m.image,
        phone: '+91 98300 XXXXX'
      }));

    const source = dynamicClubMembers.length > 0 ? dynamicClubMembers : [
      { name: b('শ্রী সুব্রত ব্যানার্জি', 'Subrata Banerjee'), role: b('সভাপতি', 'President'), phone: '+91 98300 XXXXX' },
      { name: b('শ্রী দেবাশীষ রায়', 'Debasish Roy'), role: b('কার্যকরী সভাপতি', 'Working President'), phone: '+91 98301 XXXXX' },
      { name: b('শ্রী অমিতাভ মুখার্জি', 'Amitabha Mukherjee'), role: b('সাধারণ সম্পাদক', 'General Secretary'), phone: '+91 98302 XXXXX' },
      { name: b('শ্রী রঞ্জিত দত্ত', 'Ranjit Dutta'), role: b('সহ-সম্পাদক', 'Assistant Secretary'), phone: '+91 98303 XXXXX' },
      { name: b('শ্রী প্রসেনজিৎ সেন', 'Prosenjit Sen'), role: b('ক্রীড়া সম্পাদক', 'Sports Secretary'), phone: '+91 98304 XXXXX' },
      { name: b('শ্রীমতি অনন্যা চ্যাটার্জি', 'Ananya Chatterjee'), role: b('সাংস্কৃতিক সম্পাদক', 'Cultural Secretary'), phone: '+91 98305 XXXXX' },
      { name: b('শ্রী সুদীপ্ত ঘোষ', 'Sudipta Ghosh'), role: b('কোষাধ্যক্ষ', 'Treasurer'), phone: '+91 98306 XXXXX' },
      { name: b('শ্রী রাহুল মজুমদার', 'Rahul Majumdar'), role: b('যুব শাখা আহ্বায়ক', 'Youth Wing Convenor'), phone: '+91 98307 XXXXX' },
    ];

    return source.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data.members, b, searchQuery]);

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
      {/* ═══ TOP 3-PILLAR SWITCHER HUB ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <PillarSwitcher active="club" variant="hero" />
      </div>

      {/* ═══ INDEPENDENT CLUB HERO BANNER (NO PUJA COUNTDOWN) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#2D0612] via-[#4A0A1C] to-[#1F040C] text-white border border-rose-900/30">
          {/* Subtle Ambient Background Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          <div className="relative z-10 px-6 py-12 sm:py-16 md:py-20 lg:px-12 flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Club Registration / Identity Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{b('সোনালী সঙ্ঘ • ক্রীড়া, সংস্কৃতি ও যুবকল্যাণ শাখা', 'Sonali Sangha • Sports, Cultural & Youth Wing')}</span>
            </div>

            {/* Club Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white mb-4 leading-tight">
              {settings.clubHeroTitle || b('সোনালী সঙ্ঘ', 'Sonali Sangha')} <span className="text-amber-400">{b('ক্লাব', 'Club')}</span>
            </h1>

            {/* Club Subtitle & Tagline */}
            <p className="text-base sm:text-lg md:text-xl text-rose-100/90 font-light max-w-2xl leading-relaxed mb-8">
              {settings.clubHeroTagline || b(
                'বাঁশদ্রোণী সোনালী পার্কের সংস্কৃতি, ক্রীড়া ও যুবকল্যাণের প্রাণকেন্দ্র। খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান এবং রক্তদান শিবিরের মাধ্যমে সমাজের সেবায় আমরা নিয়োজিত।',
                'The athletic, cultural, and youth epicenter of Bansdroni Sonali Park. Fostering sporting excellence, cultural unity, and humanitarian welfare since 1952.'
              )}
            </p>

            {/* Stat Pills (Replacing Puja Countdown) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl mb-8">
              <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
                <span className="text-amber-400 text-xl sm:text-2xl font-black block font-mono">
                  {toDigits(1952, lang)}
                </span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-medium">
                  {b('প্রতিষ্ঠা বর্ষ', 'Established')}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
                <span className="text-amber-400 text-xl sm:text-2xl font-black block font-mono">
                  {toDigits(250, lang)}+
                </span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-medium">
                  {b('সদস্য সংখ্যা', 'Active Members')}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
                <span className="text-amber-400 text-xl sm:text-2xl font-black block font-mono">
                  {toDigits(12, lang)}
                </span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-medium">
                  {b('বাৎসরিক টুর্নামেন্ট', 'Annual Tournaments')}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
                <span className="text-amber-400 text-xl sm:text-2xl font-black block font-mono">
                  {toDigits(500, lang)}+
                </span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-medium">
                  {b('রক্তদাতা যুক্ত', 'Blood Donors')}
                </span>
              </div>
            </div>

            {/* Quick Action Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#club-overview"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition-all border border-white/20 backdrop-blur-md flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>{b('ক্লাব পরিচিতি', 'Overview')}</span>
              </a>
              <a
                href="#club-committee"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{b('কমিটি পরিষদ', 'Committee')}</span>
              </a>
              <a
                href="#club-gallery"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition-all border border-white/20 backdrop-blur-md flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{b('ক্রীড়া গ্যালারি', 'Gallery')}</span>
              </a>
              <a
                href="#club-finance"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm transition-all border border-white/20 backdrop-blur-md flex items-center gap-1.5"
              >
                <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                <span>{b('ক্লাব অডিট ও হিসাব', 'Financials')}</span>
              </a>
            </div>
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

      {/* ═══ 2. DEDICATED CLUB COMMITTEE ROSTER ═══ */}
      <section id="club-committee" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span>{b('ক্লাব পরিচালনা পরিষদ', 'Club Leadership Roster')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('সোনালী সঙ্ঘের কর্মকর্তা ও কার্যকরী সদস্যবৃন্দ', 'Sonali Sangha Executive Committee')}
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={b('নাম বা পদবী খুঁজুন...', 'Search name or role...')}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {clubCommittee.map((m, idx) => (
              <div key={idx} className="group relative p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60 hover:border-amber-500/40 hover:shadow-md transition-all text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 font-serif font-bold text-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                  {m.name.charAt(0)}
                </div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">{m.name}</h4>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-semibold border border-amber-200">
                  {m.role}
                </span>
                <p className="text-[11px] text-stone-400 font-mono mt-2">{m.phone}</p>
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
