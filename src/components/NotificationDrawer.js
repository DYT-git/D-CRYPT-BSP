'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  X, Bell, CheckCheck, Megaphone, Image as ImageIcon,
  Calendar, AlertTriangle, ChevronRight, ExternalLink,
  Sparkles, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotificationDrawer({ isOpen, onClose, onUnreadCountChange }) {
  const { lang, b } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'puja' | 'club' | 'samiti'
  const [readIds, setReadIds] = useState([]);

  // Load read notifications from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bspc_read_notifs');
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
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
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Compute unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  // Notify parent of unread count change
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  // Mark all as read
  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem('bspc_read_notifs', JSON.stringify(allIds));
    } catch (e) {}
  };

  // Mark single as read
  const markSingleAsRead = (id) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem('bspc_read_notifs', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter(n => n.wing === activeTab || n.wing === 'universal');
  }, [notifications, activeTab]);

  // Format relative time in Bengali / English
  const formatTimeAgo = (isoDate) => {
    if (!isoDate) return '';
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime();
      const mins = Math.floor(diffMs / 60000);
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);

      if (lang === 'bn') {
        if (mins < 2) return 'এইমাত্র';
        if (mins < 60) return `${mins} মিনিট আগে`;
        if (hours < 24) return `${hours} ঘণ্টা আগে`;
        return `${days} দিন আগে`;
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

  // Wing styling details
  const getWingDetails = (wing) => {
    switch (wing) {
      case 'club':
        return {
          labelBn: 'সোনালী সঙ্ঘ ক্লাব',
          labelEn: 'Sonali Sangha Club',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          iconEmoji: '🏆'
        };
      case 'samiti':
        return {
          labelBn: 'উন্নয়ন সমিতি (RWA)',
          labelEn: 'Unnayan Samiti (RWA)',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          iconEmoji: '🏛️'
        };
      case 'puja':
        return {
          labelBn: 'শারদীয়া দুর্গাপূজা',
          labelEn: 'Durga Puja',
          badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
          iconEmoji: '🌺'
        };
      default:
        return {
          labelBn: 'সার্বজনীন পাড়া',
          labelEn: 'Community Wide',
          badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          iconEmoji: '📢'
        };
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className={`fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="w-screen max-w-md pointer-events-auto bg-white shadow-2xl flex flex-col h-full border-l border-stone-200">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-maroon/10 text-brand-maroon flex items-center justify-center border border-brand-maroon/20">
                <Bell className="w-4.5 h-4.5 text-brand-maroon" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
                    {b('বিজ্ঞপ্তি ও নোটিফিকেশন', 'Notification Center')}
                  </h2>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-black bg-rose-600 text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500">
                  {b('পূজা, ক্লাব ও সমিতির সমস্ত আপডেট', 'Real-time updates from Puja, Club & Samiti')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={fetchNotifications}
                title={b('রিফ্রেশ করুন', 'Refresh')}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
                title={b('বন্ধ করুন', 'Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Wing Filter Tabs */}
          <div className="px-4 py-2.5 bg-white border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', bn: 'সব বিজ্ঞপ্তি', en: 'All', icon: '🌐' },
              { id: 'puja', bn: 'পূজা', en: 'Puja', icon: '🌺' },
              { id: 'club', bn: 'ক্লাব', en: 'Club', icon: '🏆' },
              { id: 'samiti', bn: 'সমিতি', en: 'Samiti', icon: '🏛️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{lang === 'bn' ? tab.bn : tab.en}</span>
              </button>
            ))}

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="ml-auto text-[11px] font-semibold text-brand-maroon hover:text-rose-700 whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer"
                title={b('সব পঠিত হিসেবে চিহ্নিত করুন', 'Mark all read')}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{b('পঠিত', 'Mark read')}</span>
              </button>
            )}
          </div>

          {/* Notification List Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]/60">
            {loading && notifications.length === 0 ? (
              <div className="py-20 text-center text-stone-400 flex flex-col items-center">
                <RefreshCw className="w-7 h-7 animate-spin text-brand-maroon mb-2" />
                <p className="text-xs">{b('বিজ্ঞপ্তি লোড হচ্ছে...', 'Loading updates...')}</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-20 text-center text-stone-400 flex flex-col items-center px-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-2xl mb-3">
                  ✨
                </div>
                <p className="text-sm font-bold text-stone-700 mb-1">
                  {b('এই মুহূর্তে কোনো নতুন বিজ্ঞপ্তি নেই', 'No notifications right now')}
                </p>
                <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                  {b('নতুন নোটিশ, অনুষ্ঠান বা ছবি প্রকাশিত হলে সাথে সাথে এখানে দেখা যাবে।', 'New announcements, notices and photos will appear here in real time.')}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isRead = readIds.includes(notif.id);
                const wingInfo = getWingDetails(notif.wing);

                return (
                  <div
                    key={notif.id}
                    onClick={() => markSingleAsRead(notif.id)}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isRead
                        ? 'bg-white border-stone-200/80 opacity-80 hover:opacity-100'
                        : 'bg-white border-brand-maroon/25 shadow-xs ring-1 ring-brand-maroon/10'
                    }`}
                  >
                    {/* Header line: Wing badge + Urgent tag + Time */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${wingInfo.badgeBg}`}>
                          <span>{wingInfo.iconEmoji}</span>
                          <span>{lang === 'bn' ? wingInfo.labelBn : wingInfo.labelEn}</span>
                        </span>

                        {notif.isUrgent && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-rose-600 text-white flex items-center gap-1 uppercase tracking-wider animate-pulse">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>{b('জরুরি', 'Urgent')}</span>
                          </span>
                        )}

                        {notif.isCustom && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/15 text-amber-800 border border-amber-300">
                            {b('অ্যাডমিন বার্তা', 'Broadcast')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-stone-400">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-200 shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Notification Title & Body */}
                    <h3 className={`text-xs sm:text-[13px] font-bold mb-1 leading-snug ${isRead ? 'text-stone-800' : 'text-stone-950 font-extrabold'}`}>
                      {notif.title}
                    </h3>

                    {notif.message && (
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-2">
                        {notif.message}
                      </p>
                    )}

                    {/* Image Preview if provided */}
                    {notif.image && (
                      <div className="my-2 rounded-xl overflow-hidden border border-stone-200 max-h-36">
                        <img src={notif.image} alt={notif.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Link Action */}
                    {notif.link && (
                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex justify-end">
                        <Link
                          href={notif.link}
                          onClick={() => {
                            markSingleAsRead(notif.id);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-maroon hover:text-rose-700 transition-colors"
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

          {/* Footer with Portal Info */}
          <div className="p-3.5 border-t border-stone-200 bg-white flex items-center justify-between text-xs text-stone-500">
            <span className="text-[11px] text-stone-400">
              {b('বাঁশদ্রোণী সোনালী পার্ক সার্বজনীন পোর্টাল', 'Bansdroni Sonali Park Portal')}
            </span>
            <Link
              href="/admin/login"
              onClick={onClose}
              className="text-[11px] font-semibold text-stone-600 hover:text-brand-maroon transition-colors"
            >
              {b('অ্যাডমিন অ্যাক্সেস →', 'Admin Login →')}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
