'use client';
import { useState, useEffect } from 'react';
import {
  Megaphone, Camera, Users, Clock, RefreshCw, Sparkles,
  Plus, ImageIcon, FileText, Bell, UploadCloud, Eye,
  Check, Save, Timer, Flame, CalendarDays, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboard() {
  const { lang, b } = useLanguage();
  const [data, setData] = useState({
    photoCount: 0,
    noticeCount: 0,
    memberCount: 0,
    eventCount: 0,
    financeCount: 0,
    recentPhotos: [],
    recentNotices: [],
    recentFinances: [],
    settings: {},
    pujaNotices: 0,
    clubNotices: 0,
    samitiNotices: 0,
    pujaMembers: 0,
    clubMembers: 0,
    samitiMembers: 0,
    pujaPhotos: 0,
    clubPhotos: 0,
    samitiPhotos: 0,
    pujaFinances: 0,
    clubFinances: 0,
    samitiFinances: 0
  });

  const [loading, setLoading] = useState(true);

  // Emergency Flash Alert State
  const [flashOpen, setFlashOpen] = useState(false);
  const [savingFlash, setSavingFlash] = useState(false);
  const [flashMessage, setFlashMessage] = useState('');
  const [flashForm, setFlashForm] = useState({
    popupEnabled: 'false',
    popupTitle: '',
    popupMessage: '',
    durationHours: 3, // default 3 hours
    popupExpiresAt: ''
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        const gallery = json.gallery || [];
        const notices = json.notices || [];
        const members = json.members || [];
        const events = json.events || [];
        const finances = json.finances || json.finance || [];
        const settings = json.settings || {};

        const clubNotices = notices.filter(n => n.title?.startsWith('[Club]')).length;
        const samitiNotices = notices.filter(n => n.title?.startsWith('[Samiti]') || n.title?.startsWith('[Samity]')).length;
        const pujaNotices = notices.length - clubNotices - samitiNotices;

        const clubMembers = members.filter(m => m.role?.startsWith('[Club]')).length;
        const samitiMembers = members.filter(m => m.role?.startsWith('[Samiti]') || m.role?.startsWith('[Samity]')).length;
        const pujaMembers = members.length - clubMembers - samitiMembers;

        const clubPhotos = gallery.filter(g => g.program === 'Club & Sports' || g.program === 'Annual Sports' || g.category === 'Sports' || g.category === 'Club').length;
        const samitiPhotos = gallery.filter(g => g.program === 'Unnayan Samity' || g.program === 'Unnayan Samiti' || g.category === 'Samity' || g.category === 'Samiti' || g.category === 'Roads' || g.category === 'Greenery').length;
        const pujaPhotos = gallery.length - clubPhotos - samitiPhotos;

        const clubFinances = finances.filter(f => f.title?.startsWith('[Club]')).length;
        const samitiFinances = finances.filter(f => f.title?.startsWith('[Samiti]') || f.title?.startsWith('[Samity]')).length;
        const pujaFinances = finances.length - clubFinances - samitiFinances;

        setData({
          photoCount: gallery.length,
          noticeCount: notices.length,
          memberCount: members.length,
          eventCount: events.length,
          financeCount: finances.length,
          recentPhotos: gallery.slice(0, 4),
          recentNotices: notices.slice(0, 4),
          recentFinances: finances.slice(0, 4),
          settings,
          pujaNotices,
          clubNotices,
          samitiNotices,
          pujaMembers,
          clubMembers,
          samitiMembers,
          pujaPhotos,
          clubPhotos,
          samitiPhotos,
          pujaFinances,
          clubFinances,
          samitiFinances
        });

        // Initialize Flash Form
        setFlashForm({
          popupEnabled: settings.popupEnabled || 'false',
          popupTitle: settings.popupTitle || '',
          popupMessage: settings.popupMessage || '',
          durationHours: 3,
          popupExpiresAt: settings.popupExpiresAt || ''
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute countdown for active flash overlay
  const getFlashRemainingText = () => {
    if (flashForm.popupEnabled !== 'true') return null;
    if (!flashForm.popupExpiresAt) {
      return b('অনির্দিষ্টকাল সক্রিয় — ম্যানুয়ালি বন্ধ না করা পর্যন্ত', 'Active until manually disabled');
    }
    const expiresMs = new Date(flashForm.popupExpiresAt).getTime();
    const diffMs = expiresMs - Date.now();
    if (diffMs <= 0) {
      return b('মেয়াদ শেষ হয়েছে', 'Expired');
    }
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours > 0) {
      return b(`আর ${hours} ঘণ্টা ${remMins} মিনিট সক্রিয় থাকবে`, `${hours}h ${remMins}m remaining`);
    }
    return b(`আর ${mins} মিনিট সক্রিয় থাকবে`, `${mins}m remaining`);
  };

  const handleSaveFlash = async (e) => {
    if (e) e.preventDefault();
    setSavingFlash(true);

    let finalExpiresAt = '';
    if (flashForm.popupEnabled === 'true') {
      if (flashForm.durationHours > 0) {
        finalExpiresAt = new Date(Date.now() + flashForm.durationHours * 3600000).toISOString();
      } else {
        finalExpiresAt = ''; // unlimited
      }
    }

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          popupEnabled: flashForm.popupEnabled,
          popupTitle: flashForm.popupTitle,
          popupMessage: flashForm.popupMessage,
          popupExpiresAt: finalExpiresAt
        })
      });

      if (res.ok) {
        setFlashMessage(b('জরুরি ফ্ল্যাশ বার্তা সফলভাবে সংরক্ষিত হয়েছে!', 'Emergency alert saved successfully!'));
        setFlashForm(prev => ({ ...prev, popupExpiresAt: finalExpiresAt }));
        setFlashOpen(false);
        fetchDashboardData();
        setTimeout(() => setFlashMessage(''), 3500);
      } else {
        setFlashMessage(b('সংরক্ষণ ব্যর্থ হয়েছে।', 'Failed to save alert.'));
      }
    } catch (err) {
      setFlashMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setSavingFlash(false);
    }
  };

  const handleToggleFlashQuick = async () => {
    const nextState = flashForm.popupEnabled === 'true' ? 'false' : 'true';
    let finalExpiresAt = '';
    if (nextState === 'true') {
      finalExpiresAt = new Date(Date.now() + 3 * 3600000).toISOString(); // default 3h
    }

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          popupEnabled: nextState,
          popupExpiresAt: finalExpiresAt
        })
      });
      setFlashForm(prev => ({ ...prev, popupEnabled: nextState, popupExpiresAt: finalExpiresAt }));
      if (nextState === 'true') {
        setFlashMessage(b('জরুরি পপ-আপ চালু করা হয়েছে!', 'Emergency alert turned ON!'));
        if (!flashForm.popupTitle && !flashForm.popupMessage) {
          setFlashOpen(true);
        }
      } else {
        setFlashMessage(b('জরুরি পপ-আপ বন্ধ করা হয়েছে।', 'Emergency alert turned OFF.'));
      }
      setTimeout(() => setFlashMessage(''), 3000);
      fetchDashboardData();
    } catch (err) {
      console.error('Quick toggle failed', err);
    }
  };

  const isFlashActive = flashForm.popupEnabled === 'true' &&
    (!flashForm.popupExpiresAt || new Date(flashForm.popupExpiresAt).getTime() > Date.now());

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* ═══ App Command Centre Top Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-maroon to-brand-dark text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md ring-2 ring-brand-maroon/20 shrink-0">
            <span>ॐ</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
                {b('অ্যাডমিন কমান্ড সেন্টার', 'Admin Command Centre')}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{b('সক্রিয়', 'Active')}</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {b('বাঁশদ্রোণী সোনালী পার্ক — পূজা, ক্লাব ও সমিতির কেন্দ্রীয় পরিচালনা কেন্দ্র', 'Central control for Puja, Club, and Samiti')}
            </p>
          </div>
        </div>

        {/* Top Quick Actions (High-touch target) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/admin/notifications"
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-maroon hover:bg-brand-dark active:scale-98 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Bell className="w-4 h-4 text-amber-300" />
            <span>{b('ব্রডকাস্ট পুশ', 'Broadcast Alert')}</span>
          </Link>

          <button
            onClick={fetchDashboardData}
            title={b('রিফ্রেশ করুন', 'Refresh')}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 active:scale-98 text-xs font-semibold text-stone-700 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-maroon' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">{b('রিফ্রেশ', 'Refresh')}</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {flashMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{flashMessage}</span>
        </div>
      )}

      {/* ═══ 1. EMERGENCY FLASH OVERLAY TOP CONTROLLER (Dedicated ON/OFF Section) ═══ */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xs ${
        isFlashActive
          ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200'
          : 'bg-white border-stone-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              isFlashActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-stone-100 text-stone-500'
            }`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-stone-900">
                  {b('জরুরি ফ্ল্যাশ পপ-আপ বার্তা', 'Emergency Flash Overlay Alert')}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isFlashActive
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  {isFlashActive ? b('লাইভ সক্রিয়', 'Active Live') : b('নিষ্ক্রিয়', 'Disabled')}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {isFlashActive ? (
                  <span className="font-semibold text-rose-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>{getFlashRemainingText()}</span>
                    {flashForm.popupTitle && <span className="text-stone-700 font-bold ml-1">· &ldquo;{flashForm.popupTitle}&rdquo;</span>}
                  </span>
                ) : (
                  b('জরুরি আবহাওয়া, অঞ্জলি বা পরিবর্তনজনিত ঘোষণা দর্শকদের স্ক্রিনে তাৎক্ষণিক প্রদর্শন করতে সেট করুন', 'Broadcast urgent notices on visitor screens with auto-expiry timer')
                )}
              </p>
            </div>
          </div>

          {/* Dedicated ON / OFF Section & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap justify-end shrink-0">
            {/* Segmented ON / OFF Control */}
            <div className="inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200/90 shadow-2xs">
              <button
                type="button"
                onClick={() => !isFlashActive && handleToggleFlashQuick()}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isFlashActive
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title={b('জরুরি পপ-আপ চালু করুন', 'Turn ON Emergency Pop-up')}
              >
                <span className={`w-2 h-2 rounded-full ${isFlashActive ? 'bg-white animate-pulse' : 'bg-stone-400'}`} />
                <span>{b('চালু', 'ON')}</span>
              </button>
              <button
                type="button"
                onClick={() => isFlashActive && handleToggleFlashQuick()}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isFlashActive
                    ? 'bg-stone-800 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title={b('জরুরি পপ-আপ বন্ধ করুন', 'Turn OFF Emergency Pop-up')}
              >
                <span className={`w-2 h-2 rounded-full ${!isFlashActive ? 'bg-white' : 'bg-stone-400'}`} />
                <span>{b('বন্ধ', 'OFF')}</span>
              </button>
            </div>

            {/* Expandable Configuration Button */}
            <button
              type="button"
              onClick={() => setFlashOpen(!flashOpen)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <Timer className="w-3.5 h-3.5 text-amber-600" />
              <span>{flashOpen ? b('সম্পাদনা বন্ধ', 'Close') : b('সময় ও বার্তা সম্পাদনা', 'Set Duration & Message')}</span>
            </button>
          </div>
        </div>

        {/* Expandable Flash Overlay Configurator */}
        {flashOpen && (
          <form onSubmit={handleSaveFlash} className="mt-4 pt-4 border-t border-rose-200/60 space-y-3.5 animate-fade-in">
            {/* Status Select inside form */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  {b('পপ-আপের বর্তমান অবস্থা', 'Popup Current Status')}
                </span>
                <span className="text-[11px] text-stone-500">
                  {b('সংরক্ষণের পর ওয়েবসাইটের দর্শকদের সামনে অবিলম্বে প্রদর্শিত হবে কিনা নির্বাচন করুন', 'Choose whether the overlay should appear immediately on the website')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setFlashForm(prev => ({ ...prev, popupEnabled: 'true' }))}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    flashForm.popupEnabled === 'true'
                      ? 'bg-rose-600 border-rose-600 text-white shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{b('চালু', 'ON')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFlashForm(prev => ({ ...prev, popupEnabled: 'false' }))}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    flashForm.popupEnabled === 'false'
                      ? 'bg-stone-900 border-stone-900 text-white shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{b('বন্ধ', 'OFF')}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {b('পপ-আপ শিরোনাম', 'Popup Title')}
                </label>
                <input
                  type="text"
                  value={flashForm.popupTitle}
                  onChange={(e) => setFlashForm({ ...flashForm, popupTitle: e.target.value })}
                  placeholder={b('যেমন: ভারী বৃষ্টির কারণে অঞ্জলির সময় পরিবর্তন', 'e.g. Weather Alert / Schedule Update')}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {b('প্রদর্শনের সময়সীমা', 'Display Duration Timer')}
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { hrs: 1, label: b('১ ঘণ্টা', '1 Hour') },
                    { hrs: 3, label: b('৩ ঘণ্টা', '3 Hours') },
                    { hrs: 6, label: b('৬ ঘণ্টা', '6 Hours') },
                    { hrs: 24, label: b('২৪ ঘণ্টা', '24 Hours') },
                    { hrs: 0, label: b('অনির্দিষ্টকাল', 'Unlimited') },
                  ].map(p => (
                    <button
                      key={p.hrs}
                      type="button"
                      onClick={() => setFlashForm({ ...flashForm, durationHours: p.hrs })}
                      className={`py-1.5 px-1 rounded-lg text-center text-xs font-semibold border transition-all cursor-pointer ${
                        flashForm.durationHours === p.hrs
                          ? 'bg-rose-600 border-rose-600 text-white font-bold shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {b('জরুরি বার্তা / বিস্তারিত বিবরণ', 'Message Body')}
              </label>
              <textarea
                rows="2"
                value={flashForm.popupMessage}
                onChange={(e) => setFlashForm({ ...flashForm, popupMessage: e.target.value })}
                placeholder={b('দর্শনার্থী ও ভক্তবৃন্দের অবগতির জন্য জরুরি বার্তা...', 'Important alert instructions...')}
                className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFlashOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                {b('বাতিল', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={savingFlash}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {savingFlash ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{b('সংরক্ষণ করুন', 'Save Settings')}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ═══ 2. THE 3 PRIMARY COMMAND HUBS (NOTICES, GALLERY, AUDIT PDFS) ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* ─── HUB 1: NOTICE BOARD ─── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-amber-400 transition-all">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900 leading-tight">
                    {b('নোটিশ বোর্ড', 'Notice Board')}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {b('বিজ্ঞপ্তি ও অফিসিয়াল সার্কুলার', 'Notices & Circulars')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-sans block leading-none">
                  {data.noticeCount}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mt-1 block">
                  {b('মোট নোটিশ', 'Total Notices')}
                </span>
              </div>
            </div>

            {/* 3-Wing Breakdown Chips */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-center">
                <span className="text-[10px] font-bold text-rose-700 block">🌺 পূজা</span>
                <span className="text-sm sm:text-base font-black text-rose-900">{data.pujaNotices}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center">
                <span className="text-[10px] font-bold text-amber-700 block">🏆 ক্লাব</span>
                <span className="text-sm sm:text-base font-black text-amber-900">{data.clubNotices}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-center">
                <span className="text-[10px] font-bold text-emerald-700 block">🏛️ সমিতি</span>
                <span className="text-sm sm:text-base font-black text-emerald-900">{data.samitiNotices}</span>
              </div>
            </div>
          </div>

          {/* Quick Buttons (Thumb-friendly 44px touch targets) */}
          <div className="grid grid-cols-2 gap-2 pt-4 mt-3 border-t border-stone-100">
            <Link
              href="/admin/notices"
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-brand-maroon hover:bg-brand-dark active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>{b('নতুন নোটিশ', 'Add Notice')}</span>
            </Link>
            <Link
              href="/admin/notices"
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-4 h-4 text-stone-500" />
              <span>{b('সব নোটিশ ↗', 'Manage ↗')}</span>
            </Link>
          </div>
        </div>

        {/* ─── HUB 2: PHOTO GALLERY ─── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-rose-400 transition-all">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900 leading-tight">
                    {b('ফটো গ্যালারি', 'Photo Gallery')}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {b('স্মৃতি ও উৎসবের অ্যালবাম', '3-Wing Photo Archives')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-sans block leading-none">
                  {data.photoCount}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mt-1 block">
                  {b('মোট ছবি', 'Total Photos')}
                </span>
              </div>
            </div>

            {/* 3-Wing Breakdown Chips */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-center">
                <span className="text-[10px] font-bold text-rose-700 block">🌺 পূজা</span>
                <span className="text-sm sm:text-base font-black text-rose-900">{data.pujaPhotos}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center">
                <span className="text-[10px] font-bold text-amber-700 block">🏆 ক্লাব</span>
                <span className="text-sm sm:text-base font-black text-amber-900">{data.clubPhotos}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-center">
                <span className="text-[10px] font-bold text-emerald-700 block">🏛️ সমিতি</span>
                <span className="text-sm sm:text-base font-black text-emerald-900">{data.samitiPhotos}</span>
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-4 mt-3 border-t border-stone-100">
            <Link
              href="/admin/gallery"
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <UploadCloud className="w-4 h-4 text-rose-200" />
              <span>{b('ছবি আপলোড', 'Upload Photo')}</span>
            </Link>
            <Link
              href="/admin/gallery"
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-4 h-4 text-stone-500" />
              <span>{b('গ্যালারি ↗', 'Manage ↗')}</span>
            </Link>
          </div>
        </div>

        {/* ─── HUB 3: AUDIT & ACCOUNTS PDF ─── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between hover:shadow-md hover:border-emerald-400 transition-all">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900 leading-tight">
                    {b('হিসাব ও অডিট PDF', 'Audit & Accounts')}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {b('আর্থিক স্বচ্ছতা ও সার্কুলার', 'Financial PDFs & Audits')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-sans block leading-none">
                  {data.financeCount}
                </span>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mt-1 block">
                  {b('মোট অডিট', 'Total Audits')}
                </span>
              </div>
            </div>

            {/* 3-Wing Breakdown Chips */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-center">
                <span className="text-[10px] font-bold text-rose-700 block">🌺 পূজা</span>
                <span className="text-sm sm:text-base font-black text-rose-900">{data.pujaFinances}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center">
                <span className="text-[10px] font-bold text-amber-700 block">🏆 ক্লাব</span>
                <span className="text-sm sm:text-base font-black text-amber-900">{data.clubFinances}</span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-center">
                <span className="text-[10px] font-bold text-emerald-700 block">🏛️ সমিতি</span>
                <span className="text-sm sm:text-base font-black text-emerald-900">{data.samitiFinances}</span>
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-4 mt-3 border-t border-stone-100">
            <Link
              href="/admin/finance"
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>{b('অডিট PDF আপলোড', 'Upload PDF')}</span>
            </Link>
            <Link
              href="/admin/finance"
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-98 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-4 h-4 text-stone-500" />
              <span>{b('হিসাব পরিচালনা ↗', 'Manage ↗')}</span>
            </Link>
          </div>
        </div>

      </div>

      {/* ═══ 3. THREE COMMUNITY WINGS APP ACCESS ═══ */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-maroon inline-block animate-pulse" />
              <span>{b('৩টি মূল শাখার কুইক অ্যাক্সেস', 'Three Community Wings Access')}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {b('শারদীয়া দুর্গোৎসব, সোনালী সঙ্ঘ ও উন্নয়ন সমিতি — শাখার কার্যক্রম দ্রুত পরিচালনা করুন', 'Quickly access and manage actions for Puja, Club, and Samiti')}
            </p>
          </div>
          <span className="text-[11px] font-bold text-stone-400 self-start sm:self-auto bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200/60">
            {b('৩টি সক্রিয় উইং', '3 Active Wings')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Wing 1: Puja */}
          <div className="p-3.5 rounded-2xl border border-rose-200/90 bg-rose-50/30 flex flex-col justify-between space-y-3 hover:border-rose-400 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌺</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                    {b('শারদীয়া দুর্গোৎসব', 'Durga Puja Wing')}
                  </h3>
                  <span className="text-[10px] text-rose-700 font-semibold">{b('২০২৬ • শারদোৎসব', '2026 • Festival')}</span>
                </div>
              </div>
              <Link
                href="/puja"
                target="_blank"
                className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors"
                title={b('পাবলিক পেজ দেখুন', 'View Public Page')}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href="/admin/timeline" className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs font-semibold text-rose-800 hover:bg-rose-50 transition-colors">
                {b('পূজা নির্ঘণ্ট', 'Schedule')}
              </Link>
              <Link href="/admin/notices" className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs font-semibold text-rose-800 hover:bg-rose-50 transition-colors">
                {b('নোটিশ', 'Notices')}
              </Link>
              <Link href="/admin/gallery" className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs font-semibold text-rose-800 hover:bg-rose-50 transition-colors">
                {b('ছবি', 'Photos')}
              </Link>
              <Link href="/admin/finance" className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs font-semibold text-rose-800 hover:bg-rose-50 transition-colors">
                {b('অডিট', 'Audit')}
              </Link>
            </div>
          </div>

          {/* Wing 2: Club */}
          <div className="p-3.5 rounded-2xl border border-amber-200/90 bg-amber-50/30 flex flex-col justify-between space-y-3 hover:border-amber-400 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                    {b('সোনালী সঙ্ঘ ক্লাব', 'Sonali Sangha Club')}
                  </h3>
                  <span className="text-[10px] text-amber-700 font-semibold">{b('ক্রীড়া ও সংস্কৃতি শাখা', 'Sports & Cultural Wing')}</span>
                </div>
              </div>
              <Link
                href="/club"
                target="_blank"
                className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 text-xs font-bold transition-colors"
                title={b('পাবলিক পেজ দেখুন', 'View Public Page')}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href="/admin/committee" className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors">
                {b('ক্লাব পরিষদ', 'Committee')}
              </Link>
              <Link href="/admin/notices" className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors">
                {b('নোটিশ', 'Notices')}
              </Link>
              <Link href="/admin/gallery" className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors">
                {b('ছবি', 'Photos')}
              </Link>
              <Link href="/admin/finance" className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors">
                {b('অডিট', 'Audit')}
              </Link>
            </div>
          </div>

          {/* Wing 3: Samiti */}
          <div className="p-3.5 rounded-2xl border border-emerald-200/90 bg-emerald-50/30 flex flex-col justify-between space-y-3 hover:border-emerald-400 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏛️</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                    {b('উন্নয়ন সমিতি', 'Unnayan Samiti RWA')}
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-semibold">REG: SO067242 • নাগরিক কল্যাণ</span>
                </div>
              </div>
              <Link
                href="/samiti"
                target="_blank"
                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                title={b('পাবলিক পেজ দেখুন', 'View Public Page')}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Link href="/admin/committee" className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors">
                {b('সমিতি পরিষদ', 'Committee')}
              </Link>
              <Link href="/admin/notices" className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors">
                {b('নোটিশ', 'Notices')}
              </Link>
              <Link href="/admin/gallery" className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors">
                {b('ছবি', 'Photos')}
              </Link>
              <Link href="/admin/finance" className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors">
                {b('অডিট', 'Audit')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 4. ESSENTIAL UTILITIES ROW (App-style tiles) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/admin/committee"
          className="bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-indigo-400 hover:shadow-sm transition-all group flex flex-col justify-between min-h-[92px]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800">{b('কমিটি সদস্য', 'Committee')}</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            {b(`${data.memberCount} জন সদস্য নথিভুক্ত`, `${data.memberCount} members roster`)}
          </div>
        </Link>

        <Link
          href="/admin/timeline"
          className="bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-rose-400 hover:shadow-sm transition-all group flex flex-col justify-between min-h-[92px]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800">{b('পূজা নির্ঘণ্ট', 'Puja Schedule')}</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            {b('তিথি, অঞ্জলি ও আরতি সূচি', 'Rituals & Aarti Timings')}
          </div>
        </Link>

        <Link
          href="/admin/media"
          className="bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-amber-400 hover:shadow-sm transition-all group flex flex-col justify-between min-h-[92px]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800">{b('ব্যানার ও অডিও', 'Media & Banners')}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            {b('হিরো ব্যানার ও ঢাকের বাদ্যি', 'Hero banners & Dhak sound')}
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-brand-maroon/60 hover:shadow-sm transition-all group flex flex-col justify-between min-h-[92px]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800">{b('পোর্টাল সেটিংস', 'Portal Settings')}</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-brand-maroon flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            {b('থিম, মারকুই ও কাউন্টডাউন', 'Theme, marquee & countdown')}
          </div>
        </Link>
      </div>

    </div>
  );
}
