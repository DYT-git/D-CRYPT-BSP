'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Megaphone,
  FileText,
  Download,
  Share2,
  Check,
  Search,
  Calendar,
  ChevronRight,
  Filter,
  AlertTriangle,
  ArrowLeft,
  X,
  ExternalLink
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { triggerDownload } from '@/utils/download';
import {
  WashiTapePin,
  BinderHoles,
  TornDeckleEdge,
  DurgaDeviEmblemIcon,
  ClubCrestIcon,
  SamitiEmblemIcon,
  FestiveWaveAccent,
  PanjikaSealBadge
} from '@/components/HeritageIcons';

function detectWing(title = '') {
  if (!title) return 'Puja';
  if (typeof title === 'string') {
    if (title.startsWith('[Club]')) return 'Club';
    if (title.startsWith('[Samiti]') || title.startsWith('[Samity]')) return 'Samiti';
    if (title.startsWith('[Puja]')) return 'Puja';
    if (title.trim().startsWith('{')) {
      try {
        const p = JSON.parse(title.trim());
        const candidate = p.bn || p.en || '';
        if (candidate.startsWith('[Club]')) return 'Club';
        if (candidate.startsWith('[Samiti]') || candidate.startsWith('[Samity]')) return 'Samiti';
        if (candidate.startsWith('[Puja]')) return 'Puja';
      } catch {}
    }
  }
  return 'Puja';
}

function cleanNoticeTitle(title = '') {
  if (!title) return '';
  return String(title).replace(/^\[(Club|Samiti|Samity|Puja)\]\s*/i, '').trim();
}

function NotificationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, selectedYear } = useData();
  const { lang, b, t, toDigits, formatDate } = useLanguage();

  // Read initial wing from URL (?wing=puja, ?wing=club, ?wing=samiti, ?wing=samity)
  const initialWingParam = searchParams.get('wing')?.toUpperCase();
  const initialWing =
    initialWingParam === 'CLUB'
      ? 'Club'
      : (initialWingParam === 'SAMITI' || initialWingParam === 'SAMITY')
      ? 'Samiti'
      : 'Puja';

  const [activeWing, setActiveWing] = useState(initialWing);
  const [selectedYearFilter, setSelectedYearFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [onlyWithPdf, setOnlyWithPdf] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const targetIdParam = searchParams.get('id');
  const [highlightedId, setHighlightedId] = useState(targetIdParam || null);

  // Sync state if URL searchParams changes
  useEffect(() => {
    if (initialWingParam === 'PUJA') setActiveWing('Puja');
    else if (initialWingParam === 'CLUB') setActiveWing('Club');
    else if (initialWingParam === 'SAMITI' || initialWingParam === 'SAMITY') setActiveWing('Samiti');
  }, [initialWingParam]);

  // Deep-link auto-scroll and highlight target notice card
  useEffect(() => {
    if (targetIdParam) {
      setHighlightedId(targetIdParam);
      const timer = setTimeout(() => {
        const el = document.getElementById(`notice-${targetIdParam}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      const fadeTimer = setTimeout(() => setHighlightedId(null), 3500);
      return () => {
        clearTimeout(timer);
        clearTimeout(fadeTimer);
      };
    }
  }, [targetIdParam]);

  const allNotices = useMemo(() => {
    return (data.notices || []).map((notice) => {
      const wing = detectWing(notice.title);
      const cleanTitle = cleanNoticeTitle(notice.title);
      return {
        ...notice,
        wing,
        cleanTitle,
        hasPdf: Boolean(notice.pdfUrl)
      };
    });
  }, [data.notices]);

  // Available years from notices
  const availableYears = useMemo(() => {
    const years = new Set(allNotices.map((n) => n.year).filter(Boolean));
    years.add(2026);
    years.add(2025);
    return Array.from(years).sort((a, b) => b - a);
  }, [allNotices]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: allNotices.length,
      puja: allNotices.filter((n) => n.wing === 'Puja').length,
      club: allNotices.filter((n) => n.wing === 'Club').length,
      samiti: allNotices.filter((n) => n.wing === 'Samiti').length
    };
  }, [allNotices]);

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return allNotices.filter((n) => {
      // 1. Wing filter (strictly by selected wing)
      if (n.wing !== activeWing) return false;

      // 2. Year filter
      if (selectedYearFilter !== 'ALL' && String(n.year) !== String(selectedYearFilter)) return false;

      // 3. Urgent filter
      if (onlyUrgent && !n.isUrgent) return false;

      // 4. PDF filter
      if (onlyWithPdf && !n.hasPdf) return false;

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (n.cleanTitle || '').toLowerCase().includes(q);
        const textMatch = (n.text || '').toLowerCase().includes(q);
        if (!titleMatch && !textMatch) return false;
      }

      return true;
    });
  }, [allNotices, activeWing, selectedYearFilter, onlyUrgent, onlyWithPdf, searchQuery]);

  const copyNotice = (notice) => {
    const shareText = `📌 [${notice.wing}] ${notice.cleanTitle}\n📅 ${notice.date}\n\n${notice.text}\n\n— বাঁশদ্রোণী সোনালী পার্ক পোর্টাল`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(notice.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const getWashiText = (notice) => {
    if (notice.wing === 'Club') {
      return b(`ক্লাব সার্কুলার • ২০২৬`, `Club Circular • 2026`);
    }
    if (notice.wing === 'Samiti') {
      return b(`নাগরিক বিজ্ঞপ্তি • ২০২৬`, `Civic Notice • 2026`);
    }
    return b(`পূজা বুলেটিন • ২০২৬`, `Puja Circular • 2026`);
  };

  const getWashiVariant = (notice) => {
    if (notice.wing === 'Club') return 'amber';
    if (notice.wing === 'Samiti') return 'emerald';
    return 'rose';
  };

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-brand-maroon selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-brand-maroon transition-colors py-1.5 px-3 rounded-full bg-white/80 border border-stone-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{b('হোমপেজে ফিরে যান', 'Back to Homepage')}</span>
          </Link>
        </div>

        {/* ═══ Header Section ═══ */}
        <header className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 px-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon" />
            <span>{b('পাড়ার বার্তা', 'Notice Board')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight leading-snug">
            {b('আনুষ্ঠানিক সার্কুলার ও', 'Official Circulars &')} <span className="text-brand-maroon">{b('বিজ্ঞপ্তি কেন্দ্র', 'Notice Center')}</span>
          </h1>
        </header>

        {/* ═══ UPPER PILLAR SELECTOR (3 Wings: Puja, Club, Samiti) ═══ */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap px-2">
          <button
            onClick={() => setActiveWing('Puja')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWing === 'Puja'
                ? 'bg-rose-700 text-white shadow-md scale-105'
                : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <DurgaDeviEmblemIcon className={`w-3.5 h-3.5 ${activeWing === 'Puja' ? 'text-white' : 'text-rose-700'}`} />
            <span>{b('শারদীয়া দুর্গোৎসব', 'Durga Puja')}</span>
            <span className={`text-[11px] font-mono ml-1 px-1.5 py-0.2 rounded-full ${
              activeWing === 'Puja' ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-700'
            }`}>
              {toDigits(counts.puja, lang)}
            </span>
          </button>

          <button
            onClick={() => setActiveWing('Club')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWing === 'Club'
                ? 'bg-amber-600 text-white shadow-md scale-105'
                : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <ClubCrestIcon className={`w-3.5 h-3.5 ${activeWing === 'Club' ? 'text-white' : 'text-amber-600'}`} />
            <span>{b('সোনালী সঙ্ঘ ক্লাব', 'Sonali Club')}</span>
            <span className={`text-[11px] font-mono ml-1 px-1.5 py-0.2 rounded-full ${
              activeWing === 'Club' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'
            }`}>
              {toDigits(counts.club, lang)}
            </span>
          </button>

          <button
            onClick={() => setActiveWing('Samiti')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeWing === 'Samiti'
                ? 'bg-emerald-700 text-white shadow-md scale-105'
                : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <SamitiEmblemIcon className={`w-3.5 h-3.5 ${activeWing === 'Samiti' ? 'text-white' : 'text-emerald-700'}`} />
            <span>{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
            <span className={`text-[11px] font-mono ml-1 px-1.5 py-0.2 rounded-full ${
              activeWing === 'Samiti' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
            }`}>
              {toDigits(counts.samiti, lang)}
            </span>
          </button>
        </div>

        {/* ═══ FILTER & SEARCH DOCK ═══ */}
        <div className="max-w-4xl mx-auto mb-8 bg-[#FFFDF9] border border-[#E5DAC8] rounded-2xl p-3 sm:p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={b('নোটিশের শিরোনাম বা বিষয়বস্তু খুঁজুন...', 'Search notice title or contents...')}
                className="w-full bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-brand-maroon transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Year Selector & Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Year Dropdown */}
              <div className="relative">
                <select
                  value={selectedYearFilter}
                  onChange={(e) => setSelectedYearFilter(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#E5DAC8] rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:border-brand-maroon cursor-pointer shadow-2xs"
                >
                  <option value="ALL">{b('সকল বছর (All Years)', 'All Years')}</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {toDigits(y, lang)} {b('সাল', '')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Only Urgent Toggle */}
              <button
                type="button"
                onClick={() => setOnlyUrgent(!onlyUrgent)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 shadow-2xs ${
                  onlyUrgent
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-[#FAF7F2] border-[#E5DAC8] text-stone-600 hover:text-stone-900'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>{b('শুধু জরুরি', 'Urgent Only')}</span>
              </button>

              {/* Only With PDF Toggle */}
              <button
                type="button"
                onClick={() => setOnlyWithPdf(!onlyWithPdf)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 shadow-2xs ${
                  onlyWithPdf
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-[#FAF7F2] border-[#E5DAC8] text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>{b('পিডিএফ সহ', 'With PDF')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══ NOTICE CARDS DIRECTORY ═══ */}
        {filteredNotices.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto pt-2">
            {filteredNotices.map((notice, idx) => {
              const isCopied = copiedId === notice.id;

              return (
                <div
                  key={notice.id || idx}
                  id={`notice-${notice.id}`}
                  className={`group relative bg-[#FFFDF9] border shadow-[0_8px_24px_rgba(28,13,19,0.05)] hover:shadow-[0_16px_36px_rgba(159,18,57,0.1)] rounded-3xl pt-8 pb-5 pl-10 sm:pl-13 pr-6 sm:pr-8 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between scroll-mt-28 ${
                    String(highlightedId) === String(notice.id)
                      ? 'border-brand-maroon ring-2 ring-brand-maroon/30 shadow-[0_12px_32px_rgba(159,18,57,0.18)] bg-amber-50/20'
                      : 'border-[#E5DAC8]'
                  }`}
                >
                  {/* Top Pinned Washi Tape */}
                  <div className="absolute -top-3.5 left-8 sm:left-10 z-20 pointer-events-none">
                    <WashiTapePin text={getWashiText(notice)} variant={getWashiVariant(notice)} />
                  </div>

                  {/* Left 3D Punched Binder Margin */}
                  <div className="absolute left-2.5 sm:left-3.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none z-10">
                    <BinderHoles count={5} />
                  </div>

                  <div>
                    {/* Header Badges Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Wing Tag */}
                        {notice.wing === 'Club' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <ClubCrestIcon className="w-3 h-3 text-amber-700" />
                            <span>{b('সোনালী সঙ্ঘ', 'Sonali Club')}</span>
                          </span>
                        )}
                        {notice.wing === 'Samiti' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <SamitiEmblemIcon className="w-3 h-3 text-emerald-700" />
                            <span>{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
                          </span>
                        )}
                        {notice.wing === 'Puja' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            <DurgaDeviEmblemIcon className="w-3 h-3 text-rose-700" />
                            <span>{b('শারদীয়া দুর্গোৎসব', 'Durga Puja')}</span>
                          </span>
                        )}

                        {notice.isUrgent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-300">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-700" />
                            <span>{b('জরুরি', 'Urgent')}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/80">
                          📅 {formatDate(notice.date, lang)}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-full">
                          {toDigits(notice.year, lang)}
                        </span>
                      </div>
                    </div>

                    {/* Notice Heading */}
                    <h2 className="text-base sm:text-lg md:text-xl font-serif font-bold text-stone-900 leading-snug mb-2">
                      {t(notice.cleanTitle)}
                    </h2>

                    {/* Wave Accent */}
                    <div className="mb-3">
                      <FestiveWaveAccent
                        className={`w-12 h-1.5 ${
                          notice.wing === 'Club'
                            ? 'text-amber-500'
                            : notice.wing === 'Samiti'
                            ? 'text-emerald-500'
                            : 'text-rose-500'
                        }`}
                      />
                    </div>

                    {/* Notice Body */}
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans whitespace-pre-line mb-5">
                      {t(notice.text)}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div>
                    <div className="pt-3.5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2.5">
                      {/* Direct PDF View Button (Shown if PDF is attached) */}
                      {notice.pdfUrl ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`?viewPdf=${encodeURIComponent(notice.pdfUrl)}&pdfTitle=${encodeURIComponent(notice.cleanTitle)}`}
                            scroll={false}
                            className="btn-tactile-crimson inline-flex items-center gap-1.5 py-2 px-3.5 rounded-full text-white font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer group/btn"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-200" />
                            <span>{b('পিডিএফ দেখুন', 'View PDF')}</span>
                            <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold group-hover/btn:bg-white group-hover/btn:text-brand-maroon transition-colors">
                              →
                            </span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => triggerDownload(notice.pdfUrl, `${notice.cleanTitle || 'circular'}.pdf`)}
                            className="btn-tactile-parchment inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-stone-700 hover:text-brand-maroon text-xs font-semibold border border-[#E5DAC8] shadow-2xs transition-all cursor-pointer"
                            title={b('পিডিএফ ডাউনলোড করুন', 'Download PDF')}
                          >
                            <Download className="w-3.5 h-3.5 text-stone-600 group-hover:text-brand-maroon" />
                            <span>{b('ডাউনলোড', 'Download')}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-stone-100 text-stone-500 text-xs font-medium border border-stone-200/80">
                          <FileText className="w-3.5 h-3.5 text-stone-400" />
                          <span>{b('অফিসিয়াল বার্তা', 'Official Notice')}</span>
                        </div>
                      )}

                      {/* Share / Copy Button */}
                      <button
                        type="button"
                        onClick={() => copyNotice(notice)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                        title={b('নোটিশ কপি করুন', 'Copy Notice')}
                      >
                        {isCopied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                        <span>{isCopied ? b('কপি হয়েছে!', 'Copied!') : b('শেয়ার', 'Share')}</span>
                      </button>
                    </div>

                    {/* Torn Bottom Deckle Edge */}
                    <div className="-mx-4 -mb-3 pt-3 opacity-80">
                      <TornDeckleEdge className="w-full text-stone-200/90 h-2 block" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-16 px-4 bg-[#FFFDF9] rounded-3xl border border-[#E5DAC8] shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center text-2xl mx-auto mb-3 shadow-2xs">
              📜
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-1">
              {onlyWithPdf
                ? b('কোনো সংযুক্ত PDF সার্কুলার নেই', 'No Attached PDF Circulars')
                : b('কোনো বিজ্ঞপ্তি পাওয়া যায়নি', 'No Notices Found')}
            </h3>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              {onlyWithPdf
                ? b('নতুন সার্কুলার আপলোড হলে এখানে পাওয়া যাবে।', 'New circulars will be updated here once uploaded.')
                : b('নতুন বিজ্ঞপ্তি প্রকাশিত হলে এখানে আপডেট করা হবে।', 'New official notices will be published here once released.')}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveWing('ALL');
                setSelectedYearFilter('ALL');
                setSearchQuery('');
                setOnlyUrgent(false);
                setOnlyWithPdf(false);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-maroon text-white text-xs font-bold hover:bg-[#881337] transition-all shadow-xs cursor-pointer"
            >
              <span>{b('সমস্ত ফিল্টার রিসেট করুন', 'Reset All Filters')}</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] pt-32 text-center text-stone-500 text-sm">Loading notices...</div>}>
      <NotificationsContent />
    </Suspense>
  );
}
