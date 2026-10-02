'use client';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import PillarSwitcher from "@/components/PillarSwitcher";
import { Users, Image as ImageIcon, IndianRupee, ShieldCheck, Phone, ArrowRight, Building, CheckCircle2, Siren, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function SamitiPage() {
  const { data, selectedYear } = useData();
  const { lang, b, toDigits } = useLanguage();

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-20 sm:pt-24 pb-20 selection:bg-brand-maroon selection:text-white font-sans">
      {/* ═══ TOP 3-PILLAR SWITCHER HUB ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <PillarSwitcher active="samiti" variant="hero" />
      </div>

      {/* ═══ INDEPENDENT SAMITI HERO BANNER (NO PUJA COUNTDOWN) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#06201A] via-[#0F382E] to-[#041410] text-white border border-emerald-900/40">
          {/* Subtle Ambient Background Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

          <div className="relative z-10 px-6 py-12 sm:py-16 md:py-20 lg:px-12 flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Samiti RWA Registration Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{b('সোনালী পার্ক উন্নয়ন সমিতি • নাগরিক ও আবাসিক পরিষদ', 'Sonali Park Unnayan Samiti • Residents Welfare Association')}</span>
            </div>

            {/* Samiti Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white mb-4 leading-tight">
              {b('সোনালী পার্ক', 'Sonali Park')} <span className="text-emerald-400">{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
            </h1>

            {/* Samiti Tagline */}
            <p className="text-base sm:text-lg md:text-xl text-emerald-100/90 font-light max-w-2xl leading-relaxed mb-8">
              {b(
                'আমাদের পাড়ার নিরাপত্তা, পরিচ্ছন্নতা, রাস্তাঘাট ও নাগরিকদের দৈনন্দিন স্বাচ্ছন্দ্য রক্ষায় সার্বক্ষণিক নিয়োজিত রেজিস্টার্ড উন্নয়ন পরিষদ।',
                'The registered Residents Welfare Association stewarding civic infrastructure, neighborhood security, green cleanliness, and resident welfare in Bansdroni Sonali Park.'
              )}
            </p>

            {/* Civic Stat Pills (Replacing Puja Countdown) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl mb-8">
              <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
                <span className="text-emerald-400 text-xl sm:text-2xl font-black block font-mono">
                  ২৪/৭
                </span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-medium">
                  {b('নিরাপত্তা প্রহরী', 'Security Patrols')}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
                <span className="text-emerald-400 text-xl sm:text-2xl font-black block font-mono">
                  {toDigits(550, lang)}+
                </span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-medium">
                  {b('আবাসিক পরিবার', 'Resident Families')}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
                <span className="text-emerald-400 text-xl sm:text-2xl font-black block font-mono">
                  ১০০%
                </span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-medium">
                  {b('এলইডি পথবাতি', 'LED Streetlights')}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-center">
                <span className="text-emerald-400 text-xl sm:text-2xl font-black block font-mono">
                  দৈনিক
                </span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-medium">
                  {b('বর্জ্য নিষ্কাশন', 'Clean Sanitation')}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#samiti-committee"
                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>{b('উন্নয়ন কমিটি দেখুন', 'Samiti Committee')}</span>
              </a>
              <a
                href="#samiti-gallery"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all border border-white/20 hover:-translate-y-0.5 backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{b('নাগরিক কাজের ছবি', 'Civic Projects Gallery')}</span>
              </a>
              <a
                href="#samiti-finance"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm transition-all border border-white/20 hover:-translate-y-0.5 backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <IndianRupee className="w-4 h-4" />
                <span>{b('তহবিল ও হিসাব', 'Welfare Fund & Audit')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 1. SAMITI CIVIC CHARTER ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            <span>{b('নাগরিক অধিকার ও পরিষেবা', 'Civic Amenities & Care')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {b('নিরাপত্তা, পরিকাঠামো ও', 'Security, Infrastructure &')} <span className="text-emerald-700">{b('পরিবেশ', 'Environment')}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {b('রাত্রিকালীন নিরাপত্তা ও সিসিটিভি', 'Night Security & CCTV Watch')}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {b(
                'পাড়ার প্রবেশপথে সিসিটিভি নজরদারি এবং নিয়মিত প্রশিক্ষিত নাইট গার্ডের টহল দ্বারা সুরক্ষিত এলাকা।',
                'Comprehensive entry-gate CCTV monitoring and dedicated night guard patrols guarding residential zones.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {b('রাস্তা ও জলনিকাশি পরিকাঠামো', 'Roads & Drainage Networks')}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {b(
                'বর্ষার আগে নিয়মিত ড্রেন পরিষ্কার, কংক্রিট রাস্তা সংস্কার এবং আধুনিক পথবাতির রক্ষণাবেক্ষণ।',
                'Pre-monsoon drainage dredging, prompt concrete lane repairs, and full street light maintenance.'
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
              {b('সবুজ পরিবেশ ও পরিচ্ছন্নতা', 'Sanitation & Greenery Drives')}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {b(
                'প্রতিদিনের দরজায় দরজায় আবর্জনা সংগ্রহ, মশা নিধন স্প্রে এবং বাৎসরিক বৃক্ষরোপণ অভিযান।',
                'Door-to-door morning solid waste collection, regular anti-mosquito vector sprays, and seasonal tree plantation.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 2. SAMITI EMERGENCY HELPLINES ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-gradient-to-r from-stone-900 to-stone-950 rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Siren className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-300 uppercase tracking-widest block">
                {b('জরুরি নাগরিক সহায়তা', 'Emergency Helpdesk')}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {b('পাড়ার বাসিন্দাদের জন্য জরুরি যোগাযোগ নম্বর', 'Resident Emergency Helplines')}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{b('নিরাপত্তা রুম:', 'Security Desk:')} <strong>+91 98300 XXXXX</strong></span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              <span>{b('বাঁশদ্রোণী থানা:', 'Bansdroni PS:')} <strong>100 / 033-XXXX</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. SAMITI COMMITTEE SECTION ANCHOR ═══ */}
      <section id="samiti-committee" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider block mb-1">
                {b('পরিচালনা পরিষদ', 'Samiti Leadership')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('উন্নয়ন সমিতির কর্মকর্তা ও সদস্যবৃন্দ', 'Sonali Park Unnayan Samiti Roster')}
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
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-800 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-2">
                স
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{b('সভাপতি', 'President')}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-800 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-2">
                স
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{b('সাধারণ সম্পাদক', 'General Secretary')}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{b('নাগরিক সমন্বয়ক', 'Civic Coordinator')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-800 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-2">
                প
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{b('পরিকাঠামো আহ্বায়ক', 'Works Convenor')}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{b('রাস্তা ও পথবাতি', 'Roads & Lighting')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-800 font-serif font-bold text-lg flex items-center justify-center mx-auto mb-2">
                কো
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{b('কোষাধ্যক্ষ', 'Treasurer')}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{b('রক্ষণাবেক্ষণ তহবিল', 'Maintenance Fund')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. SAMITI GALLERY SECTION ANCHOR ═══ */}
      <section id="samiti-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider block mb-1">
                {b('ছবি গ্যালারি', 'Photo Album')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('নাগরিক উন্নয়ন ও সেবা কার্যক্রম', 'Civic Projects & Community Drives')}
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
              <img src="/assets/durga-hero.png" alt="Civic Work" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">{b('রাস্তা ও পথবাতি সংস্কার', 'Road & Streetlight Upgrades')}</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video bg-stone-100 relative group">
              <img src="/assets/durga-morning.png" alt="Civic Work" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">{b('বৃক্ষরোপণ ও সবুজায়ন', 'Greenery & Tree Plantation')}</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-video bg-stone-100 relative group col-span-2 sm:col-span-1">
              <img src="/assets/durga-evening.png" alt="Civic Work" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">{b('বাসিন্দাদের সাধারণ সভা', 'Resident Body Meetings')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. SAMITI FINANCIALS SECTION ANCHOR ═══ */}
      <section id="samiti-finance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider block mb-1">
                {b('আর্থিক স্বচ্ছতা', 'Financial Integrity')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {b('উন্নয়ন তহবিল ও অডিট রিপোর্ট', 'Welfare Fund & Audit Reports')}
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
                <span className="text-xs text-stone-500 font-semibold">{b('নাগরিক রক্ষণাবেক্ষণ তহবিল', 'Maintenance Fund')}</span>
                <h4 className="text-lg font-serif font-bold text-stone-900">{b('মাসিক চাঁদা ও সেবামূলক ব্যয় বিবরণী', 'Civic Subscriptions & Outlay')}</h4>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-teal-500/5 border border-teal-500/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center shrink-0">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-500 font-semibold">{b('পরিকাঠামো উন্নয়ন ব্যয়', 'Infrastructure Capital Fund')}</span>
                <h4 className="text-lg font-serif font-bold text-stone-900">{b('রাস্তা, আলো ও নিকাশি উন্নয়ন হিসাব', 'Roads, Lights & Drain Accounts')}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
