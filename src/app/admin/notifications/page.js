'use client';
import { useState, useEffect } from 'react';
import {
  Bell, Send, Trash2, AlertTriangle, CheckCircle2,
  RefreshCw, Megaphone, ExternalLink, Sparkles, Filter,
  ShieldCheck, Eye, Clock, ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function AdminNotificationsPage() {
  const { lang, b } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filterWing, setFilterWing] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    wing: 'universal', // 'universal' | 'puja' | 'club' | 'samiti'
    type: 'announcement',
    isUrgent: false,
    link: ''
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showToast('error', b('বিজ্ঞপ্তির শিরোনাম ও বার্তা উভয়ই আবশ্যক।', 'Title and message are required.'));
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', b('বিজ্ঞপ্তিটি সফলভাবে সমস্ত ব্যবহারকারীর কাছে পাঠানো হয়েছে!', 'Broadcast sent successfully to all users!'));
        setFormData({
          title: '',
          message: '',
          wing: 'universal',
          type: 'announcement',
          isUrgent: false,
          link: ''
        });
        fetchNotifications();
      } else {
        showToast('error', data.error || b('বিজ্ঞপ্তি পাঠাতে ব্যর্থ হয়েছে।', 'Failed to send broadcast.'));
      }
    } catch (err) {
      showToast('error', b('নেটওয়ার্ক সমস্যা দেখা দিয়েছে।', 'Network error occurred.'));
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(b('আপনি কি নিশ্চিত যে এই বিজ্ঞপ্তিটি মুছে ফেলতে চান?', 'Are you sure you want to delete this broadcast?'))) {
      return;
    }

    try {
      const res = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('success', b('বিজ্ঞপ্তি সফলভাবে মুছে ফেলা হয়েছে।', 'Broadcast deleted successfully.'));
        fetchNotifications();
      } else {
        showToast('error', b('মুছে ফেলতে ব্যর্থ হয়েছে।', 'Failed to delete.'));
      }
    } catch (err) {
      showToast('error', b('নেটওয়ার্ক ত্রুটি।', 'Network error.'));
    }
  };

  const filteredList = notifications.filter(n => {
    if (filterWing === 'all') return true;
    return n.wing === filterWing;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>{b('রিয়েল-টাইম নোটিফিকেশন ইঞ্জিন', 'Universal Real-Time Notification Engine')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {b('নোটিফিকেশন ও সম্প্রচার কেন্দ্র', 'Notification & Broadcast Hub')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            {b(
              'এখান থেকে আপনি পূজা, ক্লাব বা সমিতির নামে সার্বজনীন তাৎক্ষণিক বিজ্ঞপ্তি পাঠাতে পারবেন যা ওয়েবসাইটের বেল আইকনে সাথে সাথে প্রদর্শিত হবে।',
              'Send real-time instant alerts and broadcast messages across Durga Puja, Club, and Samiti visible on the public bell icon.'
            )}
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${loading ? 'animate-spin' : ''}`} />
          <span>{b('রিফ্রেশ', 'Refresh')}</span>
        </button>
      </div>

      {/* Toast Notification */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-xs animate-in fade-in duration-200 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* ═══ Main Grid: Compose Box + Live Preview ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Compose Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Megaphone className="w-4.5 h-4.5 text-brand-maroon" />
              <span>{b('নতুন নোটিফিকেশন পাঠান', 'Broadcast New Notification')}</span>
            </h2>
            <span className="text-[11px] font-semibold text-stone-400">
              {b('তাত্ক্ষণিক পুশ', 'Instant Live Push')}
            </span>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            
            {/* Target Pillar / Wing Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {b('বিজ্ঞপ্তির শাখা / বিভাগ নির্বাচন করুন', 'Select Branch / Wing')} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'universal', bn: 'সার্বজনীন', en: 'All Community', icon: '📢', color: 'peer-checked:border-indigo-600 peer-checked:bg-indigo-50/50 text-indigo-900' },
                  { id: 'puja', bn: 'শারদীয়া পূজা', en: 'Durga Puja', icon: '🌺', color: 'peer-checked:border-rose-600 peer-checked:bg-rose-50/50 text-rose-900' },
                  { id: 'club', bn: 'সোনালী সঙ্ঘ', en: 'Club Wing', icon: '🏆', color: 'peer-checked:border-amber-600 peer-checked:bg-amber-50/50 text-amber-900' },
                  { id: 'samiti', bn: 'উন্নয়ন সমিতি', en: 'Samiti (RWA)', icon: '🏛️', color: 'peer-checked:border-emerald-600 peer-checked:bg-emerald-50/50 text-emerald-900' },
                ].map((w) => (
                  <label key={w.id} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="wing"
                      value={w.id}
                      checked={formData.wing === w.id}
                      onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                      className="sr-only peer"
                    />
                    <div className={`p-2.5 rounded-xl border border-stone-200 hover:border-stone-300 transition-all text-center flex flex-col items-center gap-1 ${w.color}`}>
                      <span className="text-lg">{w.icon}</span>
                      <span className="text-xs font-bold leading-tight">{lang === 'bn' ? w.bn : w.en}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {b('বিজ্ঞপ্তির শিরোনাম', 'Notification Title')} *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={b('যেমন: রক্তদান শিবিরের তারিখ ঘোষণা / মহাষ্টমী অঞ্জলি সময়', 'e.g. Blood Donation Camp Date Announced / Maha Ashtami Timings')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {b('বিস্তারিত বার্তা', 'Message Details')} *
              </label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={b('বিজ্ঞপ্তির পূর্ণাঙ্গ বিবরণ লিখুন যা ব্যবহারকারীরা নোটিফিকেশন বারে দেখতে পাবেন...', 'Type the complete notification text that appears in the drawer...')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all resize-none"
              />
            </div>

            {/* Target Link & Quick Helpers */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {b('লিংক গন্তব্য (ঐচ্ছিক)', 'Destination Link (Optional)')}
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder={b('যেমন: /puja, /club#club-notices, /samiti#samiti-notices', 'e.g. /puja, /club#club-notices, /gallery')}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all font-mono"
              />

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px]">
                <span className="text-stone-400 font-semibold">{b('দ্রুত লিংক:', 'Presets:')}</span>
                {[
                  { label: b('পূজা সূচি', 'Puja Schedule'), href: '/puja' },
                  { label: b('ক্লাব নোটিশ', 'Club Notices'), href: '/club#club-notices' },
                  { label: b('সমিতি নোটিশ', 'Samiti Notices'), href: '/samiti#samiti-notices' },
                  { label: b('গ্যালারি', 'Gallery'), href: '/gallery' },
                ].map((preset) => (
                  <button
                    key={preset.href}
                    type="button"
                    onClick={() => setFormData({ ...formData, link: preset.href })}
                    className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgent Priority Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-stone-300"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900">
                      {b('জরুরি ঘোষণা (Urgent Alert)', 'Urgent High-Priority Alert')}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white uppercase animate-pulse">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {b('বিজ্ঞপ্তিতে লাল রঙের জরুরি ব্যাজ এবং জ্বলজ্বলে পালস যোগ করবে।', 'Displays a pulsing red alert badge at the top of the user notifications.')}
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{b('বিজ্ঞপ্তি পাঠানো হচ্ছে...', 'Broadcasting...')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{b('এখনই সম্প্রচার করুন (Broadcast Now)', 'Broadcast Now to Public Bell')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview in Public Drawer Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-100 rounded-2xl p-5 border border-stone-200/80">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-stone-500" />
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {b('লাইভ প্রিভিউ (পাবলিক বারে কেমন দেখাবে)', 'Live Bell Drawer Preview')}
              </h3>
            </div>

            {/* Mock Drawer Item */}
            <div className={`p-4 rounded-2xl bg-white border shadow-sm transition-all ${
              formData.isUrgent ? 'border-rose-400 ring-2 ring-rose-100' : 'border-stone-200'
            }`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border bg-stone-50 text-stone-800 border-stone-200 flex items-center gap-1">
                    <span>
                      {formData.wing === 'club' ? '🏆' : formData.wing === 'samiti' ? '🏛️' : formData.wing === 'puja' ? '🌺' : '📢'}
                    </span>
                    <span>
                      {formData.wing === 'club' ? b('সোনালী সঙ্ঘ', 'Club') : formData.wing === 'samiti' ? b('উন্নয়ন সমিতি', 'Samiti') : formData.wing === 'puja' ? b('শারদীয়া পূজা', 'Puja') : b('সার্বজনীন', 'All')}
                    </span>
                  </span>

                  {formData.isUrgent && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-rose-600 text-white uppercase tracking-wider flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>{b('জরুরি', 'Urgent')}</span>
                    </span>
                  )}

                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/15 text-amber-800 border border-amber-300">
                    {b('অ্যাডমিন বার্তা', 'Broadcast')}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-stone-400">
                  <Clock className="w-3 h-3" />
                  <span>{b('এইমাত্র', 'Just now')}</span>
                </div>
              </div>

              <h4 className="text-xs sm:text-[13px] font-black text-stone-900 mb-1 leading-snug">
                {formData.title.trim() || b('বিজ্ঞপ্তির শিরোনাম এখানে আসবে', 'Your notification headline appears here')}
              </h4>

              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {formData.message.trim() || b('বিস্তারিত বিবরণ এখানে প্রদর্শন করা হবে...', 'Detailed announcement text will appear here...')}
              </p>

              {formData.link && (
                <div className="pt-2 border-t border-stone-100 flex justify-end">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-maroon">
                    <span>{b('বিস্তারিত দেখুন', 'View Details')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-stone-500 mt-3 leading-relaxed">
              💡 {b(
                'ব্যবহারকারী ওয়েবসাইটের উপরের বেল আইকনে ক্লিক করলেই এই কার্ডটি দেখতে পাবেন এবং ক্লিক করে নির্দিষ্ট সেকশনে যেতে পারবেন।',
                'Whenever a user clicks the bell icon in the navbar, this card is shown with one-click direct navigation.'
              )}
            </p>
          </div>

          {/* Quick Tip Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900">
            <h4 className="text-xs font-bold mb-1 flex items-center gap-1.5">
              <span>⚡</span>
              <span>{b('স্বয়ংক্রিয় নোটিফিকেশন সিস্টেম', 'Automated Trigger Engine')}</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-amber-800/90">
              {b(
                'এছাড়াও আপনি যখন নোটিশ বোর্ডে নতুন নোটিশ পোস্ট করবেন বা ফটো গ্যালারিতে নতুন ছবি আপলোড করবেন, সিস্টেম স্বয়ংক্রিয়ভাবে বেল আইকনে রিয়েল-টাইম নোটিফিকেশন জেনারেট করে দেয়!',
                'Additionally, whenever you post a new Notice or upload Photos to Gallery, the system automatically derives and publishes a live notification in the public bell drawer!'
              )}
            </p>
          </div>
        </div>

      </div>

      {/* ═══ Sent Broadcasts & Feed Stream ═══ */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
        
        {/* Strip Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-stone-600" />
              <span>{b('সক্রিয় নোটিফিকেশন ও সম্প্রচার ফিড', 'Active Notifications & Broadcast Feed')}</span>
            </h2>
            <p className="text-xs text-stone-500">
              {b('মোট সক্রিয় বিজ্ঞপ্তি:', 'Total active items:')} <span className="font-bold text-stone-800">{filteredList.length}</span>
            </p>
          </div>

          {/* Wing Filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {[
              { id: 'all', bn: 'সব', en: 'All' },
              { id: 'puja', bn: 'পূজা', en: 'Puja' },
              { id: 'club', bn: 'ক্লাব', en: 'Club' },
              { id: 'samiti', bn: 'সমিতি', en: 'Samiti' },
              { id: 'universal', bn: 'সার্বজনীন', en: 'Universal' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterWing(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterWing === f.id
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {lang === 'bn' ? f.bn : f.en}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Table / Cards */}
        {loading ? (
          <div className="py-12 text-center text-stone-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-400" />
            <p className="text-xs">{b('লোড হচ্ছে...', 'Loading feed...')}</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <p className="text-xs">{b('এই ফিল্টারে কোনো বিজ্ঞপ্তি পাওয়া যায়নি।', 'No notifications found for this filter.')}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredList.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl border border-stone-200/80 hover:border-stone-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/40"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-200/80 text-stone-800">
                      {n.wing === 'club' ? '🏆 Club' : n.wing === 'samiti' ? '🏛️ Samiti' : n.wing === 'puja' ? '🌺 Puja' : '📢 Universal'}
                    </span>

                    {n.isUrgent && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-600 text-white uppercase">
                        Urgent
                      </span>
                    )}

                    {n.isCustom ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        Admin Broadcast
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                        {n.type === 'photo' ? 'Photo Upload' : 'Notice Trigger'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                    {n.title}
                  </h3>

                  {n.message && (
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {n.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {n.link && (
                    <Link
                      href={n.link}
                      target="_blank"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
                      title={b('লিংক দেখুন', 'View Link')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}

                  {n.isCustom && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={b('বিজ্ঞপ্তি মুছুন', 'Delete Broadcast')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
