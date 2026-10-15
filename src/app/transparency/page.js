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
  if (doc.title.startsWith('[Samiti]') || doc.title.startsWith('[Samity]')) return { wing: 'Samiti', cleanTitle: doc.title.replace(/^\[(Samiti|Samity)\]/i, '').trim() };
  if (doc.title.startsWith('[Puja]')) return { wing: 'Puja', cleanTitle: doc.title.replace('[Puja]', '').trim() };
  return { wing: 'Puja', cleanTitle: doc.title };
}

function hasRealValue(val) {
  if (!val || typeof val !== 'string') return false;
  const t = val.trim();
  if (!t) return false;
  if (
    t === '₹ 14,50,000' || t === '₹ 13,85,000' || t === '₹ 6,00,000' ||
    t === '₹ ৮,৫০,০০০' || t === '₹ ৭,৯৫,০০০' || t === '₹ ৩,৫০,০০০' ||
    t === '₹ ১২,২০,০০০' || t === '₹ ১১,৫০,০০০' || t === '₹ ৫,১০,০০০' ||
    t === '₹ ৬,২০,০০০' || t === '₹ ৫,৮৫,০০০' || t === '₹ ২,৪০,০০০'
  ) return false;
  return true;
}

function TransparencyContent() {
  const { data, settings, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();
  const searchParams = useSearchParams();

  // Read wing from URL param (?wing=Club | ?wing=Samiti | ?wing=Samity | ?wing=Puja)
  const initialWing = useMemo(() => {
    const w = searchParams?.get('wing');
    if (!w) return 'Puja';
    const lower = w.toLowerCase();
    if (lower === 'club') return 'Club';
    if (lower === 'samiti' || lower === 'samity') return 'Samiti';
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
      const col = hasRealValue(settings.clubTotalCollection) ? settings.clubTotalCollection : null;
      const exp = hasRealValue(settings.clubTotalExpense) ? settings.clubTotalExpense : null;
      const majAmt = hasRealValue(settings.clubMajorExpenseAmount) ? settings.clubMajorExpenseAmount : null;
      const majTitle = settings.clubMajorExpenseTitle ? (lang === 'en' ? t(settings.clubMajorExpenseTitle) : settings.clubMajorExpenseTitle) : b('ক্রীড়া টুর্নামেন্ট ও যুবকল্যাণ', 'Sports Tournaments & Youth Welfare');
      return {
        badgeTitle: b('ক্লাব বাজেট ও ব্যয় খতিয়ান', 'Club Budget & Summary'),
        headingTitle: b('ক্লাব বাৎসরিক আর্থিক বিবরণী', 'Club Annual Accounts Statement'),
        collection: col,
        collectionSub: b('সদস্য চাঁদা, টুর্নামেন্ট স্পনসর ও অনুদান', 'Member subscriptions, tournament sponsors & aid'),
        expense: exp,
        expenseSub: b('টুর্নামেন্ট, জার্সি, ক্রীড়া সামগ্রী ও উৎসব', 'Tournaments, jerseys, equipment & events'),
        majorTitle: majTitle,
        majorAmount: majAmt
      };
    }

    if (activeWing === 'Samiti') {
      const col = hasRealValue(settings.samitiTotalCollection) ? settings.samitiTotalCollection : null;
      const exp = hasRealValue(settings.samitiTotalExpense) ? settings.samitiTotalExpense : null;
      const majAmt = hasRealValue(settings.samitiMajorExpenseAmount) ? settings.samitiMajorExpenseAmount : null;
      const rawTitle = settings.samitiMajorExpenseTitle || '';
      const majTitle = (rawTitle && !rawTitle.includes('জলনিকাশি') && !rawTitle.includes('ড্রেন'))
        ? (lang === 'en' ? t(rawTitle) : rawTitle)
        : b('অভ্যন্তরীণ লেন, পথবাতি ও সিসিটিভি', 'Internal Lanes, Streetlights & CCTV');
      return {
        badgeTitle: b('নাগরিক কল্যাণ তহবিল ও নিরীক্ষা', 'Civic Fund Allocation & Audit'),
        headingTitle: b('সমিতি বাৎসরিক আর্থিক বিবরণী', 'Samiti Annual Accounts Statement'),
        collection: col,
        collectionSub: b('মাসিক আবাসিক চাঁদা ও নাগরিক উন্নয়ন অনুদান', 'Monthly residents subscriptions & civic donations'),
        expense: exp,
        expenseSub: b('অভ্যন্তরীণ পথবাতি, পরিচ্ছন্নতা, সিসিটিভি ও নিরাপত্তা', 'Internal streetlights, cleanliness, CCTV & night security'),
        majorTitle: majTitle,
        majorAmount: majAmt
      };
    }

    // Default: Puja
    const col = hasRealValue(settings.totalCollection) ? settings.totalCollection : null;
    const exp = hasRealValue(settings.totalExpense) ? settings.totalExpense : null;
    const majAmt = hasRealValue(settings.majorExpenseAmount) ? settings.majorExpenseAmount : null;
    const majTitle = settings.majorExpenseTitle ? (lang === 'en' ? t(settings.majorExpenseTitle) : settings.majorExpenseTitle) : b('মণ্ডপ নির্মাণ ও আবহ সজ্জা', 'Pandal Construction & Decor');
    return {
      badgeTitle: b('উৎসব বাজেট ও ব্যয় রূপরেখা', 'Festival Budget & Outlay'),
      headingTitle: b('শারদীয়া দুর্গোৎসব আর্থিক বিবরণী', 'Durga Puja Financial Statement'),
      collection: col,
      collectionSub: b('চাঁদা, বিজ্ঞাপন ও শুভানুধ্যায়ীদের অনুদান', 'Subscriptions, advertisements, and donations'),
      expense: exp,
      expenseSub: b('মণ্ডপ, প্রতিমা, আলো ও আপ্যায়ন', 'Pandal, idol, illumination, and hospitality'),
      majorTitle: majTitle,
      majorAmount: majAmt
    };
  }, [activeWing, settings, lang, b, t]);

  // Filtered finances strictly for the selected wing (only actual uploaded files, no dummy sample-audit.pdf)
  const filteredFinances = useMemo(() => {
    const rawAll = (data.finances || [])
      .filter(f => Number(f.year) === Number(selectedYear))
      .filter(f => f.url && f.url !== '/sample-audit.pdf');

    return rawAll.filter(f => {
      const parsed = parseFinanceDoc(f);
      return parsed.wing === activeWing;
    });
  }, [data.finances, selectedYear, activeWing]);

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-28 sm:pt-32 pb-24 selection:bg-brand-maroon selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearSelector />
      </div>

      {/* ═══ Clean Minimal Editorial Header (No Wordy Paragraph) ═══ */}
      <header className="max-w-3xl mx-auto text-center mt-6 sm:mt-8 mb-8 sm:mb-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-2 tracking-tight leading-tight">
          {b('আর্থিক স্বচ্ছতা ও', 'Financial Transparency &')} <span className="text-brand-maroon">{b('হিসাব-নিকাশ', 'Statements')}</span>
        </h1>
        <div className="flex justify-center mt-3">
          <FestiveWaveAccent className="w-16 h-2 text-amber-500/80" />
        </div>
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
            {metrics.collection ? (
              <>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-none mb-1.5 sm:mb-2 font-mono">
                  {toDigits(metrics.collection, lang)}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {metrics.collectionSub}
                </p>
              </>
            ) : (
              <>
                <div className="my-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {b('শীঘ্রই আপডেট হবে', 'To be Updated')}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium">
                  {b('বাৎসরিক সাধারণ সভা ও নিরীক্ষা শেষে প্রকাশিত হবে', 'To be published post-AGM and audit verification')}
                </p>
              </>
            )}
          </div>

          {/* Metric 2: Total Expense */}
          <div className="group relative bg-[#FFFDF9] rounded-3xl p-5 sm:p-8 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-[#E5DAC8] hover:border-rose-500/50 overflow-hidden text-center">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-600 mx-auto mb-3 sm:mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-rose-700 uppercase tracking-widest block mb-1 sm:mb-2">
              {b('মোট সামগ্রিক খরচ', 'Total Expenditure')}
            </span>
            {metrics.expense ? (
              <>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-rose-600 tracking-tight leading-none mb-1.5 sm:mb-2 font-mono">
                  {toDigits(metrics.expense, lang)}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {metrics.expenseSub}
                </p>
              </>
            ) : (
              <>
                <div className="my-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                    {b('হিসাব নিরীক্ষণাধীন', 'Audit in Progress')}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium">
                  {b('ব্যয় বিবরণী ও ভাউচার নিরীক্ষা প্রক্রিয়াধীন', 'Vouchers and accounts under verification')}
                </p>
              </>
            )}
          </div>

          {/* Metric 3: Major Expense */}
          <div className="group relative bg-[#FFFDF9] rounded-3xl p-5 sm:p-8 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-[#E5DAC8] hover:border-brand-maroon/30 overflow-hidden text-center">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center text-brand-maroon mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Landmark className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-maroon uppercase tracking-widest block mb-1 sm:mb-2">
              {b('প্রধান ব্যয়ের খাত', 'Major Expense Area')}
            </span>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-stone-900 leading-tight mb-1.5">
              {metrics.majorTitle}
            </h3>
            {metrics.majorAmount ? (
              <p className="text-xs sm:text-sm font-semibold text-brand-maroon font-mono">
                {toDigits(metrics.majorAmount, lang)}
              </p>
            ) : (
              <>
                <div className="my-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-maroon/5 text-brand-maroon border border-brand-maroon/20">
                    {b('বাজেট বরাদ্দ প্রক্রিয়াধীন', 'Allocation in Progress')}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  {b('চূড়ান্ত ব্যয় বিবরণী অডিট সাপেক্ষে', 'Final outlay subject to audit review')}
                </p>
              </>
            )}
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
          <div className="text-center py-10 sm:py-14 px-4 bg-[#FFFDF9] rounded-3xl border border-stone-200/80 shadow-xs max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mx-auto mb-3.5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-800 mb-1">
              {b('নতুন নিরীক্ষিত অডিট রিপোর্ট আপলোড হলে এখানে প্রকাশিত হবে।', 'New audited reports will be updated here once verified.')}
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
              {b('হিসাব নিরীক্ষা প্রক্রিয়াধীন রয়েছে।', 'Accounts verification is in progress.')}
            </p>
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{b('শীঘ্রই আপডেট হবে', 'To be Updated')}</span>
            </div>
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
