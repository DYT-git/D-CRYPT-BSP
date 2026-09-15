'use client';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { PartyPopper, Mic2, Drum, FileText, MapPin } from 'lucide-react';
import Link from 'next/link';
import YearSelector from "@/components/YearSelector";

export default function PujaSchedule() {
  const { data, settings, selectedYear } = useData();
  const { lang, b } = useLanguage();
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
          Festival Guide • {selectedYear}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight leading-tight">
          {b('শারদীয়া', 'Sharadiya')} <span className="text-brand-maroon">{b('দুর্গোৎসব', 'Durga Puja')}</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-stone-600 font-light leading-relaxed">
          {b(
            'বাঁশদ্রোণী সোনালী পার্কের দুর্গাপূজার সম্পূর্ণ সূচি, থিম ভাবনা ও সান্ধ্য সাংস্কৃতিক উৎসব।',
            'Complete schedule of rituals, theme concept, and evening cultural programs at Bansdroni Sonali Park.'
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
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Theme of the Year {selectedYear}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3 tracking-tight leading-tight">
              &ldquo;{settings.themeTitle || 'অতীতের আয়নায় আগামী'}&rdquo;
            </h2>
            <p className="text-rose-100/90 text-sm sm:text-base md:text-lg italic mb-6 sm:mb-8 font-light">
              ({settings.themeSubtitle || 'Reflections of the Past, Visions of the Future'})
            </p>

            {/* Artist Squircles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-white/15 pt-6 sm:pt-8 text-left">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg shrink-0">🏛️</div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-rose-200 font-bold">মণ্ডপ শিল্পী</span>
                  <span className="font-semibold text-sm text-white/95">{settings.pandalArtist || 'শিল্প নিকেতন'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg shrink-0">🎨</div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-rose-200 font-bold">প্রতিমা শিল্পী</span>
                  <span className="font-semibold text-sm text-white/95">{settings.idolArtist || 'সৌমেন পাল'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg shrink-0">💡</div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-rose-200 font-bold">আলোকসজ্জা</span>
                  <span className="font-semibold text-sm text-white/95">{settings.lightingArtist || 'রয়েল লাইটস'}</span>
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
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              Sacred Rituals
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              পূজার নির্ঘণ্ট ও <span className="text-brand-maroon">পবিত্র সূচি</span>
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">Daily rituals, puja timings, and pushpanjali schedule</p>
          </div>
          <Link
            href="?viewPdf=/docs/sample-puja-programme-2026.pdf&pdfTitle=Puja%20Detailed%20Timetable"
            scroll={false}
            className="inline-flex items-center justify-center gap-2 bg-brand-maroon hover:bg-stone-900 text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
          >
            <FileText className="w-4 h-4" /> সম্পূর্ণ নির্ঘণ্ট PDF
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {events.map((event, i) => {
              const eventDate = new Date(event.date + (event.date.includes('T') ? '' : 'T00:00:00'));
              return (
                <div
                  key={i}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-stone-200/80 hover:border-brand-maroon/30"
                >
                  {/* Top Subtle Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      {/* Floating Date Squircle */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex flex-col items-center justify-center text-brand-maroon group-hover:scale-105 group-hover:bg-brand-maroon group-hover:text-white transition-all shrink-0">
                        <span className="text-xl sm:text-2xl font-black leading-none">{eventDate.getDate()}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5">{eventDate.toLocaleString('bn', { month: 'short' })}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                            দিন {i + 1}
                          </span>
                          <span className="text-xs text-stone-500 font-medium">
                            {eventDate.toLocaleDateString('bn-IN', { weekday: 'long' })}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-stone-900 group-hover:text-brand-maroon transition-colors">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed pl-1 sm:pl-2">
                    {event.text}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 rounded-3xl border border-dashed border-stone-300 text-stone-500">
            এই বছরের পুজোর সূচি এখনও প্রকাশ করা হয়নি।
          </div>
        )}
      </section>

      {/* ═══ 3. EVENING CULTURAL ROSTER (3-Column Bento Cards) ═══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-900 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            Evening Cultural Programs
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            সন্ধ্যার সাংস্কৃতিক <span className="text-brand-maroon">মহোৎসব</span>
          </h2>
          <p className="text-stone-500 text-xs sm:text-base mt-2">
            প্রতি সন্ধ্যায় বিশিষ্ট অতিথি শিল্পী ও পাড়ার সদস্যদের মনোজ্ঞ সাংস্কৃতিক নিবেদন
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="group relative bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-rose-500/20 hover:border-rose-500/40 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <PartyPopper className="text-rose-600 w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} />
              </div>
              <span className="inline-block text-rose-600 font-bold text-[10px] sm:text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-3">
                মহাসপ্তমী সন্ধ্যা
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-2 leading-snug group-hover:text-rose-600 transition-colors">
                পাড়ার ছোটদের অনুষ্ঠান
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                আবৃত্তি, নাচ ও গান পরিবেশন করবে আমাদের ক্লাবের কচিকাঁচারা।
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-rose-500/15 text-xs font-semibold text-rose-600 flex items-center justify-between">
              <span>সন্ধ্যা ৭:০০ টা থেকে</span>
              <span>→</span>
            </div>
          </div>

          <div className="group relative bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-stone-200/80 hover:border-brand-maroon/30 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent" />
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Mic2 className="text-brand-maroon w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} />
              </div>
              <span className="inline-block text-brand-maroon font-bold text-[10px] sm:text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 mb-3">
                মহাষ্টমী সন্ধ্যা
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-2 leading-snug group-hover:text-brand-maroon transition-colors">
                বিশেষ অতিথি শিল্পী
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                কলকাতা থেকে আগত জনপ্রিয় সঙ্গীতশিল্পীর একক সঙ্গীতানুষ্ঠান।
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-stone-100 text-xs font-semibold text-brand-maroon flex items-center justify-between">
              <span>সন্ধ্যা ৭:৩০ টা থেকে</span>
              <span>→</span>
            </div>
          </div>

          <div className="group relative bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-stone-200/80 hover:border-brand-maroon/30 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent" />
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Drum className="text-brand-maroon w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} />
              </div>
              <span className="inline-block text-brand-maroon font-bold text-[10px] sm:text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 mb-3">
                মহানবমী সন্ধ্যা
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-2 leading-snug group-hover:text-brand-maroon transition-colors">
                শ্রুতিনাটক ও ধুনুচি নাচ
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                ক্লাব সদস্যদের পরিবেশনায় শ্রুতিনাটক এবং শেষে ঢাকের তালে বিশাল ধুনুচি নাচের প্রতিযোগিতা।
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-stone-100 text-xs font-semibold text-brand-maroon flex items-center justify-between">
              <span>সন্ধ্যা ৮:০০ টা থেকে</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. HOW TO REACH (Transit Card) ═══ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="group relative bg-white rounded-3xl p-5 sm:p-8 md:p-10 flex flex-col sm:flex-row gap-5 sm:gap-6 items-center shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-stone-200/80 hover:border-brand-maroon/30">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent" />
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-maroon/10 border border-brand-maroon/20 flex items-center justify-center text-brand-maroon text-2xl shrink-0 group-hover:scale-110 transition-transform">
            <MapPin className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon text-[11px] font-bold uppercase tracking-wider mb-2">
              Directions & Transit
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-2">কীভাবে <span className="text-brand-maroon">আসবেন?</span></h2>
            <div className="space-y-1.5 text-stone-600 text-xs sm:text-sm md:text-base">
              <p><strong className="text-stone-900 font-bold">মেট্রো:</strong> মাস্টারদা সূর্য সেন (বাঁশদ্রোণী) মেট্রো স্টেশন থেকে ৫ মিনিটের হাঁটা পথ বা রিকশা।</p>
              <p><strong className="text-stone-900 font-bold">বাস / অটো:</strong> বাঁশদ্রোণী বাস স্টপেজ থেকে সোনালী পার্কের দিকে সোজা রাস্তা।</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

