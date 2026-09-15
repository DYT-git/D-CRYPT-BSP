'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Music,
  UploadCloud,
  Check,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Info,
  X,
  Sun,
  Sunset,
  Moon,
  Shield
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export default function MediaManagerPage() {
  const { lang, b } = useLanguage();
  const { settings = {}, refreshData } = useData() || {};

  const SLOTS = [
    {
      id: 'morning',
      uploadType: 'hero-morning',
      settingKey: 'heroImageMorning',
      defaultPath: '/assets/durga-morning.png',
      nameBn: 'সকাল ও প্রভাত',
      nameEn: 'Morning Banner',
      hours: '05:00 AM – 12:00 PM',
      icon: Sun,
      iconColor: 'text-amber-500',
    },
    {
      id: 'afternoon',
      uploadType: 'hero-afternoon',
      settingKey: 'heroImageAfternoon',
      defaultPath: '/assets/durga-afternoon.png',
      nameBn: 'দুপুর ও অপরাহ্ন',
      nameEn: 'Afternoon Banner',
      hours: '12:00 PM – 05:00 PM',
      icon: Sunset,
      iconColor: 'text-rose-500',
    },
    {
      id: 'evening',
      uploadType: 'hero-evening',
      settingKey: 'heroImageEvening',
      defaultPath: '/assets/durga-evening.png',
      nameBn: 'সন্ধ্যা ও আরতি',
      nameEn: 'Evening Banner',
      hours: '05:00 PM – 05:00 AM',
      icon: Moon,
      iconColor: 'text-indigo-500',
    },
    {
      id: 'fallback',
      uploadType: 'hero-fallback',
      settingKey: 'heroImageFallback',
      defaultPath: '/assets/durga-hero.png',
      nameBn: 'সার্বজনীন ব্যাকআপ',
      nameEn: 'Universal Fallback',
      hours: 'সব সময়ের জন্য ব্যাকআপ',
      icon: Shield,
      iconColor: 'text-stone-500',
    },
  ];

  const [isMounted, setIsMounted] = useState(false);
  const [currentHour, setCurrentHour] = useState(null);
  const [timestamps, setTimestamps] = useState({});

  // Per-slot upload state
  const [pendingFiles, setPendingFiles] = useState({});
  const [pendingPreviews, setPendingPreviews] = useState({});
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const fileInputs = useRef({});

  // Audio State
  const [audioTimestamp, setAudioTimestamp] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);
  const audioInputRef = useRef(null);

  // Notifications & Copy State
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copiedAsset, setCopiedAsset] = useState(null);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  useEffect(() => {
    setIsMounted(true);
    setCurrentHour(new Date().getHours());
  }, []);

  const isLiveSlot = (slotId) => {
    if (!isMounted || currentHour === null) return false;
    if (slotId === 'morning') return currentHour >= 5 && currentHour < 12;
    if (slotId === 'afternoon') return currentHour >= 12 && currentHour < 17;
    if (slotId === 'evening') return currentHour >= 17 || currentHour < 5;
    return false;
  };

  const getSlotImageUrl = (slot) => {
    if (pendingPreviews[slot.id]) return pendingPreviews[slot.id];
    const savedUrl = settings?.[slot.settingKey];
    const base = savedUrl || slot.defaultPath;
    if (!timestamps[slot.id]) return base;
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}v=${timestamps[slot.id]}`;
  };

  const handleSelectFile = (slotId, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('error', b('শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে (WebP, PNG, JPG)', 'Only image files allowed (WebP, PNG, JPG)'));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('error', b('ছবির সাইজ ৮ মেগাবাইট (8MB)-এর কম হতে হবে।', 'File size must be under 8MB.'));
      return;
    }

    setPendingFiles(prev => ({ ...prev, [slotId]: file }));
    const reader = new FileReader();
    reader.onload = (e) => {
      setPendingPreviews(prev => ({ ...prev, [slotId]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async (slot) => {
    const file = pendingFiles[slot.id];
    if (!file) return;

    setUploadingSlot(slot.id);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', slot.uploadType);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('success', b(`'${slot.nameBn}' ব্যানার সফলভাবে আপডেট করা হয়েছে!`, `'${slot.nameEn}' successfully updated!`));
        setTimestamps(prev => ({ ...prev, [slot.id]: Date.now() }));
        setPendingFiles(prev => {
          const copy = { ...prev };
          delete copy[slot.id];
          return copy;
        });
        setPendingPreviews(prev => {
          const copy = { ...prev };
          delete copy[slot.id];
          return copy;
        });
        if (fileInputs.current[slot.id]) fileInputs.current[slot.id].value = '';
        if (typeof refreshData === 'function') refreshData();
      } else {
        showToast('error', data.error || b('আপলোড ব্যর্থ হয়েছে।', 'Upload failed.'));
      }
    } catch (err) {
      showToast('error', b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleAudioUpload = async (file) => {
    if (!file) return;
    if (!file.type.includes('audio') && !file.name.toLowerCase().endsWith('.mp3')) {
      showToast('error', b('শুধুমাত্র MP3 অডিও ফাইল আপলোড করা যাবে (.mp3)', 'Only MP3 audio allowed (.mp3)'));
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('error', b('অডিও সাইজ ১৫ মেগাবাইট (15MB)-এর কম হতে হবে।', 'Audio size must be under 15MB.'));
      return;
    }

    setUploadingAudio(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'audio');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('success', b('ঢাকের বাদ্যি অডিও সফলভাবে আপডেট হয়েছে!', 'Dhak audio successfully updated!'));
        setAudioTimestamp(Date.now());
        setAudioFile(null);
        if (audioInputRef.current) audioInputRef.current.value = '';
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.load();
          setIsPlayingAudio(false);
        }
        if (typeof refreshData === 'function') refreshData();
      } else {
        showToast('error', data.error || b('অডিও আপলোড ব্যর্থ হয়েছে।', 'Upload failed.'));
      }
    } catch (err) {
      showToast('error', b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setUploadingAudio(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(e => {
        showToast('error', 'Audio error: ' + e.message);
      });
    }
  };

  const copyAssetPath = (path) => {
    navigator.clipboard.writeText(path);
    setCopiedAsset(path);
    setTimeout(() => setCopiedAsset(null), 2000);
  };

  const portalAssets = [
    { name: 'শারদীয়া প্রতিমা', path: '/assets/durga.svg' },
    { name: 'ঐতিহ্যবাহী মণ্ডপ', path: '/assets/pandal.svg' },
    { name: 'উৎসবের আলো', path: '/assets/lights.svg' },
    { name: 'সোনালী সংঘ', path: '/assets/culture.svg' },
    { name: 'উন্নয়ন সমিতি', path: '/assets/community.svg' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
            {b('মিডিয়া ও ব্যানার', 'Assets & Media')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('হোমপেজের সময়ভিত্তিক হিরো ব্যানার এবং শারদীয়া অডিও পরিচালনা করুন', 'Manage time-of-day hero banners and celebratory soundtrack')}
          </p>
        </div>

        {/* Live Slot Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {b('বর্তমানে সক্রিয়:', 'Currently active:')}{' '}
            <strong className="text-stone-900">
              {!isMounted
                ? '...'
                : currentHour >= 5 && currentHour < 12
                ? b('সকাল (Morning)', 'Morning')
                : currentHour >= 12 && currentHour < 17
                ? b('দুপুর (Afternoon)', 'Afternoon')
                : b('সন্ধ্যা (Evening)', 'Evening')}
            </strong>
          </span>
        </div>
      </div>

      {/* ═══ Toast ═══ */}
      {message.text && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2.5 border text-xs font-semibold shadow-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* ═══ 1. Compact Photography Rules Strip (No clutter, just essential specs) ═══ */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
            <span className="px-2 py-0.5 rounded bg-brand-maroon text-white font-mono font-bold text-[11px]">
              16:9
            </span>
            <div>
              <p className="font-semibold text-stone-900">{b('অনুপাত ও সাইজ', 'Aspect Ratio')}</p>
              <p className="text-stone-500 text-[11px]">1920×1080 px • WebP / PNG / JPG (Max 8MB)</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
            <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-mono font-bold text-[11px]">
              Center
            </span>
            <div>
              <p className="font-semibold text-stone-900">{b('প্রতিমার অবস্থান', 'Subject Placement')}</p>
              <p className="text-stone-500 text-[11px]">{b('মা দুর্গা ও সিংহকে মাঝখানে বা ডান ঘেঁষে রাখুন', 'Keep deity centered or slightly to the right')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-[11px]">
              Left 35%
            </span>
            <div>
              <p className="font-semibold text-stone-900">{b('টেক্সট সেফ জোন', 'Text Safe Zone')}</p>
              <p className="text-stone-500 text-[11px]">{b('বাম পাশের ৩৫% ফাঁকা রাখুন হেডলাইন ও বাটনের জন্য', 'Keep left 35% clean for headline and buttons')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 2. Time-Based Hero Banners Grid (Clean 4 Cards) ═══ */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            {b('সময়ভিত্তিক হিরো ব্যানারসমূহ (৪টি স্লট)', 'Time-of-Day Hero Banners (4 Slots)')}
          </h2>
          <span className="text-[11px] text-stone-400">
            {b('ঘড়ির সময় অনুযায়ী স্বয়ংক্রিয় পরিবর্তিত হয়', 'Switches automatically based on clock')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SLOTS.map((slot) => {
            const Icon = slot.icon;
            const isLive = isLiveSlot(slot.id);
            const isUploading = uploadingSlot === slot.id;
            const hasPending = Boolean(pendingFiles[slot.id]);

            return (
              <div
                key={slot.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
                  isLive ? 'border-brand-maroon/50 ring-1 ring-brand-maroon/20' : 'border-stone-200/80'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${slot.iconColor}`} />
                      <h3 className="text-xs font-bold text-stone-900">
                        {b(slot.nameBn, slot.nameEn)}
                      </h3>
                    </div>

                    {isLive && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] font-mono text-stone-400 mb-2">
                    {slot.hours}
                  </p>

                  {/* 16:9 Image Preview */}
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-200/80 shadow-2xs group">
                    <img
                      src={getSlotImageUrl(slot)}
                      alt={slot.nameEn}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = slot.defaultPath;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    
                    {hasPending && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold shadow-xs">
                        {b('প্রস্তুত', 'Ready')}
                      </div>
                    )}

                    <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-white/80">
                      16:9
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 mt-3 border-t border-stone-100 space-y-2">
                  <input
                    ref={(el) => (fileInputs.current[slot.id] = el)}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleSelectFile(slot.id, e.target.files[0]);
                    }}
                  />

                  {hasPending ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUploadImage(slot)}
                        disabled={isUploading}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        {isUploading ? (
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5" />
                            {b('সংরক্ষণ করুন', 'Save')}
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPendingFiles(prev => {
                            const copy = { ...prev };
                            delete copy[slot.id];
                            return copy;
                          });
                          setPendingPreviews(prev => {
                            const copy = { ...prev };
                            delete copy[slot.id];
                            return copy;
                          });
                          if (fileInputs.current[slot.id]) fileInputs.current[slot.id].value = '';
                        }}
                        className="p-2 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
                        title={b('বাতিল', 'Cancel')}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputs.current[slot.id]?.click()}
                      className="w-full py-2 px-3 rounded-xl border border-stone-200 hover:border-brand-maroon/40 bg-stone-50 hover:bg-white text-stone-700 hover:text-brand-maroon text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-stone-400" />
                      <span>{b('নতুন ছবি নির্বাচন করুন', 'Change Photo')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ 3. Dhak Audio Section (Clean Horizontal Card) ═══ */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAudio}
              className="w-11 h-11 rounded-xl bg-brand-maroon hover:bg-brand-dark text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 shrink-0 cursor-pointer"
              title={isPlayingAudio ? 'থামান' : 'প্লে করুন'}
            >
              {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">
                  {b('শারদীয়া ঢাকের বাদ্যি (Festival Dhak Audio)', 'Sharadiya Dhak Audio')}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  MP3
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {b('হোমপেজের ঢাকের বাদ্যি প্লেয়ারের অডিও ফাইল • সর্বোচ্চ ১৫ MB', 'Festival ambience soundtrack looped on the homepage • Max 15MB')}
              </p>
            </div>
          </div>

          {/* Audio Actions */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/mp3,audio/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleAudioUpload(e.target.files[0]);
              }}
            />

            <button
              type="button"
              disabled={uploadingAudio}
              onClick={() => audioInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {uploadingAudio ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Music className="w-3.5 h-3.5 text-amber-400" />
                  <span>{b('নতুন অডিও আপলোড করুন', 'Upload New MP3')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hidden Native Audio Element */}
        <audio
          ref={audioRef}
          src={
            audioTimestamp
              ? `${settings?.dhakAudio || '/assets/dhak.mp3'}?v=${audioTimestamp}`
              : (settings?.dhakAudio || '/assets/dhak.mp3')
          }
          onEnded={() => setIsPlayingAudio(false)}
        />
      </div>

      {/* ═══ 4. Brand Vector Icons (Minimal 5-Column Grid) ═══ */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            {b('ব্র্যান্ডিং ভেক্টর অ্যাসেটসমূহ', 'Official Vector Assets')}
          </h3>
          <span className="text-[11px] font-mono text-stone-400">
            {portalAssets.length} SVG Icons
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {portalAssets.map((asset) => (
            <div
              key={asset.path}
              className="p-3 rounded-xl border border-stone-200/70 bg-stone-50/50 hover:bg-white transition-all flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center p-1 shrink-0">
                  <img src={asset.path} alt={asset.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-semibold text-stone-800 truncate">
                  {asset.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => copyAssetPath(asset.path)}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors shrink-0 cursor-pointer"
                title={b('পাথ কপি করুন', 'Copy Path')}
              >
                {copiedAsset === asset.path ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

