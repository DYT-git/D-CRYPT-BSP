'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, ExternalLink, Download, TrendingUp, TrendingDown, Landmark, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import YearSelector from "@/components/YearSelector";
import { triggerDownload } from "@/utils/download";
import { 
  DurgaDeviEmblemIcon, 
  ClubCrestIcon, 
  SamitiEmblemIcon, 
  FestiveWaveAccent, 
  WashiTapePin, 
  BinderHoles, 
  TornDeckleEdge 
} from '@/components/HeritageIcons';

function parseFinanceDoc(doc) {
  if (!doc?.title) return { wing: 'Puja', cleanTitle: doc?.title || '' };
  if (doc.title.startsWith('[Club]')) return { wing: 'Club', cleanTitle: doc.title.replace('[Club]', '').trim() };
  if (doc.title.startsWith('[Samiti]')) return { wing: 'Samiti', cleanTitle: doc.title.replace('[Samiti]', '').trim() };
  if (doc.title.startsWith('[Puja]')) return { wing: 'Puja', cleanTitle: doc.title.replace('[Puja]', '').trim() };
  return { wing: 'Puja', cleanTitle: doc.title };
}

const FALLBACK_CLUB_FINANCES = [
  { title: '[Club] সোনালী সঙ্ঘ বার্ষিক অডিট ও আর্থিক স্টেটমেন্ট ২০২৫-২৬', year: 2026, url: '/sample-audit.pdf' },
  { title: '[Club] বার্ষিক ক্রীড়া প্রতিযোগিতা ও টুর্নামেন্ট আয়-ব্যয় হিসাব', year: 2026, url: '/sample-audit.pdf' },
  { title: '[Club] স্বেচ্ছায় রক্তদান শিবির ও সমাজকল্যাণ তহবিল বিবরণী', year: 2025, url: '/sample-audit.pdf' }
];

const FALLBACK_SAMITI_FINANCES = [
  { title: '[Samiti] সোনালী পার্ক উন্নয়ন সমিতি বাৎসরিক অডিট রিপোর্ট ২০২৫-২৬', year: 2026, url: '/sample-audit.pdf' },
  { title: '[Samiti] পাড়ার ড্রেন ও রাস্তা সংস্কার কাজের ব্যয় বিবরণী', year: 2026, url: '/sample-audit.pdf' },
  { title: '[Samiti] সিসিটিভি ক্যামেরা ও নিরাপত্তা রক্ষণাবেক্ষণ তহবিল হিসাব', year: 2025, url: '/sample-audit.pdf' }
];

const FALLBACK_PUJA_FINANCES = [
  { title: '[Puja] শারদীয়া দুর্গোৎসব ২০২৬ সম্পূর্ণ নিরীক্ষিত অডিট রিপোর্ট', year: 2026, url: '/sample-audit.pdf' },
  { title: '[Puja] মহাষ্টমী ভোগ বিতরণ ও পূজানুষ্ঠান আর্থিক বিবরণী', year: 2026, url: '/sample-audit.pdf' },
  { title: '[Puja] বিজ্ঞাপন ও শুভানুধ্যায়ী দান বিবরণী ২০২৬', year: 2025, url: '/sample-audit.pdf' }
];

function TransparencyContent() {
  const { data, settings, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();
  const searchParams = useSearchParams();

  // Read wing from URL param (?wing=Club | ?wing=Samiti | ?wing=Puja)
  const initialWing = useMemo(() => {
    const w = searchParams?.get('wing');
    if (!w) return 'Puja';
    const lower = w.toLowerCase();
    if (lower === 'club') return 'Club';
    if (lower === 'samiti') return 'Samiti';
    return 'Puja';
  }, [searchParams]);

  const [activeWing, setActiveWing] = useState(initialWing);

  useEffect(() => {
    if (initialWing) {
      setActiveWing(initialWing);
    }
  }, [initialWing]);

  // Dynamic metrics per active wing
  const metrics = useMemo(() => {
    if (activeWing === 'Club') {
      return {
        badgeTitle: b('পাবলিক লেজার ও আয়-ব্যয় খতিয়ান', 'Public Ledger & Summary'),
        headingTitle: b('ক্লাব বাৎসরিক আর্থিক বিবরণী', 'Club Annual Accounts Statement'),
        collection: settings.clubTotalCollection || (lang === 'bn' ? '₹ ৮,৫০,০০০' : '₹ 8,50,000'),
        collectionSub: b('সদস্য চাঁদা, টুর্নামেন্ট স্পনসর ও অনুদান', 'Member subscriptions, tournament sponsors & aid'),
        expense: settings.clubTotalExpense || (lang === 'bn' ? '₹ ৭,৯৫,০০০' : '₹ 7,95,000'),
        expenseSub: b('টুর্নামেন্ট, ট্রফি, জার্সি ও ক্রীড়া সরঞ্জাম', 'Tournaments, trophies, jerseys & equipment'),
        majorTitle: lang === 'en' ? (t(settings.clubMajorExpenseTitle) || 'Sports Tournaments & Celebrations') : (settings.clubMajorExpenseTitle || 'ক্রীড়া টুর্নামেন্ট ও উৎসব'),
        majorAmount: settings.clubMajorExpenseAmount || (lang === 'bn' ? '₹ ৩,৫০,০০০' : '₹ 3,50,000')
      };
    }

    if (activeWing === 'Samiti') {
      return {
        badgeTitle: b('নাগরিক কল্যাণ তহবিল ও নিরীক্ষা', 'Civic Fund Allocation & Audit'),
        headingTitle: b('সমিতি বাৎসরিক আর্থিক বিবরণী', 'Samiti Annual Accounts Statement'),
        collection: settings.samitiTotalCollection || (lang === 'bn' ? '₹ ৬,২০,০০০' : '₹ 6,20,000'),
        collectionSub: b('মাসিক আবাসিক চাঁদা ও নাগরিক উন্নয়ন অনুদান', 'Monthly residents subscriptions & civic donations'),
        expense: settings.samitiTotalExpense || (lang === 'bn' ? '₹ ৫,৮৫,০০০' : '₹ 5,85,000'),
        expenseSub: b('রাস্তাঘাট, ড্রেন পরিষ্কার, সিসিটিভি ও নিরাপত্তা', 'Lanes, drain cleaning, CCTV & night security'),
        majorTitle: lang === 'en' ? (t(settings.samitiMajorExpenseTitle) || 'Lanes, Drain Maintenance & CCTV') : (settings.samitiMajorExpenseTitle || 'রাস্তা সংস্কার, সিসিটিভি ও নিরাপত্তা'),
        majorAmount: settings.samitiMajorExpenseAmount || (lang === 'bn' ? '₹ ২,৪০,০০০' : '₹ 2,40,000')
      };
    }

    // Default: Puja
    return {
      badgeTitle: b('উৎসব বাজেট ও ব্যয় রূপরেখা', 'Festival Budget & Outlay'),
      headingTitle: b('শারদীয়া দুর্গোৎসব আর্থিক বিবরণী', 'Durga Puja Financial Statement'),
      collection: settings.totalCollection || (lang === 'bn' ? '₹ ১৪,৫০,০০০' : '₹ 14,50,000'),
      collectionSub: b('চাঁদা, বিজ্ঞাপন ও শুভানুধ্যায়ীদের অনুদান', 'Subscriptions, advertisements, and donations'),
      expense: settings.totalExpense || (lang === 'bn' ? '₹ ১৩,৮৫,০০০' : '₹ 13,85,000'),
      expenseSub: b('মণ্ডপ, প্রতিমা, আলো ও আপ্যায়ন', 'Pandal, idol, illumination, and hospitality'),
      majorTitle: lang === 'en' ? (t(settings.majorExpenseTitle) || 'Pandal Construction & Decor') : (settings.majorExpenseTitle || 'মণ্ডপ নির্মাণ ও সজ্জা'),
      majorAmount: settings.majorExpenseAmount || (lang === 'bn' ? '₹ ৬,০০,০০০' : '₹ 6,00,000')
    };
  }, [activeWing, settings, lang, b, t]);

  // Filtered finances strictly for the selected wing
  const filteredFinances = useMemo(() => {
    const rawAll = (data.finances || []).filter(f => Number(f.year) === Number(selectedYear));
    const list = rawAll.filter(f => {
      const parsed = parseFinanceDoc(f);
      return parsed.wing === activeWing;
    });

    if (list.length > 0) return list;

    // Use authentic fallback for that wing
    const fallbackList = activeWing === 'Club' 
      ? FALLBACK_CLUB_FINANCES 
      : (activeWing === 'Samiti' ? FALLBACK_SAMITI_FINANCES : FALLBACK_PUJA_FINANCES);
    const yearMatches = fallbackList.filter(f => Number(f.year) === Number(selectedYear));
    return yearMatches.length > 0 ? yearMatches : fallbackList;
  }, [data.finances, selectedYear, activeWing]);

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-brand-maroon selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearSelector />
      </div>

      {/* ═══ Clean Editorial Header ═══ */}
      <header className="max-w-3xl mx-auto text-center mt-10 sm:mt-12 mb-8 sm:mb-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-3 tracking-tight leading-tight">
          {b('আর্থিক স্বচ্ছতা ও', 'Financial Transparency &')} <span className="text-brand-maroon">{b('হিসাব-নিকাশ', 'Statements')}</span>
        </h1>
        <div className="flex justify-center mb-3">
          <FestiveWaveAccent className="w-16 h-2 text-amber-500/80" />
        </div>
        <p className="text-sm sm:text-base md:text-lg text-stone-600 font-light leading-relaxed">
          {b(
            'বাঁশদ্রোণী সোনালী পার্কের পূজা, ক্লাব ও সমিতির বাজেট, আয়-ব্যয় এবং নিরীক্ষিত আর্থিক হিসাব সবার জন্য উন্মুক্ত।',
            'Open public records of Durga Puja, Sonali Sangha Club, and Unnayan Samiti budgets, audited statements, and fund allocations.'
          )}
        </p>
      </header>

      {/* ═══ 3-Pillar Wing Selector Tabs (NO ALL SECTION) ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setActiveWing('Puja')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border shadow-sm ${
              activeWing === 'Puja'
                ? 'bg-rose-700 text-white border-rose-700 shadow-md scale-105'
                : 'bg-white text-stone-600 border-stone-200/90 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <DurgaDeviEmblemIcon className={`w-4 h-4 ${activeWing === 'Puja' ? 'text-white' : 'text-rose-700'}`} />
            <span>{b('শারদীয়া দুর্গোৎসব', 'Durga Puja')}</span>
          </button>

          <button
            onClick={() => setActiveWing('Club')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border shadow-sm ${
              activeWing === 'Club'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105'
                : 'bg-white text-stone-600 border-stone-200/90 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <ClubCrestIcon className={`w-4 h-4 ${activeWing === 'Club' ? 'text-white' : 'text-amber-600'}`} />
            <span>{b('সোনালী সঙ্ঘ ক্লাব', 'Sonali Club')}</span>
          </button>

          <button
            onClick={() => setActiveWing('Samiti')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border shadow-sm ${
              activeWing === 'Samiti'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-md scale-105'
                : 'bg-white text-stone-600 border-stone-200/90 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <SamitiEmblemIcon className={`w-4 h-4 ${activeWing === 'Samiti' ? 'text-white' : 'text-emerald-700'}`} />
            <span>{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
          </button>
        </div>
      </div>

      {/* ═══ 1. FINANCIAL SUMMARY DASHBOARD (Dynamic Metric Cards as per Selection) ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon" />
            <span>{b('বাজেট সারসংক্ষেপ', 'Budget Overview')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
            {toDigits(selectedYear, lang)} {metrics.headingTitle}
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Metric 1: Total Collection */}
          <div className="group relative bg-[#FFFDF9] rounded-3xl p-5 sm:p-8 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-[#E5DAC8] hover:border-emerald-500/50 overflow-hidden text-center">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 mx-auto mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1 sm:mb-2">
              {b('মোট সংগৃহীত তহবিল', 'Total Collection')}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-none mb-1.5 sm:mb-2 font-mono">
              {toDigits(metrics.collection, lang)}
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {metrics.collectionSub}
            </p>
          </div>

          {/* Metric 2: Total Expense */}
          <div className="group relative bg-[#FFFDF9] rounded-3xl p-5 sm:p-8 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-[#E5DAC8] hover:border-rose-500/50 overflow-hidden text-center">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-600 mx-auto mb-3 sm:mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-rose-700 uppercase tracking-widest block mb-1 sm:mb-2">
              {b('মোট সামগ্রিক খরচ', 'Total Expenditure')}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-rose-600 tracking-tight leading-none mb-1.5 sm:mb-2 font-mono">
              {toDigits(metrics.expense, lang)}
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {metrics.expenseSub}
            </p>
          </div>

          {/* Metric 3: Major Expense */}
          <div className="group relative bg-[#FFFDF9] rounded-3xl p-5 sm:p-8 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-[#E5DAC8] hover:border-brand-maroon/30 overflow-hidden text-center">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center text-brand-maroon mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Landmark className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-maroon uppercase tracking-widest block mb-1 sm:mb-2">
              {b('প্রধান ব্যয়ের খাত', 'Major Expense Area')}
            </span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-stone-900 leading-tight mb-1">
              {metrics.majorTitle}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-brand-maroon font-mono">
              {toDigits(metrics.majorAmount, lang)}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 2. DOWNLOAD PDF REPORTS (Audit Cards) ═══ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon" />
            <span>{b('আর্থিক প্রতিবেদন', 'Audited Accounts')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
            {b('নিরীক্ষিত অডিট ও', 'Audited Statements &')} <span className="text-brand-maroon">{b('আর্থিক রিপোর্ট', 'Financial Reports')}</span>
          </h2>
        </div>

        {filteredFinances.length > 0 ? (
          <div className="space-y-4">
            {filteredFinances.map((doc, i) => {
              const parsed = parseFinanceDoc(doc);
              return (
                <Link 
                  key={i} 
                  href={`?viewPdf=${encodeURIComponent(doc.url)}&pdfTitle=${encodeURIComponent(parsed.cleanTitle)}`}
                  scroll={false}
                  className="group relative flex items-center gap-3.5 sm:gap-5 bg-[#FFFDF9] p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#E5DAC8] hover:border-brand-maroon/30 overflow-hidden"
                >
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <FileText className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-xl font-serif font-bold text-stone-900 group-hover:text-brand-maroon transition-colors truncate">
                      {t(parsed.cleanTitle)}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-stone-600 border border-[#E8DFD1]">
                        {b('পিডিএফ অডিট নথি', 'PDF Audit Document')}
                      </span>
                      {parsed.wing === 'Club' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          <ClubCrestIcon className="w-3 h-3 text-amber-700" />
                          <span>{b('সোনালী সঙ্ঘ ক্লাব', 'Club Audit')}</span>
                        </span>
                      )}
                      {parsed.wing === 'Samiti' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <SamitiEmblemIcon className="w-3 h-3 text-emerald-700" />
                          <span>{b('উন্নয়ন সমিতি', 'Samiti Audit')}</span>
                        </span>
                      )}
                      {parsed.wing === 'Puja' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <DurgaDeviEmblemIcon className="w-3 h-3 text-rose-700" />
                          <span>{b('শারদীয়া দুর্গোৎসব', 'Puja Audit')}</span>
                        </span>
                      )}
                      <span className="text-xs text-stone-400 font-mono">{b('সাল:', 'Year:')} {toDigits(doc.year, lang)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="btn-tactile-parchment inline-flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-full text-stone-800 group-hover:text-brand-maroon font-bold text-xs shadow-2xs">
                      <span>{b('দেখুন', 'View')}</span>
                      <span className="w-5 h-5 rounded-full bg-brand-maroon/10 group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white flex items-center justify-center text-[10px] font-bold transition-colors">
                        →
                      </span>
                    </div>
                    <button
                      type="button"
                      title={b('পিডিএফ ডাউনলোড করুন', 'Download PDF')}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        triggerDownload(doc.url, `${parsed.cleanTitle || 'audit-report'}.pdf`);
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-stone-100 hover:bg-brand-maroon hover:text-white text-stone-600 border border-stone-200 transition-all cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] text-stone-500 shadow-xs">
            <h3 className="text-xl font-serif font-bold text-stone-800">{b('এই বিভাগের কোনো আর্থিক রিপোর্ট এখনও আপলোড করা হয়নি।', 'No financial reports uploaded for this category yet.')}</h3>
            <p className="text-stone-400 text-sm mt-1">{b('অডিট সম্পন্ন হওয়ার পর নথিপত্র প্রকাশ করা হবে।', 'Documents will be published after the audit is finalized.')}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function TransparencyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-serif text-stone-600">লোড হচ্ছে...</div>}>
      <TransparencyContent />
    </Suspense>
  );
}
