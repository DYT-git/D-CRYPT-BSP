'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Edit2, Trash2, X, UserPlus, Check, User,
  Search, RefreshCw, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const ROLES_BY_WING = {
  Puja: [
    'সভাপতি (President)',
    'কার্যকরী সভাপতি (Working President)',
    'সহ-সভাপতি (Vice President)',
    'সাধারণ সম্পাদক (General Secretary)',
    'যুগ্ম সম্পাদক (Joint Secretary)',
    'সহ-সম্পাদক (Assistant Secretary)',
    'পূজা আহ্বায়ক (Puja Convener)',
    'মণ্ডপ ও নির্মাণ (Pandal & Construction)',
    'সাংস্কৃতিক সম্পাদক (Cultural Secretary)',
    'প্রচার ও গণসংযোগ (Publicity)',
    'কোষাধ্যক্ষ (Treasurer)',
    'সহ-কোষাধ্যক্ষ (Asst. Treasurer)',
    'কার্যকরী সদস্য (Executive Member)'
  ],
  Club: [
    'সভাপতি (President)',
    'কার্যকরী সভাপতি (Working President)',
    'সহ-সভাপতি (Vice President)',
    'সাধারণ সম্পাদক (General Secretary)',
    'সহ-সম্পাদক (Assistant Secretary)',
    'ক্রীড়া সম্পাদক (Sports Secretary)',
    'সহ-ক্রীড়া সম্পাদক (Asst. Sports Secretary)',
    'সাংস্কৃতিক সম্পাদক (Cultural Secretary)',
    'কোষাধ্যক্ষ (Treasurer)',
    'যুবকল্যাণ আহ্বায়ক (Youth Welfare)',
    'ইনডোর গেমস ইনচার্জ (Indoor Games In-Charge)',
    'কার্যকরী সদস্য (Executive Member)'
  ],
  Samiti: [
    'সভাপতি (President)',
    'কার্যকরী সভাপতি (Working President)',
    'সহ-সভাপতি (Vice President)',
    'সাধারণ সম্পাদক (General Secretary)',
    'সহ-সম্পাদক (Assistant Secretary)',
    'নিরাপত্তা আহ্বায়ক (Security In-Charge)',
    'পরিকাঠামো ও ড্রেনেজ আহ্বায়ক (Civic & Drainage)',
    'কোষাধ্যক্ষ (Treasurer)',
    'পরিচ্ছন্নতা ও স্বাস্থ্য আহ্বায়ক (Sanitation & Health)',
    'লেন প্রতিনিধি (Lane Representative)',
    'কার্যকরী সদস্য (Executive Member)'
  ]
};

export function parseMemberRole(role) {
  if (!role) return { wing: 'Puja', cleanRole: '', phone: '' };
  let wing = 'Puja';
  let rest = role;
  if (rest.startsWith('[Club]')) { wing = 'Club'; rest = rest.replace('[Club]', '').trim(); }
  else if (rest.startsWith('[Samiti]')) { wing = 'Samiti'; rest = rest.replace('[Samiti]', '').trim(); }
  else if (rest.startsWith('[Puja]')) { wing = 'Puja'; rest = rest.replace('[Puja]', '').trim(); }

  let cleanRole = rest;
  let phone = '';
  if (rest.includes('|')) {
    const parts = rest.split('|');
    cleanRole = parts[0].trim();
    phone = parts[1].replace(/phone|tel|m\.|m:/gi, '').trim();
  }
  return { wing, cleanRole, phone };
}

export default function CommitteeManagerPage() {
  const { lang, b } = useLanguage();
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    role: 'সভাপতি (President)',
    wing: 'Puja',
    phone: '',
    year: new Date().getFullYear().toString()
  });
  const [customRole, setCustomRole] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWing, setFilterWing] = useState('Puja');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMembers();
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

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      if (data.members) {
        setMembers([...data.members].sort((a, b) => (a.id || 0) - (b.id || 0)));
      }
    } catch (err) {
      console.error('Failed to load committee members', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = currentImageUrl;

      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('type', 'committee');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          finalImageUrl = uploadResult.url;
        }
      }

      let encodedRole = `[${formData.wing}] ${formData.role.trim()}`;
      if (formData.phone && formData.phone.trim()) {
        encodedRole += ` | ${formData.phone.trim()}`;
      }

      if (editingId) {
        const res = await fetch('/api/admin/committee', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            name: formData.name,
            role: encodedRole,
            year: formData.year,
            image: finalImageUrl
          })
        });

        if (res.ok) {
          setMessage(b('সদস্য তথ্য সফলভাবে আপডেট হয়েছে!', 'Member updated successfully!'));
          handleCancelEdit();
          fetchMembers();
        } else {
          setMessage(b('সদস্য তথ্য আপডেট ব্যর্থ হয়েছে।', 'Failed to update member.'));
        }
      } else {
        const res = await fetch('/api/admin/committee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            role: encodedRole,
            year: formData.year,
            image: finalImageUrl
          })
        });

        if (res.ok) {
          setMessage(b('নতুন কমিটি সদস্য যুক্ত হয়েছে!', 'New member added successfully!'));
          setFormData(prev => ({ ...prev, name: '', phone: '' }));
          setFile(null);
          setPreviewUrl(null);
          setCurrentImageUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          fetchMembers();
        } else {
          setMessage(b('নতুন সদস্য যোগ করা যায়নি।', 'Failed to add member.'));
        }
      }
    } catch (err) {
      setMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3500);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    const parsed = parseMemberRole(member.role);
    setFormData({
      name: member.name,
      wing: parsed.wing,
      role: parsed.cleanRole,
      phone: parsed.phone || '',
      year: String(member.year)
    });
    setCurrentImageUrl(member.image || null);
    setFile(null);
    setPreviewUrl(null);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      wing: 'Puja',
      role: ROLES_BY_WING.Puja[0],
      phone: '',
      year: new Date().getFullYear().toString()
    });
    setCurrentImageUrl(null);
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await fetch('/api/admin/committee', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteConfirmId })
      });
      if (editingId === deleteConfirmId) handleCancelEdit();
      setDeleteConfirmId(null);
      setMessage(b('সদস্য মুছে ফেলা হয়েছে।', 'Member deleted successfully.'));
      fetchMembers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    }
  };

  const availableYears = ['ALL', ...Array.from(new Set(members.map(m => String(m.year))))];

  const filteredMembers = members.filter(m => {
    const parsed = parseMemberRole(m.role);
    const matchesWing = filterWing === 'ALL' || parsed.wing === filterWing;
    const matchesYear = filterYear === 'ALL' || String(m.year) === filterYear;
    const matchesSearch = !searchQuery.trim() ||
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parsed.cleanRole?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWing && matchesYear && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
            {b('কমিটি ডিরেক্টরি ও কর্মকর্তা', 'Committee Roster & Leadership')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('পাড়া ও পূজা পরিচালনা কমিটির কর্মকর্তা ও সদস্যদের বিবরণ পরিচালনা করুন', 'Manage committee roster, executive leadership, and member directory')}
          </p>
        </div>

        <button
          onClick={fetchMembers}
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
        
        {/* Left: Member Form */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              {editingId ? <Edit2 className="w-4 h-4 text-brand-maroon" /> : <UserPlus className="w-4 h-4 text-brand-maroon" />}
              <span>{editingId ? b('সদস্য তথ্য সম্পাদনা', 'Edit Member') : b('নতুন সদস্য যুক্ত করুন', 'Add Member')}</span>
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-stone-500 hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{b('বাতিল', 'Cancel')}</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Wing / Pillar Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {b('সংগঠনের শাখা (Wing / Pillar)', 'Wing / Pillar')} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    const w = 'Puja';
                    setFormData(prev => ({
                      ...prev,
                      wing: w,
                      role: customRole ? prev.role : ROLES_BY_WING[w][0]
                    }));
                  }}
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
                  onClick={() => {
                    const w = 'Club';
                    setFormData(prev => ({
                      ...prev,
                      wing: w,
                      role: customRole ? prev.role : ROLES_BY_WING[w][0]
                    }));
                  }}
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
                  onClick={() => {
                    const w = 'Samiti';
                    setFormData(prev => ({
                      ...prev,
                      wing: w,
                      role: customRole ? prev.role : ROLES_BY_WING[w][0]
                    }));
                  }}
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

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('পূর্ণ নাম (Full Name)', 'Full Name')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={b('যেমন: অমিতাভ রায়চৌধুরী', 'e.g. Amitabha Roy')}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
              />
            </div>

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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {b('পদমর্যাদা', 'Role')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomRole(!customRole)}
                    className="text-[10px] font-bold text-brand-maroon hover:underline cursor-pointer"
                  >
                    {customRole ? b('তালিকা থেকে', 'From List') : b('কাস্টম টাইপ', 'Custom')}
                  </button>
                </div>

                {customRole ? (
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder={b('পদবী লিখুন', 'Enter role')}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  />
                ) : (
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs font-medium focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
                  >
                    {(ROLES_BY_WING[formData.wing] || ROLES_BY_WING.Puja).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('ফোন নম্বর (Phone Number - ঐচ্ছিক)', 'Phone Number (Optional)')}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={b('যেমন: 8910936506 বা +91 98300 XXXXX', 'e.g. 9830012345')}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-base sm:text-xs font-semibold focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                {b('ডাকনাম বা ইংরেজি নাম নামের বন্ধনীতে লিখুন, যেমন: ছোটকা দাস (বাপি) (CHOTKA DAS)', 'Include nickname or English in brackets: Name (Nickname) (ENGLISH)')}
              </p>
            </div>

            {/* Profile Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('সদস্যের ছবি (Profile Photo)', 'Profile Photo')}
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-200 hover:border-brand-maroon/50 rounded-xl p-3 text-center cursor-pointer bg-stone-50/60 hover:bg-stone-50 transition-colors flex items-center gap-3"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />

                {previewUrl || currentImageUrl ? (
                  <img
                    src={previewUrl || currentImageUrl}
                    alt="Member"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-maroon/20 shadow-2xs shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}

                <div className="text-left min-w-0 flex-1">
                  <p className="text-xs font-bold text-stone-800 truncate">
                    {file ? file.name : (currentImageUrl ? b('ছবি পরিবর্তন করতে ক্লিক করুন', 'Click to change photo') : b('ছবি নির্বাচন করুন', 'Choose photo'))}
                  </p>
                  <p className="text-[10px] text-stone-400">
                    PNG, JPG, WebP (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : editingId ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <UserPlus className="w-3.5 h-3.5" />
              )}
              <span>{editingId ? b('সদস্য তথ্য আপডেট করুন', 'Update Member') : b('সদস্য যোগ করুন', 'Add Member')}</span>
            </button>
          </form>
        </div>

        {/* Right: Roster List */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {b(`কমিটি সদস্য তালিকা (${filteredMembers.length})`, `Committee Members (${filteredMembers.length})`)}
              </h2>
              <p className="text-[11px] text-stone-400">{b('ওয়েবসাইটে দৃশ্যমান কমিটি রোস্টার', 'Public leadership directory')}</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-52">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={b('নাম বা পদবী খুঁজুন...', 'Search name or role...')}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-base sm:text-xs focus:bg-white focus:ring-2 focus:ring-brand-maroon/20 outline-none"
              />
            </div>
          </div>

          {/* Filters: Wing & Year */}
          <div className="space-y-2">
            {/* Wing Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-stone-400 mr-1 uppercase tracking-wider">{b('শাখা:', 'Wing:')}</span>
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

            {/* Year Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-stone-400 mr-1 uppercase tracking-wider">{b('বছর:', 'Year:')}</span>
              {availableYears.map(yr => (
                <button
                  key={yr}
                  onClick={() => setFilterYear(yr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterYear === yr
                      ? 'bg-brand-maroon text-white shadow-xs font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Member Cards */}
          <div className="overflow-y-auto max-h-[600px] pr-1 space-y-2">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-xs">
                <User className="w-8 h-8 mx-auto mb-2 opacity-30" />
                {b('কোনো কমিটি সদস্য খুঁজে পাওয়া যায়নি।', 'No members found.')}
              </div>
            ) : (
              filteredMembers.map((member) => {
                const parsed = parseMemberRole(member.role);
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-stone-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-brand-maroon flex items-center justify-center font-bold text-xs shrink-0">
                          {member.name ? member.name[0] : 'U'}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                            {member.name}
                          </h3>
                          <span className="px-1.5 py-0.2 rounded bg-stone-200/70 text-stone-600 text-[9px] font-mono font-bold">
                            {member.year}
                          </span>
                          {parsed.wing === 'Club' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300/60 text-[9px] font-bold">
                              🏆 {b('ক্লাব', 'Club')}
                            </span>
                          )}
                          {parsed.wing === 'Samiti' && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300/60 text-[9px] font-bold">
                              🏛️ {b('সমিতি', 'Samiti')}
                            </span>
                          )}
                          {parsed.wing === 'Puja' && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300/60 text-[9px] font-bold">
                              🌺 {b('পূজা', 'Puja')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <p className="text-xs font-semibold text-stone-600 truncate">
                            {parsed.cleanRole}
                          </p>
                          {parsed.phone && (
                            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              📞 {parsed.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer"
                      title={b('সম্পাদনা', 'Edit')}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(member.id)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={b('মুছুন', 'Delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
              <h3 className="text-sm font-bold text-stone-900">{b('সদস্য মুছে ফেলতে চান?', 'Delete this member?')}</h3>
              <p className="text-xs text-stone-500 mt-1">
                {b('এই সদস্যের রেকর্ড কমিটি তালিকা থেকে চিরতরে মুছে যাবে।', 'This member will be permanently removed from the roster.')}
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
