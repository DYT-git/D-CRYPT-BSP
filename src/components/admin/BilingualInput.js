'use client';
import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import { parseBilingual } from '@/context/LanguageContext';

export default function BilingualInput({
  label,
  value,
  onChange,
  isTextArea = false,
  rows = 3,
  placeholderBn = 'বাংলায় লিখুন...',
  placeholderEn = 'Type in English...',
  required = false,
  helpText = '',
  className = ''
}) {
  const [bilingual, setBilingual] = useState(() => parseBilingual(value));
  const [activeTab, setActiveTab] = useState('bn'); // 'bn' | 'en'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Keep internal state in sync with external value prop
  useEffect(() => {
    const parsed = parseBilingual(value);
    setBilingual(parsed);
  }, [value]);

  const updateLanguage = (lang, text) => {
    const updated = { ...bilingual, [lang]: text };
    setBilingual(updated);
    if (onChange) {
      onChange(JSON.stringify(updated));
    }
  };

  const handleAutoTranslate = async (forceSource) => {
    setErrorMsg('');
    setSuccessMsg('');

    // Determine source and target
    let sourceLang = forceSource;
    if (!sourceLang) {
      if (bilingual.bn.trim() && !bilingual.en.trim()) sourceLang = 'bn';
      else if (bilingual.en.trim() && !bilingual.bn.trim()) sourceLang = 'en';
      else sourceLang = activeTab;
    }

    const targetLang = sourceLang === 'bn' ? 'en' : 'bn';
    const sourceText = (bilingual[sourceLang] || '').trim();

    if (!sourceText) {
      setErrorMsg(sourceLang === 'bn' ? 'প্রথমে বাংলায় কিছু লিখুন!' : 'Please type English text first!');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          from: sourceLang,
          to: targetLang
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Translation failed');
      }

      const translated = data.translatedText || '';
      const updated = { ...bilingual, [targetLang]: translated };
      setBilingual(updated);
      if (onChange) {
        onChange(JSON.stringify(updated));
      }

      setSuccessMsg(
        targetLang === 'en'
          ? 'ইংরেজি সংস্করণ সফলভাবে তৈরি হয়েছে! আপনি চাইলে এডিট করতে পারেন।'
          : 'বাংলা সংস্করণ সফলভাবে তৈরি হয়েছে! আপনি চাইলে এডিট করতে পারেন।'
      );
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Translation error:', err);
      setErrorMsg('অনুবাদ করা যায়নি। অনুগ্রহ করে নিজে টাইপ করুন।');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const isBothFilled = Boolean(bilingual.bn.trim() && bilingual.en.trim());
  const isOneFilled = Boolean(bilingual.bn.trim() || bilingual.en.trim());

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header: Label + Tabs + Magic Auto-Translate Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-brand-maroon" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Translation Status & Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Status Badge */}
          {isBothFilled ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>উভয় ভাষা প্রস্তুত</span>
            </span>
          ) : isOneFilled ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span>অন্য ভাষা বাকি</span>
            </span>
          ) : null}

          {/* Quick Auto-Translate Button */}
          <button
            type="button"
            onClick={() => handleAutoTranslate()}
            disabled={loading || !isOneFilled}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
            title="একটি ভাষা থেকে অন্য ভাষায় রূপান্তর করুন"
          >
            {loading ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 text-amber-100" />
            )}
            <span>{loading ? 'অনুবাদ হচ্ছে...' : 'অটো-অনুবাদ (Sync)'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('bn')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'bn'
              ? 'bg-white text-brand-maroon shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>🇧🇩 বাংলা (Bengali)</span>
          {bilingual.bn.trim() && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('en')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'en'
              ? 'bg-white text-brand-maroon shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span>🇬🇧 English (ইংরেজি)</span>
          {bilingual.en.trim() && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          )}
        </button>
      </div>

      {/* Input Field based on Active Tab */}
      <div className="relative">
        {activeTab === 'bn' ? (
          isTextArea ? (
            <textarea
              rows={rows}
              value={bilingual.bn}
              onChange={(e) => updateLanguage('bn', e.target.value)}
              placeholder={placeholderBn}
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none transition-all placeholder:text-stone-400 font-sans"
            />
          ) : (
            <input
              type="text"
              value={bilingual.bn}
              onChange={(e) => updateLanguage('bn', e.target.value)}
              placeholder={placeholderBn}
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none transition-all placeholder:text-stone-400 font-sans"
            />
          )
        ) : (
          isTextArea ? (
            <textarea
              rows={rows}
              value={bilingual.en}
              onChange={(e) => updateLanguage('en', e.target.value)}
              placeholder={placeholderEn}
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none transition-all placeholder:text-stone-400 font-sans"
            />
          ) : (
            <input
              type="text"
              value={bilingual.en}
              onChange={(e) => updateLanguage('en', e.target.value)}
              placeholder={placeholderEn}
              className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:ring-2 focus:ring-brand-maroon/20 focus:border-brand-maroon outline-none transition-all placeholder:text-stone-400 font-sans"
            />
          )
        )}

        {/* Opposite language preview badge */}
        <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
          <div className="truncate pr-2">
            {activeTab === 'bn' ? (
              bilingual.en.trim() ? (
                <span className="text-emerald-700">
                  🇬🇧 ইংরেজি:{' '}
                  <span className="italic">{bilingual.en.substring(0, 40)}...</span>
                </span>
              ) : (
                <span className="text-amber-600">
                  ⚠️ এখনো ইংরেজি অনুবাদ নেই — উপরে &apos;অটো-অনুবাদ&apos; চাপুন
                </span>
              )
            ) : (
              bilingual.bn.trim() ? (
                <span className="text-emerald-700">
                  🇧🇩 বাংলা:{' '}
                  <span className="italic">{bilingual.bn.substring(0, 40)}...</span>
                </span>
              ) : (
                <span className="text-amber-600">
                  ⚠️ এখনো বাংলা অনুবাদ নেই — উপরে &apos;অটো-অনুবাদ&apos; চাপুন
                </span>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'bn' ? 'en' : 'bn')}
            className="text-brand-maroon hover:underline font-bold shrink-0 cursor-pointer"
          >
            {activeTab === 'bn' ? 'ইংরেজিতে এডিট করুন →' : 'বাংলায় এডিট করুন →'}
          </button>
        </div>
      </div>

      {/* Success / Error Toast notification banner */}
      {successMsg && (
        <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
          {successMsg}
        </p>
      )}
      {errorMsg && (
        <p className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 animate-in fade-in">
          {errorMsg}
        </p>
      )}
      {helpText && (
        <p className="text-[10px] text-stone-400">{helpText}</p>
      )}
    </div>
  );
}
