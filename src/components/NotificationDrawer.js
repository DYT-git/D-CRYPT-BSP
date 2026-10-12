'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Bell, FileText, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotificationDrawer({ isOpen, onClose, onUnreadCountChange }) {
  const { lang, b, t, toDigits } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState([]);

  // Load read notifications from localStorage
  useEffect(() => {
    try {
      const storedRead = localStorage.getItem('bspc_read_notifs');
      if (storedRead) {
        setReadIds(JSON.parse(storedRead));
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
        if (mins < 60) return `${toDigits(mins)} মি. আগে`;
        if (hours < 24) return `${toDigits(hours)} ঘ. আগে`;
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

  const getWingLabel = (wing) => {
    switch (wing) {
      case 'club':
        return b('সোনালী সঙ্ঘ', 'Sonali Club');
      case 'samiti':
        return b('উন্নয়ন সমিতি', 'Samiti');
      case 'puja':
        return b('দুর্গাপূজা', 'Durga Puja');
      default:
        return b('সাধারণ', 'General');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Floating Card on Desktop / Bottom Sheet on Mobile */}
      <div
        className={`fixed transition-all duration-300 ease-out z-50
          inset-x-0 bottom-0 max-h-[85vh]
          sm:inset-x-auto sm:bottom-auto sm:top-14 sm:right-4 md:right-8 sm:w-[380px] sm:max-h-[80vh]
          flex flex-col bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl border border-stone-200/90 overflow-hidden
          ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 sm:-translate-y-2 opacity-0 sm:scale-95'}
        `}
      >
        {/* Mobile Drag Pill */}
        <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Clean Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-stone-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
              {b('বিজ্ঞপ্তি', 'Notifications')}
            </h2>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded-full leading-none">
                {lang === 'bn' ? toDigits(unreadCount) : unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-stone-500 hover:text-brand-maroon transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{b('সব পঠিত', 'Mark read')}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#FAF8F5]/60">
          {loading && notifications.length === 0 ? (
            <div className="py-16 text-center text-stone-400">
              <p className="text-xs font-medium">{b('লোড হচ্ছে...', 'Loading...')}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-14 text-center text-stone-400 flex flex-col items-center">
              <Bell className="w-6 h-6 text-stone-300 mb-2 stroke-1.5" />
              <p className="text-xs font-semibold text-stone-600">{b('কোনো নতুন বিজ্ঞপ্তি নেই', 'No new notifications')}</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isRead = readIds.includes(notif.id);
              const wingLabel = getWingLabel(notif.wing);

              return (
                <Link
                  key={notif.id}
                  href={notif.link || '/notices'}
                  onClick={() => {
                    markSingleAsRead(notif.id);
                    onClose();
                  }}
                  className={`block p-3 rounded-2xl border transition-all ${
                    isRead
                      ? 'bg-white/80 border-stone-200/70 hover:bg-white hover:border-brand-maroon/30 shadow-2xs'
                      : 'bg-white border-brand-maroon/30 shadow-xs ring-1 ring-brand-maroon/10'
                  } group`}
                >
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <span className="font-semibold text-brand-maroon">{wingLabel}</span>
                      <span className="text-stone-300">•</span>
                      <span>{formatTimeAgo(notif.createdAt)}</span>
                    </div>
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`text-xs sm:text-[13px] leading-snug tracking-tight line-clamp-1 group-hover:text-brand-maroon transition-colors ${
                    isRead ? 'font-semibold text-stone-800' : 'font-bold text-stone-950'
                  }`}>
                    {t(notif.title)}
                  </h3>

                  {/* Single Line Clean Excerpt */}
                  {notif.message && (
                    <p className="text-[11px] text-stone-500 leading-normal line-clamp-1 mt-0.5">
                      {t(notif.message)}
                    </p>
                  )}

                  {/* Optional PDF badge */}
                  {notif.pdfUrl && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 w-fit px-1.5 py-0.5 rounded border border-amber-200/70">
                      <FileText className="w-3 h-3 text-amber-700" />
                      <span>PDF</span>
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>

        {/* Minimal Footer Link */}
        <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center shrink-0">
          <Link
            href="/notices"
            onClick={onClose}
            className="text-xs font-bold text-stone-700 hover:text-brand-maroon transition-colors inline-flex items-center gap-1"
          >
            <span>{b('সকল বিজ্ঞপ্তি ও নোটিশ দেখুন', 'View all announcements')}</span>
            <span className="text-stone-400">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
