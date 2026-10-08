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
  "Zoom": "বড় করে দেখুন",
  "Prev": "আগের দিন",
  "Next": "পরের দিন",
  
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
  "Sports Secretary": "ক্রীড়া সম্পাদক",
  "Asst. Sports Secretary": "সহ-ক্রীড়া সম্পাদক",
  "Cultural Secretary": "সাংস্কৃতিক সম্পাদক",
  "Executive Member": "কার্যকরী সদস্য",
  "Associate Member": "সহযোগী সদস্য",
  "Advisor": "উপদেষ্টা",
  "Chief Patron": "প্রধান পৃষ্ঠপোষক",
  "Infrastructure Convener": "পরিকাঠামো আহ্বায়ক",
  "Sanitation & Health Convener": "পরিচ্ছন্নতা ও স্বাস্থ্য",
  "Senior Citizens Coordinator": "প্রবীণ নাগরিক সমন্বয়ক",

  // Community & Wings
  "Bansdroni Sonali Park": "বাঁশদ্রোণী সোনালী পার্ক",
  "Bansdroni Sonali Sangha": "বাঁশদ্রোণী সোনালী সঙ্ঘ",
  "Sonali Sangha": "সোনালী সঙ্ঘ",
  "Sonali Sangha Club": "সোনালী সঙ্ঘ ক্লাব",
  "Sonali Park": "সোনালী পার্ক",
  "Sonali Park Club": "সোনালী পার্ক ক্লাব",
  "Unnayan Samiti": "উন্নয়ন সমিতি",
  "Sonali Park Unnayan Samiti": "সোনালী পার্ক উন্নয়ন সমিতি",
  "Club & Puja Committee": "ক্লাব ও পূজা পরিচালনা কমিটি",
  "Authorized Secure Session": "সুরক্ষিত অ্যাডমিন সেশন",
  "Three Pillars": "তিন স্তম্ভ",
  "Our Three Pillars": "আমাদের তিন স্তম্ভ",
  "Community Pillars": "পাড়ার তিন স্তম্ভ",
  "Durga Puja": "শারদীয়া দুর্গোৎসব",
  "Club & Sports": "ক্লাব ও ক্রীড়া",
  "Civic & Development": "নাগরিক ও উন্নয়ন",
  "Festivities & Culture": "উৎসব ও পূজা",
  "Explore Wings": "শাখাগুলি দেখুন",

  // Festival Tithis & Rituals
  "Maha Shashti": "মহাষষ্ঠী",
  "Maha Saptami": "মহাসপ্তমী",
  "Maha Ashtami": "মহাষ্টমী",
  "Maha Navami": "মহানবমী",
  "Bijoya Dashami": "বিজয়া দশমী",
  "Sandhi Puja": "সন্ধিপূজা",
  "Kumari Puja": "কুমারী পূজা",
  "Nabapatrika Sthan": "নবপত্রিকা স্নান ও স্থাপন",
  "Nabapatrika Snan & Puja": "নবপত্রিকা স্নান ও সপ্তমী বিহিত পূজা",
  "Pushpanjali": "পুষ্পাঞ্জli",
  "Idol Immersion": "প্রতিমা নিরঞ্জন",
  "Sindur Khela": "সিঁদুর খেলা",
  "Bhog & Special Arati": "ভোগ ও বিশেষ আরতি",
  "Pandal Artist": "মণ্ডপ শিল্পী",
  "Idol Sculptor": "প্রতিমা শিল্পী",
  "Lighting & Illumination": "আলোকসজ্জা",
  "Pandal Construction & Decor": "মণ্ডপ নির্মাণ ও সজ্জা",
  "Pandal Construction": "মণ্ডপ নির্মাণ",
  "Idol & Sculpting": "প্রতিমা নির্মাণ",
  "Lighting & Electrical": "আলোকসজ্জা ও বিদ্যুৎ",
  "Bhog & Hospitality": "ভোগ ও আপ্যায়ন",
  "Cultural Programs": "সাংস্কৃতিক অনুষ্ঠান",
  "Publicity & Media": "প্রচার ও মিডিয়া",
  "Audit Report": "অডিট রিপোর্ট",
  "Audited Statement": "নিরীক্ষিত আর্থিক বিবরণী",

  // Artists
  "Shilpa Niketan": "শিল্প নিকেতন",
  "Sanatan Rudra Paul": "সনাতন রুদ্র পাল",
  "Soumen Paul": "সৌমেন পাল",
  "Das Electric": "দাস ইলেকট্রিক",
  "Royal Lights": "রয়েল লাইটস",

  // Finance
  "Sample Durga Puja Budget 2026": "নমুনা দুর্গাপূজা বাজেট ২০২৬",
  "Road Repairs & Drainage Dredging": "রাস্তা সংস্কার ও জলনিকাশি",
  "Sports Tournaments & Celebrations": "ক্রীড়া টুর্নামেন্ট ও উৎসব",

  // Gallery programs & categories
  "Social Work": "সমাজসেবা ও রক্তদান",
  "Annual Sports": "বার্ষিক ক্রীড়া",
  "Cultural Event": "সাংস্কৃতিক সন্ধ্যা",
  "Idol & Pandal": "প্রতিমা ও মণ্ডপ",
  "Rituals & Prayers": "পূজা ও অঞ্জলি",
  "Rituals & Anjali": "পূজা ও অঞ্জলি",
  "Sindur Khela": "সিঁদুর খেলা",
  "Sports": "ক্রীড়া",
  "Blood Donation": "রক্তদান",
  "Cultural": "সংস্কৃতি",
  "Roads": "রাস্তা ও আলো",
  "Greenery": "সবুজায়ন",
  "Sanitation": "পরিচ্ছন্নতা",
  "Meetings": "নাগরিক সভা",
  "General": "সাধারণ",
  "All Photos": "সব ছবি",

  // Emergency & Diya Widgets
  "Important Update": "জরুরি ঘোষণা",
  "Understood": "বুঝেছি",
  "Offering Presented": "শ্রদ্ধার্ঘ্য নিবেদিত",
  "Light a Diya": "প্রদীপ জ্বালান",
  "Devotees": "ভক্ত",
  "With sound": "শব্দ সহ",
  "Term: 2026–2028": "কার্যকাল: ২০২৬–২০২৮"
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
  "হিসাব নিকাশ ও অডিট": "Accounts & Audit",
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
  "বড় করে দেখুন": "Zoom",
  "আগের দিন": "Prev",
  "পরের দিন": "Next",

  // Roles & Variations (including visarga and hyphens)
  "সভাপতি": "President",
  "কার্যকরী সভাপতি": "Working President",
  "সহ-সভাপতি": "Vice President",
  "সহঃ সভাপতি": "Vice President",
  "সহ সভাপতি": "Vice President",
  "সাধারণ সম্পাদক": "General Secretary",
  "সম্পাদক": "Secretary",
  "যুগ্ম সম্পাদক": "Joint Secretary",
  "সহ-সম্পাদক": "Assistant Secretary",
  "সহঃ সম্পাদক": "Assistant Secretary",
  "সহ সম্পাদক": "Assistant Secretary",
  "কোষাধ্যক্ষ": "Treasurer",
  "সহ-কোষাধ্যক্ষ": "Asst. Treasurer",
  "সহঃ কোষাধ্যক্ষ": "Asst. Treasurer",
  "সহ কোষাধ্যক্ষ": "Asst. Treasurer",
  "ক্রীড়া সম্পাদক": "Sports Secretary",
  "সহ-ক্রীড়া সম্পাদক": "Asst. Sports Secretary",
  "সহঃ ক্রীড়া সম্পাদক": "Asst. Sports Secretary",
  "সহ ক্রীড়া সম্পাদক": "Asst. Sports Secretary",
  "সাংস্কৃতিক সম্পাদক": "Cultural Secretary",
  "কার্যকরী সদস্য": "Executive Member",
  "সহযোগী সদস্য": "Associate Member",
  "উপদেষ্টা": "Advisor",
  "প্রধান পৃষ্ঠপোষক": "Chief Patron",
  "পরিকাঠামো আহ্বায়ক": "Infrastructure Convener",
  "পরিচ্ছন্নতা ও স্বাস্থ্য": "Sanitation & Health Convener",
  "প্রবীণ নাগরিক সমন্বয়ক": "Senior Citizens Coordinator",

  // Community
  "বাঁশদ্রোণী সোনালী পার্ক": "Bansdroni Sonali Park",
  "বাঁশদ্রোণী সোনালী সঙ্ঘ": "Bansdroni Sonali Sangha",
  "সোনালী সঙ্ঘ": "Sonali Sangha",
  "সোনালী সংঘ": "Sonali Sangha",
  "সোনালী সঙ্ঘ ক্লাব": "Sonali Sangha Club",
  "সোনালী পার্ক": "Sonali Park",
  "সোনালী পার্ক ক্লাব": "Sonali Park Club",
  "উন্নয়ন সমিতি": "Unnayan Samiti",
  "সোনালী পার্ক উন্নয়ন সমিতি": "Sonali Park Unnayan Samiti",
  "ক্লাব ও পূজা পরিচালনা কমিটি": "Club & Puja Committee",
  "সুরক্ষিত অ্যাডমিন সেশন": "Authorized Secure Session",
  "তিন স্তম্ভ": "Three Pillars",
  "আমাদের তিন স্তম্ভ": "Our Three Pillars",
  "পাড়ার তিন স্তম্ভ": "Community Pillars",
  "শারদীয়া দুর্গোৎসব": "Sharadiya Durga Puja",
  "ক্লাব ও ক্রীড়া": "Club & Sports",
  "নাগরিক ও উন্নয়ন": "Civic & Development",
  "উৎসব ও পূজা": "Festivities & Culture",
  "শাখাগুলি দেখুন": "Explore Wings",

  // Tithis & Rituals
  "মহাষষ্ঠী": "Maha Shashti",
  "মহাসপ্তমী": "Maha Saptami",
  "মহাষ্টমী": "Maha Ashtami",
  "মহানবমী": "Maha Navami",
  "বিজয়া দশমী": "Bijoya Dashami",
  "সন্ধিপূজা": "Sandhi Puja",
  "কুমারী পূজা": "Kumari Puja",
  "নবপত্রিকা স্নান ও স্থাপন": "Nabapatrika Sthan",
  "নবপত্রিকা স্নান ও সপ্তমী বিহিত পূজা": "Nabapatrika Snan & Puja",
  "পুষ্পাঞ্জলি": "Pushpanjali",
  "প্রতিমা নিরঞ্জন": "Idol Immersion",
  "সিঁদুর খেলা": "Sindur Khela",
  "ভোগ ও বিশেষ আরতি": "Bhog & Special Arati",
  "মণ্ডপ শিল্পী": "Pandal Artist",
  "প্রতিমা শিল্পী": "Idol Sculptor",
  "আলোকসজ্জা": "Lighting & Illumination",
  "মণ্ডপ নির্মাণ ও সজ্জা": "Pandal Construction & Decor",
  "মণ্ডপ নির্মাণ": "Pandal Construction",
  "প্রতিমা নির্মাণ": "Idol & Sculpting",
  "আলোকসজ্জা ও বিদ্যুৎ": "Lighting & Electrical",
  "ভোগ ও আপ্যায়ন": "Bhog & Hospitality",
  "সাংস্কৃতিক অনুষ্ঠান": "Cultural Programs",
  "প্রচার ও মিডিয়া": "Publicity & Media",
  "অডিট রিপোর্ট": "Audit Report",
  "নিরীক্ষিত আর্থিক বিবরণী": "Audited Statement",

  // Artists
  "শিল্প নিকেতন": "Shilpa Niketan",
  "সনাতন রুদ্র পাল": "Sanatan Rudra Paul",
  "সৌমেন পাল": "Soumen Paul",
  "দাস ইলেকট্রিক": "Das Electric",
  "রয়েল লাইটস": "Royal Lights",

  // Theme Titles
  "অতীতের আয়নায় আগামী": "Reflections of the Past, Visions of the Future",
  "অতীতের আয়নায় আগামী": "Reflections of the Past, Visions of the Future",
  "অতীতের ঐতিহ্যে আগামী দিনের স্বপ্ন": "Reflections of the Past, Visions of the Future",

  // Puja Event Titles
  "মহাষষ্ঠী — কল্পরম্ভা, দেবীর বোধন ও অধিবাস": "Maha Shashti — Kalparambha, Bodhon & Adhibas",
  "মহাষষ্ঠী — কল্পারম্ভ, দেবীর বোধন ও অধিবাস": "Maha Shashti — Kalparambha, Bodhon & Adhibas",
  "কল্পরম্ভা, দেবীর বোধন ও অধিবাস": "Kalparambha, Bodhon & Adhibas",
  "কল্পারম্ভ, দেবীর বোধন ও অধিবাস": "Kalparambha, Bodhon & Adhibas",
  "মহাসপ্তমী — নবপত্রিকা স্নান ও সপ্তমী বিহিত পূজা": "Maha Saptami — Nabapatrika Snan & Saptami Puja",
  "মহাষ্টমী — অঞ্জলি, কুমারী পূজা ও সন্ধিপূজা": "Maha Ashtami — Anjali, Kumari & Sandhi Puja",
  "অঞ্জলি, কুমারী পূজা ও সন্ধিপূজা": "Pushpanjali, Kumari & Sandhi Puja",
  "পুষ্পাঞ্জলি, কুমারী পূজা ও সন্ধিপূজা": "Pushpanjali, Kumari & Sandhi Puja",
  "মহানবমী — নবমী বিহিত পূজা, মহাহোম ও ভোগ বিতরণ": "Maha Navami — Navami Puja, Maha Homa & Bhog",
  "নবমী বিহিত পূজা, মহাহোম ও ভোগ বিতরণ": "Navami Puja, Maha Homa & Bhog Distribution",
  "মহাহোম, যজ্ঞ ও মহাভোগ বিতরণ": "Maha Homa, Yajna & Mahabhog Distribution",
  "বিজয়া দশমী — দর্পণ বিসর্জন, সিঁদুর খেলা ও প্রতিমা নিরঞ্জন": "Bijoya Dashami — Darpan Bisarjan, Sindur Khela & Immersion",
  "দর্পণ বিসর্জন, সিঁদুর খেলা ও প্রতিমা নিরঞ্জন": "Darpan Bisarjan, Sindur Khela & Immersion",
  "দর্পণ বিসর্জন, সিঁদুর খেলা ও বরণ": "Darpan Bisarjan, Sindur Khela & Baran",

  // Ritual steps and sentences
  "সকাল ৮:০০ টায় দেবীর কল্পরম্ভা ও ষষ্ঠী বিহিত পূজা": "8:00 AM · Kalparambha & Shashti Puja",
  "দেবীর কল্পরম্ভা ও ষষ্ঠী বিহিত পূজা": "Kalparambha & Shashti Puja",
  "সন্ধ্যা ৬:৩০ টায় দেবীর বোধন, আমন্ত্রণ ও অধিবাস": "6:30 PM · Bodhon, Amantran & Adhibas",
  "দেবীর বোধন, আমন্ত্রণ ও অধিবাস": "Bodhon, Amantran & Adhibas",
  "রাত ৮:০০ টায় মণ্ডপ ও প্রতিমা শুভ দ্বার উন্মোচন": "8:00 PM · Pandal & Deity Inauguration",
  "মণ্ডপ ও প্রতিমা শুভ দ্বার উন্মোচন": "Grand Inauguration of Pandal & Deity",
  "ভোর ৬:৩০ টায় গঙ্গার পবিত্র জলে নবপত্রিকা (কলাবউ) স্নান ও প্রবেশ": "6:30 AM · Holy Ganges Bath of Nabapatrika",
  "গঙ্গার পবিত্র জলে নবপত্রিকা (কলাবউ) স্নান ও প্রবেশ": "Holy Ganges Bath & Installation of Nabapatrika",
  "সকাল ৮:৩০ টায় সপ্তমী বিহিত পূজা ও সকাল ১০:০০ টায় পুষ্পাঞ্জলি": "8:30 AM · Saptami Puja & 10:00 AM · Pushpanjali",
  "সপ্তমী বিহিত পূজা ও সকাল ১০:০০ টায় পুষ্পাঞ্জলি": "Saptami Vihita Puja & 10:00 AM Pushpanjali",
  "রাত ৮:০০ টায় সান্ধ্য আরতি": "8:00 PM · Evening Sandhyarati",
  "সান্ধ্য আরতি": "Evening Sandhyarati",
  "সকাল ৮:৩০ টায় মহাষ্টমী বিহিত পূজা": "8:30 AM · Maha Ashtami Vihita Puja",
  "মহাষ্টমী বিহিত পূজা": "Maha Ashtami Vihita Puja",
  "সকাল ৯:৪৫ টায় সার্বজনীন পুষ্পাঞ্জলি": "9:45 AM · Grand Pushpanjali",
  "সার্বজনীন পুষ্পাঞ্জলি": "Grand Community Pushpanjali",
  "সন্ধিপূজা ও ১০৮ প্রদীপ প্রজ্জ্বলন": "Sandhi Puja & 108 Sacred Diya Lighting",
  "সকাল ১১:৩০ টায় কুমারী পূজা": "11:30 AM · Sacred Kumari Puja",
  "কুমারী পূজা": "Sacred Kumari Puja",
  "রাত ৮:০০ টায় ধুনুচি আরতি": "8:00 PM · Traditional Dhunuchi Dance & Arati",
  "ধুনুচি আরতি": "Traditional Dhunuchi Dance & Arati",
  "সকাল ৯:০০ টায় মহানবমী বিহিত পূজা ও অঞ্জলি": "9:00 AM · Maha Navami Puja & Anjali",
  "মহানবমী বিহিত পূজা ও অঞ্জলি": "Maha Navami Vihita Puja & Anjali",
  "সকাল ১১:০০ টায় মহাহোম ও নবমী যজ্ঞ": "11:00 AM · Maha Homa & Sacred Navami Yajna",
  "মহাহোম ও নবমী যজ্ঞ": "Maha Homa & Sacred Navami Yajna",
  "দুপুর ১:০০ টায় সর্বস্তরের ভক্তদের মাঝে মহাভোগ বিতরণ": "1:00 PM · Community Mahabhog Distribution",
  "সর্বস্তরের ভক্তদের মাঝে মহাভোগ বিতরণ": "Community Mahabhog Prasad Distribution",
  "রাত ৮:৩০ টায় বিশেষ সাংস্কৃতিক অনুষ্ঠান": "8:30 PM · Special Cultural Gala Performance",
  "বিশেষ সাংস্কৃতিক অনুষ্ঠান": "Special Cultural Gala Performance",
  "সকাল ৮:৩০ টায় দশমী বিহিত পূজা ও সমাপন": "8:30 AM · Dashami Puja Concluding Rites",
  "দশমী বিহিত পূজা ও সমাপন": "Dashami Puja Concluding Rites",
  "সকাল ৯:৪৫ টায় দর্পণ বিসর্জন": "9:45 AM · Sacred Mirror Immersion (Darpan Bisarjan)",
  "দর্পণ বিসর্জন": "Sacred Mirror Immersion (Darpan Bisarjan)",
  "সকাল ১০:৩০ টা থেকে ঐতিহ্যবাহী সিঁদুর খেলা ও দেবী বরণ": "10:30 AM · Traditional Sindur Khela & Devi Baran",
  "ঐতিহ্যবাহী সিঁদুর খেলা ও দেবী বরণ": "Traditional Sindur Khela & Devi Baran",
  "বিকেল ৫:০০ টায় প্রতিমা নিরঞ্জন শোভাযাত্রা ও মিষ্টিমুখ": "5:00 PM · Idol Immersion Procession & Sweets",
  "প্রতিমা নিরঞ্জন শোভাযাত্রা ও মিষ্টিমুখ": "Idol Immersion Procession & Sweets Distribution",

  // Notice titles & body lookups
  "দুর্গাপূজা ২০২৬ — প্রোগ্রাম শীঘ্রই প্রকাশিত হবে": "Durga Puja 2026 — Schedule Releasing Soon",
  "এটি নমুনা নোটিশ। অফিসিয়াল সময়সূচি Admin Panel থেকে আপডেট করা যাবে।": "Official circular. Complete timings can be updated via the Admin Panel.",
  "স্বাগতম — Bansdroni Sonali Park": "Welcome to Bansdroni Sonali Park",
  "দুর্গাপূজা ২০২৬, পাড়ার অনুষ্ঠান, সামাজিক কাজ ও আর্থিক তথ্যের অফিসিয়াল পোর্টাল।": "Official portal for Durga Puja 2026, social welfare, cultural events, and verified accounts.",
  "বার্ষিক ফুটবল ও ক্রিকেট টুর্নামেন্ট ২০২৬ খেলোয়াড় রেজিস্ট্রেশন": "Annual Football & Cricket Tournament 2026 Player Registration",
  "সোনালী সঙ্ঘের বাৎসরিক ফুটবল ও ক্রিকেট টুর্নামেন্টের দল গঠন প্রক্রিয়া শুরু হয়েছে। পাড়ার আগ্রহী তরুণ ও যুবকদের আগামী ১৫ দিনের মধ্যে ক্লাবের ক্রীড়া সম্পাদকের সাথে যোগাযোগ করার অনুরোধ জানানো হচ্ছে।": "Player registration has opened for Sonali Sangha's Annual Football & Cricket Tournament. Interested neighborhood youth are requested to contact the Sports Secretary within 15 days.",
  "স্বেচ্ছায় রক্তদান ও বিনামূল্যে স্বাস্থ্য পরীক্ষা শিবির": "Voluntary Blood Donation & Free Health Screening Camp",
  "সোনালী সঙ্ঘ ক্লাবের উদ্যোগে আগামী রবিবার সকাল ৯টা থেকে ক্লাব ভবনে বাৎসরিক রক্তদান ও চক্ষু পরীক্ষা শিবির অনুষ্ঠিত হবে। পাড়ার সকল নাগরিককে অংশগ্রহণ করে এই মহৎ উদ্যোগকে সফল করার আবেদন জানানো হচ্ছে।": "An annual voluntary blood donation and eye examination camp will be held at the club premises next Sunday starting 9:00 AM. All residents are invited.",
  "সাংস্কৃতিক সন্ধ্যা ও রবীন্দ্র-নজরুল জয়ন্তী মহড়া সময়সূচি": "Cultural Evening Rehearsal & Audition Schedule",
  "আসন্ন সাংস্কৃতিক অনুষ্ঠানের জন্য সংগীত, নৃত্য ও নাটক বিভাগের নিয়মিত মহড়া প্রতি মঙ্গলবার ও শুক্রবার সন্ধ্যা ৬টা থেকে ক্লাব মঞ্চে অনুষ্ঠিত হবে।": "Regular rehearsals for upcoming cultural concerts in music, dance, and drama will be held every Tuesday and Friday at 6:00 PM on the club stage.",
  "বর্ষাপূর্ব ড্রেন পরিষ্কার ও ডেঙ্গি প্রতিরোধ স্প্রে অভিযান": "Pre-Monsoon Drainage Cleaning & Anti-Dengue Spray Drive",
  "আসন্ন বর্ষা মৌসুমের পূর্বে সোনালী পার্কের প্রতিটি লেনের প্রধান ড্রেন পলি পরিষ্কার এবং মশা নিধনে ব্লিচিং ও লার্ভিসাইড স্প্রে করা হবে। বাসিন্দাদের নিকাশি নালায় কোনো ধরনের প্লাস্টিক বর্জ্য না ফেলার জন্য বিশেষ অনুরোধ জানানো হচ্ছে।": "Intensive drain desilting and anti-larval chemical spraying will be conducted across all neighborhood lanes before monsoon. Residents are requested not to dump plastic in drains.",
  "পাড়ার আবাসিকদের বার্ষিক সাধারণ সভা ও নাগরিক সনদ পর্যালোচনা": "Annual General Meeting of Residents & Civic Charter Review",
  "উন্নয়ন সমিতির বাৎসরিক সাধারণ সভা (AGM) আগামী মাসে অনুষ্ঠিত হবে। বিগত বছরের অডিট রিপোর্ট পেশ, পাড়ার নতুন সিসিটিভি ক্যামেরা স্থাপন ও রাতের নিরাপত্তা ব্যবস্থা নিয়ে আলোচনা হবে। সকল আবাসিক পরিবারের উপস্থিতি কাম্য।": "The Annual General Meeting (AGM) of Unnayan Samiti will take place next month to review audit reports, new CCTV surveillance nodes, and night security.",
  "নতুন এলইডি পথবাতি রক্ষণাবেক্ষণ ও হেল্পলাইন বিজ্ঞপ্তি": "LED Streetlight Infrastructure & Maintenance Helpline",
  "পাড়ার কোনো লেনের পথবাতি অকেজো হলে বা আলো সংক্রান্ত কোনো সমস্যা দেখা দিলে অবিলম্বে সমিতির জরুরি হেল্পলাইনে অথবা বৈদ্যুতিক আহ্বায়কের সাথে যোগাযোগ করার অনুরোধ জানানো হচ্ছে।": "If any streetlight in your lane is defective, please immediately report to the Samiti Civic Helpline or Electrical Convener for prompt repair.",

  // Finance titles
  "Sample Durga Puja Budget 2026": "Sample Durga Puja Budget 2026",
  "রাস্তা সংস্কার ও জলনিকাশি": "Road Repairs & Drainage Dredging",
  "ক্রীড়া টুর্নামেন্ট ও উৎসব": "Sports Tournaments & Celebrations",

  // Gallery programs & categories
  "সমাজসেবা ও রক্তদান": "Social Work",
  "বার্ষিক ক্রীড়া": "Annual Sports",
  "সাংস্কৃতিক সন্ধ্যা": "Cultural Events",
  "প্রতিমা ও মণ্ডপ": "Idol & Pandal",
  "পূজা ও অঞ্জলি": "Rituals & Prayers",
  "সিঁদুর খেলা": "Sindur Khela",
  "ক্রীড়া": "Sports",
  "রক্তদান": "Blood Donation",
  "সংস্কৃতি": "Cultural",
  "রাস্তা ও আলো": "Roads & Lights",
  "সবুজায়ন": "Greenery",
  "পরিচ্ছন্নতা": "Sanitation",
  "নাগরিক সভা": "Meetings",
  "সাধারণ": "General",
  "সব ছবি": "All Photos",

  // Emergency & Diya Widgets
  "জরুরি ঘোষণা": "Important Update",
  "বুঝেছি": "Understood",
  "শ্রদ্ধার্ঘ্য নিবেদিত": "Offering Presented",
  "প্রদীপ জ্বালান": "Light a Diya",
  "ভক্ত": "Devotees",
  "শব্দ সহ": "With sound",
  "কার্যকাল: ২০২৬–২০২৮": "Term: 2026–2028",

  // Site Hero taglines
  "🍁 শরতের নীল আকাশ আর শিউলির গন্ধে মেতেছে বাঁশদ্রোণী... সোনালী পার্কে মা আসছেন বছর ঘুরে! ৭৪তম বর্ষের মহা উৎসবে আপনাদের সাদর আমন্ত্রণ 🙏": "🍁 Autumn skies and the sweet fragrance of Shiuli fill the air in Bansdroni... Maa Durga arrives once more at Sonali Park! Heartfelt welcome to our 74th Grand Celebrations 🙏",
  "বাঁশদ্রোণী সোনালী পার্কের সংস্কৃতি, ক্রীড়া ও যুবকল্যাণের প্রাণকেন্দ্র। খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান এবং রক্তদান শিবিরের মাধ্যমে সমাজের সেবায় আমরা নিয়োজিত।": "The athletic, cultural, and youth epicenter of Bansdroni Sonali Park. Fostering sporting excellence, cultural unity, and humanitarian welfare since 1952.",
  "আমাদের পাড়ার নিরাপত্তা, পরিচ্ছন্নতা, রাস্তাঘাট ও নাগরিকদের দৈনন্দিন স্বাচ্ছন্দ্য রক্ষায় সার্বক্ষণিক নিয়োজিত রেজিস্টার্ড উন্নয়ন পরিষদ।": "The registered Residents Welfare Association stewarding civic infrastructure, neighborhood security, green cleanliness, and resident welfare in Bansdroni Sonali Park.",

  // Seed notice bodies
  "এটি নমুনা নোটিশ। অফিসিয়াল সময়সূচি Admin থেকে যোগ করুন।": "Sample notice. Update official timetable from the Admin panel.",
  "এটি নমুনা নোটিশ। অফিসিয়াল সময়সূচি Admin Panel থেকে আপডেট করা যাবে।": "Official circular. Complete timings can be updated via the Admin Panel.",
  "স্বাগতম — Bansdroni Sonali Park": "Welcome — Bansdroni Sonali Park",
  "দুর্গাপূজা ২০২৬, পাড়ার অনুষ্ঠান, সামাজিক কার্যক্রম ও গুরুত্বপূর্ণ খবর এক জায়গায়।": "Durga Puja 2026, community events, social welfare, and verified announcements in one place."
};

// Known member name mapping between Bengali & English
const MEMBER_NAME_MAP = {
  // Puja Leaders
  "শ্রী মৃণাল কান্তি রায়": "Sri Mrinal Kanti Roy",
  "মৃণাল কান্তি রায়": "Mrinal Kanti Roy",
  "শ্রী রাধেশ্যাম দাস": "Sri Radheshyam Das",
  "রাধেশ্যাম দাস": "Radheshyam Das",
  "শ্রী তপন কুমার পাল": "Sri Tapan Kumar Pal",
  "তপন কুমার পাল": "Tapan Kumar Pal",
  "শ্রী ঝন্টু দাস": "Sri Jhantu Das",
  "ঝন্টু দাস": "Jhantu Das",
  "শ্রী বান্টি হালদার": "Sri Bunty Halder",
  "বান্টি হালদার": "Bunty Halder",
  "শ্রী তপন হালদার": "Sri Tapan Halder",
  "তপন হালদার": "Tapan Halder",

  // Club Leaders
  "রবি জানা": "Rabi Jana",
  "ছোটকা দাস": "Chotka Das",
  "ছোটকা দাস (বাপি)": "Chotka Das (Bapi)",
  "তরুণ দেবনাথ": "Tarun Debnath",
  "নৃপেন সাহা": "Nripen Saha",
  "সুরজিৎ সরকার": "Surajit Sarkar",
  "অরূপ মল্লিক": "Arup Mullick",
  "শুভজিৎ মালো": "Subhajit Malo",
  "শুভজিৎ মালো (সনু)": "Subhajit Malo (Sonu)",
  "অভিষেক চৌধুরী": "Avisek Choudhury",
  "অভিষেক চৌধুরী (শিবা)": "Avisek Choudhury (Shiba)",
  "রবি গোস্বামী": "Ravi Goswami",
  "অমল দাস": "Amal Das",
  "অমল দাস (বাবাই)": "Amal Das (Babai)",
  "আকাশ জানা": "Akash Jana",
  "অতনু দত্ত": "Atanu Dutta",
  "অতনু দত্ত (টুটু)": "Atanu Dutta (Tutu)",
  "পিংকি কুণ্ডু": "Pinki Kundu",
  "স্নেহা ঘোষ": "Sneha Ghosh",
  "দেবাশীষ দেওয়ান": "Debasish Dewan",
  "সঞ্জয় মণ্ডল": "Sanjoy Mondal",
  "সঞ্জয় মণ্ডল (বাবাই)": "Sanjoy Mondal (Babai)",

  // Samiti Leaders
  "শ্রী পার্থসারথি সেনগুপ্ত": "Sri Partha Sarathi Sengupta",
  "পার্থসারথি সেনগুপ্ত": "Partha Sarathi Sengupta",
  "শ্রী অসীম চ্যাটার্জি": "Sri Ashim Chatterjee",
  "অসীম চ্যাটার্জি": "Ashim Chatterjee",
  "শ্রী সুশান্ত রায়": "Sri Sushanta Roy",
  "সুশান্ত রায়": "Sushanta Roy",
  "শ্রী ভাস্কর মজুমদার": "Sri Bhaskar Majumdar",
  "ভাস্কর মজুমদার": "Bhaskar Majumdar",
  "শ্রী নারায়ণ ঘোষ": "Sri Narayan Ghosh",
  "নারায়ণ ঘোষ": "Narayan Ghosh",
  "শ্রী তপন ভট্টাচার্য": "Sri Tapan Bhattacharya",
  "তপন ভট্টাচার্য": "Tapan Bhattacharya",
  "শ্রীমতী সোমা মুখার্জি": "Srimati Soma Mukherjee",
  "সোমা মুখার্জি": "Soma Mukherjee",
  "শ্রী অলোক চক্রবর্তী": "Sri Aloke Chakraborty",
  "অলোক চক্রবর্তী": "Aloke Chakraborty"
};

// Reverse name mapping (English -> Bengali)
const MEMBER_NAME_REV_MAP = {};
Object.entries(MEMBER_NAME_MAP).forEach(([bn, en]) => {
  MEMBER_NAME_REV_MAP[en] = bn;
  MEMBER_NAME_REV_MAP[en.toUpperCase()] = bn;
});

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

  // Lookup translation in dictionary with normalization
  const t = (text, targetLang = lang) => {
    if (!text) return '';
    const trimmed = String(text).trim();
    if (targetLang === 'bn') {
      if (dictBn[trimmed]) return dictBn[trimmed];
      // Try without quotes
      const cleanQuotes = trimmed.replace(/^["'“]/, '').replace(/["'”]$/, '').trim();
      if (dictBn[cleanQuotes]) return dictBn[cleanQuotes];
      return text;
    } else {
      if (dictEn[trimmed]) return dictEn[trimmed];
      // Try without quotes
      const cleanQuotes = trimmed.replace(/^["'“]/, '').replace(/["'”]$/, '').trim();
      if (dictEn[cleanQuotes]) return dictEn[cleanQuotes];
      // Try stripping wing prefixes like [Club], [Samiti], [Puja]
      const cleanPrefix = trimmed.replace(/^\[(Club|Samiti|Puja)\]\s*/i, '').trim();
      if (dictEn[cleanPrefix]) return dictEn[cleanPrefix];
      return text;
    }
  };

  // Helper for committee roles with normalization of visargas and hyphens
  const tRole = (roleStr, targetLang = lang) => {
    if (!roleStr) return '';
    let clean = String(roleStr).trim();
    // Strip wing tag and phone
    clean = clean.replace(/^\[(Club|Samiti|Puja)\]\s*/i, '').trim();
    if (clean.includes('|')) {
      clean = clean.split('|')[0].trim();
    }

    if (targetLang === 'bn') {
      if (dictBn[clean]) return dictBn[clean];
      // Normalize to hyphenated form if it's Bengali with visarga
      clean = clean.replace(/সহঃ/g, 'সহ-').replace(/সহ\s+/g, 'সহ-');
      return clean;
    } else {
      if (dictEn[clean]) return dictEn[clean];
      // Normalize Bengali visarga/colon and retry
      const normalizedBn = clean.replace(/সহঃ/g, 'সহ-').replace(/সহ\s+/g, 'সহ-').trim();
      if (dictEn[normalizedBn]) return dictEn[normalizedBn];
      return clean;
    }
  };

  // Helper for committee member names
  const tName = (rawName, targetLang = lang) => {
    if (!rawName) return '';
    const str = String(rawName).trim();
    
    // Extract English name if present in parentheses e.g. "রবি জানা (RABI JANA)"
    const parenMatches = [...str.matchAll(/\(([^)]+)\)/g)].map(m => m[1].trim());
    let extractedEnglish = '';
    parenMatches.forEach(item => {
      if (/[a-zA-Z]/.test(item)) {
        extractedEnglish = item;
      }
    });

    const mainName = str.replace(/\([^)]+\)/g, '').trim();

    if (targetLang === 'en') {
      if (extractedEnglish) {
        // Format to Title Case if ALL CAPS (e.g. "RABI JANA" -> "Rabi Jana")
        const formatted = extractedEnglish
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
        
        // Add honorific if mainName had Sri
        if (mainName.startsWith('শ্রী ') && !formatted.toLowerCase().startsWith('sri')) {
          return `Sri ${formatted}`;
        }
        if (mainName.startsWith('শ্রীমতী ') && !formatted.toLowerCase().startsWith('srimati')) {
          return `Srimati ${formatted}`;
        }
        return formatted;
      }
      return MEMBER_NAME_MAP[mainName] || MEMBER_NAME_MAP[str] || mainName;
    } else {
      // Bengali
      return MEMBER_NAME_REV_MAP[mainName] || mainName;
    }
  };

  // Helper for member nicknames
  const tNickname = (nick, targetLang = lang) => {
    if (!nick) return '';
    const clean = String(nick).trim().replace(/^["'“]/, '').replace(/["'”]$/, '');
    const nicknameMap = {
      'বাপি': 'Bapi',
      'সনু': 'Sonu',
      'শিবা': 'Shiba',
      'বাবাই': 'Babai',
      'টুটু': 'Tutu',
      'Bapi': 'বাপি',
      'Sonu': 'সনু',
      'Shiba': 'শিবা',
      'Babai': 'বাবাই',
      'Tutu': 'টুটু'
    };
    return nicknameMap[clean] || clean;
  };

  // Helper function to return language specific string
  const b = (bnText, enText) => (lang === 'bn' ? bnText : enText);

  const value = useMemo(() => ({
    lang,
    changeLanguage,
    t,
    tRole,
    tName,
    tNickname,
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
