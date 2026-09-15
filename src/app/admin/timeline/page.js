'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays,
  PlusCircle,
  Edit2,
  Trash2,
  X,
  Check,
  Search,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const PUJA_PRESETS = [
  {
    nameBn: 'মহাষষ্ঠী',
    nameEn: 'Maha Shashthi',
    date: '2026-10-17',
    titleBn: 'মহাষষ্ঠী — বোধন, আমন্ত্রণ ও অধিবাস',
    titleEn: 'Maha Shashthi — Bodhon & Adhibas',
    descBn: 'সকাল ৮:০০ টায় দেবীর বোধন ও আমন্ত্রণ। সন্ধ্যায় অধিবাস এবং ভক্তদের জন্য দ্বার উন্মোচন।',
    descEn: '08:00 AM: Devi Bodhon. Evening: Adhibas and official opening for visitors.'
  },
  {
    nameBn: 'মহাসপ্তমী',
    nameEn: 'Maha Saptami',
    date: '2026-10-18',
    titleBn: 'মহাসপ্তমী — নবপত্রিকা প্রবেশ ও সপ্তমী বিহিত পূজা',
    titleEn: 'Maha Saptami — Nabapatrika & Puja',
    descBn: 'ভোর ৬:৩০ টায় নবপত্রিকা স্নান ও প্রবেশ। সকাল ৯:০০ টায় সপ্তমী বিহিত পূজা ও অঞ্জলি।',
    descEn: '06:30 AM: Nabapatrika Snan. 09:00 AM: Saptami Puja and Pushpanjali.'
  },
  {
    nameBn: 'মহাষ্টমী',
    nameEn: 'Maha Ashtami',
    date: '2026-10-19',
    titleBn: 'মহাষ্টমী — অঞ্জলি, কুমারী পূজা ও সন্ধিপূজা',
    titleEn: 'Maha Ashtami — Kumari & Sandhi Puja',
    descBn: 'সকাল ৯:৩০ টায় সার্বজনীন পুষ্পাঞ্জলি। দুপুর ১১:৩০ টায় কুমারী পূজা। বিকেল ৫:৪২ থেকে সন্ধিপূজা।',
    descEn: '09:30 AM: Pushpanjali. 11:30 AM: Kumari Puja. 05:42 PM: Sandhi Puja.'
  },
  {
    nameBn: 'মহানবমী',
    nameEn: 'Maha Nabami',
    date: '2026-10-20',
    titleBn: 'মহানবমী — নবমী হোম ও ভোগ বিতরণ',
    titleEn: 'Maha Nabami — Maha Hom & Bhog',
    descBn: 'সকাল ১০:০০ টায় নবমী বিহিত পূজা। দুপুর ১২:৩০ টায় মহাহোম। দুপুর ১:৩০ টা থেকে ভোগ বিতরণ।',
    descEn: '10:00 AM: Nabami Puja. 12:30 PM: Maha Hom. 01:30 PM: Community Bhog.'
  },
  {
    nameBn: 'বিজয়া দশমী',
    nameEn: 'Bijoya Dashami',
    date: '2026-10-21',
    titleBn: 'বিজয়া দশমী — দশমী পূজা, সিঁদুর খেলা ও বিসর্জন',
    titleEn: 'Bijoya Dashami — Sindoor Khela & Immersion',
    descBn: 'সকাল ৯:০০ টায় দর্পণ বিসর্জন। দুপুর ২:০০ টা থেকে সিঁদুর খেলা। সন্ধ্যায় প্রতিমা নিরঞ্জন।',
    descEn: '09:00 AM: Darpan Bishorjon. 02:00 PM: Sindoor Khela. Evening: Immersion.'
  },
  {
    nameBn: 'লক্ষ্মী পূজা',
    nameEn: 'Lakshmi Puja',
    date: '2026-10-25',
    titleBn: 'শ্রীশ্রী কোজাগরী লক্ষ্মী পূজা',
    titleEn: 'Kojagari Lakshmi Puja',
    descBn: 'সন্ধ্যা ৬:৩০ টায় দেবীর আবাহন ও পূজা আরম্ভ। সার্বজনীন অঞ্জলি এবং প্রসাদ বিতরণ।',
    descEn: '06:30 PM: Puja initiation, Pushpanjali and Prasad distribution.'
  }
];

export default function TimelineManagerPage() {
  const { lang, b } = useLanguage();
  const [allEvents, setAllEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    date: '2026-10-17',
    text: '',
    year: '2026'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchEvents = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      if (data.events) {
        setAllEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((e) => String(e.year) === String(selectedYear))
      .filter((e) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          e.title?.toLowerCase().includes(q) ||
          e.date?.toLowerCase().includes(q) ||
          e.text?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [allEvents, selectedYear, searchQuery]);

  const availableYears = useMemo(() => {
    const years = new Set(allEvents.map((e) => String(e.year)));
    years.add('2026');
    years.add('2025');
    return Array.from(years).sort((a, b) => b - a);
  }, [allEvents]);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const applyPreset = (preset) => {
    setFormData({
      ...formData,
      title: lang === 'bn' ? preset.titleBn : preset.titleEn,
      date: preset.date,
      text: lang === 'bn' ? preset.descBn : preset.descEn,
      year: selectedYear
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date.trim()) {
      showToast('error', b('অনুগ্রহ করে শিরোনাম ও তারিখ দিন।', 'Please enter a title and date.'));
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch('/api/admin/timeline', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingId, year: selectedYear })
        });
        if (res.ok) {
          showToast('success', b('পূজা নির্ঘণ্ট সফলভাবে আপডেট করা হয়েছে!', 'Puja schedule successfully updated!'));
          setEditingId(null);
          setFormData({ title: '', date: '2026-10-17', text: '', year: selectedYear });
          fetchEvents();
        } else {
          showToast('error', b('আপডেট করতে ব্যর্থ হয়েছে।', 'Failed to update schedule.'));
        }
      } else {
        const res = await fetch('/api/admin/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, year: selectedYear })
        });
        if (res.ok) {
          showToast('success', b('নতুন নির্ঘণ্ট সফলভাবে যোগ করা হয়েছে!', 'New schedule event added successfully!'));
          setFormData({ title: '', date: '2026-10-17', text: '', year: selectedYear });
          fetchEvents();
        } else {
          showToast('error', b('যোগ করতে ব্যর্থ হয়েছে।', 'Failed to add event.'));
        }
      }
    } catch (err) {
      showToast('error', b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      date: event.date,
      text: event.text,
      year: String(event.year)
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', date: '2026-10-17', text: '', year: selectedYear });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch('/api/admin/timeline', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast('success', b('নির্ঘণ্ট সফলভাবে মুছে ফেলা হয়েছে।', 'Schedule event deleted successfully.'));
        if (editingId === id) handleCancelEdit();
        fetchEvents();
      } else {
        showToast('error', b('মুছে ফেলতে ব্যর্থ হয়েছে।', 'Failed to delete event.'));
      }
    } catch (err) {
      showToast('error', b('ত্রুটি: ' + err.message, 'Error: ' + err.message));
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const getEventDateParts = (dateStr) => {
    if (!dateStr) return { day: '--', month: '--', weekday: '--' };
    try {
      const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
      if (isNaN(d.getTime())) return { day: '--', month: '--', weekday: '--' };
      return {
        day: d.getDate(),
        month: d.toLocaleString(lang === 'bn' ? 'bn-IN' : 'en-US', { month: 'short' }),
        weekday: d.toLocaleDateString(lang === 'bn' ? 'bn-IN' : 'en-US', { weekday: 'short' })
      };
    } catch {
      return { day: '--', month: '--', weekday: '--' };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
            {b('পূজা নির্ঘণ্ট ও সময়সূচি', 'Puja Schedule & Rituals')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {b('মহাষষ্ঠী থেকে বিজয়া দশমী পর্যন্ত সমস্ত আচার ও উৎসবের নির্ঘণ্ট পরিচালনা করুন', 'Manage daily rituals, timings, and ceremonial schedule')}
          </p>
        </div>

        {/* Year Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200/80 self-start sm:self-center overflow-x-auto max-w-full">
          <Calendar className="w-3.5 h-3.5 text-stone-400 ml-1.5 mr-0.5 shrink-0" />
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => {
                setSelectedYear(yr);
                setFormData((prev) => ({ ...prev, year: yr }));
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
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

      {/* ═══ Toast ═══ */}
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

      {/* ═══ Main Grid: Left Editor (5 cols) | Right Events List (7 cols) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form Card */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              {editingId ? (
                <Edit2 className="w-4 h-4 text-brand-maroon" />
              ) : (
                <PlusCircle className="w-4 h-4 text-brand-maroon" />
              )}
              <span>{editingId ? b('নির্ঘণ্ট সম্পাদনা করুন', 'Edit Schedule Event') : b('নতুন নির্ঘণ্ট যোগ করুন', 'Add New Schedule Event')}</span>
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{b('বাতিল', 'Cancel')}</span>
              </button>
            )}
          </div>

          {/* Quick Presets Strip */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              {b('দ্রুত প্রিসেট (Quick Presets)', 'Quick Presets')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PUJA_PRESETS.map((preset) => (
                <button
                  key={preset.nameEn}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-[11px] font-semibold text-stone-700 transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? preset.nameBn : preset.nameEn}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('অনুষ্ঠানের নাম ও পর্ব', 'Event Title')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-base sm:text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all"
                placeholder={b('যেমন: মহাষ্টমী — অঞ্জলি ও সন্ধিপূজা', 'e.g. Maha Ashtami — Pushpanjali & Sandhi Puja')}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('তারিখ (Date)', 'Date')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-base sm:text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all"
              />
            </div>

            {/* Text Details */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {b('বিস্তারিত সময়সূচি', 'Timing & Ritual Details')} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows="4"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full p-3 rounded-xl border border-stone-300 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon transition-all leading-relaxed"
                placeholder={b('সকালের অঞ্জলি, আরতি এবং প্রসাদ বিতরণের সঠিক সময় লিখুন...', 'Specify puja start times, aarti, pushpanjali slots...')}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-maroon hover:bg-brand-dark text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : editingId ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{b('নির্ঘণ্ট আপডেট করুন', 'Update Event')}</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{b('নির্ঘণ্টে যোগ করুন', 'Add Event')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Events List */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span>{b('নির্ধারিত অনুষ্ঠানসমূহ', 'Scheduled Events')}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono">
                  {selectedYear}
                </span>
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {b(`মোট ${filteredEvents.length} টি অনুষ্ঠান তালিকাভুক্ত`, `${filteredEvents.length} events listed`)}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-52">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={b('অনুষ্ঠান খুঁজুন...', 'Search schedule...')}
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

          {/* Timeline List */}
          {fetching ? (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-brand-maroon border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-stone-400">{b('সময়সূচি লোড হচ্ছে...', 'Loading schedule...')}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
              <CalendarDays className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-700">{b('কোনো সূচি পাওয়া যায়নি', 'No events found')}</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {searchQuery
                  ? b('অনুসন্ধানের সাথে মিলছে এমন কিছু নেই।', 'No matching events.')
                  : b(`${selectedYear} সালের জন্য কোনো নির্ঘণ্ট যোগ করা হয়নি।`, `No events for ${selectedYear}.`)}
              </p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
              {filteredEvents.map((event) => {
                const dateParts = getEventDateParts(event.date);
                const isSelected = editingId === event.id;

                return (
                  <div
                    key={event.id}
                    className={`p-3.5 sm:p-4 rounded-xl transition-all border ${
                      isSelected
                        ? 'border-brand-maroon/60 bg-rose-50/20 ring-1 ring-brand-maroon/20'
                        : 'border-stone-200/80 bg-stone-50/50 hover:bg-white hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Date Box & Details */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-white border border-stone-200 flex flex-col items-center justify-center text-brand-maroon shrink-0 shadow-2xs">
                          <span className="text-base font-bold leading-none">{dateParts.day}</span>
                          <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5 text-stone-500">
                            {dateParts.month}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-700">
                              {dateParts.weekday}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              {event.date}
                            </span>
                          </div>
                          <h3 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEdit(event)}
                          className={`p-1.5 rounded-lg text-stone-500 hover:text-brand-maroon hover:bg-stone-100 transition-colors cursor-pointer ${
                            isSelected ? 'bg-brand-maroon text-white hover:bg-brand-dark hover:text-white' : ''
                          }`}
                          title={b('সম্পাদনা', 'Edit')}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(event.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title={b('মুছে ফেলুন', 'Delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Event Description */}
                    <p className="text-xs text-stone-600 mt-2.5 pt-2 border-t border-stone-100 leading-relaxed whitespace-pre-wrap">
                      {event.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Delete Confirmation Modal ═══ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-stone-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-brand-maroon flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {b('নির্ঘণ্ট মুছে ফেলতে চান?', 'Delete Schedule Event?')}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {b('এই অনুষ্ঠানটি জনসাধারণের সময়সূচি থেকে চিরতরে মুছে যাবে।', 'This event will be permanently removed from the public schedule.')}
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
