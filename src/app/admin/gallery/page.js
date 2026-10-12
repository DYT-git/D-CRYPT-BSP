'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Trash2, Image as ImageIcon, RefreshCw, UploadCloud, Check,
  Copy, Eye, Search, X, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const WINGS = [
  {
    id: 'puja',
    programName: 'Durga Puja',
    categoryName: 'Puja',
    labelBn: 'শারদীয়া দুর্গাপূজা',
    labelEn: 'Durga Puja',
    icon: '🌺',
    colorClasses: 'bg-rose-50 border-rose-300 text-brand-maroon font-bold shadow-xs ring-1 ring-rose-200',
    tagBg: 'bg-rose-100 text-brand-maroon border-rose-200',
    placeholder: 'যেমন: ২০২৬ মণ্ডপ সজ্জা ও প্রতিমা দর্শন'
  },
  {
    id: 'club',
    programName: 'Club & Sports',
    categoryName: 'Club',
    labelBn: 'সোনালী সঙ্ঘ',
    labelEn: 'Sonali Club',
    icon: '🏆',
    colorClasses: 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs ring-1 ring-amber-200',
    tagBg: 'bg-amber-100 text-amber-900 border-amber-200',
    placeholder: 'যেমন: বার্ষিক নকআউট ফুটবল টুর্নামেন্ট ২০২৬'
  },
  {
    id: 'samiti',
    programName: 'Unnayan Samiti',
    categoryName: 'Samiti',
    labelBn: 'উন্নয়ন সমিতি',
    labelEn: 'Unnayan Samiti',
    icon: '🏛️',
    colorClasses: 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-200',
    tagBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    placeholder: 'যেমন: পাড়ার প্রধান রাস্তা ও ড্রেন সংস্কার কাজ'
  }
];

function getWingForImage(img) {
  if (!img) return 'Puja';
  if (
    img.program === 'Club & Sports' ||
    img.program === 'Annual Sports' ||
    img.program === 'Social Work' ||
    img.program === 'Cultural Event' ||
    img.category === 'Club' ||
    img.category === 'Sports' ||
    img.category === 'Blood Donation' ||
    img.category === 'Cultural'
  ) {
    return 'Club';
  }
  if (
    img.program === 'Unnayan Samiti' ||
    img.category === 'Samiti' ||
    img.category === 'Roads' ||
    img.category === 'Greenery' ||
    img.category === 'Sanitation' ||
    img.category === 'Civic' ||
    img.category === 'Meetings'
  ) {
    return 'Samiti';
  }
  return 'Puja';
}

export default function GalleryManagerPage() {
  const { lang, b } = useLanguage();
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // array of { id, file, name, size, previewUrl }
  const [uploadProgress, setUploadProgress] = useState(null); // { current, total, percent }
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // 3 Primary Wings (Puja | Club | Samiti) - No sub-groups
  const [selectedWing, setSelectedWing] = useState('puja');

  // Form data: Title, default current year, date and time
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear().toString(),
    dateStr: new Date().toISOString().split('T')[0],
    timeStr: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    directUrl: ''
  });

  const [uploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [message, setMessage] = useState('');
  const [filterWing, setFilterWing] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [previewModalImg, setPreviewModalImg] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(item => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [selectedFiles]);

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

  const addFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (incoming.length === 0) {
      setMessage(b('শুধুমাত্র ইমেজ ফাইল (PNG, JPG, WebP) নির্বাচন করুন।', 'Only image files (PNG, JPG, WebP) are allowed.'));
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const newEntries = incoming.map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      previewUrl: URL.createObjectURL(f)
    }));

    setSelectedFiles(prev => {
      const combined = [...prev, ...newEntries];
      if (combined.length > 20) {
        setMessage(b('সর্বোচ্চ ২০টি ছবি একসাথে আপলোড করা যাবে। অতিরিক্ত ছবি বাদ দেওয়া হলো।', 'Maximum 20 photos allowed at once. Extra photos trimmed.'));
        setTimeout(() => setMessage(''), 4000);
        return combined.slice(0, 20);
      }
      return combined;
    });
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => {
      const target = prev.find(item => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(item => item.id !== id);
    });
  };

  const clearAllFiles = () => {
    selectedFiles.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0 && !formData.directUrl.trim()) {
      setMessage(b('অনুগ্রহ করে অন্তত একটি ছবি নির্বাচন করুন অথবা ছবির লিংক দিন।', 'Please select at least one photo or provide an image URL.'));
      return;
    }

    setUploading(true);
    setMessage('');
    setUploadProgress({ current: 0, total: selectedFiles.length || 1, percent: 15 });

    try {
      const activeWing = WINGS.find(w => w.id === selectedWing) || WINGS[0];
      const baseTitle = formData.title.trim() || activeWing.labelBn;
      const uploadYear = parseInt(formData.year, 10) || new Date().getFullYear();

      if (selectedFiles.length > 0) {
        // Upload batch of files to /api/admin/upload
        const fileData = new FormData();
        selectedFiles.forEach(item => {
          fileData.append('files', item.file);
        });
        fileData.append('type', 'gallery');

        setUploadProgress({ current: 1, total: selectedFiles.length, percent: 50 });

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: fileData,
        });

        if (!uploadRes.ok) throw new Error('File upload failed');
        const uploadResult = await uploadRes.json();
        const uploadedUrls = uploadResult.urls || [uploadResult.url];

        setUploadProgress({ current: selectedFiles.length, total: selectedFiles.length, percent: 85 });

        // Save batch entries to /api/admin/gallery
        const batchItems = uploadedUrls.map((url, idx) => ({
          year: uploadYear,
          title: selectedFiles.length > 1 ? `${baseTitle} (${idx + 1})` : baseTitle,
          program: activeWing.programName,
          category: activeWing.categoryName,
          src: url
        }));

        const dbRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: batchItems })
        });

        if (!dbRes.ok) throw new Error('Database save failed');

        setMessage(b(`${uploadedUrls.length}টি ছবি সফলভাবে ${activeWing.labelBn} গ্যালারিতে প্রকাশ করা হয়েছে!`, `Successfully published ${uploadedUrls.length} photos to ${activeWing.labelEn} gallery!`));
        clearAllFiles();
      } else if (formData.directUrl.trim()) {
        const dbRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            year: uploadYear,
            title: baseTitle,
            program: activeWing.programName,
            category: activeWing.categoryName,
            src: formData.directUrl.trim()
          })
        });

        if (!dbRes.ok) throw new Error('Database save failed');
        setMessage(b('ছবি সফলভাবে গ্যালারিতে প্রকাশ করা হয়েছে!', 'Photo successfully published to gallery!'));
      }

      setFormData(prev => ({
        ...prev,
        title: '',
        directUrl: '',
        timeStr: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }));
      setFilterWing(selectedWing === 'puja' ? 'Puja' : selectedWing === 'club' ? 'Club' : 'Samiti');
      fetchImages();

      setTimeout(() => setMessage(''), 4500);
    } catch (err) {
      setMessage(b('আপলোড ব্যর্থ হয়েছে: ' + err.message, 'Upload failed: ' + err.message));
    } finally {
      setUploading(false);
      setUploadProgress(null);
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
    const wing = getWingForImage(img);
    if (filterWing !== 'ALL' && filterWing !== wing) return false;

    const matchesSearch = !searchQuery.trim() ||
      img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.program?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const activeWingObj = WINGS.find(w => w.id === selectedWing) || WINGS[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* ═══ Top Header ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-brand-maroon text-[11px] font-bold mb-1">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{b('ফটো গ্যালারি আপলোড সেন্টার', 'Photo Gallery Upload Center')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {b('৩টি প্রধান শাখার ফটো গ্যালারি আপলোড', '3-Wing Photo Gallery Management')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('পূজা, ক্লাব অথবা সমিতি নির্বাচন করুন, শিরোনাম দিন এবং সরাসরি ছবি আপলোড করুন', 'Select Puja, Club, or Samiti wing, provide an image title, and upload directly')}
          </p>
        </div>

        <button
          onClick={fetchImages}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin text-brand-maroon' : 'text-stone-400'}`} />
          <span>{b('রিফ্রেশ', 'Refresh')}</span>
        </button>
      </div>

      {/* Toast Alert */}
      {message && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2.5 border text-xs font-semibold shadow-xs ${
            message.includes('failed') || message.includes('ব্যর্থ') || message.includes('Error')
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {message.includes('failed') || message.includes('ব্যর্থ') || message.includes('Error') ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ═══ Left Column: Simplified 3-Wing Upload Box ═══ */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-rose-600" />
              <span>{b('নতুন ছবি আপলোড ফর্ম', 'Upload New Image')}</span>
            </span>
            <span className="text-[11px] font-mono text-stone-400">
              {formData.dateStr} • {formData.timeStr}
            </span>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            
            {/* 1. MAIN 3-WING SELECTION (No sub-groups) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {b('আপলোডের প্রধান বিভাগ', 'Select Target Wing')} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WINGS.map(wing => (
                  <button
                    key={wing.id}
                    type="button"
                    onClick={() => setSelectedWing(wing.id)}
                    className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                      selectedWing === wing.id
                        ? wing.colorClasses
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="block text-lg mb-0.5">{wing.icon}</span>
                    <span>{lang === 'bn' ? wing.labelBn : wing.labelEn}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                {b(`নির্বাচিত: ${activeWingObj.labelBn} গ্যালারিতে সরাসরি আপলোড হবে`, `Uploaded image routes directly to ${activeWingObj.labelEn} gallery`)}
              </p>
            </div>

            {/* 2. IMAGE TITLE FIELD */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('ছবির শিরোনাম', 'Image Title')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={activeWingObj.placeholder}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
              />
            </div>

            {/* 3. AUTO DEFAULT YEAR, DATE & TIME */}
            <div className="grid grid-cols-3 gap-2.5 items-center">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('সাল', 'Year')}
                </label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('তারিখ', 'Date')}
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateStr}
                  onChange={(e) => setFormData({ ...formData, dateStr: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {b('সময়', 'Time')}
                </label>
                <input
                  type="time"
                  required
                  value={formData.timeStr}
                  onChange={(e) => setFormData({ ...formData, timeStr: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 outline-none"
                />
              </div>
            </div>

            {/* 4. DRAG & DROP MULTI-PHOTO UPLOAD AREA */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {b('ছবি নির্বাচন করুন (একসাথে ১-১০+ ছবি)', 'Select Photos (1-10+ Photos at Once)')}
                </label>
                {selectedFiles.length > 0 && (
                  <span className="text-[11px] font-bold text-brand-maroon bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    {b(`${selectedFiles.length}টি ছবি নির্বাচিত`, `${selectedFiles.length} photos selected`)}
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />

              {selectedFiles.length > 0 ? (
                /* Selected Multi-Photo Preview Tray */
                <div className="border border-stone-200 rounded-2xl p-3 bg-stone-50/70 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200/70 text-xs">
                    <span className="font-semibold text-stone-600 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                      <span>{b('আপলোডের জন্য প্রস্তুত:', 'Ready to upload:')}</span>
                      <strong className="text-stone-900">{selectedFiles.length} {b('টি ছবি', 'photos')}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-bold text-brand-maroon hover:underline cursor-pointer"
                      >
                        {b('+ আরও যোগ করুন', '+ Add More')}
                      </button>
                      <span className="text-stone-300">|</span>
                      <button
                        type="button"
                        onClick={clearAllFiles}
                        className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        {b('সব বাতিল', 'Clear All')}
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Grid Tray */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                    {selectedFiles.map((item, idx) => (
                      <div
                        key={item.id}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-black/5 border border-stone-200 shadow-2xs flex flex-col justify-between"
                      >
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Number Badge */}
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-mono font-bold backdrop-blur-xs">
                          #{idx + 1}
                        </span>
                        {/* Remove Cross Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(item.id);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
                          title={b('বাদ দিন', 'Remove photo')}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {/* Size Pill */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1.5 py-1">
                          <p className="text-[9px] font-mono text-white/90 truncate">
                            {item.size}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Realtime Upload Progress Bar */}
                  {uploadProgress && (
                    <div className="pt-2 border-t border-stone-200">
                      <div className="flex justify-between text-[11px] font-bold text-stone-700 mb-1">
                        <span>{b('ছবিগুলো প্রসেস ও আপলোড হচ্ছে...', 'Processing & uploading photos...')}</span>
                        <span>{uploadProgress.percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                        <div
                          className="h-full bg-brand-maroon transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty Multi-Photo Drop Area */
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-brand-maroon bg-rose-50/50 scale-[1.01]'
                      : 'border-stone-300 hover:border-brand-maroon/60 bg-stone-50/50 hover:bg-white'
                  }`}
                >
                  <div className="space-y-2 py-2">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-brand-maroon flex items-center justify-center mx-auto shadow-2xs">
                      <UploadCloud className="w-6 h-6 text-brand-maroon" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">
                        {b('ছবি ড্র্যাগ করুন অথবা ক্লিক করে একসাথে একাধিক (১-১০+) ছবি বেছে নিন', 'Drag & drop photos or click to select multiple (1-10+) photos')}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {b('একাধিক ছবি একসাথে স্বয়ংক্রিয়ভাবে আপলোড হবে • PNG, JPG, WebP', 'Multiple photos will upload automatically • PNG, JPG, WebP')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. DIRECT URL FALLBACK */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">
                {b('অথবা সরাসরি ইমেজ লিংক দিন (একক ছবির জন্য)', 'Or paste direct image URL (Optional single photo)')}
              </label>
              <input
                type="text"
                value={formData.directUrl}
                onChange={(e) => setFormData({ ...formData, directUrl: e.target.value })}
                placeholder="/assets/gallery/sample-photo.jpg"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-brand-maroon outline-none"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {uploading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>
                {uploading
                  ? b(`আপলোড হচ্ছে (${uploadProgress?.current || 1}/${uploadProgress?.total || selectedFiles.length || 1})...`, `Uploading (${uploadProgress?.current || 1}/${uploadProgress?.total || selectedFiles.length || 1})...`)
                  : selectedFiles.length > 1
                  ? b(`${selectedFiles.length}টি ছবি ${activeWingObj.labelBn} গ্যালারিতে প্রকাশ করুন`, `Publish ${selectedFiles.length} Photos to ${activeWingObj.labelEn} Gallery`)
                  : b(`${activeWingObj.labelBn} গ্যালারিতে প্রকাশ করুন`, `Publish to ${activeWingObj.labelEn} Gallery`)}
              </span>
            </button>
          </form>
        </div>

        {/* ═══ Right Column: Published Gallery Grid (Newest First) ═══ */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {b(`প্রকাশিত ছবি (${filteredImages.length})`, `Published Photos (${filteredImages.length})`)}
              </h2>
              <p className="text-[11px] text-stone-400">
                {b('সর্বশেষ আপলোড করা ছবি সর্বদা প্রথমে থাকে', 'Latest uploaded photos appear first')}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-44">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={b('ছবি খুঁজুন...', 'Search photos...')}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-7 pr-2.5 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-brand-maroon outline-none"
              />
            </div>
          </div>

          {/* Wing Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-100">
            {[
              { id: 'ALL', bn: 'সকল ছবি', en: 'All Photos', count: images.length },
              { id: 'Puja', bn: '🌺 শারদীয়া পূজা', en: '🌺 Durga Puja', count: images.filter(g => getWingForImage(g) === 'Puja').length },
              { id: 'Club', bn: '🏆 সোনালী সঙ্ঘ', en: '🏆 Sonali Club', count: images.filter(g => getWingForImage(g) === 'Club').length },
              { id: 'Samiti', bn: '🏛️ উন্নয়ন সমিতি', en: '🏛️ Unnayan Samiti', count: images.filter(g => getWingForImage(g) === 'Samiti').length },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterWing(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterWing === tab.id
                    ? 'bg-stone-900 text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{lang === 'bn' ? tab.bn : tab.en}</span>
                <span className="ml-1 opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Image Grid (Scrollable, newest first) */}
          <div className="overflow-y-auto max-h-[680px] pr-1">
            {filteredImages.length === 0 ? (
              <div className="text-center py-20 text-stone-400 text-xs">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                {b('কোনো ছবি পাওয়া যায়নি।', 'No images found.')}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredImages.map((img) => {
                  const wing = getWingForImage(img);
                  const tagInfo = wing === 'Club'
                    ? { icon: '🏆', text: b('ক্লাব', 'Club'), bg: 'bg-amber-100 text-amber-900 border-amber-200' }
                    : wing === 'Samiti'
                    ? { icon: '🏛️', text: b('সমিতি', 'Samiti'), bg: 'bg-emerald-100 text-emerald-900 border-emerald-200' }
                    : { icon: '🌺', text: b('পূজা', 'Puja'), bg: 'bg-rose-100 text-rose-900 border-rose-200' };

                  return (
                    <div
                      key={img.id}
                      className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                        <img
                          src={img.src}
                          alt={img.title || 'Photo'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Top Badge */}
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${tagInfo.bg}`}>
                            {tagInfo.icon} {tagInfo.text}
                          </span>
                        </div>

                        {/* Overlay with Preview and Copy (Accessible on Mobile) */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 sm:opacity-0 group-hover:opacity-100 hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-1.5 sm:gap-2 p-2">
                          <button
                            type="button"
                            onClick={() => setPreviewModalImg(img)}
                            className="p-2 sm:p-1.5 rounded-xl bg-white/95 text-stone-800 hover:bg-white hover:scale-110 transition-all cursor-pointer shadow-xs min-w-[36px] min-h-[36px] flex items-center justify-center"
                            title={b('বড় করে দেখুন', 'Preview Zoom')}
                          >
                            <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyCdnUrl(img.src, img.id)}
                            className="p-2 sm:p-1.5 rounded-xl bg-white/95 text-stone-800 hover:bg-white hover:scale-110 transition-all cursor-pointer shadow-xs min-w-[36px] min-h-[36px] flex items-center justify-center"
                            title={b('লিংক কপি', 'Copy Link')}
                          >
                            {copiedId === img.id ? (
                              <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(img.id)}
                            className="p-2 sm:p-1.5 rounded-xl bg-white/95 text-rose-600 hover:bg-rose-50 hover:scale-110 transition-all cursor-pointer shadow-xs min-w-[36px] min-h-[36px] flex items-center justify-center"
                            title={b('মুছুন', 'Delete Photo')}
                          >
                            <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Info Footer */}
                      <div className="p-2.5">
                        <h4 className="text-xs font-bold text-stone-800 truncate" title={img.title}>
                          {img.title || 'Untitled Photo'}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-stone-400 font-mono">
                          <span>{img.year}</span>
                          <span className="truncate max-w-[100px]">{img.src.split('/').pop()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                {b('এই ছবিটি ওয়েবসাইট ও গ্যালারি থেকে স্থায়ীভাবে অপসারিত হবে।', 'This photo will be permanently deleted from the gallery.')}
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

      {/* Fullsize Preview Modal */}
      {previewModalImg && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-stone-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold truncate">{previewModalImg.title}</span>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black flex items-center justify-center max-h-[75vh]">
              <img
                src={previewModalImg.src}
                alt={previewModalImg.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
