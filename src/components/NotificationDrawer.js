'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X, Bell, CheckCheck, Megaphone, Image as ImageIcon,
  Calendar, AlertTriangle, ChevronRight, RefreshCw,
  Sparkles, Check, ArrowRight, ShieldCheck, FileText,
  Flame, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotificationDrawer({ isOpen, onClose, onUnreadCountChange }) {
  const { lang, b, t, toDigits } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'urgent' | 'puja' | 'club' | 'samiti'
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [readIds, setReadIds] = useState([]);

  // Load read notifications from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bspc_read_notifs');
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
  }, []);

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const json = await res.json();
        if (json.notifications) {
          setNotifications(json.notifications);
        }
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Compute unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  // Notify parent component of unread count change
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  // Mark all notifications as read
  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem('bspc_read_notifs', JSON.stringify(allIds));
    } catch (e) {}
  };

  // Mark single notification as read
  const markSingleAsRead = (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem('bspc_read_notifs', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    const counts = { all: notifications.length, urgent: 0, puja: 0, club: 0, samiti: 0 };
    notifications.forEach(n => {
      if (n.isUrgent) counts.urgent++;
      if (n.wing === 'puja') counts.puja++;
      else if (n.wing === 'club') counts.club++;
      else if (n.wing === 'samiti') counts.samiti++;
    });
    return counts;
  }, [notifications]);

  // Filtered notifications based on tab and unreadOnly toggle
  const filteredNotifications = useMemo(() => {
    let list = notifications;

    if (activeTab === 'urgent') {
      list = list.filter(n => n.isUrgent);
    } else if (activeTab === 'puja') {
      list = list.filter(n => n.wing === 'puja' || n.wing === 'universal');
    } else if (activeTab === 'club') {
      list = list.filter(n => n.wing === 'club' || n.wing === 'universal');
    } else if (activeTab === 'samiti') {
      list = list.filter(n => n.wing === 'samiti' || n.wing === 'universal');
    }

    if (unreadOnly) {
      list = list.filter(n => !readIds.includes(n.id));
    }

    return list;
  }, [notifications, activeTab, unreadOnly, readIds]);

  // Relative timestamp formatting
  const formatTimeAgo = (isoDate) => {
    if (!isoDate) return '';
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime();
      const mins = Math.max(1, Math.floor(diffMs / 60000));
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);

      if (lang === 'bn') {
        if (mins < 2) return 'এইমাত্র';
        if (mins < 60) return `${toDigits(mins)} মিনিট আগে`;
        if (hours < 24) return `${toDigits(hours)} ঘণ্টা আগে`;
        return `${toDigits(days)} দিন আগে`;
      } else {
        if (mins < 2) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
      }
    } catch {
      return '';
    }
  };

  // Helper details for wings
  const getWingDetails = (wing) => {
    switch (wing) {
      case 'club':
        return {
          labelBn: 'সোনালী সঙ্ঘ ক্লাব',
          labelEn: 'Sonali Sangha Club',
          badgeBg: 'bg-amber-50 text-amber-900 border-amber-200/80',
          accentBorder: 'border-l-amber-500',
          iconEmoji: '🏆'
        };
      case 'samiti':
        return {
          labelBn: 'উন্নয়ন সমিতি (RWA)',
          labelEn: 'Unnayan Samiti (RWA)',
          badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200/80',
          accentBorder: 'border-l-emerald-500',
          iconEmoji: '🏛️'
        };
      case 'puja':
        return {
          labelBn: 'শারদীয়া দুর্গাপূজা',
          labelEn: 'Durga Puja',
          badgeBg: 'bg-rose-50 text-rose-900 border-rose-200/80',
          accentBorder: 'border-l-brand-maroon',
          iconEmoji: '🌺'
        };
      default:
        return {
          labelBn: 'সার্বজনীন পাড়া',
          labelEn: 'Community Wide',
          badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200/80',
          accentBorder: 'border-l-indigo-500',
          iconEmoji: '📢'
        };
    }
  };

  // Type badge info
  const getTypeInfo = (type, isUrgent, isCustom) => {
    if (isUrgent) {
      return {
        labelBn: 'জরুরি নোটিশ',
        labelEn: 'Urgent Alert',
        icon: AlertTriangle,
        className: 'bg-rose-600 text-white animate-pulse'
      };
    }
    if (isCustom) {
      return {
        labelBn: 'অ্যাডমিন বার্তা',
        labelEn: 'Broadcast',
        icon: Megaphone,
        className: 'bg-amber-500 text-white'
      };
    }
    if (type === 'photo') {
      return {
        labelBn: 'নতুন ছবি',
        labelEn: 'New Photo',
        icon: ImageIcon,
        className: 'bg-violet-600 text-white'
      };
    }
    if (type === 'notice') {
      return {
        labelBn: 'বিজ্ঞপ্তি',
        labelEn: 'Notice',
        icon: FileText,
        className: 'bg-sky-600 text-white'
      };
    }
    return {
      labelBn: 'আপডেট',
      labelEn: 'Update',
      icon: Bell,
      className: 'bg-stone-700 text-white'
    };
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop Dimming Overlay with Blur */}
      <div
        className={`fixed inset-0 bg-stone-950/45 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Floating Popover on Desktop / Responsive Bottom-Sheet on Mobile */}
      <div
        className={`fixed transition-all duration-300 ease-out z-50
          /* Mobile (< 640px): Bottom Sheet */
          inset-x-0 bottom-0 max-h-[90vh]
          /* Desktop (>= 640px): Floating Anchored Card below Bell */
          sm:inset-x-auto sm:bottom-auto sm:top-14 sm:right-4 md:right-8 sm:w-[440px] sm:max-h-[84vh]
          flex flex-col bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl border border-stone-200/90 overflow-hidden
          ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 sm:-translate-y-2 opacity-0 sm:scale-95'}
        `}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* ═══ 1. HEADER WITH SUMMARY & ACTIONS ═══ */}
        <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-3 border-b border-stone-200/80 bg-stone-50/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 via-rose-500/15 to-brand-maroon/20 text-brand-maroon flex items-center justify-center border border-brand-maroon/25 shrink-0 shadow-xs">
              <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-brand-maroon fill-brand-maroon/20" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-stone-900 tracking-tight">
                  {b('বিজ্ঞপ্তি ও নোটিফিকেশন', 'Notification Center')}
                </h2>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-black bg-rose-600 text-white rounded-full leading-none shadow-xs">
                    {lang === 'bn' ? toDigits(unreadCount) : unreadCount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 truncate">
                {unreadCount > 0
                  ? b(`${toDigits(unreadCount)}টি অপঠিত বিজ্ঞপ্তি রয়েছে`, `${unreadCount} unread announcements`)
                  : b('সমস্ত সাম্প্রতিক আপডেট পঠিত', 'All updates caught up')}
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title={b('সমস্ত বিজ্ঞপ্তি পঠিত চিহ্নিত করুন', 'Mark all as read')}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-brand-maroon text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-brand-maroon" />
                <span className="hidden xs:inline">{b('সব পঠিত', 'Mark Read')}</span>
              </button>
            )}

            <button
              onClick={fetchNotifications}
              title={b('রিফ্রেশ করুন', 'Refresh')}
              className="p-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer shadow-xs"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-maroon' : ''}`} />
            </button>

            <button
              onClick={onClose}
              title={b('বন্ধ করুন', 'Close')}
              className="p-1.5 rounded-xl bg-white hover:bg-rose-50 border border-stone-200 text-stone-500 hover:text-rose-600 transition-colors cursor-pointer shadow-xs"
              aria-label="Close"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* ═══ 2. LOGICAL CATEGORY TABS & UNREAD FILTER ═══ */}
        <div className="px-3.5 sm:px-4 py-2 bg-white border-b border-stone-100 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', bn: 'সব', en: 'All', icon: '🌐', count: tabCounts.all },
              ...(tabCounts.urgent > 0
                ? [{ id: 'urgent', bn: 'জরুরি', en: 'Urgent', icon: '🚨', count: tabCounts.urgent, isUrgentTab: true }]
                : []),
              { id: 'puja', bn: 'পূজা', en: 'Puja', icon: '🌺', count: tabCounts.puja },
              { id: 'club', bn: 'ক্লাব', en: 'Club', icon: '🏆', count: tabCounts.club },
              { id: 'samiti', bn: 'সমিতি', en: 'Samiti', icon: '🏛️', count: tabCounts.samiti },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? tab.isUrgentTab
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-stone-900 text-white shadow-xs'
                      : tab.isUrgentTab
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{lang === 'bn' ? tab.bn : tab.en}</span>
                  {tab.count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        active
                          ? 'bg-white/25 text-white'
                          : tab.isUrgentTab
                          ? 'bg-rose-600 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {lang === 'bn' ? toDigits(tab.count) : tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Toggle: Filter Unread Only */}
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-2 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 border ${
              unreadOnly
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                : 'bg-stone-50 text-stone-500 hover:text-stone-800 border-stone-200'
            }`}
            title={b('শুধু অপঠিত বিজ্ঞপ্তি ফিল্টার করুন', 'Filter unread only')}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${unreadOnly ? 'bg-rose-600 animate-pulse' : 'bg-stone-400'}`} />
            <span>{b('অপঠিত', 'Unread')}</span>
          </button>
        </div>

        {/* ═══ 3. NOTIFICATION LIST (SCROLLABLE) ═══ */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5 bg-[#FAF8F5]/70">
          {loading && notifications.length === 0 ? (
            <div className="py-20 text-center text-stone-400 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-brand-maroon mb-2.5" />
              <p className="text-xs font-semibold">{b('বিজ্ঞপ্তি লোড হচ্ছে...', 'Loading updates...')}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            /* Delightful All Caught Up / Zero State */
            <div className="py-14 text-center text-stone-500 flex flex-col items-center px-4">
              <div className="w-14 h-14 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-2xl mb-3 shadow-xs">
                ✨
              </div>
              <p className="text-sm font-black text-stone-800 mb-1">
                {unreadOnly
                  ? b('কোনো অপঠিত বিজ্ঞপ্তি নেই!', 'No unread notifications!')
                  : b('এই বিভাগে কোনো বিজ্ঞপ্তি নেই', 'No notifications in this tab')}
              </p>
              <p className="text-xs text-stone-400 max-w-xs leading-relaxed mb-4">
                {b(
                  'আপনি বাঁশদ্রোণী সোনালী পার্ক পূজা, ক্লাব ও সমিতির সমস্ত সাম্প্রতিক খবরের সাথে আপ-টু-ডেট আছেন।',
                  'You are fully caught up with the latest announcements from Durga Puja, Sonali Sangha Club, and Unnayan Samiti.'
                )}
              </p>

              {/* Quick Navigation Shortcuts */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <Link
                  href="/puja"
                  onClick={onClose}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-rose-50 border border-stone-200 text-rose-800 text-[11px] font-bold transition-all shadow-2xs"
                >
                  🌺 {b('পূজা সময়সূচি', 'Puja Schedule')}
                </Link>
                <Link
                  href="/club"
                  onClick={onClose}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 border border-stone-200 text-amber-800 text-[11px] font-bold transition-all shadow-2xs"
                >
                  🏆 {b('ক্লাব কার্যক্রম', 'Club Activities')}
                </Link>
                <Link
                  href="/samiti"
                  onClick={onClose}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 border border-stone-200 text-emerald-800 text-[11px] font-bold transition-all shadow-2xs"
                >
                  🏛️ {b('নাগরিক সনদ', 'Civic Charter')}
                </Link>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isRead = readIds.includes(notif.id);
              const wingInfo = getWingDetails(notif.wing);
              const typeInfo = getTypeInfo(notif.type, notif.isUrgent, notif.isCustom);
              const TypeIcon = typeInfo.icon;

              return (
                <div
                  key={notif.id}
                  className={`group relative p-3 sm:p-3.5 rounded-2xl border transition-all ${
                    isRead
                      ? 'bg-white/85 border-stone-200/80 opacity-85 hover:opacity-100 hover:bg-white hover:shadow-xs'
                      : notif.isUrgent
                      ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-200 shadow-xs'
                      : 'bg-white border-amber-300/60 ring-1 ring-amber-400/20 shadow-xs'
                  } ${wingInfo.accentBorder} border-l-4`}
                >
                  {/* Top Bar: Wing Pill + Category Badge + Relative Time + Mark Read Button */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      {/* Wing Badge */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${wingInfo.badgeBg}`}>
                        <span>{wingInfo.iconEmoji}</span>
                        <span>{lang === 'bn' ? wingInfo.labelBn : wingInfo.labelEn}</span>
                      </span>

                      {/* Type Badge */}
                      <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black flex items-center gap-1 uppercase tracking-wider ${typeInfo.className}`}>
                        <TypeIcon className="w-2.5 h-2.5" />
                        <span>{lang === 'bn' ? typeInfo.labelBn : typeInfo.labelEn}</span>
                      </span>
                    </div>

                    {/* Right side: Time Ago & Unread Dot / Checkmark Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                        <Clock className="w-2.5 h-2.5 text-stone-300" />
                        {formatTimeAgo(notif.createdAt)}
                      </span>

                      {/* Toggle Read Indicator Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isRead) {
                            // Unmark
                            const next = readIds.filter(id => id !== notif.id);
                            setReadIds(next);
                            localStorage.setItem('bspc_read_notifs', JSON.stringify(next));
                          } else {
                            markSingleAsRead(notif.id);
                          }
                        }}
                        title={isRead ? b('অপঠিত চিহ্নিত করুন', 'Mark as unread') : b('পঠিত চিহ্নিত করুন', 'Mark as read')}
                        className="p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                        aria-label="Toggle read status"
                      >
                        {isRead ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 ring-2 ring-white"></span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-xs sm:text-[13px] mb-1 leading-snug tracking-tight ${
                    isRead ? 'font-bold text-stone-800' : 'font-black text-stone-950'
                  }`}>
                    {t(notif.title)}
                  </h3>

                  {/* Message description */}
                  {notif.message && (
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-1.5">
                      {t(notif.message)}
                    </p>
                  )}

                  {/* Image Preview for Gallery Photos */}
                  {notif.image && (
                    <div className="my-2 rounded-xl overflow-hidden border border-stone-200/90 relative aspect-[16/9] max-h-36 bg-stone-100 group/img shadow-2xs">
                      <img
                        src={notif.image}
                        alt={notif.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2 pointer-events-none">
                        <span className="text-[10px] font-bold text-white flex items-center gap-1 drop-shadow-sm">
                          <ImageIcon className="w-3 h-3 text-amber-300" />
                          {b('ছবি গ্যালারিতে দেখুন', 'View in Gallery')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer Action Button */}
                  {notif.link && (
                    <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 italic">
                        {isRead ? b('পঠিত হয়েছে', 'Read') : b('নতুন বিজ্ঞপ্তি', 'New')}
                      </span>
                      <Link
                        href={notif.link}
                        onClick={() => {
                          markSingleAsRead(notif.id);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-brand-maroon text-stone-800 hover:text-white text-[11px] font-bold transition-all shadow-2xs"
                      >
                        <span>{b('বিস্তারিত দেখুন', 'View Details')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ═══ 4. FOOTER WITH QUICK BROADCAST SHORTCUT (FOR ADMINS/COMMITTEE) ═══ */}
        <div className="p-3 border-t border-stone-200/80 bg-stone-50/90 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-stone-500 text-[11px] min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">
              {b('বাঁশদ্রোণী সোনালী পার্ক সার্বজনীন পোর্টাল', 'Bansdroni Sonali Park Universal')}
            </span>
          </div>

          <Link
            href="/admin/notifications"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-maroon hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/90 border border-brand-maroon/20 px-2.5 py-1 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <Megaphone className="w-3 h-3 text-brand-maroon" />
            <span>{b('অ্যাডমিন ব্রডকাস্ট →', 'Admin Broadcast →')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
