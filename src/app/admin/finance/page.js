'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Search,
  Calendar,
  AlertCircle,
  FileCheck,
  X,
  Eye,
  RefreshCw,
  Download
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { triggerDownload } from '@/utils/download';

const TITLE_PRESETS_BY_WING = {
  Puja: [
    { bn: 'শারদীয়া দুর্গোৎসব পূর্ণাঙ্গ আয়-ব্যয় বিবরণী ২০২৬', en: 'Sharadiya Durga Puja Balance Sheet 2026' },
    { bn: 'বার্ষিক পূজা অডিট রিপোর্ট ২০২৫-২৬', en: 'Annual Puja Audit Report 2025-26' },
    { bn: 'মহাষ্টমী ভোগ ও পূজা কল্যাণ তহবিল হিসেব', en: 'Bhog & Puja Welfare Fund Account' },
    { bn: 'মণ্ডপ ও আলোকসজ্জা ব্যয় বিবরণী', en: 'Pandal & Illumination Expense Audit' }
  ],
  Club: [
    { bn: 'সোনালী সঙ্ঘ বার্ষিক অডিট ও আর্থিক স্টেটমেন্ট ২০২৫-২৬', en: 'Sonali Sangha Annual Audit & Accounts 2025-26' },
    { bn: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ও টুর্নামেন্ট আয়-ব্যয় হিসাব', en: 'Annual Sports & Tournaments Expenditure Statement' },
    { bn: 'স্বেচ্ছায় রক্তদান শিবির ও সমাজকল্যাণ তহবিল বিবরণী', en: 'Blood Donation & Social Welfare Fund Audit' },
    { bn: 'ক্লাব ভবন ও ইনডোর গেমস রক্ষণাবেক্ষণ হিসাব', en: 'Club Infrastructure & Indoor Games Account' }
  ],
  Samiti: [
    { bn: 'সোনালী পার্ক উন্নয়ন সমিতি বার্ষিক অডিট ও আর্থিক হিসাব ২০২৫-২৬', en: 'Sonali Park Unnayan Samiti Annual Audit Statement 2025-26' },
    { bn: 'পাড়ার রাস্তা, এলইডি আলো ও জলনিকাশি উন্নয়ন হিসাব বিবরণী', en: 'Roads, LED Lighting & Drainage Capital Accounts' },
    { bn: 'মাসিক নিরাপত্তা প্রহরী ও বর্জ্য নিষ্কাশন পরিচালনা হিসাব', en: 'Monthly Security Patrol & Sanitation Operations Audit' },
    { bn: 'নাগরিক কল্যাণ তহবিল ও জরুরি সহায়তা ব্যয় বিবরণী', en: 'Civic Welfare & Emergency Support Statement' }
  ]
};

export function parseFinanceDoc(doc) {
  if (!doc?.title) return { wing: 'Puja', cleanTitle: doc?.title || '' };
  if (doc.title.startsWith('[Club]')) return { wing: 'Club', cleanTitle: doc.title.replace('[Club]', '').trim() };
  if (doc.title.startsWith('[Samiti]')) return { wing: 'Samiti', cleanTitle: doc.title.replace('[Samiti]', '').trim() };
  if (doc.title.startsWith('[Puja]')) return { wing: 'Puja', cleanTitle: doc.title.replace('[Puja]', '').trim() };
  return { wing: 'Puja', cleanTitle: doc.title };
}

export default function FinanceManagerPage() {
  const { lang, b } = useLanguage();
  const [finances, setFinances] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    wing: 'Puja',
    year: new Date().getFullYear().toString()
  });
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [filterWing, setFilterWing] = useState('ALL');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const fetchFinances = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      if (data.finances) {
        setFinances(data.finances.sort((a, b) => b.year - a.year));
      }
    } catch (err) {
      console.error('Failed to fetch finance records:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, []);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const availableYears = useMemo(() => {
    const years = new Set(finances.map((f) => String(f.year)));
    years.add('2026');
    years.add('2025');
    return Array.from(years).sort((a, b) => b - a);
  }, [finances]);

  const filteredFinances = useMemo(() => {
    return finances
      .filter((doc) => {
        const parsed = parseFinanceDoc(doc);
        if (filterWing !== 'ALL' && parsed.wing !== filterWing) return false;
        if (selectedYear !== 'ALL' && String(doc.year) !== String(selectedYear)) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          parsed.cleanTitle?.toLowerCase().includes(q) ||
          String(doc.year).includes(q)
        );
      });
  }, [finances, filterWing, selectedYear, searchQuery]);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      showToast('error', b('শুধুমাত্র PDF ফাইল আপলোড করা যাবে (.pdf)', 'Only PDF files allowed (.pdf)'));
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      showToast('error', b('ফাইলের সাইজ ১৫ মেগাবাইট (15MB)-এর কম হতে হবে।', 'File size must be under 15MB.'));
      return;
    }

    setFile(selectedFile);
    if (!formData.title) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setFormData((prev) => ({ ...prev, title: cleanName }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('error', b('অনুগ্রহ করে প্রথমে একটি PDF ফাইল নির্বাচন করুন।', 'Please select a PDF file first.'));
      return;
    }
    if (!formData.title.trim()) {
      showToast('error', b('অনুগ্রহ করে ডকুমেন্টের শিরোনাম দিন।', 'Please provide a document title.'));
      return;
    }

    setLoading(true);
    try {
      // 1. Upload PDF
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 'finance');

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!uploadRes.ok) throw new Error('File upload failed');
      const uploadResult = await uploadRes.json();

      // 2. Save metadata
      const encodedTitle = `[${formData.wing}] ${formData.title.trim()}`;
      const dbRes = await fetch('/api/admin/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: encodedTitle,
          year: parseInt(formData.year),
          url: uploadResult.url
        })
      });

      if (!dbRes.ok) throw new Error('Database save failed');

      showToast('success', b('আর্থিক রিপোর্ট সফলভাবে প্রকাশ করা হয়েছে!', 'Audit report published successfully!'));
      setFile(null);
      setFormData((prev) => ({ ...prev, title: '' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchFinances();
    } catch (err) {
      showToast('error', b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch('/api/admin/finance', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast('success', b('ডকুমেন্ট মুছে ফেলা হয়েছে।', 'Document deleted successfully.'));
        fetchFinances();
      } else {
        showToast('error', b('ডকুমেন্ট মুছতে ব্যর্থ হয়েছে।', 'Failed to delete document.'));
      }
    } catch (err) {
      showToast('error', b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const copyUrl = (url, id) => {
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
            {b('বাজেট ও অডিট রিপোর্ট', 'Budget & Audit Reports')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('বার্ষিক আয়-ব্যয় ও অডিট PDF প্রকাশ এবং আর্থিক স্বচ্ছতা পরিচালনা করুন', 'Publish annual financial reports and audit PDFs for public transparency')}
          </p>
        </div>

        {/* Year Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200/80 self-start sm:self-center">
          <Calendar className="w-3.5 h-3.5 text-stone-400 ml-1.5 mr-0.5" />
          <button
            onClick={() => setSelectedYear('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedYear === 'ALL'
                ? 'bg-brand-maroon text-white shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
            }`}
          >
            {b('সব বছর', 'All')}
          </button>
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-brand-maroon text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {message.text && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2.5 border text-xs font-semibold shadow-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Upload New Report */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-brand-maroon flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">{b('নতুন অডিট রিপোর্ট আপলোড', 'Upload Audit Document')}</h2>
              <p className="text-[11px] text-stone-400">{b('স্বচ্ছতা পেজে সর্বসাধারণের জন্য প্রকাশ', 'Published on public transparency page')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 3-Pillar Wing Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {b('অডিট রিপোর্টের শাখা (Wing / Pillar)', 'Audit Report Wing')} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, wing: 'Puja' }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formData.wing === 'Puja'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  🌺 {b('দুর্গোৎসব', 'Puja')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, wing: 'Club' }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formData.wing === 'Club'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  🏆 {b('ক্লাব', 'Club')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, wing: 'Samiti' }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formData.wing === 'Samiti'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  🏛️ {b('সমিতি', 'Samiti')}
                </button>
              </div>
            </div>

            {/* Fiscal Year */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('আর্থিক বছর (Fiscal Year)', 'Fiscal Year')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-base sm:text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all"
                placeholder="2026"
              />
            </div>

            {/* Document Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('ডকুমেন্টের শিরোনাম', 'Document Title')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-base sm:text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all"
                placeholder={b('যেমন: বার্ষিক অডিট ও আর্থিক স্টেটমেন্ট ২০২৬', 'e.g. Annual Audit & Balance Sheet 2026')}
              />
            </div>

            {/* Title Presets */}
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                {b('প্রস্তাবিত শিরোনাম (Quick Titles)', 'Quick Titles')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(TITLE_PRESETS_BY_WING[formData.wing] || TITLE_PRESETS_BY_WING.Puja).map((preset) => (
                  <button
                    key={preset.en}
                    type="button"
                    onClick={() => setFormData({ ...formData, title: lang === 'bn' ? preset.bn : preset.en })}
                    className="px-2 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-[11px] font-medium text-stone-600 transition-colors cursor-pointer"
                  >
                    {lang === 'bn' ? preset.bn : preset.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('PDF ফাইল নির্বাচন', 'PDF File')} <span className="text-rose-500">*</span>
              </label>

              {!file ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-brand-maroon bg-rose-50/50'
                      : 'border-stone-200 hover:border-brand-maroon/50 bg-stone-50/60 hover:bg-stone-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                    }}
                  />
                  <FileText className="w-6 h-6 mx-auto text-stone-400 mb-1" />
                  <p className="text-xs font-semibold text-stone-800">
                    {b('PDF ফাইল ড্রপ করুন অথবা ', 'Drop PDF here or ')}
                    <span className="text-brand-maroon underline">{b('ব্রাউজ করুন', 'Browse')}</span>
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    PDF • {b('সর্বোচ্চ ১৫ মেগাবাইট (15MB)', 'Max 15MB')}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-[10px] font-mono">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {formatFileSize(file.size)} • {b('ফাইল প্রস্তুত', 'Ready')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-white transition-colors shrink-0 cursor-pointer"
                    title={b('বাতিল', 'Remove')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-brand-maroon hover:bg-brand-dark text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileCheck className="w-3.5 h-3.5" />
              )}
              <span>{b('অডিট রিপোর্ট প্রকাশ করুন', 'Publish Report')}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Published Documents */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {b(`প্রকাশিত অডিট রিপোর্ট (${filteredFinances.length})`, `Published Reports (${filteredFinances.length})`)}
              </h2>
              <p className="text-[11px] text-stone-400">
                {b('জনসাধারণের জন্য উন্মুক্ত সমস্ত হিসাবের বিবরণী', 'Public transparency records')}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-52">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={b('রিপোর্ট খুঁজুন...', 'Search reports...')}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-base sm:text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Wing Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-stone-400 mr-1 uppercase tracking-wider">{b('শাখা:', 'Wing:')}</span>
            <button
              type="button"
              onClick={() => setFilterWing('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterWing === 'ALL'
                  ? 'bg-stone-900 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {b('সব শাখা', 'All Wings')}
            </button>
            <button
              type="button"
              onClick={() => setFilterWing('Puja')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterWing === 'Puja'
                  ? 'bg-rose-700 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🌺 {b('দুর্গোৎসব', 'Puja')}
            </button>
            <button
              type="button"
              onClick={() => setFilterWing('Club')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterWing === 'Club'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🏆 {b('ক্লাব', 'Club')}
            </button>
            <button
              type="button"
              onClick={() => setFilterWing('Samiti')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterWing === 'Samiti'
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🏛️ {b('সমিতি', 'Samiti')}
            </button>
          </div>

          {/* List */}
          {fetching ? (
            <div className="text-center py-16">
              <div className="w-6 h-6 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-stone-400">{b('রিপোর্ট লোড হচ্ছে...', 'Loading reports...')}</p>
            </div>
          ) : filteredFinances.length === 0 ? (
            <div className="text-center py-16 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
              <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-700">{b('কোনো রিপোর্ট পাওয়া যায়নি', 'No reports found')}</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {searchQuery
                  ? b('অনুসন্ধানের সাথে মিলছে এমন কোনো ডকুমেন্ট নেই।', 'No matching documents.')
                  : b('এখনও কোনো আর্থিক রিপোর্ট যোগ করা হয়নি।', 'No financial reports uploaded yet.')}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
              {filteredFinances.map((doc) => {
                const parsed = parseFinanceDoc(doc);
                return (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Left: Info */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 text-brand-maroon flex items-center justify-center shrink-0 shadow-2xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-stone-200/70 text-stone-700 font-mono">
                            {doc.year}
                          </span>
                          {parsed.wing === 'Club' && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              🏆 {b('ক্লাব', 'Club')}
                            </span>
                          )}
                          {parsed.wing === 'Samiti' && (
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              🏛️ {b('সমিতি', 'Samiti')}
                            </span>
                          )}
                          {parsed.wing === 'Puja' && (
                            <span className="text-[9px] font-bold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              🌺 {b('পূজা', 'Puja')}
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {b('স্বচ্ছ অডিট', 'Verified')}
                          </span>
                        </div>
                        <h3 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                          {parsed.cleanTitle}
                        </h3>
                      </div>
                    </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => setPreviewPdfUrl(doc.url)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer"
                      title={b('প্রিভিউ', 'Preview')}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-stone-600 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer"
                      title={b('নতুন ট্যাবে খুলুন', 'Open in new tab')}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => copyUrl(doc.url, doc.id)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer"
                      title={b('লিংক কপি', 'Copy URL')}
                    >
                      {copiedId === doc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(doc.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={b('মুছুন', 'Delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* In-App PDF Preview Lightbox */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-maroon" />
                <span className="font-bold text-stone-900 text-xs sm:text-sm">{b('PDF ডকুমেন্ট প্রিভিউ', 'PDF Document Preview')}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => triggerDownload(previewPdfUrl, 'finance-audit.pdf')}
                  className="text-xs font-semibold text-brand-maroon hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-brand-maroon/20 flex items-center gap-1 cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{b('ডাউনলোড', 'Download')}</span>
                </button>
                <a
                  href={previewPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-stone-600 hover:text-brand-maroon hover:underline flex items-center gap-1 px-1.5 py-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{b('সম্পূর্ণ স্ক্রিন', 'Full Screen')}</span>
                </a>
                <button
                  onClick={() => setPreviewPdfUrl(null)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-stone-100 p-2">
              <iframe
                src={previewPdfUrl?.startsWith('http') ? `https://docs.google.com/viewer?url=${encodeURIComponent(previewPdfUrl)}&embedded=true` : previewPdfUrl}
                className="w-full h-full rounded-xl border border-stone-300 bg-white"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-stone-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-brand-maroon flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {b('ডকুমেন্টটি মুছে ফেলবেন?', 'Delete this document?')}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {b('এই আর্থিক অডিট রিপোর্টটি চিরতরে মুছে যাবে।', 'This audit report will be permanently deleted.')}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                {b('বাতিল', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
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
