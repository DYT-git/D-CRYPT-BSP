'use client';
import { useState, useMemo } from 'react';
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

export default function TransparencyPage() {
  const { data, settings, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();
  const [activeWing, setActiveWing] = useState('ALL');

  const allYearFinances = useMemo(() => {
    return (data.finances || []).filter(f => f.year === selectedYear);
  }, [data.finances, selectedYear]);

  const filteredFinances = useMemo(() => {
    return allYearFinances.filter(f => {
      const parsed = parseFinanceDoc(f);
      if (activeWing === 'ALL') return true;
      return parsed.wing === activeWing;
    });
  }, [allYearFinances, activeWing]);

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-brand-maroon selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearSelector />
      </div>

      {/* ═══ Symmetrical 3-Tier Header ═══ */}
      <header className="max-w-3xl mx-auto text-center mt-10 sm:mt-12 mb-12 sm:mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon animate-pulse" />
          {b('আর্থিক সততা ও স্বচ্ছতা', 'Financial Integrity')} • {toDigits(selectedYear, lang)}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight leading-tight">
          {b('আর্থিক স্বচ্ছতা ও', 'Financial Transparency &')} <span className="text-brand-maroon">{b('হিসাব-নিকাশ', 'Audit Reports')}</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-stone-600 font-light leading-relaxed">
          {b(
            'বাঁশদ্রোণী সোনালী পার্কের দুর্গাপূজা বাজেট, আয়-ব্যয় এবং নিরীক্ষিত আর্থিক হিসাব সবার জন্য উন্মুক্ত।',
            'Open public records of Durga Puja budgets, audited statements, and community welfare fund allocations.'
          )}
        </p>
      </header>

      {/* ═══ 1. FINANCIAL SUMMARY DASHBOARD (Bento Metric Cards) ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {b('বাজেট ও হিসাব বিবরণী', 'Budget & Accounts Overview')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {toDigits(selectedYear, lang)} {b('বর্ষের আর্থিক', 'Financial')} <span className="text-emerald-700">{b('বিবরণী', 'Statement')}</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Metric 1: Total Collection */}
          <div className="group relative bg-white rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-emerald-500/20 hover:border-emerald-500/50 overflow-hidden text-center">
            {/* Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 mx-auto mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1 sm:mb-2">
              {b('মোট সংগৃহীত তহবিল', 'Total Collection')}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-none mb-1.5 sm:mb-2">
              {toDigits(settings.totalCollection || (lang === 'bn' ? '₹ ১৪,৫০,০০০' : '₹ 14,50,000'), lang)}
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {b('চাঁদা, বিজ্ঞাপন ও শুভানুধ্যায়ীদের অনুদান', 'Subscriptions, advertisements, and donations')}
            </p>
          </div>

          {/* Metric 2: Total Expense */}
          <div className="group relative bg-white rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-rose-500/20 hover:border-rose-500/50 overflow-hidden text-center">
            {/* Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-600 mx-auto mb-3 sm:mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-rose-700 uppercase tracking-widest block mb-1 sm:mb-2">
              {b('মোট সামগ্রিক খরচ', 'Total Expenditure')}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-rose-600 tracking-tight leading-none mb-1.5 sm:mb-2">
              {toDigits(settings.totalExpense || (lang === 'bn' ? '₹ ১৩,৮৫,০০০' : '₹ 13,85,000'), lang)}
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              {b('মণ্ডপ, প্রতিমা, আলো ও আপ্যায়ন', 'Pandal, idol, illumination, and hospitality')}
            </p>
          </div>

          {/* Metric 3: Major Expense */}
          <div className="group relative bg-white rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-stone-200/80 hover:border-brand-maroon/30 overflow-hidden text-center">
            {/* Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/40 to-transparent" />
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center text-brand-maroon mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Landmark className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-maroon uppercase tracking-widest block mb-1 sm:mb-2">
              {b('প্রধান ব্যয়ের খাত', 'Major Expense Area')}
            </span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-stone-900 leading-tight mb-1">
              {lang === 'en' ? (t(settings.majorExpenseTitle) || 'Pandal Construction & Decor') : (settings.majorExpenseTitle || 'মণ্ডপ নির্মাণ ও সজ্জা')}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-brand-maroon">
              {toDigits(settings.majorExpenseAmount || (lang === 'bn' ? '₹ ৬,০০,০০০' : '₹ 6,00,000'), lang)}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 2. DOWNLOAD PDF REPORTS (Audit Cards) ═══ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon text-[11px] font-bold uppercase tracking-wider mb-2">
            ✦ {b('যাচাইকৃত অডিট নথি', 'Verified Audit Documents')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {b('অডিট ও আর্থিক রিপোর্ট', 'Audited Statements & Financial')} <span className="text-brand-maroon">{b('ডাউনলোড', 'Reports')}</span>
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            {b('পূর্ণাঙ্গ হিসাব দেখতে নিচের যেকোনো ডকুমেন্টে ক্লিক করুন', 'Click on any document below to inspect audited accounts or download verified statements.')}
          </p>
        </div>

        {/* 3-Pillar Wing Tabs for Audits */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveWing('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeWing === 'ALL'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50'
            }`}
          >
            {b('সকল অডিট নথি', 'All Audits')} ({toDigits(allYearFinances.length, lang)})
          </button>
          <button
            onClick={() => setActiveWing('Puja')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWing === 'Puja'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <DurgaDeviEmblemIcon className={`w-3.5 h-3.5 ${activeWing === 'Puja' ? 'text-white' : 'text-rose-700'}`} />
            <span>{b('শারদীয়া দুর্গোৎসব', 'Durga Puja')}</span>
          </button>
          <button
            onClick={() => setActiveWing('Club')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWing === 'Club'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <ClubCrestIcon className={`w-3.5 h-3.5 ${activeWing === 'Club' ? 'text-white' : 'text-amber-600'}`} />
            <span>{b('সোনালী সঙ্ঘ ক্লাব', 'Sonali Club')}</span>
          </button>
          <button
            onClick={() => setActiveWing('Samiti')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWing === 'Samiti'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <SamitiEmblemIcon className={`w-3.5 h-3.5 ${activeWing === 'Samiti' ? 'text-white' : 'text-emerald-700'}`} />
            <span>{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
          </button>
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
                  className="group relative flex items-center gap-3.5 sm:gap-5 bg-[#FFFDF9] p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-[0_4px_16px_rgba(28,13,19,0.04)] hover:shadow-[0_12px_28px_rgba(159,18,57,0.1)] hover:-translate-y-1 transition-all duration-300 border border-[#E5DAC8] hover:border-brand-maroon/30 overflow-hidden"
                >
                  {/* Subtle top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center text-brand-maroon shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <FileText className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-xl font-serif font-bold text-stone-900 group-hover:text-brand-maroon transition-colors truncate">
                      {t(parsed.cleanTitle)}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F2] text-stone-600 border border-[#E8DFD1]">
                        {b('পিডিএফ অডিট নথি', 'PDF Audit Document')}
                      </span>
                      {parsed.wing === 'Club' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <ClubCrestIcon className="w-3 h-3 text-amber-700" />
                          <span>{b('সোনালী সঙ্ঘ ক্লাব', 'Club Audit')}</span>
                        </span>
                      )}
                      {parsed.wing === 'Samiti' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <SamitiEmblemIcon className="w-3 h-3 text-emerald-700" />
                          <span>{b('উন্নয়ন সমিতি', 'Samiti Audit')}</span>
                        </span>
                      )}
                      {parsed.wing === 'Puja' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
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
          <div className="text-center py-20 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] text-stone-500">
            <h3 className="text-xl font-serif">{b('এই বিভাগের কোনো আর্থিক রিপোর্ট এখনও আপলোড করা হয়নি।', 'No financial reports uploaded for this category yet.')}</h3>
            <p className="text-stone-400 text-sm mt-1">{b('অডিট সম্পন্ন হওয়ার পর নথিপত্র প্রকাশ করা হবে।', 'Documents will be published after the audit is finalized.')}</p>
          </div>
        )}
      </section>
    </main>
  );
}

