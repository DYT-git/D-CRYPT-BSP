'use client';
import { createContext, useContext, useState, useEffect } from 'react';

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
  
  // Actions
  "View Website": "ওয়েবসাইট দেখুন",
  "Live Website": "ওয়েবসাইট দেখুন",
  "Refresh": "রিফ্রেশ করুন",
  "Save Changes": "সংরক্ষণ করুন",
  "Cancel": "বাতিল",
  "Delete": "মুছে ফেলুন",
  "Edit": "সম্পাদনা",
  "Upload": "আপলোড করুন",
  "Download": "ডাউনলোড",
  "Search": "অনুসন্ধান করুন",
  "View Details": "বিস্তারিত দেখুন",
  "Read More": "আরও পড়ুন",
  "Learn More": "আরও জানুন",
  "All": "সব",
  "All Years": "সব বছর",
  
  // Roles
  "President": "সভাপতি",
  "Working President": "কার্যকরী সভাপতি",
  "Vice President": "সহ-সভাপতি",
  "General Secretary": "সাধারণ সম্পাদক",
  "Joint Secretary": "যুগ্ম সম্পাদক",
  "Assistant Secretary": "সহ-সম্পাদক",
  "Treasurer": "কোষাধ্যক্ষ",
  "Asst. Treasurer": "সহ-কোষাধ্যক্ষ",
  "Cultural Secretary": "সাংস্কৃতিক সম্পাদক",
  "Executive Member": "কার্যকরী সদস্য",
  
  // Community
  "Bansdroni Sonali Park": "বাঁশদ্রোণী সোনালী পার্ক",
  "Sonali Sangha": "সোনালী সংঘ",
  "Sonali Park Unnayan Samiti": "সোনালী পার্ক উন্নয়ন সমিতি",
  "Club & Puja Committee": "ক্লাব ও পূজা পরিচালনা কমিটি",
  "Authorized Secure Session": "সুরক্ষিত অ্যাডমিন সেশন"
};

const dictEn = {
  // Reverse lookup from Bengali to English
  "হোম": "Home",
  "দুর্গাপূজা ২০২৬": "Durga Puja 2026",
  "পূজা নির্ঘণ্ট": "Puja Schedule",
  "কমিটি": "Committee",
  "ছবি গ্যালারি": "Photo Gallery",
  "হিসাব নিকাশ": "Financial Transparency",
  "নোটিশ বোর্ড": "Notice Board",
  "বিজ্ঞপ্তি": "Notices",
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
  "সব বছর": "All Years",
  "সব": "All",
  "বাঁশদ্রোণী সোনালী পার্ক": "Bansdroni Sonali Park",
  "সুরক্ষিত অ্যাডমিন সেশন": "Authorized Secure Session"
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('bn');

  useEffect(() => {
    const saved = localStorage.getItem('sonaliParkLanguage');
    if (saved === 'en' || saved === 'bn') {
      setLang(saved);
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

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t, b }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
