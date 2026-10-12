'use client';
import { useState } from 'react';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { PartyPopper, Mic2, Drum, FileText, MapPin, Download, Share2, Check, Bell, AlertTriangle, ChevronRight, Megaphone, Link2 } from 'lucide-react';
import Link from 'next/link';
import YearSelector from "@/components/YearSelector";
import { triggerDownload } from "@/utils/download";
import { 
  MandapIcon, 
  SculptorIcon, 
  IlluminationIcon, 
  FestiveWaveAccent, 
  WashiTapePin, 
  BinderHoles, 
  TornDeckleEdge,
  DiyaIcon,
  ShankhaIcon,
  DurgaDeviEmblemIcon
} from '@/components/HeritageIcons';

export default function PujaSchedule() {
  const { data, settings, selectedYear } = useData();
  const { lang, b, t, toDigits, formatDate } = useLanguage();
  const [activeNoticeTab, setActiveNoticeTab] = useState('current'); // 'current' | 'all'
  const [copiedNoticeId, setCopiedNoticeId] = useState(null);
  const events = data.events.filter(e => e.year === selectedYear);

  // Puja specific notices (Limited to top 5)
  const allPujaNotices = (data.notices || []).filter(n => !n.title?.startsWith('[Club]') && !n.title?.startsWith('[Samiti]'));
  const currentPujaNotices = allPujaNotices.filter(n => n.year === selectedYear);
  const displayedPujaNotices = (activeNoticeTab === 'current' ? (currentPujaNotices.length > 0 ? currentPujaNotices : allPujaNotices) : allPujaNotices).slice(0, 5);

  const copyNotice = (notice) => {
    if (!notice) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/notifications?wing=puja&id=${encodeURIComponent(notice.id || '')}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedNoticeId(notice.id);
      setTimeout(() => setCopiedNoticeId(null), 2500);
    }
  };

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-brand-maroon selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearSelector />
      </div>

      {/* ═══ Clean Editorial Header ═══ */}
      <header className="max-w-3xl mx-auto text-center mt-10 sm:mt-12 mb-12 sm:mb-16 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight leading-tight">
          {b('শারদীয়া', 'Sharadiya')} <span className="text-brand-maroon">{b('দুর্গোৎসব', 'Durga Puja')}</span> {toDigits(selectedYear)}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-stone-600 font-light leading-relaxed">
          {b(
            'বাঁশদ্রোণী সোনালী পার্কের দুর্গাপূজার সম্পূর্ণ সূচি, থিম ভাবনা ও সান্ধ্য সাংস্কৃতিক উৎসব।',
            'Complete schedule of sacred rituals, theme concept, and evening cultural programs at Bansdroni Sonali Park.'
          )}
        </p>
      </header>

      {/* ═══ 1. THEME SHOWCASE (Heritage Notepad Pavilion) ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_8px_24px_rgba(28,13,19,0.05)] hover:shadow-[0_16px_36px_rgba(159,18,57,0.1)] rounded-3xl pt-8 pb-5 pl-10 sm:pl-14 pr-5 sm:pr-8 transition-all duration-300">
          {/* Top Pinned Textured Washi Tape */}
          <div className="absolute -top-3.5 left-7 sm:left-10 z-30 pointer-events-none">
            <WashiTapePin text={b(`শারদ থিম পরিক্রমা • ${toDigits(selectedYear)}`, `Theme of the Year • ${selectedYear}`)} variant="amber" />
          </div>

          {/* Left Perforated Spiral Binder Margin - Authentic 3D Punched Holes */}
          <div className="absolute left-2.5 sm:left-3.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none z-20">
            <BinderHoles count={5} />
          </div>

          {/* Clipped Decorative Background Elements & Deckle Edge */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            {/* Ambient Background Watermark */}
            <div className="absolute -right-8 -bottom-8 w-60 h-60 opacity-[0.03] text-stone-900">
              <svg viewBox="0 0 200 200" className="w-full h-full" fill="currentColor">
                {[...Array(6)].map((_, i) => (
                  <ellipse key={i} cx="100" cy="100" rx="40" ry="90" transform={`rotate(${i * 30} 100 100)`} />
                ))}
              </svg>
            </div>

            {/* Torn Paper Deckle Bottom Edge */}
            <div className="absolute bottom-0 inset-x-0 opacity-70">
              <TornDeckleEdge className="w-full text-stone-200 h-2 block" />
            </div>
          </div>

          {/* Content Body */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            {/* Top Header Row with Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-stone-700 border border-[#E8DFD1] font-serif shadow-2xs">
                <DurgaDeviEmblemIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-600" />
                <span>{b('শারদীয় বিশেষ ভাবনা', 'Curated Theme Concept')}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8DFD1] text-[10px] sm:text-[11px] text-stone-600 font-serif font-medium shadow-2xs">
                <DiyaIcon className="w-3 h-3 text-stone-500" />
                <span>{b('বাঁশদ্রোণী সোনালী পার্ক প্যাভিলিয়ন', 'Bansdroni Sonali Park Pavilion')}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black text-stone-900 mb-2 tracking-tight leading-tight">
              <span className="text-stone-400">&ldquo;</span>
              {lang === 'en' ? (t(settings.themeTitle) || 'Reflections of the Past, Visions of the Future') : (settings.themeTitle ? settings.themeTitle.replace(/^["'“]/, '').replace(/["'”]$/, '') : 'অতীতের আয়নায় আগামী')}
              <span className="text-stone-400">&rdquo;</span>
            </h2>
            <div className="flex justify-center my-2">
              <FestiveWaveAccent className="w-16 h-2 text-amber-500" />
            </div>
            <p className="text-stone-600 text-sm sm:text-base md:text-lg italic mb-6 sm:mb-8 font-serif leading-relaxed">
              ({lang === 'en' ? (t(settings.themeSubtitle) || 'Reflections of the Past, Visions of the Future') : (settings.themeSubtitle || 'অতীতের ঐতিহ্যে আগামী দিনের স্বপ্ন')})
            </p>

            {/* Artist Squircles with Handcrafted Vector Motifs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-stone-200/80 pt-6 sm:pt-8 text-left">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E8DFD1] hover:border-amber-400/70 shadow-2xs transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 shadow-2xs text-amber-700">
                  <MandapIcon className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-600 font-bold font-serif">{b('মণ্ডপ শিল্পী', 'Pandal Artist')}</span>
                  <span className="font-serif font-black text-sm text-stone-900">{lang === 'en' ? (t(settings.pandalArtist) || 'Shilpa Niketan') : (settings.pandalArtist || 'শিল্প নিকেতন')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E8DFD1] hover:border-amber-400/70 shadow-2xs transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 shadow-2xs text-amber-700">
                  <SculptorIcon className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-600 font-bold font-serif">{b('প্রতিমা শিল্পী', 'Idol Sculptor')}</span>
                  <span className="font-serif font-black text-sm text-stone-900">{lang === 'en' ? (t(settings.idolArtist) || 'Sanatan Rudra Paul') : (settings.idolArtist || 'সনাতন রুদ্র পাল')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E8DFD1] hover:border-amber-400/70 shadow-2xs transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 shadow-2xs text-amber-700">
                  <IlluminationIcon className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-600 font-bold font-serif">{b('আলোকসজ্জা', 'Illumination')}</span>
                  <span className="font-serif font-black text-sm text-stone-900">{lang === 'en' ? (t(settings.lightingArtist) || 'Das Electric') : (settings.lightingArtist || 'দাস ইলেকট্রিক')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. RITUALS TIMELINE (Bento Timeline Cards) ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-2 text-rose-800 font-serif text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em]">
              <span className="w-4 h-0.5 bg-rose-700/70 rounded-full" />
              <span>{b('পঞ্চমী থেকে বিজয়া দশমী', 'Mahapanchami to Bijoya Dashami')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              {b('পূজার নির্ঘণ্ট ও', 'Sacred Rituals &')} <span className="text-brand-maroon">{b('পবিত্র সূচি', 'Timetable')}</span>
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {b('প্রতিদিনের পূজার নির্ঘণ্ট, অঞ্জলির সময় ও সান্ধ্য আরতির সময়সূচি', 'Daily rituals, puja timings, and pushpanjali schedule')}
            </p>
          </div>
          <Link
            href="?viewPdf=/docs/sample-puja-programme-2026.pdf&pdfTitle=Puja%20Detailed%20Timetable"
            scroll={false}
            className="btn-tactile-parchment inline-flex items-center justify-between sm:justify-center gap-3 py-2.5 sm:py-3 pl-5 pr-3 rounded-full text-stone-900 hover:text-brand-maroon font-bold text-xs sm:text-sm transition-all duration-200 group/btn shadow-md w-full sm:w-auto"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-maroon" />
              <span>{b('সম্পূর্ণ নির্ঘণ্ট PDF', 'Full Timetable PDF')}</span>
            </span>
            <span className="w-6 h-6 rounded-full bg-brand-maroon/10 group-hover/btn:bg-brand-maroon text-brand-maroon group-hover/btn:text-white flex items-center justify-center text-xs font-bold transition-colors">
              →
            </span>
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="space-y-4 sm:space-y-6 pt-2">
            {events.map((event, i) => {
              const eventDate = new Date(event.date + (event.date.includes('T') ? '' : 'T00:00:00'));
              // Clean ceremony title: strip redundant day prefix like "মহাষষ্ঠী —"
              const cleanTitle = (event.title || '').replace(/^[^—–-]+[—–-]\s*/, '').trim() || event.title;

              return (
                <div
                  key={i}
                  className="group relative bg-[#FFFDF9] rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-[#E5DAC8] overflow-hidden"
                >
                  {/* Top Fine Gold Highlight Line */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Header: Date + Festival Day Counter + Clean Ceremony Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-2.5 border-b border-[#E8DFD1]/80">
                    <div className="flex items-center gap-3">
                      {/* Compact Date Badge */}
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-amber-50/60 border border-[#E5DAC8] flex flex-col items-center justify-center text-stone-900 group-hover:border-brand-maroon group-hover:bg-brand-maroon group-hover:text-white transition-all shrink-0 shadow-2xs">
                        <span className="text-lg sm:text-xl font-serif font-black leading-none tabular-nums">{toDigits(eventDate.getDate())}</span>
                        <span className="text-[9px] font-serif font-bold uppercase tracking-wider mt-0.5 opacity-80">
                          {eventDate.toLocaleString(lang === 'bn' ? 'bn-IN' : 'en-US', { month: 'short' })}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-brand-maroon border border-rose-500/20">
                            {b('দিন', 'Day')} {toDigits(i + 1)}
                          </span>
                          <span className="text-xs text-stone-500 font-serif font-medium">
                            {eventDate.toLocaleDateString(lang === 'bn' ? 'bn-IN' : 'en-US', { weekday: 'long' })}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-stone-900 group-hover:text-brand-maroon transition-colors leading-tight">
                          {t(cleanTitle)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Structured Chronological Timeline Nodes (Zero Wasted Space) */}
                  {event.text && (
                    <div className="relative pl-4 sm:pl-5 border-l-2 border-amber-400/40 space-y-2 ml-1.5 sm:ml-2 my-2">
                      {event.text
                        .split(/[।.]/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((step, sIdx) => {
                          const timeMatch = step.match(/^([^\s]+(?:\s+[^\s]+)?\s*টায়|[^\s]+(?:\s+[^\s]+)?\s*থেকে)/);
                          const timeBadge = timeMatch ? timeMatch[0] : null;
                          const ritualText = timeMatch ? step.slice(timeMatch[0].length).trim() : step;
                          
                          // Convert Bengali time badge to English format (e.g. "সকাল ৮:০০ টায়" -> "8:00 AM")
                          const formattedTime = timeBadge && lang === 'en'
                            ? (timeBadge.includes('থেকে') 
                                ? `${toDigits(timeBadge.replace(/[^০-৯0-9:]/g, ''), 'en')} onwards`
                                : `${toDigits(timeBadge.replace(/[^০-৯0-9:]/g, ''), 'en')} ${timeBadge.includes('রাত') || timeBadge.includes('সন্ধ্যা') || timeBadge.includes('দুপুর') || timeBadge.includes('বিকেল') ? 'PM' : 'AM'}`)
                            : timeBadge;

                          return (
                            <div key={sIdx} className="relative group/step">
                              {/* Glowing Timeline Node Dot */}
                              <div className="absolute -left-[21px] sm:-left-[25px] top-2 w-2 h-2 rounded-full bg-brand-maroon ring-4 ring-[#FFFDF9]" />

                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5 bg-[#FAF7F2] p-2 sm:p-2.5 rounded-xl border border-[#E8DFD1]/60 hover:border-amber-400/50 transition-colors">
                                {formattedTime && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-serif font-bold text-brand-maroon bg-white px-2 py-0.5 rounded-md border border-[#E8DFD1]/70 shrink-0 w-max shadow-2xs">
                                    🕒 {formattedTime}
                                  </span>
                                )}
                                <span className="text-xs sm:text-[13px] text-stone-800 font-serif leading-relaxed">
                                  {t(ritualText)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Subtle Perforated Bottom Deckle Edge */}
                  <div className="pt-2 -mx-4 sm:-mx-6 -mb-4 opacity-50">
                    <TornDeckleEdge className="w-full text-stone-200 h-1 block" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] text-stone-500">
            {b('এই বছরের পুজোর সূচি এখনও প্রকাশ করা হয়নি।', 'Puja schedule for this year will be announced soon.')}
          </div>
        )}
      </section>

      {/* ═══ 3. EVENING CULTURAL ROSTER (3-Column Tactile Cards) ═══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {b('সন্ধ্যার সাংস্কৃতিক', 'Sharadiya Cultural')} <span className="text-brand-maroon">{b('মহোৎসব', 'Extravaganza')}</span>
          </h2>
          <p className="text-stone-500 text-xs sm:text-base mt-2">
            {b(
              'প্রতি সন্ধ্যায় বিশিষ্ট অতিথি শিল্পী ও পাড়ার সদস্যদের মনোজ্ঞ সাংস্কৃতিক নিবেদন',
              'Special performances by distinguished guest artists and talented neighborhood members every evening.'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <div className="group relative bg-[#FFFDF9] rounded-3xl pt-8 pb-5 pl-7 sm:pl-9 pr-5 sm:pr-7 shadow-[0_6px_20px_rgba(28,13,19,0.04)] hover:shadow-[0_16px_32px_rgba(159,18,57,0.1)] hover:-translate-y-1.5 transition-all duration-300 border border-[#E5DAC8] flex flex-col justify-between">
            {/* Top Pinned Washi Tape */}
            <div className="absolute -top-3.5 left-6 sm:left-8 z-20">
              <WashiTapePin text={b('মহাসপ্তমী • ২০২৬', 'Maha Saptami')} variant="rose" />
            </div>
            {/* Left Binder Holes */}
            <div className="absolute left-2 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
              <BinderHoles count={3} />
            </div>

            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <PartyPopper className="text-rose-600 w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-1 leading-snug group-hover:text-brand-maroon transition-colors">
                {b('পাড়ার ছোটদের অনুষ্ঠান', 'Children Cultural Evening')}
              </h3>
              <div className="mb-2.5">
                <FestiveWaveAccent className="w-12 h-1.5 text-rose-500/70" />
              </div>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {b('আবৃত্তি, নাচ ও গান পরিবেশন করবে আমাদের ক্লাবের কচিকাঁচারা।', 'Recitation, song and dance performances by the young children of our neighborhood.')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8DFD1] text-xs font-semibold text-rose-700 flex items-center justify-between">
              <span>{b('সন্ধ্যা ৭:০০ টা থেকে', 'From 7:00 PM onwards')}</span>
              <span className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-700 group-hover:bg-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </div>
          </div>

          <div className="group relative bg-[#FFFDF9] rounded-3xl pt-8 pb-5 pl-7 sm:pl-9 pr-5 sm:pr-7 shadow-[0_6px_20px_rgba(28,13,19,0.04)] hover:shadow-[0_16px_32px_rgba(159,18,57,0.1)] hover:-translate-y-1.5 transition-all duration-300 border border-[#E5DAC8] flex flex-col justify-between">
            {/* Top Pinned Washi Tape */}
            <div className="absolute -top-3.5 left-6 sm:left-8 z-20">
              <WashiTapePin text={b('মহাষ্টমী • ২০২৬', 'Maha Ashtami')} variant="amber" />
            </div>
            {/* Left Binder Holes */}
            <div className="absolute left-2 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
              <BinderHoles count={3} />
            </div>

            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Mic2 className="text-brand-maroon w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-1 leading-snug group-hover:text-brand-maroon transition-colors">
                {b('বিশেষ অতিথি শিল্পী', 'Celebrity Guest Artiste')}
              </h3>
              <div className="mb-2.5">
                <FestiveWaveAccent className="w-12 h-1.5 text-amber-500/80" />
              </div>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {b('কলকাতা থেকে আগত জনপ্রিয় সঙ্গীতশিল্পীর একক সঙ্গীতানুষ্ঠান।', 'Musical night and vocal performance by celebrated guest artistes from Kolkata.')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8DFD1] text-xs font-semibold text-brand-maroon flex items-center justify-between">
              <span>{b('সন্ধ্যা ৭:৩০ টা থেকে', 'From 7:30 PM onwards')}</span>
              <span className="w-6 h-6 rounded-full bg-brand-maroon/10 text-brand-maroon group-hover:bg-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </div>
          </div>

          <div className="group relative bg-[#FFFDF9] rounded-3xl pt-8 pb-5 pl-7 sm:pl-9 pr-5 sm:pr-7 shadow-[0_6px_20px_rgba(28,13,19,0.04)] hover:shadow-[0_16px_32px_rgba(159,18,57,0.1)] hover:-translate-y-1.5 transition-all duration-300 border border-[#E5DAC8] flex flex-col justify-between">
            {/* Top Pinned Washi Tape */}
            <div className="absolute -top-3.5 left-6 sm:left-8 z-20">
              <WashiTapePin text={b('মহানবমী • ২০২৬', 'Maha Navami')} variant="rose" />
            </div>
            {/* Left Binder Holes */}
            <div className="absolute left-2 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
              <BinderHoles count={3} />
            </div>

            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Drum className="text-brand-maroon w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-1 leading-snug group-hover:text-brand-maroon transition-colors">
                {b('শ্রুতিনাটক ও ধুনুচি নাচ', 'Audio Drama & Dhunuchi Dance')}
              </h3>
              <div className="mb-2.5">
                <FestiveWaveAccent className="w-12 h-1.5 text-amber-500/80" />
              </div>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {b(
                  'ক্লাব সদস্যদের পরিবেশনায় শ্রুতিনাটক এবং শেষে ঢাকের তালে বিশাল ধুনুচি নাচের প্রতিযোগিতা।',
                  'Audio drama by club members followed by the grand traditional Dhunuchi dance competition.'
                )}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8DFD1] text-xs font-semibold text-brand-maroon flex items-center justify-between">
              <span>{b('সন্ধ্যা ৮:০০ টা থেকে', 'From 8:00 PM onwards')}</span>
              <span className="w-6 h-6 rounded-full bg-brand-maroon/10 text-brand-maroon group-hover:bg-brand-maroon group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. PUJA BULLETINS & NOTICES (Dedicated Section) ═══ */}
      <section id="puja-notices" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-24 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-2 text-rose-800 font-serif text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em]">
              <span className="w-4 h-0.5 bg-rose-700/70 rounded-full" />
              <span>{b('মণ্ডপ ও ভক্ত নির্দেশিকা', 'Pavilion & Resident Advisory')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              {b('পূজা বুলেটিন ও', 'Festival Circulars &')} <span className="text-brand-maroon">{b('বিজ্ঞপ্তি সার্কুলার', 'Bulletins')}</span>
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {b('মা দুর্গার আগমনী উৎসবের সমস্ত আনুষ্ঠানিক বিজ্ঞপ্তি, ভোগ কুপন, অঞ্জলি নির্ঘণ্ট ও নিয়মাবলী', 'Official circulars, bhog coupons, and guidelines approved by the Puja Committee')}
            </p>
          </div>

          {/* Past / Current Archive Tabs & Full Directory Link */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveNoticeTab('current')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeNoticeTab === 'current'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50'
              }`}
            >
              {b('বর্তমান বছর', 'Current Year')} ({toDigits(selectedYear, lang)})
            </button>
            <button
              type="button"
              onClick={() => setActiveNoticeTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeNoticeTab === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50'
              }`}
            >
              {b('সকল আর্কাইভ', 'All Archive')} ({toDigits(allPujaNotices.length, lang)})
            </button>
            <Link
              href="/notifications?wing=puja"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-2xs"
            >
              <span>{b('সম্পূর্ণ তালিকা', 'Full List')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {displayedPujaNotices.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 pt-2">
            {displayedPujaNotices.map((notice, i) => {
              const noticePdf = notice.pdfUrl || '/docs/sample-puja-notice-2026.pdf';
              const cleanTitle = notice.title?.replace(/^\[Puja\]\s*/, '') || '';
              const isCopied = copiedNoticeId === notice.id;

              return (
                <div
                  key={notice.id || i}
                  className="group relative bg-[#FFFDF9] border border-[#E5DAC8] shadow-[0_8px_24px_rgba(28,13,19,0.05)] hover:shadow-[0_16px_36px_rgba(159,18,57,0.1)] rounded-3xl pt-8 pb-5 pl-10 sm:pl-13 pr-6 sm:pr-8 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  {/* Top Pinned Washi Tape */}
                  <div className="absolute -top-3.5 left-8 sm:left-10 z-20 pointer-events-none">
                    <WashiTapePin
                      text={b(`শারদীয়া সার্কুলার • ${toDigits(notice.year, lang)}`, `Puja Circular • ${notice.year}`)}
                      variant="rose"
                    />
                  </div>

                  {/* Left 3D Punched Binder Margin */}
                  <div className="absolute left-2.5 sm:left-3.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none z-10">
                    <BinderHoles count={5} />
                  </div>

                  <div>
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <DurgaDeviEmblemIcon className="w-3 h-3 text-rose-700" />
                          <span>{b('শারদীয়া দুর্গোৎসব', 'Durga Puja')}</span>
                        </span>
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
                    <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-stone-900 leading-snug mb-2">
                      {t(cleanTitle)}
                    </h3>

                    {/* Festive Wave */}
                    <div className="mb-3">
                      <FestiveWaveAccent className="w-12 h-1.5 text-rose-500" />
                    </div>

                    {/* Body Text */}
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans whitespace-pre-line mb-5">
                      {t(notice.text)}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div>
                    <div className="pt-3.5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2.5">
                      {/* Direct PDF View Button (Only if notice.pdfUrl exists) */}
                      {notice.pdfUrl ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`?viewPdf=${encodeURIComponent(notice.pdfUrl)}&pdfTitle=${encodeURIComponent(cleanTitle)}`}
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
                            onClick={() => triggerDownload(notice.pdfUrl, `${cleanTitle || 'puja-notice'}.pdf`)}
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

                      {/* Link Copy Button */}
                      <button
                        type="button"
                        onClick={() => copyNotice(notice)}
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
          <div className="text-center py-12 bg-[#FFFDF9] rounded-2xl border border-[#E5DAC8] p-6 max-w-md mx-auto">
            <span className="text-3xl block mb-2">📜</span>
            <p className="text-sm font-semibold text-stone-700">{b('এই বছরের জন্য কোনো নতুন বিজ্ঞপ্তি নেই।', 'No official circulars published for this year yet.')}</p>
          </div>
        )}
      </section>

      {/* ═══ 5. HOW TO REACH (Transit Card) ═══ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 pt-4">
        <div className="group relative bg-[#FFFDF9] rounded-3xl p-6 sm:p-9 md:p-11 flex flex-col sm:flex-row gap-5 sm:gap-7 items-center shadow-[0_6px_20px_rgba(28,13,19,0.04)] hover:shadow-[0_16px_32px_rgba(159,18,57,0.08)] transition-all duration-300 border border-[#E5DAC8]">
          <div className="absolute -top-3.5 left-7 sm:left-10 z-20">
            <WashiTapePin text={b('পথনির্দেশিকা • রুট ম্যাপ', 'Directions & Transit')} variant="blue" />
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center text-brand-maroon text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <MapPin className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-1.5">
              {b('কীভাবে', 'How to')} <span className="text-brand-maroon">{b('আসবেন?', 'Reach?')}</span>
            </h2>
            <div className="mb-3">
              <FestiveWaveAccent className="w-12 h-1.5 text-stone-400" />
            </div>
            <div className="space-y-1.5 text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              <p>
                <strong className="text-stone-900 font-bold">{b('মণ্ডপের ঠিকানা:', 'Pandal Address:')}</strong>{' '}
                {b('বি/১৩৭, সোনালী পার্ক, বাঁশদ্রোণী, কলকাতা - ৭০', 'B/137, Sonali Park, Bansdroni, Kolkata - 700070')}
              </p>
              <p>
                <strong className="text-stone-900 font-bold">{b('মেট্রো:', 'Metro:')}</strong>{' '}
                {b('মাস্টারদা সূর্য সেন (বাঁশদ্রোণী) মেট্রো স্টেশন থেকে ৫ মিনিটের হাঁটা পথ বা রিকশা।', '5 minutes by walking or rickshaw from Masterda Surya Sen (Bansdroni) Metro Station.')}
              </p>
              <p>
                <strong className="text-stone-900 font-bold">{b('বাস / অটো:', 'Bus / Auto:')}</strong>{' '}
                {b('বাঁশদ্রোণী বাস স্টপেজ থেকে সোনালী পার্কের দিকে সোজা রাস্তা।', 'Straight route towards Sonali Park from Bansdroni Bus Stop.')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
