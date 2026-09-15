'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const EN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const dictBn = {
  // Navigation & General
  "Home": "হোম",
  "Durga Puja 2026": "দুর্গাপূজা ২০২৬",
  "Puja Schedule": "পূজা নির্ঘণ্ট",
  "Festival Schedule": "উৎসব সময়সূচি",
  "Committee": "কমিটি",
  "Committee Members": "কমিটির সদস্য",
  "Gallery": "ছবি গ্যালারি",
  "Photo Gallery": "ছবি গ্যালারি",
  "Financials": "হিসাব নিকাশ",
  "Transparency": "আর্থিক স্বচ্ছতা",
  "Notice Board": "নোটিশ বোর্ড",
  "Notices": "বিজ্ঞপ্তি",
  "Important Documents": "গুরুত্বপূর্ণ নথি",
  "Contact": "যোগাযোগ",
  "About Us": "আমাদের সম্পর্কে",
  "Dashboard": "ড্যাশবোর্ড",
  "Global Settings": "গ্লোবাল সেটিংস",
  "Gallery Archives": "গ্যালারি আর্কাইভ",
  "Assets & Media": "মিডিয়া ও অডিও",
  "Committee Roster": "কমিটি তালিকা",
  "Budget & Audit": "বাজেট ও অডিট",
  
  // Actions & Buttons
  "View Website": "ওয়েবসাইট দেখুন",
  "Live Website": "ওয়েবসাইট দেখুন",
  "Refresh": "রিফ্রেশ করুন",
  "Save Changes": "সংরক্ষণ করুন",
  "Cancel": "বাতিল",
  "Delete": "মুছে ফেলুন",
  "Edit": "সম্পাদনা",
  "Upload": "আপলোড করুন",
  "Download": "ডাউনলোড",
  "Download PDF": "পিডিএফ ডাউনলোড",
  "Search": "অনুসন্ধান করুন",
  "View Details": "বিস্তারিত দেখুন",
  "Read More": "আরও পড়ুন",
  "Learn More": "আরও জানুন",
  "All": "সব",
  "All Years": "সব বছর",
  "Full Screen": "সম্পূর্ণ স্ক্রিন",
  "Share": "শেয়ার",
  "Copied": "কপি হয়েছে!",
  
  // Roles & Designations
  "President": "সভাপতি",
  "Working President": "কার্যকরী সভাপতি",
  "Vice President": "সহ-সভাপতি",
  "General Secretary": "সাধারণ সম্পাদক",
  "Secretary": "সম্পাদক",
  "Joint Secretary": "যুগ্ম সম্পাদক",
  "Assistant Secretary": "সহ-সম্পাদক",
  "Treasurer": "কোষাধ্যক্ষ",
  "Asst. Treasurer": "সহ-কোষাধ্যক্ষ",
  "Cultural Secretary": "সাংস্কৃতিক সম্পাদক",
  "Executive Member": "কার্যকরী সদস্য",
  "Advisor": "উপদেষ্টা",
  "Chief Patron": "প্রধান পৃষ্ঠপোষক",
  
  // Community & Wings
  "Bansdroni Sonali Park": "বাঁশদ্রোণী সোনালী পার্ক",
  "Sonali Sangha": "সোনালী সঙ্ঘ",
  "Sonali Park Unnayan Samiti": "সোনালী পার্ক উন্নয়ন সমিতি",
  "Club & Puja Committee": "ক্লাব ও পূজা পরিচালনা কমিটি",
  "Authorized Secure Session": "সুরক্ষিত অ্যাডমিন সেশন",

  // Festival Tithis & Rituals
  "Maha Shashti": "মহাষষ্ঠী",
  "Maha Saptami": "মহাসপ্তমী",
  "Maha Ashtami": "মহাষ্টমী",
  "Maha Navami": "মহানবমী",
  "Bijoya Dashami": "বিজয়া দশমী",
  "Sandhi Puja": "সন্ধিপূজা",
  "Kumari Puja": "কুমারী পূজা",
  "Nabapatrika Sthan": "নবপত্রিকা স্নান ও স্থাপন",
  "Pushpanjali": "পুষ্পাঞ্জলি",
  "Idol Immersion": "প্রতিমা নিরঞ্জন",
  "Sindur Khela": "সিঁদুর খেলা",
  "Bhog & Arati": "ভোগ ও বিশেষ আরতি",
  "Pandal Artist": "মণ্ডপ শিল্পী",
  "Idol Sculptor": "প্রতিমা শিল্পী",
  "Lighting & Illumination": "আলোকসজ্জা"
};

const dictEn = {
  // Reverse lookup: Bengali to English
  "হোম": "Home",
  "দুর্গাপূজা ২০২৬": "Durga Puja 2026",
  "পূজা নির্ঘণ্ট": "Puja Schedule",
  "উৎসব সময়সূচি": "Festival Schedule",
  "কমিটি": "Committee",
  "কমিটির সদস্য": "Committee Members",
  "ছবি গ্যালারি": "Photo Gallery",
  "হিসাব নিকাশ": "Financial Transparency",
  "আর্থিক স্বচ্ছতা": "Financial Transparency",
  "নোটিশ বোর্ড": "Notice Board",
  "বিজ্ঞপ্তি": "Notices",
  "গুরুত্বপূর্ণ নথি": "Important Documents",
  "যোগাযোগ": "Contact",
  "আমাদের সম্পর্কে": "About Us",
  "ড্যাশবোর্ড": "Dashboard",
  "গ্লোবাল সেটিংস": "Global Settings",
  "গ্যালারি আর্কাইভ": "Gallery Archives",
  "মিডিয়া ও অডিও": "Assets & Media",
  "কমিটি তালিকা": "Committee Roster",
  "বাজেট ও অডিট": "Budget & Audit",
  "ওয়েবসাইট দেখুন": "Live Website",
  "রিফ্রেশ করুন": "Refresh",
  "সংরক্ষণ করুন": "Save Changes",
  "বাতিল": "Cancel",
  "মুছে ফেলুন": "Delete",
  "সম্পাদনা": "Edit",
  "আপলোড করুন": "Upload",
  "ডাউনলোড": "Download",
  "পিডিএফ ডাউনলোড": "Download PDF",
  "সব বছর": "All Years",
  "সব": "All",
  "সম্পূর্ণ স্ক্রিন": "Full Screen",
  "শেয়ার": "Share",
  "কপি হয়েছে!": "Copied!",

  // Roles
  "সভাপতি": "President",
  "কার্যকরী সভাপতি": "Working President",
  "সহ-সভাপতি": "Vice President",
  "সাধারণ সম্পাদক": "General Secretary",
  "সম্পাদক": "Secretary",
  "যুগ্ম সম্পাদক": "Joint Secretary",
  "সহ-সম্পাদক": "Assistant Secretary",
  "কোষাধ্যক্ষ": "Treasurer",
  "সহ-কোষাধ্যক্ষ": "Asst. Treasurer",
  "সাংস্কৃতিক সম্পাদক": "Cultural Secretary",
  "কার্যকরী সদস্য": "Executive Member",
  "উপদেষ্টা": "Advisor",
  "প্রধান পৃষ্ঠপোষক": "Chief Patron",

  // Community
  "বাঁশদ্রোণী সোনালী পার্ক": "Bansdroni Sonali Park",
  "সোনালী সঙ্ঘ": "Sonali Sangha Club",
  "সোনালী সংঘ": "Sonali Sangha Club",
  "সোনালী পার্ক উন্নয়ন সমিতি": "Sonali Park Unnayan Samiti",
  "ক্লাব ও পূজা পরিচালনা কমিটি": "Club & Puja Committee",
  "সুরক্ষিত অ্যাডমিন সেশন": "Authorized Secure Session",

  // Tithis & Rituals
  "মহাষষ্ঠী": "Maha Shashti",
  "মহাসপ্তমী": "Maha Saptami",
  "মহাষ্টমী": "Maha Ashtami",
  "মহানবমী": "Maha Navami",
  "বিজয়া দশমী": "Bijoya Dashami",
  "সন্ধিপূজা": "Sandhi Puja",
  "কুমারী পূজা": "Kumari Puja",
  "নবপত্রিকা স্নান ও স্থাপন": "Nabapatrika Sthan",
  "পুষ্পাঞ্জলি": "Pushpanjali",
  "প্রতিমা নিরঞ্জন": "Idol Immersion",
  "সিঁদুর খেলা": "Sindur Khela",
  "ভোগ ও বিশেষ আরতি": "Bhog & Special Arati",
  "মণ্ডপ শিল্পী": "Pandal Artist",
  "প্রতিমা শিল্পী": "Idol Sculptor",
  "আলোকসজ্জা": "Lighting & Illumination"
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('bn');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('sonaliParkLanguage');
      if (saved === 'en' || saved === 'bn') {
        setLang(saved);
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('sonaliParkLanguage', newLang);
    } catch {
      // LocalStorage fallback
    }
  };

  // Convert numbers between 0-9 and ০-৯ based on language
  const toDigits = (value, targetLang = lang) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (targetLang === 'bn') {
      return str.replace(/\d/g, (d) => BN_DIGITS[parseInt(d, 10)]);
    } else {
      return str.replace(/[০-৯]/g, (d) => EN_DIGITS[d.charCodeAt(0) - 2534]);
    }
  };

  // Format dates according to selected language
  const formatDate = (dateVal, targetLang = lang, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
    if (!dateVal) return '';
    try {
      const d = typeof dateVal === 'string'
        ? new Date(dateVal.includes('T') ? dateVal : `${dateVal}T00:00:00`)
        : new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString(targetLang === 'bn' ? 'bn-IN' : 'en-US', options);
    } catch {
      return String(dateVal);
    }
  };

  // Lookup translation in dictionary
  const t = (text) => {
    if (!text) return '';
    if (lang === 'bn') {
      return dictBn[text] || text;
    } else {
      return dictEn[text] || text;
    }
  };

  // Helper function to return language specific string
  const b = (bnText, enText) => (lang === 'bn' ? bnText : enText);

  const value = useMemo(() => ({
    lang,
    changeLanguage,
    t,
    b,
    toDigits,
    formatDate,
    mounted
  }), [lang, mounted]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
