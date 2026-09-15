'use client';
import { useState } from 'react';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import YearSelector from "@/components/YearSelector";
import { Download, X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { triggerDownload } from "@/utils/download";

const PROGRAMS = [
  { key: 'Durga Puja',       labelBn: 'শারদীয়া দুর্গাপূজা', labelEn: 'Durga Puja' },
  { key: 'Social Work',      labelBn: 'সমাজসেবা ও রক্তদান', labelEn: 'Social Service' },
  { key: 'Annual Sports',    labelBn: 'বার্ষিক ক্রীড়া', labelEn: 'Annual Sports' },
  { key: 'Cultural Event',   labelBn: 'সাংস্কৃতিক সন্ধ্যা', labelEn: 'Cultural Evenings' },
];

const CATEGORIES = [
  { key: 'All',                labelBn: 'সব ছবি', labelEn: 'All Photos' },
  { key: 'Idol & Pandal',      labelBn: 'প্রতিমা ও মণ্ডপ', labelEn: 'Idol & Pandal' },
  { key: 'Rituals & Anjali',   labelBn: 'পূজা ও অঞ্জলি', labelEn: 'Rituals & Prayers' },
  { key: 'Sindur Khela',       labelBn: 'সিঁদুর খেলা', labelEn: 'Sindur Khela' },
];

export default function GalleryPage() {
  const { data, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();
  const [activeProgram,  setActiveProgram]  = useState('Durga Puja');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage,  setSelectedImage]  = useState(null);
  const [lightboxIdx,    setLightboxIdx]    = useState(0);

  const gallery = data.gallery.filter(g => g.year === selectedYear);
  const filteredGallery = gallery.filter(item => {
    if (item.program !== activeProgram) return false;
    if (activeProgram === 'Durga Puja' && activeCategory !== 'All') {
      if (item.category !== activeCategory) return false;
    }
    return true;
  });

  const openLightbox = (item, idx) => { setSelectedImage(item); setLightboxIdx(idx); };
  const navigate = (dir) => {
    const next = (lightboxIdx + dir + filteredGallery.length) % filteredGallery.length;
    setSelectedImage(filteredGallery[next]);
    setLightboxIdx(next);
  };

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-brand-maroon selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearSelector />
      </div>

      {/* ═══ Symmetrical 3-Tier Header ═══ */}
      <header className="max-w-3xl mx-auto text-center mt-10 sm:mt-12 mb-10 sm:mb-12 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon animate-pulse" />
          {b('স্মৃতি ও ঐতিহ্য', 'Memories & Archives')} • {toDigits(selectedYear, lang)}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight leading-tight">
          {b('স্মৃতির', 'Moments &')} <span className="text-brand-maroon">{b('গ্যালারি', 'Photo Gallery')}</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-stone-600 font-light leading-relaxed">
          {b(
            'বাঁশদ্রোণী সোনালী পার্কের উৎসব, ধুনুচি নাচ, আনন্দ ও সমাজসেবামূলক কর্মকাণ্ডের রঙিন অ্যালবাম।',
            'Photographic archives of Durga Puja celebrations, rituals, social service, and community memories at Bansdroni Sonali Park.'
          )}
        </p>
      </header>

      {/* ═══ Program Selector Tabs (Frosted Pills) ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
          {PROGRAMS.map(prog => (
            <button
              key={prog.key}
              onClick={() => { setActiveProgram(prog.key); setActiveCategory('All'); }}
              className={`px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold transition-all text-xs sm:text-sm border shadow-sm cursor-pointer ${
                activeProgram === prog.key
                  ? 'bg-brand-maroon text-white border-brand-maroon shadow-md scale-105'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-brand-maroon/40 hover:text-brand-maroon'
              }`}
            >
              {lang === 'bn' ? prog.labelBn : prog.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Category Sub-Tabs (for Durga Puja) ═══ */}
      {activeProgram === 'Durga Puja' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {lang === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>
      )}

      {/* ═══ Photo Grid (Bento Photo Cards) ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredGallery.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredGallery.map((item, i) => (
              <div
                key={i}
                className="group relative break-inside-avoid rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-stone-200/80 hover:border-brand-maroon/40 bg-white"
                onClick={() => openLightbox(item, i)}
              >
                {/* Top Subtle Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                <img
                  src={item.src}
                  alt={item.title || 'Gallery Photo'}
                  onError={(e) => { e.currentTarget.src = '/assets/durga-hero.png'; }}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay & Action Pill */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-black/50 hover:bg-brand-maroon text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-md cursor-pointer"
                      title={b('ছবি ডাউনলোড করুন', 'Download Photo')}
                      onClick={e => {
                        e.stopPropagation();
                        triggerDownload(item.src, `${item.title || 'gallery-photo'}.jpg`);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <span className="text-white/90 text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-black/50 border border-white/15 mb-2 inline-block">
                      {t(item.category)}
                    </span>
                    <h3 className="text-white font-serif font-bold text-lg leading-tight mt-1">{item.title}</h3>
                  </div>
                </div>

                {/* Center Zoom Cue */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/80 rounded-3xl border border-dashed border-stone-300 flex flex-col items-center gap-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-stone-600">
              {b('এই বিভাগে কোনো ছবি আপলোড করা হয়নি।', 'No photos uploaded in this category yet.')}
            </h3>
            <p className="text-stone-400 text-sm">
              {b('শীঘ্রই নতুন ছবি যোগ করা হবে।', 'New photographs will be added soon.')}
            </p>
          </div>
        )}
      </div>

      {/* ═══ Lightbox Modal ═══ */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-[#0B1224]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition z-50 border border-white/20">
            <X className="w-5 h-5" />
          </button>
          {filteredGallery.length > 1 && (
            <button onClick={e => { e.stopPropagation(); navigate(-1); }} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3.5 border border-white/20 transition z-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
            </button>
          )}
          <div className="relative flex flex-col items-center gap-4 max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.title} className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10" />
            <div className="flex items-center justify-between w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-3.5 gap-4">
              <div className="min-w-0">
                <span className="text-rose-200 text-[10px] uppercase tracking-widest font-bold block">
                  {t(selectedImage.category)}
                </span>
                <h3 className="text-white font-bold text-lg truncate mt-0.5">{selectedImage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => triggerDownload(selectedImage.src, `${selectedImage.title || 'gallery-photo'}.jpg`)}
                className="flex items-center gap-2 bg-brand-maroon hover:bg-stone-900 text-white px-5 py-2.5 rounded-full font-bold transition-all text-sm border border-white/20 shrink-0 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" /> {b('ডাউনলোড', 'Download')}
              </button>
            </div>
            <span className="text-white/50 text-xs">{toDigits(lightboxIdx + 1, lang)} / {toDigits(filteredGallery.length, lang)}</span>
          </div>
          {filteredGallery.length > 1 && (
            <button onClick={e => { e.stopPropagation(); navigate(1); }} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3.5 border border-white/20 transition z-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      )}
    </main>
  );
}

