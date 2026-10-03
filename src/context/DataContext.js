'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

export function DataProvider({ children }) {
  const [data, setData] = useState({
    events: [], members: [], notices: [], gallery: [], finances: []
  });
  const [settings, setSettings] = useState({
    heroHeading: 'শারদ প্রাতে মায়ের আগমন...',
    heroSubHeading: 'আনন্দ আর আলোয় সাজুক ভুবন।',
    heroTagline: '🍁 শরতের নীল আকাশ আর শিউলির গন্ধে মেতেছে বাঁশদ্রোণী... সোনালী পার্কে মা আসছেন বছর ঘুরে! ৭৪তম বর্ষের মহা উৎসবে আপনাদের সাদর আমন্ত্রণ 🙏',
    countdownDate: '2026-10-16T06:00:00+05:30',
    countdownHeading: 'মা আসছেন...',
    currentYear: '74',
    themeTitle: '"অতীতের আয়নায় আগামী"',
    themeSubtitle: '(Reflections of the Past)',
    pandalArtist: 'শিল্প নিকেতন',
    idolArtist: 'সনাতন রুদ্র পাল',
    lightingArtist: 'দাস ইলেকট্রিক',
    totalCollection: '₹ 14,50,000',
    totalExpense: '₹ 13,85,000',
    majorExpenseTitle: 'Pandal Construction',
    majorExpenseAmount: '₹ 6,00,000',
    // Club settings
    clubHeroTitle: 'সোনালী সঙ্ঘ',
    clubHeroTagline: 'বাঁশদ্রোণী সোনালী পার্কের সংস্কৃতি, ক্রীড়া ও যুবকল্যাণের প্রাণকেন্দ্র। খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান এবং রক্তদান শিবিরের মাধ্যমে সমাজের সেবায় আমরা নিয়োজিত।',
    clubTotalCollection: '₹ ৮,৫০,০০০',
    clubTotalExpense: '₹ ৭,৯৫,০০০',
    clubMajorExpenseTitle: 'ক্রীড়া টুর্নামেন্ট ও উৎসব',
    clubMajorExpenseAmount: '₹ ৩,৫০,০০০',
    // Samiti settings
    samitiHeroTitle: 'সোনালী পার্ক',
    samitiHeroTagline: 'আমাদের পাড়ার নিরাপত্তা, পরিচ্ছন্নতা, রাস্তাঘাট ও নাগরিকদের দৈনন্দিন স্বাচ্ছন্দ্য রক্ষায় সার্বক্ষণিক নিয়োজিত রেজিস্টার্ড উন্নয়ন পরিষদ।',
    samitiTotalCollection: '₹ ১২,২০,০০০',
    samitiTotalExpense: '₹ ১১,৫০,০০০',
    samitiMajorExpenseTitle: 'রাস্তা সংস্কার ও জলনিকাশি',
    samitiMajorExpenseAmount: '₹ ৫,১০,০০০'
  });
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(fetchedData => {
        if (!fetchedData.error) {
          setData(fetchedData);
          if (fetchedData.settings) {
            setSettings(prev => ({ ...prev, ...fetchedData.settings }));
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch API data", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <DataContext.Provider value={{ data, settings, selectedYear, setSelectedYear, isLoading, refreshData: () => window.location.reload() }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
