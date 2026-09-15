'use client';
import { useState, useEffect } from 'react';
import {
  Megaphone, AlertTriangle, Check, Trash2, Edit2, X,
  Search, Plus, RefreshCw, BellRing, Save
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NoticesManagerPage() {
  const { lang, b } = useLanguage();
  const [notices, setNotices] = useState([]);
  const [activeFormTab, setActiveFormTab] = useState('notice'); // 'notice' | 'popup'

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    isUrgent: false,
    year: new Date().getFullYear().toString()
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Settings for Emergency Popup
  const [popupSettings, setPopupSettings] = useState({
    popupEnabled: 'false',
    popupTitle: '',
    popupMessage: ''
  });
  const [savingPopup, setSavingPopup] = useState(false);

  useEffect(() => {
    fetchNotices();
    fetchPopupSettings();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/admin/notices');
      const data = await res.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch notices', err);
    }
  };

  const fetchPopupSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setPopupSettings({
        popupEnabled: data.popupEnabled || 'false',
        popupTitle: data.popupTitle || '',
        popupMessage: data.popupMessage || ''
      });
    } catch (err) {
      console.error('Failed to fetch popup settings', err);
    }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch('/api/admin/notices', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingId })
        });
        if (res.ok) {
          setMessage(b('নোটিশ সফলভাবে আপডেট করা হয়েছে!', 'Notice updated successfully!'));
          setEditingId(null);
          setFormData({ title: '', text: '', isUrgent: false, year: new Date().getFullYear().toString() });
          fetchNotices();
        } else {
          setMessage(b('নোটিশ আপডেট করা যায়নি।', 'Failed to update notice.'));
        }
      } else {
        const res = await fetch('/api/admin/notices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          setMessage(b('নতুন নোটিশ সফলভাবে প্রকাশিত হয়েছে!', 'Notice published successfully!'));
          setFormData({ title: '', text: '', isUrgent: false, year: new Date().getFullYear().toString() });
          fetchNotices();
        } else {
          setMessage(b('নোটিশ প্রকাশ করা যায়নি।', 'Failed to publish notice.'));
        }
      }
    } catch (err) {
      setMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3500);
    }
  };

  const startEdit = (notice) => {
    setActiveFormTab('notice');
    setEditingId(notice.id);
    setFormData({
      title: notice.title,
      text: notice.text,
      isUrgent: Boolean(notice.isUrgent),
      year: String(notice.year || new Date().getFullYear())
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', text: '', isUrgent: false, year: new Date().getFullYear().toString() });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await fetch('/api/admin/notices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirmId })
      });
      if (editingId === deleteConfirmId) cancelEdit();
      setDeleteConfirmId(null);
      setMessage(b('নোটিশ মুছে ফেলা হয়েছে।', 'Notice deleted successfully.'));
      fetchNotices();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    }
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    setSavingPopup(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(popupSettings)
      });
      if (res.ok) {
        setMessage(b('জরুরি পপ-আপ সেটিংস সংরক্ষিত হয়েছে!', 'Emergency popup settings saved!'));
        setTimeout(() => setMessage(''), 3500);
      } else {
        setMessage(b('পপ-আপ সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।', 'Failed to save popup settings.'));
      }
    } catch (err) {
      setMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setSavingPopup(false);
    }
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch = !searchQuery.trim() ||
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.text?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgent = !filterUrgent || n.isUrgent;
    return matchesSearch && matchesUrgent;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
            {b('নোটিশ বোর্ড ও জরুরি বার্তা', 'Notice Board & Announcements')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('নাগরিকদের জন্য সাধারণ ও জরুরি বিজ্ঞপ্তি প্রকাশ ও নিয়ন্ত্রণ করুন', 'Publish official community notices and manage broadcast alerts')}
          </p>
        </div>

        <button
          onClick={fetchNotices}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
          <span>{b('রিফ্রেশ', 'Refresh')}</span>
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2.5 border text-xs font-semibold shadow-xs ${
            message.includes('Error') || message.includes('failed') || message.includes('ব্যর্থ')
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {message.includes('Error') || message.includes('failed') || message.includes('ব্যর্থ') ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ═══ Left Column: Form with Clean Tabbed Switch ═══ */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          
          {/* Segmented Control */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-stone-100 border border-stone-200/80">
            <button
              type="button"
              onClick={() => setActiveFormTab('notice')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeFormTab === 'notice'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>{editingId ? b('সম্পাদনা', 'Edit Notice') : b('নতুন নোটিশ', 'New Notice')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFormTab('popup')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeFormTab === 'popup'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>{b('জরুরি পপ-আপ', 'Alert Modal')}</span>
              {popupSettings.popupEnabled === 'true' && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          </div>

          {/* TAB 1: Notice Form */}
          {activeFormTab === 'notice' && (
            <form onSubmit={handleNoticeSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-stone-900">
                  {editingId ? b('বিদ্যমান নোটিশ সম্পাদনা', 'Edit Notice') : b('ওয়েবসাইটে নোটিশ প্রকাশ', 'Publish Notice')}
                </span>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{b('বাতিল', 'Cancel')}</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('নোটিশের শিরোনাম', 'Notice Title')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={b('যেমন: চাঁদা সংগ্রহ ও কুপন সংক্রান্ত বিজ্ঞপ্তি', 'e.g. Donation Drive Notice')}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('বছর (Year)', 'Year')}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                      className="w-4 h-4 text-brand-maroon rounded border-stone-300 focus:ring-brand-maroon"
                    />
                    <span className="text-xs font-bold text-rose-700">
                      {b('জরুরি নোটিশ', 'Urgent Notice')}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('বিস্তারিত বিবরণ', 'Notice Content')} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder={b('বিজ্ঞপ্তির পূর্ণাঙ্গ বার্তা এখানে লিখুন...', 'Write the full announcement text here...')}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-base sm:text-xs focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Megaphone className="w-3.5 h-3.5" />
                )}
                <span>{editingId ? b('পরিবর্তন সংরক্ষণ করুন', 'Save Changes') : b('নোটিশ প্রকাশ করুন', 'Publish Notice')}</span>
              </button>
            </form>
          )}

          {/* TAB 2: Emergency Alert Modal Settings */}
          {activeFormTab === 'popup' && (
            <form onSubmit={handlePopupSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <span className="text-xs font-bold text-stone-900">{b('জরুরি পপ-আপ মডাল', 'Emergency Modal Broadcast')}</span>
                  <p className="text-[11px] text-stone-400">{b('ওয়েবসাইটে প্রবেশের সময় তাত্ক্ষণিক সতর্কবার্তা', 'Popup shown when users first visit the portal')}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  popupSettings.popupEnabled === 'true'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-stone-100 text-stone-600'
                }`}>
                  {popupSettings.popupEnabled === 'true' ? 'Active' : 'Disabled'}
                </span>
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={popupSettings.popupEnabled === 'true'}
                  onChange={(e) => setPopupSettings({
                    ...popupSettings,
                    popupEnabled: e.target.checked ? 'true' : 'false'
                  })}
                  className="w-4 h-4 text-brand-maroon rounded border-stone-300 focus:ring-brand-maroon"
                />
                <span className="text-xs font-bold text-stone-800">
                  {b('জরুরি পপ-আপ সক্রিয় রাখুন (Enable Modal)', 'Enable Emergency Popup on Portal')}
                </span>
              </label>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('পপ-আপ শিরোনাম', 'Popup Title')}
                </label>
                <input
                  type="text"
                  value={popupSettings.popupTitle}
                  onChange={(e) => setPopupSettings({ ...popupSettings, popupTitle: e.target.value })}
                  placeholder={b('যেমন: জরুরি আবহাওয়া সতর্কতা', 'e.g. Weather Alert')}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs focus:ring-2 focus:ring-brand-maroon/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('পপ-আপ বার্তা', 'Popup Message')}
                </label>
                <textarea
                  rows="3"
                  value={popupSettings.popupMessage}
                  onChange={(e) => setPopupSettings({ ...popupSettings, popupMessage: e.target.value })}
                  placeholder={b('দর্শনার্থীদের জন্য সতর্কতামূলক নির্দেশনা...', 'Important visitor instructions...')}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-base sm:text-xs focus:ring-2 focus:ring-brand-maroon/20 outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={savingPopup}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {savingPopup ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{b('পপ-আপ সেটিংস সংরক্ষণ করুন', 'Save Modal Settings')}</span>
              </button>
            </form>
          )}
        </div>

        {/* ═══ Right Column: Published Notices List ═══ */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {b(`প্রকাশিত নোটিশ তালিকা (${filteredNotices.length})`, `Published Notices (${filteredNotices.length})`)}
              </h2>
              <p className="text-[11px] text-stone-400">{b('ওয়েবসাইটে প্রদর্শিত সব নোটিশ', 'All active public notices')}</p>
            </div>

            {/* Search and Urgent Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterUrgent(!filterUrgent)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  filterUrgent
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {b(`🚨 জরুরি (${notices.filter(n => n.isUrgent).length})`, `🚨 Urgent (${notices.filter(n => n.isUrgent).length})`)}
              </button>

              <div className="relative flex-1 sm:w-44">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={b('নোটিশ খুঁজুন...', 'Search notices...')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-base sm:text-xs focus:bg-white focus:ring-2 focus:ring-brand-maroon/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notices Stack */}
          <div className="overflow-y-auto max-h-[600px] pr-1 space-y-2.5">
            {filteredNotices.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-30" />
                {b('কোনো নোটিশ খুঁজে পাওয়া যায়নি।', 'No notices found.')}
              </div>
            ) : (
              filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    notice.isUrgent
                      ? 'bg-rose-50/30 border-rose-200'
                      : 'bg-stone-50/50 border-stone-200/80 hover:bg-white hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {notice.isUrgent && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider">
                            Urgent
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-700 text-[10px] font-mono font-bold">
                          {notice.year}
                        </span>
                        <h3 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                          {notice.title}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 whitespace-pre-line pt-0.5 leading-relaxed">
                        {notice.text}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => startEdit(notice)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer"
                        title={b('সম্পাদনা', 'Edit')}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(notice.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={b('মুছুন', 'Delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-stone-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-brand-maroon flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">{b('নোটিশটি মুছে ফেলতে চান?', 'Delete this notice?')}</h3>
              <p className="text-xs text-stone-500 mt-1">
                {b('এই নোটিশটি ওয়েবসাইট থেকে স্থায়ীভাবে অপসারিত হবে।', 'This notice will be permanently deleted.')}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                {b('বাতিল', 'Cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                {b('মুছে ফেলুন', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
