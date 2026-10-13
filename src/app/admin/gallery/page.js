'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Trash2, Image as ImageIcon, RefreshCw, UploadCloud, Check,
  Copy, Eye, Search, X, AlertTriangle, LayoutGrid, Grid, List,
  CheckSquare, Square, Loader2, Edit2
} from 'lucide-react';
import { useLanguage, parseBilingual } from '@/context/LanguageContext';
import BilingualInput from '@/components/admin/BilingualInput';
import { getImageWing } from '@/utils/gallery';

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
    placeholder: 'যেমন: পাড়ার অভ্যন্তরীণ রাস্তা ও পথবাতি সংস্কার কাজ'
  }
];

function getWingForImage(img) {
  return getImageWing(img);
}

export default function GalleryManagerPage() {
  const { lang, b, t } = useLanguage();
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
    year: '2026',
    dateStr: '',
    timeStr: '',
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

  // Laptop File Manager Style: View modes ('mini' | 'grid' | 'list') and Multi-Selection
  const [viewMode, setViewMode] = useState('mini');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Photo Caption Editing State
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchImages();
    const now = new Date();
    setFormData(prev => ({
      ...prev,
      year: now.getFullYear().toString(),
      dateStr: now.toISOString().split('T')[0],
      timeStr: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }));
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

  // Client-side image optimizer using Canvas (smoothly downscales multi-megabyte photos to web-ready JPEG)
  const optimizeImageForWeb = async (file, maxDimension = 1920, quality = 0.85) => {
    if (typeof window === 'undefined') return file;
    if (!file.type?.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
      return file;
    }
    // Files already under 800KB do not need compression
    if (file.size <= 800 * 1024) {
      return file;
    }

    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.onload = () => {
            try {
              let width = img.width;
              let height = img.height;

              if (width <= maxDimension && height <= maxDimension && file.size < 1.5 * 1024 * 1024) {
                resolve(file);
                return;
              }

              if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                  height = Math.round((height * maxDimension) / width);
                  width = maxDimension;
                } else {
                  width = Math.round((width * maxDimension) / height);
                  height = maxDimension;
                }
              }

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(file);
                return;
              }

              ctx.drawImage(img, 0, 0, width, height);
              canvas.toBlob(
                (blob) => {
                  if (!blob || blob.size >= file.size) {
                    resolve(file);
                  } else {
                    const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                    const optimizedFile = new File([blob], newName, {
                      type: 'image/jpeg',
                      lastModified: Date.now()
                    });
                    resolve(optimizedFile);
                  }
                },
                'image/jpeg',
                quality
              );
            } catch {
              resolve(file);
            }
          };
          img.onerror = () => resolve(file);
          img.src = e.target?.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
      } catch {
        resolve(file);
      }
    });
  };

  const addFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList).filter(f => 
      f.type?.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name)
    );
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
    setUploadProgress({ current: 0, total: selectedFiles.length || 1, percent: 10 });

    try {
      const activeWing = WINGS.find(w => w.id === selectedWing) || WINGS[0];
      const uploadYear = parseInt(formData.year, 10) || new Date().getFullYear();

      // Resolve bilingual title with auto-translate if only one language is filled
      let titleObj = parseBilingual(formData.title);
      if (!titleObj.bn.trim() && !titleObj.en.trim()) {
        titleObj = { bn: activeWing.labelBn, en: activeWing.labelEn };
      } else {
        try {
          if (titleObj.bn.trim() && !titleObj.en.trim()) {
            const trRes = await fetch('/api/admin/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: titleObj.bn.trim(), from: 'bn', to: 'en' })
            });
            const trData = await trRes.json().catch(() => ({}));
            if (trData.success && trData.translatedText) titleObj.en = trData.translatedText;
          } else if (titleObj.en.trim() && !titleObj.bn.trim()) {
            const trRes = await fetch('/api/admin/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: titleObj.en.trim(), from: 'en', to: 'bn' })
            });
            const trData = await trRes.json().catch(() => ({}));
            if (trData.success && trData.translatedText) titleObj.bn = trData.translatedText;
          }
        } catch (trErr) {
          console.warn('Auto-translation gallery upload fallback:', trErr);
        }
      }

      const formatPhotoTitle = (idx, total) => {
        if (total <= 1) return JSON.stringify(titleObj);
        return JSON.stringify({
          bn: `${titleObj.bn} (${idx + 1})`,
          en: `${titleObj.en} (${idx + 1})`
        });
      };

      if (selectedFiles.length > 0) {
        const total = selectedFiles.length;
        const uploadedUrls = [];
        const failedFiles = [];

        // Upload files with real-time per-file progress reporting & automatic downscaling
        for (let i = 0; i < total; i++) {
          const item = selectedFiles[i];
          const currentNum = i + 1;
          const pct = Math.round((i / total) * 85) + 10;
          setUploadProgress({ current: currentNum, total, percent: pct });

          try {
            // 1. Optimize image client-side if needed (prevents 15MB camera raw payloads)
            const fileToUpload = await optimizeImageForWeb(item.file);

            // 2. Upload file to /api/admin/upload
            const fileData = new FormData();
            fileData.append('file', fileToUpload);
            fileData.append('type', 'gallery');

            const uploadRes = await fetch('/api/admin/upload', {
              method: 'POST',
              body: fileData,
            });

            const uploadResult = await uploadRes.json().catch(() => ({}));

            if (!uploadRes.ok || !uploadResult.success) {
              const errMsg = uploadResult.error || `Upload failed for ${item.name} (status ${uploadRes.status})`;
              throw new Error(errMsg);
            }

            const url = uploadResult.url || (uploadResult.urls && uploadResult.urls[0]);
            if (!url) {
              throw new Error(`Server returned no image URL for ${item.name}`);
            }

            uploadedUrls.push(url);
          } catch (fileErr) {
            console.error(`Error uploading file ${item.name}:`, fileErr);
            failedFiles.push({ name: item.name, reason: fileErr.message });
          }
        }

        if (uploadedUrls.length === 0) {
          const details = failedFiles.map(f => f.reason).filter(Boolean).join('; ') || 'Server error';
          throw new Error(details);
        }

        setUploadProgress({ current: total, total, percent: 95 });

        // Save batch entries to /api/admin/gallery
        const batchItems = uploadedUrls.map((url, idx) => ({
          year: uploadYear,
          title: formatPhotoTitle(idx, uploadedUrls.length),
          program: activeWing.programName,
          category: activeWing.categoryName,
          src: url
        }));

        const dbRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: batchItems })
        });

        const dbResult = await dbRes.json().catch(() => ({}));
        if (!dbRes.ok || !dbResult.success) {
          throw new Error(dbResult.error || b('গ্যালারি ডাটাবেস সেভ ব্যর্থ হয়েছে।', 'Failed to save gallery records in database.'));
        }

        if (failedFiles.length > 0) {
          setMessage(b(
            `${uploadedUrls.length}টি ছবি সফলভাবে ${activeWing.labelBn} গ্যালারিতে প্রকাশ করা হয়েছে (${failedFiles.length}টি ছবি ব্যর্থ হয়েছে)।`,
            `Published ${uploadedUrls.length} photos to ${activeWing.labelEn} gallery (${failedFiles.length} photos failed).`
          ));
        } else {
          setMessage(b(
            `${uploadedUrls.length}টি ছবি সফলভাবে ${activeWing.labelBn} গ্যালারিতে প্রকাশ করা হয়েছে!`,
            `Successfully published ${uploadedUrls.length} photos to ${activeWing.labelEn} gallery!`
          ));
        }
        clearAllFiles();
      } else if (formData.directUrl.trim()) {
        const dbRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            year: uploadYear,
            title: JSON.stringify(titleObj),
            program: activeWing.programName,
            category: activeWing.categoryName,
            src: formData.directUrl.trim()
          })
        });

        const dbResult = await dbRes.json().catch(() => ({}));
        if (!dbRes.ok || !dbResult.success) {
          throw new Error(dbResult.error || b('গ্যালারি ডাটাবেস সেভ ব্যর্থ হয়েছে।', 'Failed to save gallery record in database.'));
        }
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

      setTimeout(() => setMessage(''), 5000);
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

  const toggleSelectPhoto = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllPhotos = () => {
    const allIds = filteredImages.map(img => img.id);
    setSelectedPhotoIds(allIds);
  };

  const deselectAllPhotos = () => {
    setSelectedPhotoIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedPhotoIds.length === 0) return;
    setBulkDeleting(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedPhotoIds })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setMessage(b(
          `${selectedPhotoIds.length}টি ছবি সফলভাবে মুছে ফেলা হয়েছে!`,
          `Successfully deleted ${selectedPhotoIds.length} photos!`
        ));
        setSelectedPhotoIds([]);
        setIsBulkDeleteModalOpen(false);
        fetchImages();
        setTimeout(() => setMessage(''), 4000);
      } else {
        setMessage(b('মুছতে ব্যর্থ হয়েছে: ' + (data.error || 'Server error'), 'Failed to delete: ' + (data.error || 'Server error')));
      }
    } catch (err) {
      setMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setBulkDeleting(false);
      setIsBulkDeleteModalOpen(false);
    }
  };

  const startEditCaption = (photo) => {
    setEditingPhoto(photo);
    const parsed = parseBilingual(photo.title);
    setEditCaption(JSON.stringify(parsed));
  };

  const cancelEditCaption = () => {
    setEditingPhoto(null);
    setEditCaption('');
    setSavingEdit(false);
  };

  const handleSaveCaption = async (e) => {
    if (e) e.preventDefault();
    if (!editingPhoto) return;

    let titleObj = parseBilingual(editCaption);
    if (!titleObj.bn.trim() && !titleObj.en.trim()) {
      setMessage(b('অনুগ্রহ করে ছবির শিরোনাম লিখুন।', 'Please enter photo caption.'));
      return;
    }

    setSavingEdit(true);

    // Auto-translate missing language before updating
    try {
      if (titleObj.bn.trim() && !titleObj.en.trim()) {
        const trRes = await fetch('/api/admin/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: titleObj.bn.trim(), from: 'bn', to: 'en' })
        });
        const trData = await trRes.json().catch(() => ({}));
        if (trData.success && trData.translatedText) titleObj.en = trData.translatedText;
      } else if (titleObj.en.trim() && !titleObj.bn.trim()) {
        const trRes = await fetch('/api/admin/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: titleObj.en.trim(), from: 'en', to: 'bn' })
        });
        const trData = await trRes.json().catch(() => ({}));
        if (trData.success && trData.translatedText) titleObj.bn = trData.translatedText;
      }
    } catch (trErr) {
      console.warn('Auto translation caption fallback:', trErr);
    }

    const finalTitle = JSON.stringify(titleObj);

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPhoto.id,
          title: finalTitle
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setMessage(b('ছবির শিরোনাম সফলভাবে আপডেট করা হয়েছে!', 'Photo caption updated successfully!'));
        setEditingPhoto(null);
        setEditCaption('');
        fetchImages();
        setTimeout(() => setMessage(''), 3500);
      } else {
        setMessage(b('আপডেট ব্যর্থ হয়েছে: ' + (data.error || 'Server error'), 'Failed to update: ' + (data.error || 'Server error')));
      }
    } catch (err) {
      setMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setSavingEdit(false);
    }
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
            <span className="text-[11px] font-mono text-stone-400" suppressHydrationWarning>
              {formData.dateStr && formData.timeStr ? `${formData.dateStr} • ${formData.timeStr}` : ''}
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

            {/* 2. IMAGE TITLE FIELD (Bilingual with Auto-Translate) */}
            <BilingualInput
              label={b('ছবির শিরোনাম / ক্যাপশন', 'Photo Title / Caption')}
              value={formData.title}
              onChange={(val) => setFormData(prev => ({ ...prev, title: val }))}
              placeholderBn={activeWingObj.placeholder || 'যেমন: মণ্ডপ সজ্জা ও প্রতিমা দর্শন'}
              placeholderEn="e.g. Pandal Decoration & Idol Darshan"
              helpText={b('বাংলা বা ইংরেজিতে লিখলে অটো-অনুবাদ ব্যবহার করে অন্য ভাষা তৈরি হবে।', 'Type in Bengali or English; click Auto-Translate to sync.')}
            />

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
                        onClick={() => setPreviewModalImg({ src: item.previewUrl, title: item.name })}
                        className="group relative aspect-square rounded-xl overflow-hidden bg-black/5 border border-stone-200 shadow-2xs flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-brand-maroon/30 transition-all"
                        title={b('বড় করে দেখতে ক্লিক করুন', 'Click to preview full size')}
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
                          className="absolute top-1 right-1 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
                          title={b('বাদ দিন', 'Remove photo')}
                        >
                          <X className="w-3.5 h-3.5" />
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

        {/* ═══ Right Column: Published Gallery Grid (File Manager Style View Modes & Multi-Select) ═══ */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-3.5">
          {/* Top Bar: Title, Search & File Manager View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-stone-900">
                  {b(`প্রকাশিত ছবি (${filteredImages.length})`, `Published Photos (${filteredImages.length})`)}
                </h2>
                {selectedPhotoIds.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-maroon text-white text-[10px] font-bold">
                    {b(`${selectedPhotoIds.length} নির্বাচিত`, `${selectedPhotoIds.length} selected`)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                {b('সর্বশেষ আপলোড করা ছবি সর্বদা প্রথমে থাকে', 'Latest uploaded photos appear first')}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative w-full sm:w-36">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={b('খুঁজুন...', 'Search...')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-7 pr-2.5 py-1 text-xs focus:bg-white focus:ring-1 focus:ring-brand-maroon outline-none"
                />
              </div>

              {/* Laptop File Manager View Mode Switcher */}
              <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('mini')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'mini'
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title={b('মিনি ভিউ (ল্যাপটপ ফাইল ম্যানেজার)', 'Mini View (Compact File Manager)')}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">{b('মিনি', 'Mini')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title={b('গ্রিড ভিউ (কার্ড)', 'Grid View (Cards)')}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">{b('গ্রিড', 'Grid')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  title={b('তালিকা ভিউ (ফাইল ডিটেইলস)', 'List View (File Details)')}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">{b('তালিকা', 'List')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Wing Filter Tabs & Select All Quick Button */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-stone-100 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'ALL', bn: 'সকল', en: 'All', count: images.length },
                { id: 'Puja', bn: '🌺 পূজা', en: '🌺 Puja', count: images.filter(g => getWingForImage(g) === 'Puja').length },
                { id: 'Club', bn: '🏆 ক্লাব', en: '🏆 Club', count: images.filter(g => getWingForImage(g) === 'Club').length },
                { id: 'Samiti', bn: '🏛️ সমিতি', en: '🏛️ Samiti', count: images.filter(g => getWingForImage(g) === 'Samiti').length },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterWing(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
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

            {/* Quick Select All / Deselect Toggle */}
            {filteredImages.length > 0 && (
              <button
                type="button"
                onClick={selectedPhotoIds.length === filteredImages.length ? deselectAllPhotos : selectAllPhotos}
                className="text-[11px] font-bold text-stone-600 hover:text-brand-maroon flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
              >
                {selectedPhotoIds.length === filteredImages.length ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-brand-maroon" />
                    <span>{b('সব বাদ দিন', 'Deselect All')}</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5 text-stone-400" />
                    <span>{b('সব নির্বাচন', 'Select All')}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* ═══ Multi-Select Floating / Sticky Batch Action Bar ═══ */}
          {selectedPhotoIds.length > 0 && (
            <div className="p-2.5 px-3 rounded-xl bg-rose-50/80 border border-brand-maroon/30 flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-maroon animate-pulse" />
                <span className="text-xs font-bold text-stone-900">
                  {b(`${selectedPhotoIds.length}টি ছবি নির্বাচিত`, `${selectedPhotoIds.length} photos selected`)}
                </span>
                <span className="text-stone-300">|</span>
                <button
                  type="button"
                  onClick={deselectAllPhotos}
                  className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 hover:underline cursor-pointer"
                >
                  {b('বাতিল', 'Cancel')}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{b(`একসাথে মুছুন (${selectedPhotoIds.length})`, `Delete (${selectedPhotoIds.length})`)}</span>
                </button>
              </div>
            </div>
          )}

          {/* ═══ Photo Viewports (Mini View vs Grid vs Details List) ═══ */}
          <div className="overflow-y-auto max-h-[640px] pr-1">
            {filteredImages.length === 0 ? (
              <div className="text-center py-20 text-stone-400 text-xs">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                {b('কোনো ছবি পাওয়া যায়নি।', 'No images found.')}
              </div>
            ) : viewMode === 'mini' ? (
              /* ─── 1. MINI VIEW: High-density laptop file manager icons ─── */
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2">
                {filteredImages.map((img) => {
                  const wing = getWingForImage(img);
                  const isSelected = selectedPhotoIds.includes(img.id);
                  const tagIcon = wing === 'Club' ? '🏆' : wing === 'Samiti' ? '🏛️' : '🌺';

                  return (
                    <div
                      key={img.id}
                      onClick={() => toggleSelectPhoto(img.id)}
                      className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all ${
                        isSelected
                          ? 'ring-2 ring-brand-maroon border-brand-maroon shadow-sm bg-rose-50/20'
                          : 'border-stone-200 bg-stone-100 hover:border-brand-maroon/60 hover:shadow-2xs'
                      }`}
                      title={t(img.title) || 'Photo'}
                    >
                      <img
                        src={img.src}
                        alt={t(img.title) || 'Photo'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />

                      {/* Multi-select Checkbox (top-left) */}
                      <div
                        onClick={(e) => toggleSelectPhoto(img.id, e)}
                        className={`absolute top-1 left-1 z-10 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-brand-maroon text-white shadow-xs'
                            : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 backdrop-blur-xs hover:bg-black/80'
                        }`}
                      >
                        {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <Square className="w-3 h-3 text-white/80" />}
                      </div>

                      {/* Wing Badge (top-right) */}
                      <span className="absolute top-1 right-1 text-[10px] drop-shadow-sm pointer-events-none">
                        {tagIcon}
                      </span>

                      {/* Hover Overlay with Preview, Edit & Copy */}
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPreviewModalImg(img); }}
                          className="w-6 h-6 rounded-md bg-white/95 text-stone-800 hover:bg-white hover:scale-110 flex items-center justify-center shadow-xs cursor-pointer"
                          title={b('বড় করে দেখুন', 'Zoom Preview')}
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); startEditCaption(img); }}
                          className="w-6 h-6 rounded-md bg-white/95 text-brand-maroon hover:bg-rose-50 hover:scale-110 flex items-center justify-center shadow-xs cursor-pointer"
                          title={b('শিরোনাম সম্পাদনা', 'Edit Caption')}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); copyCdnUrl(img.src, img.id); }}
                          className="w-6 h-6 rounded-md bg-white/95 text-stone-800 hover:bg-white hover:scale-110 flex items-center justify-center shadow-xs cursor-pointer"
                          title={b('লিংক কপি', 'Copy URL')}
                        >
                          {copiedId === img.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(img.id); }}
                          className="w-6 h-6 rounded-md bg-white/95 text-rose-600 hover:bg-rose-50 hover:scale-110 flex items-center justify-center shadow-xs cursor-pointer"
                          title={b('মুছুন', 'Delete')}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Compact Bottom Gradient Title */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1 px-1.5 pt-3 pointer-events-none">
                        <p className="text-[10px] font-semibold text-white truncate leading-tight">
                          {t(img.title) || 'Photo'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : viewMode === 'list' ? (
              /* ─── 2. LIST VIEW: Laptop file manager details table ─── */
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white">
                {/* List Header */}
                <div className="bg-stone-50 p-2.5 px-3 flex items-center gap-3 text-[11px] font-bold text-stone-500 uppercase tracking-wider select-none">
                  <span className="w-5 text-center">✓</span>
                  <span className="w-10 text-center">{b('ছবি', 'Photo')}</span>
                  <span className="flex-1 min-w-0">{b('শিরোনাম ও বিবরণ', 'Title & Filename')}</span>
                  <span className="w-24 hidden sm:block">{b('শাখা', 'Wing')}</span>
                  <span className="w-12 text-center hidden md:block">{b('সাল', 'Year')}</span>
                  <span className="w-24 text-right">{b('অ্যাকশন', 'Actions')}</span>
                </div>

                {/* Rows */}
                {filteredImages.map((img) => {
                  const wing = getWingForImage(img);
                  const isSelected = selectedPhotoIds.includes(img.id);
                  const tagInfo = wing === 'Club'
                    ? { icon: '🏆', text: b('ক্লাব', 'Club'), bg: 'bg-amber-100 text-amber-900 border-amber-200' }
                    : wing === 'Samiti'
                    ? { icon: '🏛️', text: b('সমিতি', 'Samiti'), bg: 'bg-emerald-100 text-emerald-900 border-emerald-200' }
                    : { icon: '🌺', text: b('পূজা', 'Puja'), bg: 'bg-rose-100 text-rose-900 border-rose-200' };

                  return (
                    <div
                      key={img.id}
                      onClick={() => toggleSelectPhoto(img.id)}
                      className={`p-2 px-3 flex items-center gap-3 transition-colors hover:bg-stone-50/80 cursor-pointer ${
                        isSelected ? 'bg-rose-50/50' : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => toggleSelectPhoto(img.id, e)}
                        className="w-5 h-5 flex items-center justify-center cursor-pointer shrink-0"
                      >
                        {isSelected ? <CheckSquare className="w-4 h-4 text-brand-maroon" /> : <Square className="w-4 h-4 text-stone-300 hover:text-stone-500" />}
                      </button>

                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <img src={img.src} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {t(img.title) || 'Untitled Photo'}
                        </p>
                        <p className="text-[10px] text-stone-400 font-mono truncate">
                          {img.src.split('/').pop()}
                        </p>
                      </div>

                      <div className="w-24 hidden sm:block shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tagInfo.bg}`}>
                          {tagInfo.icon} {tagInfo.text}
                        </span>
                      </div>

                      <span className="w-12 text-center font-mono text-xs text-stone-500 hidden md:block shrink-0">
                        {img.year}
                      </span>

                      <div className="w-24 flex items-center justify-end gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setPreviewModalImg(img)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer"
                          title={b('বড় করে দেখুন', 'Zoom Preview')}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditCaption(img)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer"
                          title={b('শিরোনাম সম্পাদনা', 'Edit Caption')}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyCdnUrl(img.src, img.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer"
                          title={b('লিংক কপি', 'Copy URL')}
                        >
                          {copiedId === img.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(img.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title={b('মুছুন', 'Delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ─── 3. GRID VIEW: Standard Card Grid ─── */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredImages.map((img) => {
                  const wing = getWingForImage(img);
                  const isSelected = selectedPhotoIds.includes(img.id);
                  const tagInfo = wing === 'Club'
                    ? { icon: '🏆', text: b('ক্লাব', 'Club'), bg: 'bg-amber-100 text-amber-900 border-amber-200' }
                    : wing === 'Samiti'
                    ? { icon: '🏛️', text: b('সমিতি', 'Samiti'), bg: 'bg-emerald-100 text-emerald-900 border-emerald-200' }
                    : { icon: '🌺', text: b('পূজা', 'Puja'), bg: 'bg-rose-100 text-rose-900 border-rose-200' };

                  return (
                    <div
                      key={img.id}
                      className={`group bg-white rounded-xl border overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${
                        isSelected ? 'ring-2 ring-brand-maroon border-brand-maroon' : 'border-stone-200'
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => toggleSelectPhoto(img.id)}>
                        <img
                          src={img.src}
                          alt={img.title || 'Photo'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Checkbox (top-left) */}
                        <div
                          onClick={(e) => toggleSelectPhoto(img.id, e)}
                          className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-brand-maroon text-white shadow-xs'
                              : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 backdrop-blur-xs hover:bg-black/80'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Square className="w-3.5 h-3.5 text-white/80" />}
                        </div>

                        {/* Top Badge */}
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${tagInfo.bg}`}>
                            {tagInfo.icon} {tagInfo.text}
                          </span>
                        </div>

                        {/* Overlay with Preview, Edit, Copy and Delete */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setPreviewModalImg(img)}
                            className="w-8 h-8 rounded-xl bg-white/95 text-stone-800 hover:bg-white hover:scale-110 transition-all cursor-pointer shadow-xs flex items-center justify-center"
                            title={b('বড় করে দেখুন', 'Preview Zoom')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditCaption(img)}
                            className="w-8 h-8 rounded-xl bg-white/95 text-brand-maroon hover:bg-rose-50 hover:scale-110 transition-all cursor-pointer shadow-xs flex items-center justify-center"
                            title={b('শিরোনাম সম্পাদনা', 'Edit Caption')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyCdnUrl(img.src, img.id)}
                            className="w-8 h-8 rounded-xl bg-white/95 text-stone-800 hover:bg-white hover:scale-110 transition-all cursor-pointer shadow-xs flex items-center justify-center"
                            title={b('লিংক কপি', 'Copy Link')}
                          >
                            {copiedId === img.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(img.id)}
                            className="w-8 h-8 rounded-xl bg-white/95 text-rose-600 hover:bg-rose-50 hover:scale-110 transition-all cursor-pointer shadow-xs flex items-center justify-center"
                            title={b('মুছুন', 'Delete Photo')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Info Footer */}
                      <div className="p-2.5">
                        <h4 className="text-xs font-bold text-stone-800 truncate" title={t(img.title)}>
                          {t(img.title) || 'Untitled Photo'}
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

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-stone-200 text-center space-y-3 animate-in fade-in duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {b(`${selectedPhotoIds.length}টি ছবি মুছে ফেলতে চান?`, `Delete ${selectedPhotoIds.length} photos?`)}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {b(
                  `নির্বাচিত ${selectedPhotoIds.length}টি ছবি গ্যালারি ও ডাটাবেস থেকে স্থায়ীভাবে মুছে যাবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`,
                  `All ${selectedPhotoIds.length} selected photos will be permanently deleted. This action cannot be undone.`
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                disabled={bulkDeleting}
                className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {b('বাতিল', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {bulkDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{b('মুছছে...', 'Deleting...')}</span>
                  </>
                ) : (
                  <span>{b('সব মুছে ফেলুন', 'Delete All')}</span>
                )}
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
              <span className="text-xs font-bold truncate">{t(previewModalImg.title)}</span>
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
                alt={t(previewModalImg.title)}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ Edit Caption Modal ═══ */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-maroon inline-block" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  {b('ছবির শিরোনাম ও ক্যাপশন সম্পাদনা', 'Edit Photo Title / Caption')}
                </h3>
              </div>
              <button
                type="button"
                onClick={cancelEditCaption}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <img
                src={editingPhoto.src}
                alt="Thumbnail"
                className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0 text-xs space-y-0.5">
                <p className="font-bold text-stone-800 truncate">{t(editingPhoto.title)}</p>
                <p className="text-stone-400 font-mono text-[11px] truncate">{editingPhoto.src.split('/').pop()}</p>
                <span className="inline-block px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                  {editingPhoto.year}
                </span>
              </div>
            </div>

            {/* Bilingual Caption Input with 1-click Auto-Translate */}
            <BilingualInput
              label={b('ছবির শিরোনাম / ক্যাপশন', 'Photo Title / Caption')}
              value={editCaption}
              onChange={(val) => setEditCaption(val)}
              placeholderBn="যেমন: ২০২৬ মণ্ডপ সজ্জা ও আলোকসজ্জা"
              placeholderEn="e.g. 2026 Pandal Decoration & Lighting"
              helpText={b('বাংলা বা ইংরেজি যেকোনো একটি লিখুন, এরপর অটো-অনুবাদ ব্যবহার করে অন্য ভাষা তৈরি করুন।', 'Type in Bengali or English; use Auto-Translate to sync.')}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={cancelEditCaption}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {b('বাতিল', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleSaveCaption}
                disabled={savingEdit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-maroon text-white hover:bg-[#881337] transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {savingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{savingEdit ? b('সংরক্ষণ হচ্ছে...', 'Saving...') : b('সংরক্ষণ করুন', 'Save Changes')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
