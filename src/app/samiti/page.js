'use client';
import { useState, useMemo } from 'react';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Users, Image as ImageIcon, IndianRupee, ShieldCheck, Phone, ArrowRight, 
  Building, CheckCircle2, Siren, Wrench, Lightbulb, Trash2, TreePine, 
  Search, Download, ZoomIn, X, ExternalLink, FileText, HeartHandshake, Eye,
  Megaphone
} from 'lucide-react';
import Link from 'next/link';
import { triggerDownload } from '@/utils/download';
import { 
  SamitiEmblemIcon, 
  CivicShieldBadgeIcon, 
  CivicLightBadgeIcon, 
  CivicGreeneryBadgeIcon, 
  FestiveWaveAccent, 
  WashiTapePin, 
  BinderHoles, 
  TornDeckleEdge 
} from '@/components/HeritageIcons';

export default function SamitiPage() {
  const { data, settings, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();

  // Gallery filter & lightbox
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Committee search
  const [searchQuery, setSearchQuery] = useState('');

  // Samiti Dedicated Notices
  const samitiNotices = useMemo(() => {
    const raw = (data.notices && data.notices.length > 0)
      ? data.notices
          .filter(n => n.title && n.title.startsWith('[Samiti]'))
          .map(n => ({
            ...n,
            title: n.title.replace(/^\[Samiti\]\s*/, '')
          }))
      : [];

    if (raw.length > 0) return raw;

    // Authentic fallback notices for samiti
    return [
      {
        id: 'samiti-notice-1',
        title: b('বর্ষাপূর্ব ড্রেন পরিষ্কার ও ডেঙ্গি প্রতিরোধ স্প্রে অভিযান', 'Pre-Monsoon Drainage Cleaning & Vector Spray Drive'),
        text: b(
          'আসন্ন বর্ষা মৌসুমের পূর্বে সোনালী পার্কের প্রতিটি লেনের প্রধান ড্রেন পলি পরিষ্কার এবং মশা নিধনে ব্লিচিং ও লার্ভিসাইড স্প্রে করা হবে। বাসিন্দাদের নিকাশি নালায় কোনো ধরনের প্লাস্টিক বর্জ্য না ফেলার জন্য বিশেষ অনুরোধ জানানো হচ্ছে।',
          'Intensive drain desilting and anti-larval chemical spraying will be conducted across all neighborhood lanes before monsoon. Residents are requested not to dispose of solid or plastic waste into drainage lines.'
        ),
        isUrgent: true,
        year: 2026
      },
      {
        id: 'samiti-notice-2',
        title: b('পাড়ার আবাসিকদের বার্ষিক সাধারণ সভা ও নাগরিক সনদ পর্যালোচনা', 'Annual General Meeting of Residents & Civic Charter Review'),
        text: b(
          'উন্নয়ন সমিতির বাৎসরিক সাধারণ সভা (AGM) আগামী মাসে অনুষ্ঠিত হবে। বিগত বছরের অডিট রিপোর্ট পেশ, পাড়ার নতুন সিসিটিভি ক্যামেরা স্থাপন ও রাতের নিরাপত্তা ব্যবস্থা নিয়ে আলোচনা হবে। সকল আবাসিক পরিবারের উপস্থিতি কাম্য।',
          'The Annual General Meeting (AGM) of Unnayan Samiti will take place next month. Discussion on annual audit presentation, new CCTV surveillance nodes, and neighborhood night guards.'
        ),
        isUrgent: false,
        year: 2026
      },
      {
        id: 'samiti-notice-3',
        title: b('নতুন এলইডি পথবাতি রক্ষণাবেক্ষণ ও হেল্পলাইন বিজ্ঞপ্তি', 'LED Streetlight Infrastructure & Maintenance Helpline'),
        text: b(
          'পাড়ার কোনো লেনের পথবাতি অকেজো হলে বা আলো সংক্রান্ত কোনো সমস্যা দেখা দিলে অবিলম্বে সমিতির জরুরি হেল্পলাইনে অথবা বৈদ্যুতিক আহ্বায়কের সাথে যোগাযোগ করার অনুরোধ জানানো হচ্ছে।',
          'If any streetlight in your lane is non-functional or flickering, please report immediately to the Samiti Civic Helpline or Electrical In-Charge for same-day repair.'
        ),
        isUrgent: false,
        year: 2026
      }
    ];
  }, [data.notices, b]);

  // Fallback civic gallery photos
  const samitiGalleryItems = useMemo(() => {
    const raw = (data.gallery && data.gallery.length > 0)
      ? data.gallery.filter(g => g.program === 'Unnayan Samiti' || g.category === 'Samiti' || g.category === 'Roads' || g.category === 'Greenery' || g.category === 'Sanitation' || g.category === 'Civic')
      : [];

    if (raw.length > 0) return raw;

    // Authentic civic fallbacks
    return [
      {
        src: '/assets/durga-hero.png',
        title: b('পাড়ার প্রধান রাস্তা ও ড্রেন সংস্কার কাজ', 'Main Lane & Drainage Renovation'),
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
        src: '/assets/durga-afternoon.png',
        title: b('নতুন এলইডি পথবাতি স্থাপন অভিযান', 'LED Streetlight Infrastructure Project'),
        category: 'Roads',
        year: 2025
      },
      {
        src: '/assets/durga-hero.jpg',
        title: b('বর্ষাপূর্ব ড্রেন পরিষ্কার ও ডেঙ্গি প্রতিরোধ স্প্রে', 'Pre-Monsoon Drain Cleaning & Vector Spray'),
        category: 'Sanitation',
        year: 2025
      }
    ];
  }, [data.gallery, b]);

  const filteredGallery = useMemo(() => {
    if (activeCategory === 'All') return samitiGalleryItems;
    return samitiGalleryItems.filter(item => item.category === activeCategory);
  }, [samitiGalleryItems, activeCategory]);

  const openLightbox = (item, idx) => {
    setSelectedImage(item);
    setLightboxIdx(idx);
  };

  const navigateLightbox = (dir) => {
    const next = (lightboxIdx + dir + filteredGallery.length) % filteredGallery.length;
    setSelectedImage(filteredGallery[next]);
    setLightboxIdx(next);
  };

  // Samiti Committee Roster
  const samitiCommittee = useMemo(() => {
    const dynamicSamitiMembers = (data.members || [])
      .filter(m => m.role && m.role.startsWith('[Samiti]'))
      .map(m => {
        const withoutTag = m.role.replace('[Samiti]', '').trim();
        let role = withoutTag;
        let phone = '+91 98300 XXXXX';
        if (withoutTag.includes('|')) {
          const parts = withoutTag.split('|');
          role = parts[0].trim();
          phone = '+91 ' + parts[1].replace(/phone|tel|m\.|m:/gi, '').trim();
        }
        return {
          name: m.name,
          role: role,
          image: m.image,
          phone: phone
        };
      });

    const source = dynamicSamitiMembers.length > 0 ? dynamicSamitiMembers : [
      { name: b('শ্রী পার্থসারথি সেনগুপ্ত', 'Partha Sarathi Sengupta'), role: b('সভাপতি', 'President'), phone: '+91 98300 XXXXX' },
      { name: b('শ্রী অসীম চ্যাটার্জি', 'Ashim Chatterjee'), role: b('সহ-সভাপতি', 'Vice President'), phone: '+91 98301 XXXXX' },
      { name: b('শ্রী সুশান্ত রায়', 'Sushanta Roy'), role: b('সাধারণ সম্পাদক', 'General Secretary'), phone: '+91 98302 XXXXX' },
      { name: b('শ্রী ভাস্কর মজুমদার', 'Bhaskar Majumdar'), role: b('সহ-সম্পাদক', 'Assistant Secretary'), phone: '+91 98303 XXXXX' },
      { name: b('শ্রী তপন ভট্টাচার্য', 'Tapan Bhattacharya'), role: b('পরিকাঠামো আহ্বায়ক', 'Civic Works Convenor'), phone: '+91 98304 XXXXX' },
      { name: b('শ্রীমতী সোমা মুখার্জি', 'Soma Mukherjee'), role: b('পরিচ্ছন্নতা ও স্বাস্থ্য', 'Sanitation & Environment'), phone: '+91 98305 XXXXX' },
      { name: b('শ্রী নারায়ণ ঘোষ', 'Narayan Ghosh'), role: b('কোষাধ্যক্ষ', 'Treasurer'), phone: '+91 98306 XXXXX' },
      { name: b('শ্রী অলোক চক্রবর্তী', 'Aloke Chakraborty'), role: b('প্রবীণ নাগরিক সমন্বয়ক', 'Senior Citizen Support'), phone: '+91 98307 XXXXX' },
    ];

    return source.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data.members, b, searchQuery]);

  // Samiti Financial Documents
  const samitiFinances = useMemo(() => {
    const dynamicFinances = (data.finances || [])
      .filter(f => f.title && f.title.startsWith('[Samiti]'))
      .map(f => ({
        title: f.title.replace('[Samiti]', '').trim(),
        year: f.year,
        url: f.url
      }));

    if (dynamicFinances.length > 0) {
      return dynamicFinances;
    }

    return [
      {
        title: b('সোনালী পার্ক উন্নয়ন সমিতি বার্ষিক অডিট ও আর্থিক হিসাব ২০২৫-২৬', 'Sonali Park Unnayan Samiti Annual Audit Statement 2025-26'),
        year: 2026,
        url: '/sample-audit.pdf'
      },
      {
        title: b('পাড়ার রাস্তা, এলইডি আলো ও জলনিকাশি উন্নয়ন হিসাব বিবরণী', 'Roads, LED Lighting & Drainage Capital Accounts'),
        year: 2026,
        url: '/sample-audit.pdf'
      },
      {
        title: b('মাসিক নিরাপত্তা প্রহরী ও বর্জ্য নিষ্কাশন পরিচালনা হিসাব', 'Monthly Security Patrol & Sanitation Operations Audit'),
        year: 2025,
        url: '/sample-audit.pdf'
      }
    ];
  }, [data.finances, b]);

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-20 sm:pt-24 pb-20 selection:bg-brand-maroon selection:text-white font-sans">
      {/* ═══ INDEPENDENT SAMITI HERO BANNER (WITH HERO IMAGE & CONTROLS) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-950 text-white border border-emerald-900/40 group">
          {/* Hero Banner Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={settings?.samitiHeroImage || '/assets/samiti-hero-banner.jpg'}
              alt="Bansdroni Sonali Park Unnayan Samiti Civic Banner"
              className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Cinematic Multi-Layer Gradient Overlays for maximum legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-stone-950/90" />
            <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
          </div>

          {/* Top emerald decorative highlight */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-10" />

          <div className="relative z-10 px-6 py-14 sm:py-20 md:py-24 lg:px-12 flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Samiti RWA Registration Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
              <SamitiEmblemIcon className="w-4 h-4 text-emerald-400" />
              <span>{b('সোনালী পার্ক উন্নয়ন সমিতি • নাগরিক ও আবাসিক পরিষদ (RWA)', 'Sonali Park Unnayan Samiti • Residents Welfare Association')}</span>
            </div>

            {/* Samiti Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white mb-2 leading-tight drop-shadow-md">
              {settings.samitiHeroTitle || b('সোনালী পার্ক', 'Sonali Park')} <span className="text-emerald-400">{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
            </h1>
            <div className="flex justify-center mb-4">
              <FestiveWaveAccent className="w-16 h-2 text-emerald-400/90" />
            </div>

            {/* Samiti Subtitle & Tagline */}
            <p className="text-base sm:text-lg md:text-xl text-stone-200 font-normal max-w-2xl leading-relaxed mb-4 drop-shadow-sm">
              {settings.samitiHeroTagline || b(
                'আমাদের পাড়ার নিরাপত্তা, পরিচ্ছন্নতা, রাস্তাঘাট ও নাগরিকদের দৈনন্দিন স্বাচ্ছন্দ্য রক্ষায় সার্বক্ষণিক নিয়োজিত রেজিস্টার্ড উন্নয়ন পরিষদ।',
                'The registered Residents Welfare Association stewarding civic infrastructure, neighborhood security, green cleanliness, and resident welfare in Bansdroni Sonali Park.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 1. SAMITI CIVIC CHARTER & SERVICES ═══ */}
      <section id="samiti-charter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            <span>{b('নাগরিক অধিকার ও পরিষেবা', 'Civic Amenities & Care')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {b('নিরাপত্তা, পরিকাঠামো ও', 'Security, Infrastructure &')} <span className="text-emerald-700">{b('পরিবেশ', 'Environment')}</span>
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            {b(
              'সোনালী পার্ক উন্নয়ন সমিতি পাড়ার প্রতিটি নাগরিকের নিরাপত্তা, আধুনিক পরিকাঠামো ও সুস্থ পরিবেশ নিশ্চিতে সার্বক্ষণিক প্রতিশ্রুতিবদ্ধ।',
              'Committed to guarding the civic wellbeing, infrastructure longevity, and emergency resilience of every resident family.'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              {b('রাত্রিকালীন পাহারা ও গেট', 'Night Watch & Security Gates')}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {b(
                'সিসিটিভি ক্যামেরা নজরদারি, অটোমেটেড গেট লকিং এবং সার্বক্ষণিক গার্ডের টহল।',
                'Comprehensive entry-gate lock system, CCTV recording, and patrolling night guards.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              {b('রাস্তা ও নিকাশি সংস্কার', 'Roads & Drainage Networks')}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {b(
                'কংক্রিট লেন মেরামত, বর্ষার ড্রেন পরিষ্কার এবং পথবাতির তাত্ক্ষণিক রক্ষণাবেক্ষণ।',
                'Pre-monsoon drainage silt clearing, lane paving, and prompt electrical maintenance.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-700 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              {b('পরিচ্ছন্নতা ও বর্জ্য অপসারণ', 'Doorstep Solid Waste')}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {b(
                'দৈনিক দরজায় দরজায় ময়লা সংগ্রহ, ডেঙ্গু প্রতিরোধে নিয়মিত ব্লিচিং ও স্প্রে।',
                'Daily morning garbage collection, vector spray for dengue control, and sanitation.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4">
              <TreePine className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
              {b('বৃক্ষরোপণ ও সবুজায়ন', 'Greenery & Parks')}
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {b(
                'পাড়ার রাস্তার দুধারে ছায়াঘন বৃক্ষরোপণ এবং খোলা উদ্যানের নিয়মিত পরিচর্যা।',
                'Seasonal tree sapling planting drives and neighborhood park green cover upkeep.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 2. RESIDENT EMERGENCY DIRECTORY & HELPLINES ═══ */}
      <section id="samiti-helplines" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 pt-4">
        <div className="group relative bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 rounded-3xl p-6 sm:p-10 text-white border border-stone-800 shadow-2xl">
          {/* Top Pinned Washi Tape */}
          <div className="absolute -top-3.5 left-7 sm:left-10 z-20">
            <WashiTapePin text={b('জরুরি হেল্পলাইন • সার্বক্ষণিক সেবা', 'Emergency Helplines • 24x7 Direct')} variant="rose" />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-800 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block">
                  {b('জরুরি নাগরিক সেবা ডিরেক্টরি', 'Emergency Resident Helpline Directory')}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {b('পাড়ার বাসিন্দাদের জন্য সার্বক্ষণিক জরুরি যোগাযোগ', 'Immediate Emergency Assistance Contacts')}
                </h3>
              </div>
            </div>
            <span className="text-xs text-stone-400">
              {b('যেকোনো জরুরি প্রয়োজনে সরাসরি কল করুন', 'Direct 1-tap call for urgent assistance')}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            <a href="tel:+919830000000" className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">{b('সমিতি নিরাপত্তা রুম', 'Samiti Security Desk')}</span>
                  <span className="text-sm font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">+91 98300 XXXXX</span>
                </div>
              </div>
              <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:100" className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-400/40 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Siren className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">{b('বাঁশদ্রোণী থানা', 'Bansdroni Police Station')}</span>
                  <span className="text-sm font-bold text-white font-mono group-hover:text-rose-400 transition-colors">100 / 033-2412-XXXX</span>
                </div>
              </div>
              <Phone className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:102" className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-400/40 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">{b('জরুরি অ্যাম্বুলেন্স', 'Emergency Ambulance')}</span>
                  <span className="text-sm font-bold text-white font-mono group-hover:text-red-400 transition-colors">102 / +91 98311 XXXXX</span>
                </div>
              </div>
              <Phone className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:03324750000" className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/40 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">{b('কেএমসি ১১২ ওয়ার্ড অফিস', 'KMC Ward 112 Office')}</span>
                  <span className="text-sm font-bold text-white font-mono group-hover:text-teal-400 transition-colors">033-2475-XXXX</span>
                </div>
              </div>
              <Phone className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:+919832200000" className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">{b('পাড়ার ইলেকট্রিশিয়ান', 'Local Electrician')}</span>
                  <span className="text-sm font-bold text-white font-mono group-hover:text-amber-400 transition-colors">+91 98322 XXXXX</span>
                </div>
              </div>
              <Phone className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </a>

            <a href="tel:+919833300000" className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">{b('প্লাম্বার ও জল সরবরাহ', 'Emergency Plumber')}</span>
                  <span className="text-sm font-bold text-white font-mono group-hover:text-blue-400 transition-colors">+91 98333 XXXXX</span>
                </div>
              </div>
              <Phone className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ 3. DEDICATED SAMITI NOTICE BOARD ═══ */}
      <section id="samiti-notices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-stone-100 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Megaphone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{b('নাগরিক বুলেটিন ও সার্কুলার', 'Civic Bulletin & Circulars')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('উন্নয়ন সমিতির জরুরি', 'Unnayan Samiti Official')} <span className="text-emerald-800">{b('বিজ্ঞপ্তি ও নির্দেশিকা', 'Notices & Directives')}</span>
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                {b('রাস্তাঘাট, নিকাশি নালা, বর্জ্য নিষ্কাশন ও পাড়ার নিরাপত্তা সংক্রান্ত সরকারি ও আবাসিক নোটিশ', 'Official announcements regarding drainage works, waste collection, security gates, and resident meetings.')}
              </p>
            </div>
            <div className="shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
              {b('সক্রিয় নোটিশ', 'Active Notices')}: {toDigits(samitiNotices.length, lang)} {b('টি', '')}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-5">
            {samitiNotices.map((notice, idx) => (
              <div
                key={notice.id || idx}
                className="group relative pt-8 pb-5 pl-8 sm:pl-10 pr-6 rounded-3xl bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_6px_20px_rgba(28,13,19,0.04)] hover:shadow-[0_16px_32px_rgba(5,150,105,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Pinned Washi Tape Header */}
                <div className="absolute -top-3.5 left-6 sm:left-8 z-20">
                  <WashiTapePin text={b(`নাগরিক সার্কুলার নং ০${idx + 1}`, `Civic Circular #${idx + 1}`)} variant="emerald" />
                </div>

                {/* Left Spiral Binder Holes */}
                <div className="absolute left-2.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
                  <BinderHoles count={4} />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-900 border border-emerald-500/20 font-serif shadow-2xs">
                      <SamitiEmblemIcon className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{b('নাগরিক বিজ্ঞপ্তি', 'Civic Notice')}</span>
                    </span>
                    {notice.isUrgent && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-2xs">
                        {b('জরুরি', 'Urgent')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-base mb-1.5 group-hover:text-emerald-900 transition-colors leading-snug">
                    {notice.title}
                  </h3>
                  <div className="mb-2.5">
                    <FestiveWaveAccent className="w-12 h-1.5 text-emerald-600/80" />
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line mb-3">
                    {notice.text}
                  </p>
                </div>

                <div>
                  <div className="pt-3 border-t border-[#E8DFD1] flex items-center justify-between text-[11px] text-stone-400">
                    <span>{b('সাল:', 'Year:')} {toDigits(notice.year, lang)}</span>
                    <span className="text-emerald-800 font-bold font-serif">{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
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

      {/* ═══ 4. DEDICATED SAMITI COMMITTEE ROSTER ═══ */}
      <section id="samiti-committee" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>{b('নাগরিক পরিষদ', 'Executive Roster')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('উন্নয়ন সমিতির কর্মকর্তা ও লেন সমন্বয়কবৃন্দ', 'Unnayan Samiti Leadership & Ward Reps')}
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
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {samitiCommittee.map((m, idx) => (
              <div key={idx} className="group relative p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60 hover:border-emerald-500/40 hover:bg-white hover:shadow-md transition-all flex flex-col items-center justify-between text-center">
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full max-w-[120px] aspect-[4/5] mx-auto rounded-xl overflow-hidden border border-emerald-200/80 bg-stone-100 shadow-2xs mb-2.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover object-top" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-emerald-50 text-emerald-800 font-serif font-bold text-2xl flex items-center justify-center">
                        {m.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">{m.name}</h4>
                </div>

                <div className="w-full flex flex-col items-center gap-1.5 mt-3 pt-2.5 border-t border-stone-200/60">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-900 text-[11px] font-bold border border-emerald-200/80 leading-tight">
                    {m.role}
                  </span>
                  {m.phone && (
                    <a
                      href={`tel:${m.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 hover:border-emerald-300 text-[10px] font-mono font-bold transition-all shadow-2xs cursor-pointer group/tel"
                      title={b('কল করুন', 'Call')}
                    >
                      <Phone className="w-3 h-3 text-emerald-600 group-hover/tel:scale-110 transition-transform" />
                      <span>{m.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. DEDICATED CIVIC PROJECTS GALLERY ═══ */}
      <section id="samiti-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>{b('নাগরিক কাজের অ্যালবাম', 'Civic Projects Archive')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('উন্নয়ন কর্মকাণ্ড ও পরিকাঠামো অ্যালবাম', 'Infrastructure Projects & Community Drives')}
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'All', labelBn: 'সব ছবি', labelEn: 'All Photos' },
                { key: 'Roads', labelBn: 'রাস্তা ও আলো', labelEn: 'Roads & Lights' },
                { key: 'Greenery', labelBn: 'সবুজায়ন', labelEn: 'Greenery' },
                { key: 'Sanitation', labelBn: 'পরিচ্ছন্নতা', labelEn: 'Sanitation' },
                { key: 'Meetings', labelBn: 'নাগরিক সভা', labelEn: 'Meetings' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.key
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
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
                  alt={img.title || 'Civic Project'}
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
                        triggerDownload(img.src, `${img.title || 'samiti-photo'}.jpg`);
                      }}
                      className="p-2 rounded-full bg-black/60 hover:bg-emerald-600 text-white backdrop-blur-md transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-600/80 text-white inline-block mb-1">
                      {img.category || 'Samiti'}
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

      {/* ═══ 5. DEDICATED SAMITI FINANCIALS & AUDITED ACCOUNTS ═══ */}
      <section id="samiti-finance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{b('নাগরিক স্বচ্ছতা ও অডিট হিসাব', 'Civic Accounts & Transparency')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              {b('উন্নয়ন তহবিল, পরিকাঠামো বাজেট ও', 'Welfare Fund, Infrastructure Accounts &')} <span className="text-emerald-700">{b('অডিট রিপোর্ট', 'Audited Statements')}</span>
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {b('সোনালী পার্কের আবাসিক চাঁদা, রাস্তাঘাট মেরামত এবং নাগরিক ব্যয়ের সম্পূর্ণ নিরীক্ষিত বিবরণী।', 'Audited public records of resident maintenance collections, road repair investments, and sanitation outlays.')}
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-500/20 text-center">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                {b('মোট বাৎসরিক কল্যাণ তহবিল', 'Total Maintenance Fund')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-mono mb-1">
                {toDigits(settings.samitiTotalCollection || '₹ ১২,২০,০০০', lang)}
              </h3>
              <p className="text-[11px] text-stone-500">{b('আবাসিক মাসিক চাঁদা ও বিশেষ তহবিল', 'Monthly maintenance & civic fund')}</p>
            </div>

            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-500/20 text-center">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
                {b('মোট সামগ্রিক নাগরিক ব্যয়', 'Total Civic Expenditure')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mb-1">
                {toDigits(settings.samitiTotalExpense || '₹ ১১,৫০,০০০', lang)}
              </h3>
              <p className="text-[11px] text-stone-500">{b('নিরাপত্তা গার্ড, আলো, ড্রেন ও আবর্জনা', 'Guard wages, lighting & sanitation')}</p>
            </div>

            <div className="p-6 rounded-2xl bg-teal-50/50 border border-teal-500/20 text-center">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">
                {b('প্রধান ব্যয়ের খাত', 'Major Development Head')}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-tight mb-1">
                {b(settings.samitiMajorExpenseTitle || 'রাস্তা সংস্কার ও জলনিকাশি', 'Road Repairs & Drainage Dredging')}
              </h3>
              <p className="text-xs font-bold text-teal-700 font-mono">
                {toDigits(settings.samitiMajorExpenseAmount || '₹ ৫,১০,০০০', lang)}
              </p>
            </div>
          </div>

          {/* Audit Documents Download List */}
          <div className="space-y-3">
            {samitiFinances.map((doc, idx) => (
              <Link
                key={idx}
                href={`?viewPdf=${encodeURIComponent(doc.url)}&pdfTitle=${encodeURIComponent(doc.title)}`}
                scroll={false}
                className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-600/40 hover:bg-white transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 group-hover:text-emerald-700 transition-colors truncate">
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
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-xs group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    <span>{b('দেখুন', 'View')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <button
                    type="button"
                    title={b('পিডিএফ ডাউনলোড করুন', 'Download PDF')}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      triggerDownload(doc.url, `${doc.title || 'samiti-audit'}.pdf`);
                    }}
                    className="p-1.5 rounded-full bg-stone-200/80 hover:bg-emerald-700 hover:text-white text-stone-600 transition-colors cursor-pointer"
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
                <span className="text-emerald-300 text-[10px] uppercase tracking-widest font-bold block">
                  {selectedImage.category || 'Samiti'}
                </span>
                <h3 className="text-white font-bold text-lg truncate mt-0.5">{selectedImage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => triggerDownload(selectedImage.src, `${selectedImage.title || 'samiti-photo'}.jpg`)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full font-bold transition-all text-sm shadow-md cursor-pointer"
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
