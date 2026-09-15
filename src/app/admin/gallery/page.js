'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Trash2, Image as ImageIcon, RefreshCw, UploadCloud, Check,
  Copy, Eye, Search, X, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const PROGRAMS = {
  "Durga Puja": ["Idol & Pandal", "Rituals", "Cultural Events", "Immersion", "General"],
  "Social Work": ["Blood Donation", "Cloth Distribution", "Health Camp", "Education", "General"],
  "Others": ["General"]
};

export default function GalleryManagerPage() {
  const { lang, b } = useLanguage();
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    title: '',
    program: 'Durga Puja',
    category: 'Idol & Pandal'
  });

  const [uploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [message, setMessage] = useState('');
  const [filterYear, setFilterYear] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [previewModalImg, setPreviewModalImg] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const fetchImages = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load gallery images', err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleProgramChange = (e) => {
    const newProgram = e.target.value;
    setFormData({
      ...formData,
      program: newProgram,
      category: PROGRAMS[newProgram][0]
    });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
      } else {
        setMessage(b('শুধুমাত্র ইমেজ ফাইল (PNG, JPG, WebP) নির্বাচন করুন।', 'Only image files (PNG, JPG, WebP) are allowed.'));
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage(b('অনুগ্রহ করে প্রথমে একটি ছবি নির্বাচন করুন।', 'Please select an image file first.'));
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      // 1. Upload to CDN via backend API
      const fileData = new FormData();
      fileData.append('file', file);
      fileData.append('type', 'gallery');

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fileData,
      });

      if (!uploadRes.ok) throw new Error('File upload failed');
      const uploadResult = await uploadRes.json();

      // 2. Save metadata to database
      const dbRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          src: uploadResult.url
        })
      });

      if (!dbRes.ok) throw new Error('Database save failed');

      setMessage(b('ছবি সফলভাবে গ্যালারিতে সংরক্ষণ করা হয়েছে!', 'Photo successfully published to gallery!'));
      setFile(null);
      setPreviewUrl(null);
      setFormData({ ...formData, title: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchImages();

      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(b('আপলোড ব্যর্থ হয়েছে: ' + err.message, 'Upload failed: ' + err.message));
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirmId })
      });
      if (res.ok) {
        setMessage(b('ছবি সফলভাবে মুছে ফেলা হয়েছে।', 'Photo deleted successfully.'));
        setDeleteConfirmId(null);
        fetchImages();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(b('মুছতে ব্যর্থ হয়েছে।', 'Failed to delete photo.'));
      }
    } catch (err) {
      setMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    }
  };

  const copyCdnUrl = (src, id) => {
    navigator.clipboard.writeText(src);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredImages = images.filter(img => {
    const matchesYear = filterYear === 'ALL' || String(img.year) === filterYear;
    const matchesSearch = !searchQuery.trim() ||
      img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const availableYears = ['ALL', ...Array.from(new Set(images.map(img => String(img.year))))];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
            {b('ফটো গ্যালারি ও অ্যালবাম', 'Gallery Archives')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('উৎসব ও বিভিন্ন অনুষ্ঠানের ছবি পরিচালনা করুন', 'Manage community event photography and archives')}
          </p>
        </div>

        <button
          onClick={fetchImages}
          disabled={loadingList}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin text-brand-maroon' : 'text-stone-400'}`} />
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

      {/* Main Grid: Upload Left (5 cols) | Gallery Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Upload Form */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-brand-maroon flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">{b('নতুন ছবি আপলোড করুন', 'Upload New Photo')}</h2>
              <p className="text-[11px] text-stone-400">{b('সিডিএন ক্লাউডে স্থায়ী সংরক্ষণ', 'Permanent cloud storage')}</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-3.5">
            {/* Drop Zone */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('ছবির ফাইল নির্বাচন', 'Photo File')} <span className="text-rose-500">*</span>
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-brand-maroon bg-rose-50/50'
                    : previewUrl
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-stone-200 bg-stone-50/60 hover:bg-stone-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />

                {previewUrl ? (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Upload Preview"
                      className="w-full h-36 object-cover rounded-lg shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-stone-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title={b('ছবি সরান', 'Remove')}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-left text-xs font-semibold text-stone-800 truncate mt-2">
                      {file?.name}
                    </p>
                    <p className="text-left text-[10px] text-stone-400">
                      {(file?.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="py-4 space-y-1.5">
                    <UploadCloud className="w-6 h-6 mx-auto text-stone-400" />
                    <p className="text-xs font-semibold text-stone-800">
                      {b('ছবি টেনে আনুন অথবা ', 'Drop photo here or ')}
                      <span className="text-brand-maroon underline">{b('ব্রাউজ করুন', 'Browse')}</span>
                    </p>
                    <p className="text-[10px] text-stone-400">
                      WebP, PNG, JPG (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Year & Title */}
            <div className="grid grid-cols-2 gap-3">
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

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('শিরোনাম (Title)', 'Title')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={b('যেমন: মহাষ্টমী অঞ্জলি', 'e.g. Ashtami Anjali')}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                />
              </div>
            </div>

            {/* Program & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('ইভেন্ট / প্রোগ্রাম', 'Event')}
                </label>
                <select
                  value={formData.program}
                  onChange={handleProgramChange}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs font-medium focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                >
                  {Object.keys(PROGRAMS).map(prog => (
                    <option key={prog} value={prog}>{prog}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('বিভাগ (Category)', 'Category')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs font-medium focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                >
                  {PROGRAMS[formData.program].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{b('সংরক্ষণ করা হচ্ছে...', 'Saving photo...')}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{b('গ্যালারিতে প্রকাশ করুন', 'Publish to Gallery')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Published Gallery */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {b(`সংরক্ষিত ছবিসমূহ (${filteredImages.length})`, `Published Photos (${filteredImages.length})`)}
              </h2>
              <p className="text-[11px] text-stone-400">{b('লাইভ পোর্টালে দৃশ্যমান অ্যালবাম', 'Visible on public gallery')}</p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-52">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={b('ছবি খুঁজুন...', 'Search photos...')}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-base sm:text-xs focus:bg-white focus:ring-2 focus:ring-brand-maroon/20 outline-none"
              />
            </div>
          </div>

          {/* Year Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-stone-400 mr-1 uppercase tracking-wider">{b('বছর:', 'Year:')}</span>
            {availableYears.map(yr => (
              <button
                key={yr}
                onClick={() => setFilterYear(yr)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterYear === yr
                    ? 'bg-brand-maroon text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="overflow-y-auto max-h-[600px] pr-1">
            {filteredImages.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                {b('কোনো ছবি খুঁজে পাওয়া যায়নি।', 'No photos found.')}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredImages.map((img) => (
                  <div
                    key={img.id}
                    className="group border border-stone-200/80 rounded-xl overflow-hidden bg-stone-50/50 hover:bg-white hover:shadow-2xs transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-4/3 bg-stone-200 overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/gallery/sample-pandal.svg';
                        }}
                      />

                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono font-bold text-white">
                        {img.year}
                      </span>

                      {/* Action buttons on hover */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setPreviewModalImg(img)}
                          className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                          title={b('বড় করে দেখুন', 'Preview')}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => copyCdnUrl(img.src, img.id)}
                          className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                          title={b('লিংক কপি', 'Copy URL')}
                        >
                          {copiedId === img.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(img.id)}
                          className="w-7 h-7 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                          title={b('মুছুন', 'Delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="font-bold text-stone-900 text-xs truncate" title={img.title}>
                        {img.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-stone-500 font-medium">
                        <span className="px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-700 font-semibold">{img.program}</span>
                        <span>•</span>
                        <span className="truncate">{img.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <h3 className="text-sm font-bold text-stone-900">{b('ছবিটি মুছে ফেলতে চান?', 'Delete this photo?')}</h3>
              <p className="text-xs text-stone-500 mt-1">
                {b('এই ছবিটি গ্যালারি অ্যালবাম থেকে স্থায়ীভাবে মুছে যাবে।', 'This photo will be permanently deleted from the gallery.')}
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

      {/* Lightbox Modal */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewModalImg.src}
              alt={previewModalImg.title}
              className="w-full max-h-[75vh] object-contain mx-auto"
            />
            <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between border-t border-stone-800">
              <div>
                <p className="font-bold text-xs">{previewModalImg.title}</p>
                <p className="text-[11px] text-stone-400">{previewModalImg.category} • {previewModalImg.year}</p>
              </div>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
