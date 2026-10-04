'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Palette, Type, Clock, Sparkles, DollarSign, Save,
  CheckCircle2, AlertCircle, RefreshCw, Calendar, Trophy, ShieldCheck,
  Image as ImageIcon, UploadCloud, RotateCcw
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsManagerPage() {
  const { lang, b } = useLanguage();
  const [settings, setSettings] = useState({
    heroHeading: '',
    heroSubHeading: '',
    heroTagline: '',
    countdownDate: '2026-10-17T00:00:00+05:30',
    countdownHeading: '',
    currentYear: '74',
    primaryColor: '#E11D48',
    secondaryColor: '#F59E0B',
    themeTitle: '',
    themeSubtitle: '',
    pandalArtist: '',
    idolArtist: '',
    lightingArtist: '',
    totalCollection: '',
    totalExpense: '',
    majorExpenseTitle: '',
    majorExpenseAmount: '',
    // Club settings
    clubHeroTitle: '',
    clubHeroTagline: '',
    clubHeroImage: '',
    clubTotalCollection: '',
    clubTotalExpense: '',
    clubMajorExpenseTitle: '',
    clubMajorExpenseAmount: '',
    // Samiti settings
    samitiHeroTitle: '',
    samitiHeroTagline: '',
    samitiHeroImage: '',
    samitiTotalCollection: '',
    samitiTotalExpense: '',
    samitiMajorExpenseTitle: '',
    samitiMajorExpenseAmount: ''
  });

  const [activeTab, setActiveTab] = useState('branding');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching settings:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (name, value) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const getDatetimeLocalValue = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      const tzOffset = 330;
      const localTime = new Date(date.getTime() + (tzOffset + date.getTimezoneOffset()) * 60000);
      return localTime.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  const handleDatetimeChange = (val) => {
    if (!val) return;
    const isoWithTz = `${val}:00+05:30`;
    handleChange('countdownDate', isoWithTz);
  };

  const clubHeroFileInputRef = useRef(null);
  const [uploadingHero, setUploadingHero] = useState(false);

  const handleHeroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'club-hero');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        const freshUrl = resData.url + '?t=' + Date.now();
        handleChange('clubHeroImage', freshUrl);
        setMessage(b('ক্লাব হিরো ব্যানার সফলভাবে আপলোড হয়েছে!', 'Club hero banner uploaded successfully!'));
        setTimeout(() => setMessage(''), 4000);
      } else {
        setMessage(b('আপলোড ব্যর্থ হয়েছে: ' + (resData.error || 'Unknown error'), 'Upload failed: ' + (resData.error || 'Unknown error')));
      }
    } catch (err) {
      setMessage(b('আপলোড ত্রুটি: ' + err.message, 'Upload error: ' + err.message));
    } finally {
      setUploadingHero(false);
      if (clubHeroFileInputRef.current) clubHeroFileInputRef.current.value = '';
    }
  };

  const samitiHeroFileInputRef = useRef(null);
  const [uploadingSamitiHero, setUploadingSamitiHero] = useState(false);

  const handleSamitiHeroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSamitiHero(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'samiti-hero');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        const freshUrl = resData.url + '?t=' + Date.now();
        handleChange('samitiHeroImage', freshUrl);
        setMessage(b('সমিতি হিরো ব্যানার সফলভাবে আপলোড হয়েছে!', 'Samiti hero banner uploaded successfully!'));
        setTimeout(() => setMessage(''), 4000);
      } else {
        setMessage(b('আপলোড ব্যর্থ হয়েছে: ' + (resData.error || 'Unknown error'), 'Upload failed: ' + (resData.error || 'Unknown error')));
      }
    } catch (err) {
      setMessage(b('আপলোড ত্রুটি: ' + err.message, 'Upload error: ' + err.message));
    } finally {
      setUploadingSamitiHero(false);
      if (samitiHeroFileInputRef.current) samitiHeroFileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage(b('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!', 'Settings saved successfully!'));
        setTimeout(() => setMessage(''), 4000);
      } else {
        setMessage(b('ত্রুটি: সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।', 'Error: Failed to save settings.'));
      }
    } catch (err) {
      setMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'branding', labelBn: 'রং ও ব্র্যান্ডিং', labelEn: 'Theme Colors', icon: Palette },
    { id: 'hero', labelBn: 'হোমপেজ ও দুর্গাপূজা', labelEn: 'Puja & Hero', icon: Type },
    { id: 'countdown', labelBn: 'কাউন্টডাউন টাইমার', labelEn: 'Countdown Timer', icon: Clock },
    { id: 'theme', labelBn: 'পূজার থিম ও শিল্পী', labelEn: 'Theme & Artisans', icon: Sparkles },
    { id: 'finance', labelBn: 'পূজা বাজেট সারসংক্ষেপ', labelEn: 'Puja Financials', icon: DollarSign },
    { id: 'club', labelBn: 'সোনালী সঙ্ঘ ক্লাব', labelEn: 'Club Controls', icon: Trophy },
    { id: 'samiti', labelBn: 'উন্নয়ন সমিতি', labelEn: 'Samiti Controls', icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-stone-400">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-brand-maroon" />
        <span className="text-xs">{b('সেটিংস লোড হচ্ছে...', 'Loading settings...')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
            {b('গ্লোবাল সেটিংস', 'Global Settings')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('ব্র্যান্ডিং রং, হোমপেজ বার্তা, কাউন্টডাউন ও পূজার মূল তথ্য পরিচালনা করুন', 'Manage theme colors, banner copy, countdown target, and festival details')}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-brand-maroon hover:bg-brand-dark text-white text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{b('সংরক্ষণ করুন', 'Save Settings')}</span>
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold border flex items-center gap-2.5 shadow-xs ${
          message.includes('ত্রুটি') || message.includes('Error')
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {message.includes('ত্রুটি') || message.includes('Error') ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* ═══ 3-Pillar Quick Pillar Switcher ═══ */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100 border border-stone-200/90 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', bn: 'সব সেটিংস', en: 'All Settings', icon: '⚙️' },
          { id: 'puja', bn: '🌺 শারদীয়া দুর্গাপূজা', en: '🌺 Durga Puja', icon: '🌺' },
          { id: 'club', bn: '🏆 সোনালী সঙ্ঘ ক্লাব', en: '🏆 Sonali Sangha Club', icon: '🏆' },
          { id: 'samiti', bn: '🏛️ উন্নয়ন সমিতি', en: '🏛️ Unnayan Samiti', icon: '🏛️' },
        ].map((pillar) => (
          <button
            key={pillar.id}
            type="button"
            onClick={() => {
              if (pillar.id === 'puja') setActiveTab('hero');
              else if (pillar.id === 'club') setActiveTab('club');
              else if (pillar.id === 'samiti') setActiveTab('samiti');
              else if (pillar.id === 'all') setActiveTab('branding');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              (pillar.id === 'puja' && ['hero', 'countdown', 'theme', 'finance'].includes(activeTab)) ||
              (pillar.id === 'club' && activeTab === 'club') ||
              (pillar.id === 'samiti' && activeTab === 'samiti') ||
              (pillar.id === 'all' && activeTab === 'branding')
                ? 'bg-stone-900 text-white shadow-xs font-extrabold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <span>{pillar.icon}</span>
            <span>{lang === 'bn' ? pillar.bn : pillar.en}</span>
          </button>
        ))}
      </div>

      {/* Clean Tabs Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-stone-900 text-white shadow-xs font-bold'
                  : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-400' : 'text-stone-400'}`} />
              <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200/80 shadow-xs">
        
        {/* 1. Theme Colors */}
        {activeTab === 'branding' && (
          <div className="space-y-5">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-maroon" />
                <span>{b('ওয়েবসাইটের ব্র্যান্ডিং রং', 'Website Branding Colors')}</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {b('বোতাম, হেডলাইন হাইলাইট ও অ্যাকসেন্ট উপাদান এই রঙে প্রদর্শিত হবে', 'Primary brand buttons, badges, and accents will reflect these colors')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Color */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    {b('প্রধান রং (Primary)', 'Primary Color')}
                  </label>
                  <span className="text-xs font-mono font-bold text-stone-600">{settings.primaryColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="h-9 w-14 rounded-lg cursor-pointer border border-stone-300 bg-white p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold uppercase outline-none focus:ring-2 focus:ring-brand-maroon/20"
                  />
                </div>
                <p className="text-[11px] text-stone-400">{b('ডিফল্ট: #E11D48 (উৎসবের আলতা লাল)', 'Default: #E11D48 (Alta Red)')}</p>
              </div>

              {/* Secondary Color */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    {b('অ্যাকসেন্ট রং (Accent)', 'Secondary Color')}
                  </label>
                  <span className="text-xs font-mono font-bold text-stone-600">{settings.secondaryColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="h-9 w-14 rounded-lg cursor-pointer border border-stone-300 bg-white p-0.5"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold uppercase outline-none focus:ring-2 focus:ring-brand-maroon/20"
                  />
                </div>
                <p className="text-[11px] text-stone-400">{b('ডিফল্ট: #F59E0B (উজ্জ্বল সোনালী ও শিউলির রং)', 'Default: #F59E0B (Amber Gold)')}</p>
              </div>
            </div>

            {/* ═══ Real-Time Color Combination Live Preview ═══ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 space-y-3.5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-400 block">
                    {b('রিয়েল-টাইম লাইভ প্রিভিউ', 'Real-Time Color Preview')}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {b('রঙের সামঞ্জস্য ও কনট্রাস্ট প্রিভিউ', 'Theme Palette & Component Contrast')}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400">
                  <span>Primary: <strong className="text-white uppercase">{settings.primaryColor}</strong></span>
                  <span>•</span>
                  <span>Secondary: <strong className="text-white uppercase">{settings.secondaryColor}</strong></span>
                </div>
              </div>

              {/* Simulated Portal Elements */}
              <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md shrink-0 text-base"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    ॐ
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Bansdroni Sonali Park
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{ backgroundColor: settings.secondaryColor, color: '#1c1917' }}
                      >
                        {settings.currentYear || '74'}তম বর্ষ
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      {settings.themeTitle || '"অতীতের আয়নায় আগামী"'}
                    </p>
                  </div>
                </div>

                {/* Simulated Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    {b('প্রধান বোতাম', 'Primary Button')}
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
                    style={{ backgroundColor: settings.secondaryColor, color: '#1c1917' }}
                  >
                    {b('অ্যাকসেন্ট বোতাম', 'Accent Button')}
                  </div>
                </div>
              </div>

              {/* Gradient Transition Bar */}
              <div
                className="h-1.5 rounded-full w-full shadow-2xs"
                style={{
                  background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`
                }}
              />
            </div>
          </div>
        )}

        {/* 2. Hero & Headlines */}
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-brand-maroon" />
                <span>{b('হোমপেজ ব্যানার ও মারকুই টেক্সট', 'Hero Banner & Marquee')}</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {b('ওয়েবসাইটের শীর্ষে চলমান মারকুই বার্তা ও প্রধান শিরোনামসমূহ', 'Top running marquee announcements and primary landing headlines')}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('শীর্ষ মারকুই ঘোষণা বার্তা (Top Announcement Marquee)', 'Top Running Announcement Marquee')}
              </label>
              <textarea
                rows="2"
                value={settings.heroTagline || ''}
                onChange={(e) => handleChange('heroTagline', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl p-3 text-base sm:text-xs focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                placeholder={b('🍁 শরতের নীল আকাশ আর শিউলির গন্ধে মেতেছে বাঁশদ্রোণী...', 'Welcome to Bansdroni Sonali Park Durga Puja 2026...')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('হিরো প্রধান শিরোনাম (Hero Heading)', 'Hero Main Heading')}
                </label>
                <input
                  type="text"
                  value={settings.heroHeading || ''}
                  onChange={(e) => handleChange('heroHeading', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder={b('শারদ প্রাতে মায়ের আগমন...', 'Sharad Prate Mayer Agomoni...')}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('হিরো সাব-হেডিং (Hero Subtitle)', 'Hero Subtitle')}
                </label>
                <input
                  type="text"
                  value={settings.heroSubHeading || ''}
                  onChange={(e) => handleChange('heroSubHeading', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder={b('আনন্দ আর আলোয় সাজুক ভুবন।', 'May the festival bring joy and peace to all.')}
                />
              </div>
            </div>

            <div className="w-full sm:w-48">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('পূজার বর্ষ সংখ্যা (Edition)', 'Festival Edition (Years)')}
              </label>
              <input
                type="text"
                value={settings.currentYear || '74'}
                onChange={(e) => handleChange('currentYear', e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-bold font-mono focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                placeholder="74"
              />
              <p className="text-[10px] text-stone-400 mt-1">{b('যেমন: 74 (৭৪তম বর্ষের শারদোৎসব)', 'e.g. 74th year celebration')}</p>
            </div>
          </div>
        )}

        {/* 3. Countdown Timer */}
        {activeTab === 'countdown' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-maroon" />
                <span>{b('কাউন্টডাউন টাইমার ও লক্ষ্য তারিখ', 'Countdown Target & Timer')}</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {b('কাউন্টডাউন ঘড়ি স্বয়ংক্রিয়ভাবে উৎসবের দিন পর্যন্ত সেকেন্ড গণনা করবে', 'Countdown capsule on the homepage counts down live to this target')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('কাউন্টডাউন শিরোনাম (Countdown Heading)', 'Countdown Heading')}
                </label>
                <input
                  type="text"
                  value={settings.countdownHeading || ''}
                  onChange={(e) => handleChange('countdownHeading', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder={b('মহাষ্টমী আসতে আর মাত্র', 'Days until Maha Ashtami')}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('লক্ষ্য তারিখ ও সময় (Target Date & Time)', 'Target Date & Time')}
                </label>
                <input
                  type="datetime-local"
                  value={getDatetimeLocalValue(settings.countdownDate)}
                  onChange={(e) => handleDatetimeChange(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                />
              </div>
            </div>

            {/* Quick Presets for Durga Puja 2026 */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-maroon" />
                {b('২০২৬ শারদোৎসব দ্রুত প্রিসেট (Quick Presets)', 'Durga Puja 2026 Presets')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { nameBn: 'মহাষষ্ঠী (16 Oct 2026)', nameEn: 'Maha Shashthi (16 Oct)', date: '2026-10-16T00:00:00+05:30', headingBn: 'মহাষষ্ঠী আসতে আর মাত্র', headingEn: 'Maha Shashthi in' },
                  { nameBn: 'মহাসপ্তমী (17 Oct 2026)', nameEn: 'Maha Saptami (17 Oct)', date: '2026-10-17T00:00:00+05:30', headingBn: 'মহাসপ্তমী আসতে আর মাত্র', headingEn: 'Maha Saptami in' },
                  { nameBn: 'মহাষ্টমী (18 Oct 2026)', nameEn: 'Maha Ashtami (18 Oct)', date: '2026-10-18T00:00:00+05:30', headingBn: 'মহাষ্টমী আসতে আর মাত্র', headingEn: 'Maha Ashtami in' },
                  { nameBn: 'মহানবমী (19 Oct 2026)', nameEn: 'Maha Nabami (19 Oct)', date: '2026-10-19T00:00:00+05:30', headingBn: 'মহানবমী আসতে আর মাত্র', headingEn: 'Maha Nabami in' },
                  { nameBn: 'বিজয়া দশমী (20 Oct 2026)', nameEn: 'Bijoya Dashami (20 Oct)', date: '2026-10-20T00:00:00+05:30', headingBn: 'বিজয়া দশমী আসতে আর মাত্র', headingEn: 'Bijoya Dashami in' },
                ].map((p) => (
                  <button
                    key={p.nameEn}
                    type="button"
                    onClick={() => {
                      handleChange('countdownDate', p.date);
                      handleChange('countdownHeading', lang === 'bn' ? p.headingBn : p.headingEn);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:border-brand-maroon hover:text-brand-maroon transition-all cursor-pointer shadow-2xs"
                  >
                    {lang === 'bn' ? p.nameBn : p.nameEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Puja Theme & Artisans */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-maroon" />
                <span>{b('পূজার থিম ও বিশিষ্ট শিল্পীবৃন্দ', 'Festival Theme & Creative Artisans')}</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {b('মণ্ডপ, প্রতিমা এবং আলোকসজ্জার মূল আকর্ষণ তথ্য', 'Pandal theme, idol sculptor, and lighting director details')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('থিমের নাম (বাংলায়)', 'Theme Title (Bengali)')}
                </label>
                <input
                  type="text"
                  value={settings.themeTitle || ''}
                  onChange={(e) => handleChange('themeTitle', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder='"অতীতের আয়নায় আগামী"'
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('Theme Subtitle (English)', 'Theme Subtitle (English)')}
                </label>
                <input
                  type="text"
                  value={settings.themeSubtitle || ''}
                  onChange={(e) => handleChange('themeSubtitle', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder="(Reflections of the Past)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('মণ্ডপ শিল্পী', 'Pandal Artist')}
                </label>
                <input
                  type="text"
                  value={settings.pandalArtist || ''}
                  onChange={(e) => handleChange('pandalArtist', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder={b('শিল্প নিকেতন', 'Artisan Studio')}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('প্রতিমা শিল্পী', 'Idol Sculptor')}
                </label>
                <input
                  type="text"
                  value={settings.idolArtist || ''}
                  onChange={(e) => handleChange('idolArtist', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder={b('সনাতন রুদ্র পাল', 'Sanatan Rudra Pal')}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('আলোকসজ্জা শিল্পী', 'Lighting Director')}
                </label>
                <input
                  type="text"
                  value={settings.lightingArtist || ''}
                  onChange={(e) => handleChange('lightingArtist', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder={b('দাস ইলেকট্রিক', 'Das Electric')}
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. Financial Summary for /transparency */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-maroon" />
                <span>{b('আর্থিক স্বচ্ছতা সারসংক্ষেপ (/transparency)', 'Financial Summary (/transparency)')}</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {b('নাগরিকদের জন্য স্বচ্ছতা পেজে প্রদর্শিত মূল বাজেট পরিসংখ্যান', 'Key financial figures displayed on the public transparency page')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('মোট আদায় / সংগ্রহ (Total Collection)', 'Total Collection')}
                </label>
                <input
                  type="text"
                  value={settings.totalCollection || ''}
                  onChange={(e) => handleChange('totalCollection', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder="₹ 14,50,000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('মোট খরচ (Total Expenditure)', 'Total Expenditure')}
                </label>
                <input
                  type="text"
                  value={settings.totalExpense || ''}
                  onChange={(e) => handleChange('totalExpense', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder="₹ 13,85,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('প্রধান ব্যয়ের খাত (Major Expense Head)', 'Major Expense Head')}
                </label>
                <input
                  type="text"
                  value={settings.majorExpenseTitle || ''}
                  onChange={(e) => handleChange('majorExpenseTitle', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder="Pandal Construction"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('প্রধান ব্যয়ের পরিমাণ (Major Expense Amount)', 'Major Expense Amount')}
                </label>
                <input
                  type="text"
                  value={settings.majorExpenseAmount || ''}
                  onChange={(e) => handleChange('majorExpenseAmount', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  placeholder="₹ 6,00,000"
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. Sonali Sangha Club Controls */}
        {activeTab === 'club' && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>{b('সোনালী সঙ্ঘ ক্লাব সেটিংস (/club)', 'Sonali Sangha Club Settings (/club)')}</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {b('ক্লাবের প্রধান শিরোনাম, ভূমিকা বার্তা এবং বাৎসরিক ক্রীড়া ও সাংস্কৃতিক বাজেট পরিচালনা করুন', 'Manage club hero titles, mission tagline, and annual sports/cultural financial totals')}
                </p>
              </div>
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                {b('ক্লাব শাখা', 'Club Wing')}
              </span>
            </div>

            {/* Club Hero Copy */}
            <div className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/20 space-y-4">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                {b('ক্লাব পেজ ব্যানার ও ভূমিকা', 'Club Hero Banner & Overview')}
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('ক্লাবের প্রধান শিরোনাম (Club Hero Title)', 'Club Hero Title')}
                </label>
                <input
                  type="text"
                  value={settings.clubHeroTitle || ''}
                  onChange={(e) => handleChange('clubHeroTitle', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                  placeholder="সোনালী সঙ্ঘ"
                />
                <p className="text-[11px] text-stone-400 mt-1">{b('ডিফল্ট: সোনালী সঙ্ঘ (ক্লাব শব্দটি স্বয়ংক্রিয়ভাবে সোনালী রঙে যুক্ত হবে)', 'Default: Sonali Sangha (Club will be automatically highlighted)')}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('ক্লাব বিবরণ ও বার্তা (Club Tagline & Intro)', 'Club Tagline & Intro')}
                </label>
                <textarea
                  rows={3}
                  value={settings.clubHeroTagline || ''}
                  onChange={(e) => handleChange('clubHeroTagline', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-normal focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none leading-relaxed"
                  placeholder="বাঁশদ্রোণী সোনালী পার্কের সংস্কৃতি, ক্রীড়া ও যুবকল্যাণের প্রাণকেন্দ্র..."
                />
              </div>
            </div>

            {/* Club Hero Banner Image Control */}
            <div className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>{b('ক্লাব হিরো ব্যানার ছবি (Club Hero Banner Image)', 'Club Hero Banner Image')}</span>
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {b('স্ট্যান্ডার্ড ১৬:৯ ল্যান্ডস্কেপ অনুপাতের ছবি ব্যবহার করুন (অনুপাত 16:9)', 'Standard 16:9 landscape aspect ratio banner')}
                  </p>
                </div>
                {settings.clubHeroImage && settings.clubHeroImage !== '/assets/club-hero-banner.jpg' && (
                  <button
                    type="button"
                    onClick={() => handleChange('clubHeroImage', '/assets/club-hero-banner.jpg')}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200/80 shadow-2xs cursor-pointer hover:bg-white"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{b('ডিফল্ট ব্যানারে রিসেট', 'Reset Default')}</span>
                  </button>
                )}
              </div>

              {/* Live Banner Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-300/60 aspect-[16/9] max-h-56 bg-stone-900 shadow-md group">
                <img
                  src={settings.clubHeroImage || '/assets/club-hero-banner.jpg'}
                  alt="Club Banner Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />
                <div className="absolute bottom-3 left-4 right-4 text-white z-10 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-mono">
                      {b('লাইভ হিরো প্রিভিউ', 'Live Banner Preview')}
                    </span>
                    <h4 className="text-base sm:text-lg font-serif font-black drop-shadow">
                      {settings.clubHeroTitle || b('সোনালী সঙ্ঘ', 'Sonali Sangha')} <span className="text-amber-400">{b('ক্লাব', 'Club')}</span>
                    </h4>
                  </div>
                  <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded text-stone-300 font-mono border border-white/10">
                    16:9 Ratio
                  </span>
                </div>
              </div>

              {/* Upload & URL Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('ছবির পাথ বা ইউআরএল (Image URL / Path)', 'Image URL or Asset Path')}
                  </label>
                  <input
                    type="text"
                    value={settings.clubHeroImage || ''}
                    onChange={(e) => handleChange('clubHeroImage', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-mono text-stone-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                    placeholder="/assets/club-hero-banner.jpg"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    {b('ডিফল্ট: /assets/club-hero-banner.jpg বা যেকোনো কাস্টম লিঙ্ক দিন', 'Default: /assets/club-hero-banner.jpg or paste any custom image URL')}
                  </p>
                </div>

                <div className="flex flex-col justify-end">
                  <input
                    type="file"
                    ref={clubHeroFileInputRef}
                    onChange={handleHeroUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingHero}
                    onClick={() => clubHeroFileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {uploadingHero ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{b('আপলোড হচ্ছে...', 'Uploading...')}</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 text-stone-950" />
                        <span>{b('নতুন ছবি আপলোড', 'Upload Image')}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-400 mt-1 text-center">
                    JPG, PNG, WebP (max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Club Financial Metrics */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                {b('ক্লাব আর্থিক সারসংক্ষেপ (Club Accounts & Transparency)', 'Club Accounts & Financial Metrics')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('মোট বাৎসরিক তহবিল (Total Club Collection)', 'Total Club Collection')}
                  </label>
                  <input
                    type="text"
                    value={settings.clubTotalCollection || ''}
                    onChange={(e) => handleChange('clubTotalCollection', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                    placeholder="₹ ৮,৫০,০০০"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">{b('সদস্য চাঁদা, অনুদান ও টুর্নামেন্ট স্পনসরশিপ', 'Member subscriptions & sponsorships')}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('মোট সামগ্রিক খরচ (Total Expenditure)', 'Total Expenditure')}
                  </label>
                  <input
                    type="text"
                    value={settings.clubTotalExpense || ''}
                    onChange={(e) => handleChange('clubTotalExpense', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                    placeholder="₹ ৭,৯৫,০০০"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">{b('টুর্নামেন্ট, জার্সি, ট্রফি ও সরঞ্জাম', 'Tournaments, equipment & prizes')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('প্রধান ব্যয়ের খাত (Major Expense Head)', 'Major Expense Head')}
                  </label>
                  <input
                    type="text"
                    value={settings.clubMajorExpenseTitle || ''}
                    onChange={(e) => handleChange('clubMajorExpenseTitle', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                    placeholder="ক্রীড়া টুর্নামেন্ট ও উৎসব"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('প্রধান ব্যয়ের পরিমাণ (Major Expense Amount)', 'Major Expense Amount')}
                  </label>
                  <input
                    type="text"
                    value={settings.clubMajorExpenseAmount || ''}
                    onChange={(e) => handleChange('clubMajorExpenseAmount', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
                    placeholder="₹ ৩,৫০,০০০"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. Sonali Park Unnayan Samiti Controls */}
        {activeTab === 'samiti' && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{b('উন্নয়ন সমিতি সেটিংস (/samiti)', 'Sonali Park Unnayan Samiti Settings (/samiti)')}</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {b('নাগরিক উন্নয়ন পরিষদের ব্যানার, পরিচিতি বার্তা এবং পরিকাঠামো অডিট বাজেট পরিচালনা করুন', 'Manage civic RWA hero headline, community intro, and infrastructure welfare budgets')}
                </p>
              </div>
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                {b('সমিতি শাখা', 'Samiti Wing')}
              </span>
            </div>

            {/* Samiti Hero Copy */}
            <div className="p-4 rounded-xl border border-emerald-200/60 bg-emerald-50/20 space-y-4">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                {b('সমিতি ব্যানার ও পরিচিতি', 'Samiti Hero Banner & Civic Charter')}
              </h3>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('সমিতির প্রধান শিরোনাম (Samiti Hero Title)', 'Samiti Hero Title')}
                </label>
                <input
                  type="text"
                  value={settings.samitiHeroTitle || ''}
                  onChange={(e) => handleChange('samitiHeroTitle', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  placeholder="সোনালী পার্ক"
                />
                <p className="text-[11px] text-stone-400 mt-1">{b('ডিফল্ট: সোনালী পার্ক (উন্নয়ন সমিতি কথাটি স্বয়ংক্রিয়ভাবে পান্না সবুজ রঙে থাকবে)', 'Default: Sonali Park (Unnayan Samiti will be styled in emerald)')}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('সমিতি পরিচিতি ও বার্তা (Samiti Tagline & Mission)', 'Samiti Tagline & Mission')}
                </label>
                <textarea
                  rows={3}
                  value={settings.samitiHeroTagline || ''}
                  onChange={(e) => handleChange('samitiHeroTagline', e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-normal focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none leading-relaxed"
                  placeholder="আমাদের পাড়ার নিরাপত্তা, পরিচ্ছন্নতা, রাস্তাঘাট ও নাগরিকদের দৈনন্দিন স্বাচ্ছন্দ্য রক্ষায় সার্বক্ষণিক নিয়োজিত..."
                />
              </div>
            </div>

            {/* Samiti Hero Banner Image Control */}
            <div className="p-4 rounded-xl border border-emerald-200/60 bg-emerald-50/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{b('সমিতি হিরো ব্যানার ছবি (Samiti Hero Banner Image)', 'Samiti Hero Banner Image')}</span>
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {b('স্ট্যান্ডার্ড ১৬:৯ ল্যান্ডস্কেপ অনুপাতের ছবি ব্যবহার করুন (অনুপাত 16:9)', 'Standard 16:9 landscape aspect ratio banner')}
                  </p>
                </div>
                {settings.samitiHeroImage && settings.samitiHeroImage !== '/assets/samiti-hero-banner.jpg' && (
                  <button
                    type="button"
                    onClick={() => handleChange('samitiHeroImage', '/assets/samiti-hero-banner.jpg')}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200/80 shadow-2xs cursor-pointer hover:bg-white"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{b('ডিফল্ট ব্যানারে রিসেট', 'Reset Default')}</span>
                  </button>
                )}
              </div>

              {/* Live Banner Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-emerald-300/60 aspect-[16/9] max-h-56 bg-stone-900 shadow-md group">
                <img
                  src={settings.samitiHeroImage || '/assets/samiti-hero-banner.jpg'}
                  alt="Samiti Banner Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />
                <div className="absolute bottom-3 left-4 right-4 text-white z-10 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">
                      {b('লাইভ হিরো প্রিভিউ', 'Live Banner Preview')}
                    </span>
                    <h4 className="text-base sm:text-lg font-serif font-black drop-shadow">
                      {settings.samitiHeroTitle || b('সোনালী পার্ক', 'Sonali Park')} <span className="text-emerald-400">{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
                    </h4>
                  </div>
                  <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded text-stone-300 font-mono border border-white/10">
                    16:9 Ratio
                  </span>
                </div>
              </div>

              {/* Upload & URL Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('ছবির পাথ বা ইউআরএল (Image URL / Path)', 'Image URL or Asset Path')}
                  </label>
                  <input
                    type="text"
                    value={settings.samitiHeroImage || ''}
                    onChange={(e) => handleChange('samitiHeroImage', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-mono text-stone-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    placeholder="/assets/samiti-hero-banner.jpg"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    {b('ডিফল্ট: /assets/samiti-hero-banner.jpg বা যেকোনো কাস্টম লিঙ্ক দিন', 'Default: /assets/samiti-hero-banner.jpg or paste any custom image URL')}
                  </p>
                </div>

                <div className="flex flex-col justify-end">
                  <input
                    type="file"
                    ref={samitiHeroFileInputRef}
                    onChange={handleSamitiHeroUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingSamitiHero}
                    onClick={() => samitiHeroFileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {uploadingSamitiHero ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{b('আপলোড হচ্ছে...', 'Uploading...')}</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 text-white" />
                        <span>{b('নতুন ছবি আপলোড', 'Upload Image')}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-400 mt-1 text-center">
                    JPG, PNG, WebP (max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Samiti Financial Metrics */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                {b('নাগরিক কল্যাণ তহবিল ও পরিকাঠামো বাজেট (Civic Fund & Outlay)', 'Civic Maintenance Fund & Outlay')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('মোট বাৎসরিক কল্যাণ তহবিল (Total Maintenance Fund)', 'Total Maintenance Fund')}
                  </label>
                  <input
                    type="text"
                    value={settings.samitiTotalCollection || ''}
                    onChange={(e) => handleChange('samitiTotalCollection', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    placeholder="₹ ১২,২০,০০০"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">{b('আবাসিক মাসিক রক্ষণাবেক্ষণ চাঁদা ও বিশেষ উন্নয়ন তহবিল', 'Monthly maintenance collections & resident welfare fund')}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('মোট সামগ্রিক নাগরিক ব্যয় (Total Civic Expenditure)', 'Total Civic Expenditure')}
                  </label>
                  <input
                    type="text"
                    value={settings.samitiTotalExpense || ''}
                    onChange={(e) => handleChange('samitiTotalExpense', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    placeholder="₹ ১১,৫০,০০০"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">{b('নিরাপত্তা গার্ড, পথবাতি, ড্রেন পরিষ্কার ও পরিচ্ছন্নতা', 'Security guards, streetlights, drainage & garbage clearing')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('প্রধান পরিকাঠামো খাত (Major Development Head)', 'Major Development Head')}
                  </label>
                  <input
                    type="text"
                    value={settings.samitiMajorExpenseTitle || ''}
                    onChange={(e) => handleChange('samitiMajorExpenseTitle', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    placeholder="রাস্তা সংস্কার ও জলনিকাশি"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('প্রধান খাতের ব্যয়ের পরিমাণ (Major Development Amount)', 'Major Development Amount')}
                  </label>
                  <input
                    type="text"
                    value={settings.samitiMajorExpenseAmount || ''}
                    onChange={(e) => handleChange('samitiMajorExpenseAmount', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    placeholder="₹ ৫,১০,০০০"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
