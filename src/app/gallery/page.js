'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import YearSelector from "@/components/YearSelector";
import { Download, X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { triggerDownload } from "@/utils/download";
import { getImageWing } from "@/utils/gallery";
import { 
  DurgaDeviEmblemIcon, 
  ClubCrestIcon, 
  SamitiEmblemIcon, 
  FestiveWaveAccent 
} from '@/components/HeritageIcons';

const WINGS = [
  { key: 'Puja', labelBn: 'শারদীয়া দুর্গোৎসব', labelEn: 'Durga Puja', Icon: DurgaDeviEmblemIcon, activeColor: 'bg-rose-700 text-white border-rose-700' },
  { key: 'Club', labelBn: 'সোনালী সঙ্ঘ', labelEn: 'Sonali Club', Icon: ClubCrestIcon, activeColor: 'bg-amber-600 text-white border-amber-600' },
  { key: 'Samiti', labelBn: 'উন্নয়ন সমিতি', labelEn: 'Unnayan Samiti', Icon: SamitiEmblemIcon, activeColor: 'bg-emerald-700 text-white border-emerald-700' },
];

const FALLBACK_CLUB_PHOTOS = [
  { src: '/assets/durga-hero.png', title: 'বার্ষিক ফুটবল টুর্নামেন্ট', category: 'Sports', wing: 'Club', year: 2026 },
  { src: '/assets/durga-morning.png', title: 'স্বেচ্ছায় রক্তদান ও স্বাস্থ্য শিবির', category: 'Blood Donation', wing: 'Club', year: 2026 },
  { src: '/assets/durga-evening.png', title: 'রবীন্দ্র জয়ন্তী ও সাংস্কৃতিক সন্ধ্যা', category: 'Cultural', wing: 'Club', year: 2026 },
  { src: '/assets/durga-afternoon.png', title: 'বাৎসরিক ক্রীড়া প্রতিযোগিতা ও পুরস্কার বিতরণ', category: 'Sports', wing: 'Club', year: 2026 },
  { src: '/assets/durga-hero.jpg', title: 'যুব ক্রিকেট চ্যাম্পিয়নশিপ ফাইনাল', category: 'Sports', wing: 'Club', year: 2025 }
];

const FALLBACK_SAMITI_PHOTOS = [
  { src: '/assets/durga-hero.png', title: 'পাড়ার অভ্যন্তরীণ রাস্তা ও পথবাতি সংস্কার কাজ', category: 'Roads', wing: 'Samiti', year: 2026 },
  { src: '/assets/durga-morning.png', title: 'পরিবেশ দিবস উপলক্ষে বাৎসরিক বৃক্ষরোপণ', category: 'Greenery', wing: 'Samiti', year: 2026 },
  { src: '/assets/durga-evening.png', title: 'পাড়ার বাসিন্দাদের সাধারণ বার্ষিক সভা', category: 'Meetings', wing: 'Samiti', year: 2026 },
  { src: '/assets/durga-afternoon.png', title: 'নতুন এলইডি পথবাতি স্থাপন অভিযান', category: 'Roads', wing: 'Samiti', year: 2025 },
  { src: '/assets/durga-hero.jpg', title: 'বর্ষাপূর্ব পাড়ার পরিচ্ছন্নতা ও ডেঙ্গি প্রতিরোধ স্প্রে', category: 'Sanitation', wing: 'Samiti', year: 2025 }
];

function GalleryContent() {
  const { data, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();
  const searchParams = useSearchParams();

  // Initial wing from URL query param: ?wing=Club | ?wing=Samiti | ?wing=Puja
  const initialWing = useMemo(() => {
    const w = searchParams?.get('wing');
    if (!w) return 'Puja';
    const lower = w.toLowerCase();
    if (lower === 'club') return 'Club';
    if (lower === 'samiti') return 'Samiti';
    return 'Puja';
  }, [searchParams]);

  const [activeWing, setActiveWing] = useState(initialWing);
  const [visibleCount, setVisibleCount] = useState(24);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  // Sync state if URL search param changes
  useEffect(() => {
    if (initialWing) {
      setActiveWing(initialWing);
      setVisibleCount(24);
    }
  }, [initialWing]);

  useEffect(() => {
    setVisibleCount(24);
  }, [selectedYear, activeWing]);

  // Gallery items filtering based on active wing (Newest first)
  const filteredGallery = useMemo(() => {
    const rawAll = (data.gallery || []).filter(g => g.year === selectedYear);

    if (activeWing === 'Puja') {
      const list = rawAll.filter(g => getImageWing(g) === 'Puja');
      return list.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    if (activeWing === 'Club') {
      let list = rawAll.filter(g => getImageWing(g) === 'Club');
      if (list.length === 0) list = FALLBACK_CLUB_PHOTOS;
      return list.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    if (activeWing === 'Samiti') {
      let list = rawAll.filter(g => getImageWing(g) === 'Samiti');
      if (list.length === 0) list = FALLBACK_SAMITI_PHOTOS;
      return list.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return rawAll.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [data.gallery, selectedYear, activeWing]);

  // Photo counts per wing
  const counts = useMemo(() => {
    const rawAll = (data.gallery || []).filter(g => g.year === selectedYear);
    const pCount = rawAll.filter(g => getImageWing(g) === 'Puja').length;
    const cList = rawAll.filter(g => getImageWing(g) === 'Club');
    const cCount = cList.length > 0 ? cList.length : FALLBACK_CLUB_PHOTOS.length;
    const sList = rawAll.filter(g => getImageWing(g) === 'Samiti');
    const sCount = sList.length > 0 ? sList.length : FALLBACK_SAMITI_PHOTOS.length;
    return { Puja: pCount, Club: cCount, Samiti: sCount };
  }, [data.gallery, selectedYear]);

  const openLightbox = (item, idx) => { setSelectedImage(item); setLightboxIdx(idx); };
  const navigate = (dir) => {
    const next = (lightboxIdx + dir + filteredGallery.length) % filteredGallery.length;
    setSelectedImage(filteredGallery[next]);
    setLightboxIdx(next);
  };

  // Lightbox keyboard controls
  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, lightboxIdx, filteredGallery]);

  // Lightbox touch swipe controls
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) navigate(1);
    if (diff < -50) navigate(-1);
    setTouchStartX(null);
  };

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-28 sm:pt-32 pb-24 selection:bg-brand-maroon selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearSelector />
      </div>

      {/* ═══ Clean Editorial Header (Minimal & Spacious) ═══ */}
      <header className="max-w-3xl mx-auto text-center mt-6 sm:mt-8 mb-8 sm:mb-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-2 tracking-tight leading-tight">
          {b('স্মৃতির সুর ও', 'Moments & Visual')} <span className="text-brand-maroon">{b('প্রতিচ্ছবি', 'Memories')}</span>
        </h1>
        <div className="flex justify-center mt-3">
          <FestiveWaveAccent className="w-16 h-2 text-amber-500/80" />
        </div>
      </header>

      {/* ═══ 3-Pillar Wing Selector Tabs ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
          {WINGS.map(({ key, labelBn, labelEn, Icon, activeColor }) => {
            const isSelected = activeWing === key;
            const count = counts[key] || 0;
            return (
              <button
                key={key}
                onClick={() => setActiveWing(key)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold transition-all text-xs sm:text-sm border shadow-sm cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? `${activeColor} shadow-md scale-105`
                    : 'bg-white text-stone-700 border-stone-200/90 hover:border-stone-400 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-600'}`} />
                <span>{lang === 'bn' ? labelBn : labelEn}</span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                  {toDigits(count, lang)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Photo Grid (Heritage Sandalwood Cards) ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredGallery.length > 0 ? (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredGallery.slice(0, visibleCount).map((item, i) => (
                <div
                  key={item.id || item.src || i}
                  className="group relative break-inside-avoid rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#E5DAC8] bg-[#FFFDF9]"
                  onClick={() => openLightbox(item, i)}
                >
                  <img
                    src={item.src}
                    alt={item.title || 'Gallery Photo'}
                    onError={(e) => { e.currentTarget.src = '/assets/durga-hero.png'; }}
                    className="w-full object-cover filter grayscale-[12%] contrast-[104%] group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-103 transition-all duration-700 bg-stone-100"
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
                      <h3 className="text-white font-serif font-bold text-lg leading-tight mt-1">{t(item.title)}</h3>
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

            {/* Load More Button if more photos exist */}
            {filteredGallery.length > visibleCount && (
              <div className="flex justify-center mt-12 sm:mt-14">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="btn-tactile-parchment px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-stone-800 hover:text-brand-maroon flex items-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <ImageIcon className="w-4 h-4 text-brand-maroon" />
                  <span>
                    {b(
                      `আরও ${toDigits(Math.min(24, filteredGallery.length - visibleCount))}টি ছবি দেখুন (মোট ${toDigits(filteredGallery.length)}টি)`,
                      `Load ${Math.min(24, filteredGallery.length - visibleCount)} More Photos (${filteredGallery.length} Total)`
                    )}
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E5DAC8] flex flex-col items-center gap-4 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-800">
              {b('এই বিভাগে কোনো ছবি আপলোড করা হয়নি।', 'No photos uploaded in this category yet.')}
            </h3>
            <p className="text-stone-500 text-sm">
              {b('শীঘ্রই নতুন ছবি যোগ করা হবে।', 'New photographs will be added soon.')}
            </p>
          </div>
        )}
      </div>

      {/* ═══ Lightbox Modal ═══ */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-[#0B1224]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedImage(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button onClick={() => setSelectedImage(null)} className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition z-50 border border-white/20 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          {filteredGallery.length > 1 && (
            <button onClick={e => { e.stopPropagation(); navigate(-1); }} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3.5 border border-white/20 transition z-50 cursor-pointer">
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
                <h3 className="text-white font-bold text-lg truncate mt-0.5">{t(selectedImage.title)}</h3>
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
            <button onClick={e => { e.stopPropagation(); navigate(1); }} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3.5 border border-white/20 transition z-50 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      )}
    </main>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-serif text-stone-600">লোড হচ্ছে...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
