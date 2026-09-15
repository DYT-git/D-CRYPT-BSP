'use client';
import { useState, useEffect } from 'react';
import {
  Palette, Type, Clock, Sparkles, DollarSign, Save,
  CheckCircle2, AlertCircle, RefreshCw, Calendar
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
    majorExpenseAmount: ''
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
    { id: 'hero', labelBn: 'হোমপেজ ও শিরোনাম', labelEn: 'Hero & Headlines', icon: Type },
    { id: 'countdown', labelBn: 'কাউন্টডাউন টাইমার', labelEn: 'Countdown Timer', icon: Clock },
    { id: 'theme', labelBn: 'পূজার থিম ও শিল্পী', labelEn: 'Theme & Artisans', icon: Sparkles },
    { id: 'finance', labelBn: 'স্বচ্ছতা ও বাজেট সারসংক্ষেপ', labelEn: 'Financial Summary', icon: DollarSign },
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

      </div>
    </div>
  );
}
