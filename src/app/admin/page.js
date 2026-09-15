'use client';
import { useState, useEffect } from 'react';
import {
  Megaphone, Camera, Users, CalendarDays,
  ArrowUpRight, Clock, RefreshCw, Sparkles,
  Plus, ImageIcon, FileText, ChevronRight
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
    recentPhotos: [],
    recentNotices: [],
    settings: {}
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        const gallery = json.gallery || [];
        const notices = json.notices || [];
        const members = json.members || [];
        const events = json.events || [];
        setData({
          photoCount: gallery.length,
          noticeCount: notices.length,
          memberCount: members.length,
          eventCount: events.length,
          recentPhotos: gallery.slice(-4).reverse(),
          recentNotices: notices.slice(-4).reverse(),
          settings: json.settings || {}
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

  const stats = [
    {
      labelBn: 'গ্যালারি ছবি',
      labelEn: 'Gallery Photos',
      value: String(data.photoCount),
      icon: Camera,
      link: '/admin/gallery',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'hover:border-rose-300'
    },
    {
      labelBn: 'সক্রিয় নোটিশ',
      labelEn: 'Active Notices',
      value: String(data.noticeCount),
      icon: Megaphone,
      link: '/admin/notices',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'hover:border-amber-300'
    },
    {
      labelBn: 'কমিটি সদস্য',
      labelEn: 'Committee Members',
      value: String(data.memberCount),
      icon: Users,
      link: '/admin/committee',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-300'
    },
    {
      labelBn: 'পূজা নির্ঘণ্ট',
      labelEn: 'Schedule Rituals',
      value: String(data.eventCount),
      icon: CalendarDays,
      link: '/admin/timeline',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-300'
    },
  ];

  const quickActions = [
    {
      nameBn: 'নতুন ছবি যোগ',
      nameEn: 'Add Photo',
      path: '/admin/gallery',
      icon: Plus,
    },
    {
      nameBn: 'জরুরি নোটিশ',
      nameEn: 'Post Notice',
      path: '/admin/notices',
      icon: Megaphone,
    },
    {
      nameBn: 'ব্যানার ও মিডিয়া',
      nameEn: 'Update Media',
      path: '/admin/media',
      icon: ImageIcon,
    },
    {
      nameBn: 'অডিট রিপোর্ট',
      nameEn: 'Audit PDF',
      path: '/admin/finance',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* ═══ Header with Welcome Badge & Quick Refresh ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
            {b('ড্যাশবোর্ড ওভারভিউ', 'Dashboard Overview')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('বাঁশদ্রোণী সোনালী পার্ক পূজা ও ক্লাব পোর্টাল পরিচালনা কেন্দ্র', 'Official Operations & Real-Time Management Hub')}
          </p>
        </div>

        {/* Quick Actions Strip & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <div className="hidden lg:flex items-center gap-1.5 mr-2">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={qa.path}
                  href={qa.path}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-[11px] font-semibold text-stone-700 hover:text-brand-maroon transition-colors shadow-2xs"
                >
                  <Icon className="w-3 h-3 text-stone-400" />
                  <span>{lang === 'bn' ? qa.nameBn : qa.nameEn}</span>
                </Link>
              );
            })}
          </div>

          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-maroon' : 'text-stone-400'}`} />
            <span>{b('রিফ্রেশ', 'Refresh')}</span>
          </button>
        </div>
      </div>

      {/* ═══ 4 Elevated Metric Cards ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.link}
              href={s.link}
              className={`bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 ${s.border} hover:shadow-xs transition-all group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-stone-500">
                  {lang === 'bn' ? s.labelBn : s.labelEn}
                </span>
                <div className={`w-8 h-8 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-sans">
                  {s.value}
                </span>
                <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-700 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ═══ 2-Column Split: Active Festival Theme (5 cols) & Notices/Photos (7 cols) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Festival Status */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-maroon" />
              <h2 className="font-bold text-stone-900 text-sm">
                {b('বর্তমান উৎসব ও থিম', 'Active Festival & Theme')}
              </h2>
            </div>
            <Link href="/admin/settings" className="text-xs font-semibold text-brand-maroon hover:underline">
              {b('সেটিংস ↗', 'Settings ↗')}
            </Link>
          </div>

          <div className="space-y-3">
            {/* Theme Title Box */}
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                {b('পূজার প্রধান থিম', 'Festival Theme')}
              </span>
              <p className="font-bold text-stone-900 text-sm mt-0.5">
                {data.settings.themeTitle || '"অতীতের আয়নায় আগামী"'}
              </p>
              {data.settings.themeSubtitle && (
                <p className="text-xs text-stone-500 mt-0.5">{data.settings.themeSubtitle}</p>
              )}
            </div>

            {/* Artisans Grid */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                <span className="text-[9px] uppercase font-bold text-stone-400 block truncate">
                  {b('মণ্ডপ', 'Pandal')}
                </span>
                <p className="font-semibold text-stone-800 text-[11px] mt-0.5 truncate">
                  {data.settings.pandalArtist || 'শিল্প নিকেতন'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                <span className="text-[9px] uppercase font-bold text-stone-400 block truncate">
                  {b('প্রতিমা', 'Idol')}
                </span>
                <p className="font-semibold text-stone-800 text-[11px] mt-0.5 truncate">
                  {data.settings.idolArtist || 'সনাতন রুদ্র পাল'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50/70 border border-stone-200/70">
                <span className="text-[9px] uppercase font-bold text-stone-400 block truncate">
                  {b('আলোকসজ্জা', 'Lights')}
                </span>
                <p className="font-semibold text-stone-800 text-[11px] mt-0.5 truncate">
                  {data.settings.lightingArtist || 'দাস ইলেকট্রিক'}
                </p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/70 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  {b('কাউন্টডাউন শিরোনাম', 'Countdown Target')}
                </span>
                <p className="font-semibold text-stone-800 mt-0.5">
                  {data.settings.countdownHeading || 'মহাষ্টমী আসতে আর মাত্র'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-mono font-bold text-stone-700 shadow-2xs">
                <Clock className="w-3 h-3 text-brand-maroon" />
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Latest Notices & Photos */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-5">
          {/* Latest Notices */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="font-bold text-stone-900 text-sm">
                {b('সর্বশেষ প্রকাশিত নোটিশ', 'Latest Published Notices')}
              </h2>
              <Link href="/admin/notices" className="text-xs font-semibold text-brand-maroon hover:underline">
                {b('সব নোটিশ ↗', 'All Notices ↗')}
              </Link>
            </div>

            {data.recentNotices.length === 0 ? (
              <div className="py-6 text-center text-stone-400 text-xs">
                {b('কোনো সক্রিয় নোটিশ নেই।', 'No notices published yet.')}{' '}
                <Link href="/admin/notices" className="text-brand-maroon underline font-semibold">
                  {b('নতুন নোটিশ যোগ করুন', 'Add Notice')}
                </Link>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                {data.recentNotices.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50/60 border border-stone-200/70 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {n.isUrgent && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 text-brand-maroon shrink-0">
                          {b('জরুরি', 'URGENT')}
                        </span>
                      )}
                      <span className="font-semibold text-stone-800 text-xs truncate">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 shrink-0 ml-3 font-mono">{n.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Gallery Photos */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-800">
                {b('সাম্প্রতিক গ্যালারি ছবি', 'Recent Uploaded Photos')}
              </span>
              <Link href="/admin/gallery" className="text-xs text-brand-maroon hover:underline font-semibold">
                {b('গ্যালারি ↗', 'Gallery ↗')}
              </Link>
            </div>

            {data.recentPhotos.length === 0 ? (
              <p className="text-xs text-stone-400">{b('এখনো কোনো ছবি নেই।', 'No photos uploaded yet.')}</p>
            ) : (
              <div className="grid grid-cols-4 gap-2.5">
                {data.recentPhotos.map((photo) => (
                  <Link
                    key={photo.id}
                    href="/admin/gallery"
                    className="relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200/70 aspect-4/3 shadow-2xs group"
                  >
                    <img
                      src={photo.src}
                      alt={photo.title || 'Photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
