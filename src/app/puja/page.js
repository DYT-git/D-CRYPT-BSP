'use client';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { PartyPopper, Mic2, Drum, FileText, MapPin } from 'lucide-react';
import Link from 'next/link';
import YearSelector from "@/components/YearSelector";
import { 
  MandapIcon, 
  SculptorIcon, 
  IlluminationIcon, 
  FestiveWaveAccent, 
  WashiTapePin, 
  BinderHoles, 
  TornDeckleEdge,
  DiyaIcon,
  ShankhaIcon
} from '@/components/HeritageIcons';

export default function PujaSchedule() {
  const { data, settings, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();
  const events = data.events.filter(e => e.year === selectedYear);

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-brand-maroon selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearSelector />
      </div>

      {/* ═══ Symmetrical 3-Tier Header ═══ */}
      <header className="max-w-3xl mx-auto text-center mt-10 sm:mt-12 mb-12 sm:mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon animate-pulse" />
          {b('শারদীয়া দুর্গাপূজা নির্দেশিকা', 'Festival Guide')} • {toDigits(selectedYear)}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight leading-tight">
          {b('শারদীয়া', 'Sharadiya')} <span className="text-brand-maroon">{b('দুর্গোৎসব', 'Durga Puja')}</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-stone-600 font-light leading-relaxed">
          {b(
            'বাঁশদ্রোণী সোনালী পার্কের দুর্গাপূজার সম্পূর্ণ সূচি, থিম ভাবনা ও সান্ধ্য সাংস্কৃতিক উৎসব।',
            'Complete schedule of sacred rituals, theme concept, and evening cultural programs at Bansdroni Sonali Park.'
          )}
        </p>
      </header>

      {/* ═══ 1. THEME SHOWCASE (Bento Card with Authentic Ruby Depth) ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-maroon via-[#A01135] to-[#7D0925] text-white p-5 sm:p-8 md:p-12 shadow-2xl border border-white/15 transition-all duration-300">
          {/* Ambient Background Geometry */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <svg viewBox="0 0 400 200" className="w-full h-full" fill="white">
              {[...Array(8)].map((_, i) => (
                <ellipse key={i} cx={i * 60 - 10} cy="100" rx="25" ry="80" opacity="0.5" transform={`rotate(${i * 22} ${i * 60 - 10} 100)`} />
              ))}
            </svg>
          </div>
          {/* Top Subtle Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-4">
              <DiyaIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>{b('শারদ থিম', 'Theme of the Year')} {toDigits(selectedYear)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-2 tracking-tight leading-tight">
              &ldquo;{settings.themeTitle || b('অতীতের আয়নায় আগামী', 'Reflections of the Past, Visions of the Future')}&rdquo;
            </h2>
            <div className="flex justify-center my-2">
              <FestiveWaveAccent className="w-16 h-2 text-amber-300/80" />
            </div>
            <p className="text-rose-100/90 text-sm sm:text-base md:text-lg italic mb-6 sm:mb-8 font-light">
              ({settings.themeSubtitle || b('অতীতের ঐতিহ্যে আগামী দিনের স্বপ্ন', 'Reflections of the Past, Visions of the Future')})
            </p>

            {/* Artist Squircles with Handcrafted Vector Motifs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-white/15 pt-6 sm:pt-8 text-left">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <MandapIcon className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-rose-200 font-bold">{b('মণ্ডপ শিল্পী', 'Pandal Artist')}</span>
                  <span className="font-semibold text-sm text-white/95">{settings.pandalArtist || b('শিল্প নিকেতন', 'Shilpa Niketan')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <SculptorIcon className="w-5 h-5 text-rose-200" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-rose-200 font-bold">{b('প্রতিমা শিল্পী', 'Idol Sculptor')}</span>
                  <span className="font-semibold text-sm text-white/95">{settings.idolArtist || b('সৌমেন পাল', 'Soumen Paul')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <IlluminationIcon className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-rose-200 font-bold">{b('আলোকসজ্জা', 'Illumination')}</span>
                  <span className="font-semibold text-sm text-white/95">{settings.lightingArtist || b('রয়েল লাইটস', 'Royal Lights')}</span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
              <ShankhaIcon className="w-3.5 h-3.5 text-rose-700" />
              <span>{b('পবিত্র পূজা নির্ঘণ্ট', 'Sacred Rituals')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              {b('পূজার নির্ঘণ্ট ও', 'Puja Timetable &')} <span className="text-brand-maroon">{b('পবিত্র সূচি', 'Sacred Rituals')}</span>
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
          <div className="space-y-6 sm:space-y-8 pt-4">
            {events.map((event, i) => {
              const eventDate = new Date(event.date + (event.date.includes('T') ? '' : 'T00:00:00'));
              const ritualThemes = ['rose', 'amber', 'emerald', 'blue'];
              const tapeVariant = ritualThemes[i % ritualThemes.length];
              return (
                <div
                  key={i}
                  className="group relative bg-[#FFFDF9] rounded-3xl pt-8 pb-5 pl-8 sm:pl-12 pr-5 sm:pr-8 shadow-[0_6px_20px_rgba(28,13,19,0.04)] hover:shadow-[0_16px_32px_rgba(159,18,57,0.1)] hover:-translate-y-1 transition-all duration-300 border border-[#E5DAC8]"
                >
                  {/* Top Pinned Washi Tape Header */}
                  <div className="absolute -top-3.5 left-7 sm:left-10 z-20">
                    <WashiTapePin text={b(`পূজা নির্ঘণ্ট • দিন ০${i + 1}`, `Ritual Schedule • Day ${i + 1}`)} variant={tapeVariant} />
                  </div>

                  {/* Left Perforated Spiral Binder Holes */}
                  <div className="absolute left-2.5 sm:left-3 top-8 bottom-8 flex flex-col justify-around pointer-events-none">
                    <BinderHoles count={4} />
                  </div>

                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-3 border-b border-[#E8DFD1]/80">
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      {/* Floating Date Squircle */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#E5DAC8] flex flex-col items-center justify-center text-stone-900 group-hover:border-brand-maroon group-hover:bg-brand-maroon group-hover:text-white transition-all shrink-0 shadow-2xs">
                        <span className="text-xl sm:text-2xl font-black leading-none">{toDigits(eventDate.getDate())}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-80">
                          {eventDate.toLocaleString(lang === 'bn' ? 'bn-IN' : 'en-US', { month: 'short' })}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-stone-700 border border-[#E8DFD1]">
                            {b('দিন', 'Day')} {toDigits(i + 1)}
                          </span>
                          <span className="text-xs text-stone-500 font-medium">
                            {eventDate.toLocaleDateString(lang === 'bn' ? 'bn-IN' : 'en-US', { weekday: 'long' })}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-stone-900 group-hover:text-brand-maroon transition-colors leading-tight">
                          {t(event.title)}
                        </h3>
                        <div className="mt-1.5">
                          <FestiveWaveAccent className="w-12 h-1.5 text-amber-500/80" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-3">
                    {event.text}
                  </p>

                  {/* Torn Deckle Bottom Edge */}
                  <div className="pt-2 -mx-5 sm:-mx-8 -mb-5 opacity-80">
                    <TornDeckleEdge className="w-full text-stone-200/90 h-2 block" />
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            {b('সান্ধ্য সাংস্কৃতিক অনুষ্ঠান', 'Evening Cultural Programs')}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {b('সন্ধ্যার সাংস্কৃতিক', 'Evening Cultural')} <span className="text-brand-maroon">{b('মহোৎসব', 'Extravaganza')}</span>
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

      {/* ═══ 4. HOW TO REACH (Transit Card) ═══ */}
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
