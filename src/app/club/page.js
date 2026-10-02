'use client';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import PillarSwitcher from "@/components/PillarSwitcher";
import { Users, Image as ImageIcon, IndianRupee, Trophy, HeartHandshake, ShieldCheck, ArrowRight, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ClubPage() {
  const { data, selectedYear } = useData();
  const { lang, b, toDigits } = useLanguage();

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
              <span>{b('সোনালী সঙ্ঘ • ক্রীড়া ও সংস্কৃতি শাখা', 'Sonali Sangha • Sports & Cultural Wing')}</span>
            </div>

            {/* Club Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white mb-4 leading-tight">
              {b('সোনালী সঙ্ঘ', 'Sonali Sangha')} <span className="text-amber-400">{b('ক্লাব', 'Club')}</span>
            </h1>

            {/* Club Tagline */}
            <p className="text-base sm:text-lg md:text-xl text-rose-100/90 font-light max-w-2xl leading-relaxed mb-8">
              {b(
                'বাঁশদ্রোণী সোনালী পার্কের সংস্কৃতি, ক্রীড়া ও যুবকল্যাণের প্রাণকেন্দ্র। খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান এবং রক্তদান শিবিরের মাধ্যমে সমাজের সেবায় আমরা নিয়োজিত।',
                'The athletic, cultural, and youth epicenter of Bansdroni Sonali Park. Fostering sporting excellence, cultural unity, and humanitarian welfare.'
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

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#club-committee"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>{b('ক্লাব কমিটি দেখুন', 'Club Committee')}</span>
              </a>
              <a
                href="#club-gallery"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all border border-white/20 hover:-translate-y-0.5 backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{b('ক্রীড়া ও সাংস্কৃতিক গ্যালারি', 'Sports & Culture Gallery')}</span>
              </a>
              <a
                href="#club-finance"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all border border-white/20 hover:-translate-y-0.5 backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <IndianRupee className="w-4 h-4" />
                <span>{b('ক্লাব হিসাব ও অডিট', 'Club Financials')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 1. CLUB CORE ACTIVITIES ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 text-amber-700" />
            <span>{b('আমাদের মূল কার্যক্রম', 'Core Club Activities')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {b('খেলাধুলা, সংস্কৃতি ও', 'Athletics, Culture &')} <span className="text-brand-maroon">{b('সমাজসেবা', 'Community Care')}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {b('বার্ষিক ক্রীড়া প্রতিযোগিতা', 'Annual Sports Meet')}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {b(
                'পাড়ার ছোট-বড় সকলের জন্য বার্ষিক দৌড়, ফুটবল টুর্নামেন্ট, ব্যাডমিন্টন চ্যাম্পিয়নশিপ ও ক্যারম প্রতিযোগিতা।',
                'Annual track & field events, football leagues, badminton championships, and indoor tournaments for all age groups.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-700 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {b('রক্তদান ও স্বাস্থ্য শিবির', 'Blood Donation & Health Camps')}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {b(
                'প্রতি বছর স্বেচ্ছায় রক্তদান শিবির, চক্ষু পরীক্ষা ও বিনামূল্যে প্রবীণ নাগরিকদের স্বাস্থ্য পরীক্ষা কার্যক্রম।',
                'Voluntary blood donation drives, free eye checkups, and routine preventive health camps for senior citizens.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-brand-maroon/10 text-brand-maroon flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {b('সাংস্কৃতিক সন্ধ্যা ও উৎসব', 'Cultural Evenings & Festivals')}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {b(
                'পঁচিশে বৈশাখ, স্বাধীনতা দিবস, প্রজাতন্ত্র দিবস এবং বিজয়া সম্মিলনীর বর্ণাঢ্য সাংস্কৃতিক অনুষ্ঠান ও নাটক।',
                'Grand celebrations of Rabindra Jayanti, Independence Day, Republic Day, and Bijoya Sammilani cultural festivals.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 2. CLUB COMMITTEE SECTION ANCHOR ═══ */}
      <section id="club-committee" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wider block mb-1">
                {b('পরিচালনা পরিষদ', 'Executive Committee')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('সোনালী সঙ্ঘের কর্মকর্তা ও সদস্যবৃন্দ', 'Sonali Sangha Club Leadership')}
              </h2>
            </div>
            <Link
              href="/committee"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-maroon hover:text-rose-700 transition-colors"
            >
              <span>{b('সম্পূর্ণ কমিটি রোস্টার দেখুন', 'View Full Roster')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-800 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-2">
                স
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{b('সভাপতি', 'President')}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{b('সোনালী সঙ্ঘ ক্লাব', 'Sonali Sangha Club')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-800 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-2">
                স
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{b('সাধারণ সম্পাদক', 'General Secretary')}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{b('সোনালী সঙ্ঘ ক্লাব', 'Sonali Sangha Club')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-800 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-2">
                ক্রী
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{b('ক্রীড়া সম্পাদক', 'Sports Secretary')}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{b('টুর্নামেন্ট ও যুব শাখা', 'Tournaments & Youth Wing')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-800 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-2">
                কো
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{b('কোষাধ্যক্ষ', 'Treasurer')}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{b('অর্থ ও হিসাব শাখা', 'Finance & Audit')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. CLUB GALLERY SECTION ANCHOR ═══ */}
      <section id="club-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wider block mb-1">
                {b('ছবি গ্যালারি', 'Photo Album')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('ক্লাবের ক্রীড়া ও উৎসব মুহূর্ত', 'Sports & Social Memories')}
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-maroon hover:text-rose-700 transition-colors"
            >
              <span>{b('মূল গ্যালারি অ্যালবাম দেখুন', 'Explore Full Gallery')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-2xl overflow-hidden aspect-video bg-stone-100 relative group">
              <img src="/assets/durga-hero.png" alt="Club Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">{b('বার্ষিক ক্রীড়া প্রতিযোগিতা', 'Annual Sports Meet')}</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video bg-stone-100 relative group">
              <img src="/assets/durga-morning.png" alt="Club Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">{b('স্বেচ্ছায় রক্তদান শিবির', 'Blood Donation Camp')}</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video bg-stone-100 relative group col-span-2 sm:col-span-1">
              <img src="/assets/durga-evening.png" alt="Club Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">{b('সাংস্কৃতিক নাটক ও অনুষ্ঠান', 'Cultural Drama Night')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. CLUB FINANCIALS SECTION ANCHOR ═══ */}
      <section id="club-finance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-amber-700 text-xs font-bold uppercase tracking-wider block mb-1">
                {b('আর্থিক স্বচ্ছতা', 'Financial Integrity')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('ক্লাবের হিসাব-নিকাশ ও অডিট', 'Club Accounts & Audit Reports')}
              </h2>
            </div>
            <Link
              href="/transparency"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-maroon hover:text-rose-700 transition-colors"
            >
              <span>{b('পূর্ণাঙ্গ অডিট পৃষ্ঠা দেখুন', 'View All Audit Records')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-500 font-semibold">{b('স্বচ্ছ ও নিরীক্ষিত তহবিল', 'Audited Operations Fund')}</span>
                <h4 className="text-lg font-serif font-bold text-stone-900">{b('ক্লাবের বাৎসরিক বাজেট ও হিসাব', 'Annual Club Budget & Balance')}</h4>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-500 font-semibold">{b('ক্রীড়া ও সাংস্কৃতিক তহবিল', 'Sports & Cultural Fund')}</span>
                <h4 className="text-lg font-serif font-bold text-stone-900">{b('টুর্নামেন্ট আয়োজন ও যুবকল্যাণ ব্যয়', 'Tournaments & Youth Welfare')}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
