'use client';
import { useState, useEffect } from 'react';
import {
  Megaphone, AlertTriangle, Check, Trash2, Edit2, X,
  Search, RefreshCw, FileText, UploadCloud,
  ExternalLink, Eye
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function FestiveWaveAccent({ className = 'text-amber-500' }) {
  return (
    <svg className={className} viewBox="0 0 120 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 4C15 1 25 7 40 4C55 1 65 7 80 4C95 1 105 7 120 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function NoticesManagerPage() {
  const { lang, b } = useLanguage();
  const [notices, setNotices] = useState([]);
  const [selectedWing, setSelectedWing] = useState('puja'); // 'puja' | 'club' | 'samiti'
  const [filterWing, setFilterWing] = useState('all'); // 'all' | 'puja' | 'club' | 'samiti'

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    isUrgent: false,
    year: new Date().getFullYear().toString(),
    date: new Date().toISOString().split('T')[0],
    pdfUrl: ''
  });

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [filterWithPdf, setFilterWithPdf] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchNotices();
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

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setMessage(b('অনুগ্রহ করে নোটিশের মূল শিরোনাম লিখুন।', 'Please enter notice main heading.'));
      return;
    }
    if (!formData.text.trim()) {
      setMessage(b('অনুগ্রহ করে নোটিশের বিস্তারিত বিবরণ লিখুন।', 'Please enter notice body text.'));
      return;
    }

    setLoading(true);

    // Apply wing tag to title under the hood
    let cleanTitle = (formData.title || '').replace(/^\[Club\]\s*/i, '').replace(/^\[Samiti\]\s*/i, '').replace(/^\[Puja\]\s*/i, '').trim();
    let finalTitle = cleanTitle;
    if (selectedWing === 'club') {
      finalTitle = `[Club] ${cleanTitle}`;
    } else if (selectedWing === 'samiti') {
      finalTitle = `[Samiti] ${cleanTitle}`;
    }

    const payload = {
      ...formData,
      title: finalTitle,
      subtitle: '',
      text: (formData.text || '').trim(),
      date: formData.date || new Date().toISOString().split('T')[0],
      pdfUrl: formData.pdfUrl ? formData.pdfUrl.trim() : null
    };

    try {
      if (editingId) {
        const res = await fetch('/api/admin/notices', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingId })
        });
        if (res.ok) {
          setMessage(b('নোটিশ সফলভাবে আপডেট করা হয়েছে!', 'Notice updated successfully!'));
          setEditingId(null);
          setSelectedWing('puja');
          setFormData({
            title: '',
            text: '',
            isUrgent: false,
            year: new Date().getFullYear().toString(),
            date: new Date().toISOString().split('T')[0],
            pdfUrl: ''
          });
          fetchNotices();
        } else {
          setMessage(b('নোটিশ আপডেট করা যায়নি।', 'Failed to update notice.'));
        }
      } else {
        const res = await fetch('/api/admin/notices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setMessage(b('নতুন নোটিশ সফলভাবে প্রকাশিত হয়েছে!', 'Notice published successfully!'));
          setSelectedWing('puja');
          setFormData({
            title: '',
            text: '',
            isUrgent: false,
            year: new Date().getFullYear().toString(),
            date: new Date().toISOString().split('T')[0],
            pdfUrl: ''
          });
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

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setMessage(b('শুধুমাত্র PDF ফাইল আপলোড করা যাবে (.pdf)', 'Only PDF files allowed (.pdf)'));
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploadingPdf(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 'notice');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) throw new Error('PDF upload failed');
      const data = await res.json();
      setFormData(prev => ({ ...prev, pdfUrl: data.url }));
      setMessage(b('PDF সফলভাবে আপলোড হয়েছে!', 'PDF uploaded successfully!'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(b('PDF আপলোড ব্যর্থ হয়েছে: ' + err.message, 'PDF upload failed: ' + err.message));
    } finally {
      setUploadingPdf(false);
    }
  };

  const startEdit = (notice) => {
    setEditingId(notice.id);

    let wing = 'puja';
    let cleanTitle = notice.title || '';
    if (cleanTitle.startsWith('[Club]')) {
      wing = 'club';
      cleanTitle = cleanTitle.replace(/^\[Club\]\s*/, '');
    } else if (cleanTitle.startsWith('[Samiti]')) {
      wing = 'samiti';
      cleanTitle = cleanTitle.replace(/^\[Samiti\]\s*/, '');
    }
    setSelectedWing(wing);

    setFormData({
      title: cleanTitle,
      text: notice.text || '',
      isUrgent: Boolean(notice.isUrgent),
      year: String(notice.year || new Date().getFullYear()),
      date: notice.date || new Date().toISOString().split('T')[0],
      pdfUrl: notice.pdfUrl || ''
    });
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSelectedWing('puja');
    setFormData({
      title: '',
      text: '',
      isUrgent: false,
      year: new Date().getFullYear().toString(),
      date: new Date().toISOString().split('T')[0],
      pdfUrl: ''
    });
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

  const filteredNotices = notices.filter(n => {
    const isClubNotice = n.title?.startsWith('[Club]');
    const isSamitiNotice = n.title?.startsWith('[Samiti]');
    const isPujaNotice = !isClubNotice && !isSamitiNotice;

    if (filterWing === 'puja' && !isPujaNotice) return false;
    if (filterWing === 'club' && !isClubNotice) return false;
    if (filterWing === 'samiti' && !isSamitiNotice) return false;

    const matchesSearch = !searchQuery.trim() ||
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.text?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgent = !filterUrgent || n.isUrgent;
    const matchesPdf = !filterWithPdf || Boolean(n.pdfUrl);

    return matchesSearch && matchesUrgent && matchesPdf;
  });

  // Wing styling details for preview and badges
  const wingDetails = {
    puja: {
      labelBn: 'শারদীয়া দুর্গাপূজা',
      labelEn: 'Durga Puja',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
      badgeBorder: 'border-rose-200',
      icon: '🌺',
      accentColor: 'text-brand-maroon',
      authTextBn: 'বাঁশদ্রোণী সোনালী পার্ক সার্বজনীন দুর্গোৎসব পরিচালনা পরিষদ',
      authTextEn: 'Bansdroni Sonali Park Sarbojanin Durgotsav Committee'
    },
    club: {
      labelBn: 'সোনালী সঙ্ঘ',
      labelEn: 'Sonali Sangha Club',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBorder: 'border-amber-200',
      icon: '🏆',
      accentColor: 'text-amber-700',
      authTextBn: 'বাঁশদ্রোণী সোনালী সঙ্ঘ ক্লাব ও ক্রীড়া পরিষদ কর্তৃক অনুমোদিত',
      authTextEn: 'Authorized by Bansdroni Sonali Sangha Club Executive'
    },
    samiti: {
      labelBn: 'উন্নয়ন সমিতি',
      labelEn: 'Unnayan Samiti (RWA)',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeBorder: 'border-emerald-200',
      icon: '🏛️',
      accentColor: 'text-emerald-700',
      authTextBn: 'বাঁশদ্রোণী সোনালী পার্ক উন্নয়ন সমিতি পরিচালনা পরিষদ কর্তৃক অনুমোদিত',
      authTextEn: 'Authorized by Bansdroni Sonali Park Unnayan Samiti Executive'
    }
  };

  const currentWingInfo = wingDetails[selectedWing];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold mb-1">
            <Megaphone className="w-3.5 h-3.5 text-amber-600" />
            <span>{b('নোটিশ প্রকাশ ও পরিচালনা কেন্দ্র', 'Notice Publishing & Release Center')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {b('নোটিশ বোর্ড কন্ট্রোল', 'Notice Board Publishing Control')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('ওয়েবসাইটের নোটিশ কার্ডের মূল শিরোনাম, বিস্তারিত বক্তব্য ও সার্কুলার PDF সরাসরি নিয়ন্ত্রণ করুন', 'Directly compose and edit Notice Heading, Body Text, and Circular PDF attachments matching portal cards')}
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

      {/* Toast Notification */}
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

      {/* 2-Column Grid: Form & Live Card Preview vs Published List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ═══ Left Column: Notice Composer & Live Preview ═══ */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Notice Composition Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-maroon inline-block animate-pulse" />
                <span className="text-sm font-bold text-stone-900">
                  {editingId ? b('বিদ্যমান নোটিশ সম্পাদনা', 'Edit Notice') : b('নতুন নোটিশ রচনা করুন', 'Compose New Notice')}
                </span>
              </div>
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

            <form onSubmit={handleNoticeSubmit} className="space-y-4">
              
              {/* 1. Wing Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  {b('শাখা নির্বাচন', 'Target Wing')} <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedWing('puja')}
                    className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                      selectedWing === 'puja'
                        ? 'bg-rose-50 border-rose-300 text-brand-maroon font-bold shadow-xs ring-1 ring-rose-200'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="block text-base mb-0.5">🌺</span>
                    <span>{b('শারদীয়া পূজা', 'Durga Puja')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWing('club')}
                    className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                      selectedWing === 'club'
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs ring-1 ring-amber-200'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="block text-base mb-0.5">🏆</span>
                    <span>{b('সোনালী সঙ্ঘ', 'Club')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWing('samiti')}
                    className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                      selectedWing === 'samiti'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-200'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="block text-base mb-0.5">🏛️</span>
                    <span>{b('উন্নয়ন সমিতি', 'Samiti')}</span>
                  </button>
                </div>
              </div>

              {/* 2. Notice Main Heading */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('নোটিশের মূল শিরোনাম', 'Notice Main Heading')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={b('যেমন: চাঁদা সংগ্রহ ও কুপন সংক্রান্ত বিজ্ঞপ্তি', 'e.g. Donation & Coupon Notice')}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                />
              </div>

              {/* 3. Notice Body Text */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('বিজ্ঞপ্তির মূল বক্তব্য / বিস্তারিত বিবরণ', 'Notice Body Text')} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="5"
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder={b('বিজ্ঞপ্তির পূর্ণাঙ্গ বক্তব্য এখানে লিখুন...\n(যেমন: আগামী রবিবার সকাল ১০টায় ক্লাব প্রাঙ্গণে সাধারণ সভা অনুষ্ঠিত হবে। সকল সদস্যের উপস্থিতি একান্ত কাম্য।)', 'Write full notice body text here...')}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs leading-relaxed focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                />
              </div>

              {/* 5. Date & Urgent Toggle */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {b('প্রকাশের তারিখ', 'Publication Date')}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 outline-none"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                      className="w-4 h-4 text-brand-maroon rounded border-stone-300 focus:ring-brand-maroon cursor-pointer"
                    />
                    <span className="text-xs font-bold text-rose-700">
                      🚨 {b('জরুরি নোটিশ', 'Urgent Notice')}
                    </span>
                  </label>
                </div>
              </div>

              {/* 6. PDF Circular Attachment */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {b('সংযুক্ত অফিসিয়াল সার্কুলার PDF (ঐচ্ছিক)', 'Attached Circular PDF (Optional)')}
                  </label>
                  {formData.pdfUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, pdfUrl: '' }))}
                      className="text-[11px] text-rose-600 hover:underline cursor-pointer font-bold"
                    >
                      {b('পিডিএফ সরান', 'Remove PDF')}
                    </button>
                  )}
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-brand-maroon text-stone-700 hover:text-brand-maroon text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                      <UploadCloud className="w-3.5 h-3.5 text-brand-maroon" />
                      <span>{uploadingPdf ? b('আপলোড হচ্ছে...', 'Uploading...') : b('PDF আপলোড করুন', 'Upload PDF File')}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfUpload}
                        disabled={uploadingPdf}
                        className="hidden"
                      />
                    </label>

                    {formData.pdfUrl && (
                      <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 text-xs font-medium max-w-full">
                        <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[150px]">{formData.pdfUrl.split('/').pop()}</span>
                        <a
                          href={formData.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:text-emerald-900 ml-1"
                          title="Open PDF"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={formData.pdfUrl || ''}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder={b('অথবা সরাসরি লিংক দিন: /docs/sample-notice.pdf', 'or paste URL: /docs/sample-notice.pdf')}
                    className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-brand-maroon outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Megaphone className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>{editingId ? b('পরিবর্তন সংরক্ষণ করুন', 'Save Changes') : b('ওয়েবসাইটে নোটিশ প্রকাশ করুন', 'Publish Notice')}</span>
              </button>
            </form>
          </div>

          {/* ═══ LIVE NOTICE CARD PREVIEW (Exact match with public portal card) ═══ */}
          <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-maroon" />
                <span>{b('লাইভ কার্ড প্রিভিউ', 'Live Portal Card Preview')}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {b('ওয়েবসাইটে যেমন দেখাবে', 'As Rendered on Portal')}
              </span>
            </div>

            {/* Simulating public notice card */}
            <div className="card-tactile-parchment p-5 sm:p-6 rounded-2xl border border-amber-200/90 shadow-xs relative overflow-hidden bg-[#FAF7F2]">
              {/* Top Meta Row */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${currentWingInfo.badgeBg}`}>
                    <span>{currentWingInfo.icon}</span>
                    <span>{lang === 'bn' ? currentWingInfo.labelBn : currentWingInfo.labelEn}</span>
                  </span>
                  {formData.isUrgent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-300">
                      <span>{b('জরুরি', 'Urgent')}</span>
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-serif font-medium text-stone-600 bg-white/90 px-2 py-0.5 rounded-full border border-stone-200 shadow-2xs">
                  📅 {formData.date || '২০২৬-১০-১০'}
                </span>
              </div>

              {/* Notice Title (Heading) */}
              <h3 className="text-base sm:text-lg font-serif font-black text-stone-900 leading-snug tracking-tight">
                {formData.title.trim() || b('এখানে মূল শিরোনাম প্রদর্শিত হবে', 'Main heading will appear here')}
              </h3>

              {/* Divider Wave */}
              <div className="my-2">
                <FestiveWaveAccent className={`w-14 h-1.5 ${currentWingInfo.accentColor}`} />
              </div>

              {/* Body Text */}
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line mb-3">
                {formData.text.trim() || b('এখানে বিজ্ঞপ্তির মূল বক্তব্য প্রদর্শিত হবে...', 'Notice body text will appear here...')}
              </p>

              {/* Attached PDF Button */}
              {formData.pdfUrl && (
                <div className="pt-1 pb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-maroon text-white font-bold text-xs shadow-xs">
                    <FileText className="w-3.5 h-3.5 text-amber-200" />
                    <span>{b('অফিসিয়াল বিজ্ঞপ্তি PDF দেখুন', 'View Official PDF Circular')}</span>
                    <span className="ml-1">→</span>
                  </span>
                </div>
              )}

              {/* Authorized Footer */}
              <div className="pt-2 border-t border-amber-200/60 text-[10px] text-stone-500 font-serif italic flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">{lang === 'bn' ? currentWingInfo.authTextBn : currentWingInfo.authTextEn}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ═══ Right Column: Published Notices List (Sorted Newest First) ═══ */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {b(`প্রকাশিত নোটিশ তালিকা (${filteredNotices.length})`, `Published Notices (${filteredNotices.length})`)}
              </h2>
              <p className="text-[11px] text-stone-400">
                {b('সর্বশেষ প্রকাশিত নোটিশ সর্বদা প্রথমে প্রদর্শিত হয়', 'Latest published notices appear first')}
              </p>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
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

              <button
                type="button"
                onClick={() => setFilterWithPdf(!filterWithPdf)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  filterWithPdf
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {b(`📄 PDF (${notices.filter(n => n.pdfUrl).length})`, `📄 PDF (${notices.filter(n => n.pdfUrl).length})`)}
              </button>

              <div className="relative flex-1 sm:w-36">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={b('খুঁজুন...', 'Search...')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-7 pr-2.5 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-brand-maroon outline-none"
                />
              </div>
            </div>
          </div>

          {/* Wing Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-100">
            {[
              { key: 'all', labelBn: 'সকল শাখা', labelEn: 'All Wings', count: notices.length },
              { key: 'puja', labelBn: '🌺 শারদীয়া পূজা', labelEn: '🌺 Durga Puja', count: notices.filter(n => !n.title?.startsWith('[Club]') && !n.title?.startsWith('[Samiti]')).length },
              { key: 'club', labelBn: '🏆 সোনালী সঙ্ঘ', labelEn: '🏆 Sonali Club', count: notices.filter(n => n.title?.startsWith('[Club]')).length },
              { key: 'samiti', labelBn: '🏛️ উন্নয়ন সমিতি', labelEn: '🏛️ Samiti (RWA)', count: notices.filter(n => n.title?.startsWith('[Samiti]')).length },
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterWing(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterWing === tab.key
                    ? 'bg-stone-900 text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
                <span className="ml-1 opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Notices Stack (Scrollable, latest first) */}
          <div className="overflow-y-auto max-h-[680px] pr-1 space-y-3">
            {filteredNotices.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-30" />
                {b('কোনো নোটিশ খুঁজে পাওয়া যায়নি।', 'No notices found.')}
              </div>
            ) : (
              filteredNotices.map((notice) => {
                const isClub = notice.title?.startsWith('[Club]');
                const isSamiti = notice.title?.startsWith('[Samiti]');
                const cleanHeading = notice.title?.replace(/^\[Club\]\s*/i, '').replace(/^\[Samiti\]\s*/i, '').replace(/^\[Puja\]\s*/i, '');

                return (
                  <div
                    key={notice.id}
                    className={`p-4 rounded-xl border transition-all ${
                      notice.isUrgent
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-stone-50/50 border-stone-200/80 hover:bg-white hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        {/* Tags Bar */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {notice.isUrgent && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider">
                              {b('🚨 জরুরি', '🚨 Urgent')}
                            </span>
                          )}
                          {/* Wing Badge */}
                          {isClub ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold">
                              🏆 {b('সোনালী সঙ্ঘ', 'Club')}
                            </span>
                          ) : isSamiti ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-bold">
                              🏛️ {b('উন্নয়ন সমিতি', 'Samiti')}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-brand-maroon text-[10px] font-bold">
                              🌺 {b('শারদীয়া দুর্গোৎসব', 'Puja')}
                            </span>
                          )}
                          {notice.date && (
                            <span className="text-[10px] font-mono text-stone-400">
                              📅 {notice.date}
                            </span>
                          )}
                        </div>

                        {/* Notice Heading */}
                        <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                          {cleanHeading}
                        </h3>

                        {/* Notice Body Text */}
                        <p className="text-xs text-stone-600 whitespace-pre-line pt-0.5 leading-relaxed line-clamp-3">
                          {notice.text}
                        </p>

                        {/* PDF Attachment Indicator */}
                        {notice.pdfUrl && (
                          <div className="pt-1 flex items-center gap-2">
                            <a
                              href={notice.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-600" />
                              <span>{b('সংযুক্ত PDF সার্কুলার দেখুন', 'View PDF Circular')}</span>
                              <ExternalLink className="w-3 h-3 text-amber-600" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => startEdit(notice)}
                          className="p-2 sm:p-1.5 rounded-xl text-stone-500 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                          title={b('সম্পাদনা', 'Edit')}
                        >
                          <Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(notice.id)}
                          className="p-2 sm:p-1.5 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                          title={b('মুছুন', 'Delete')}
                        >
                          <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
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
                {b('এই নোটিশটি ওয়েবসাইট থেকে স্থায়ীভাবে অপসারিত হবে।', 'This notice will be permanently deleted from portal.')}
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
