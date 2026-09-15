'use client';
import { useData, YEARS } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';

export default function YearSelector() {
  const { selectedYear, setSelectedYear, data } = useData();
  const { lang, b, toDigits } = useLanguage();

  // Check if a year has any data uploaded by admin
  const hasData = (y) => {
    if (y === 2026) return true; // Current active year is always unlocked
    return (
      (data.events && data.events.some(e => e.year === y)) ||
      (data.members && data.members.some(m => m.year === y)) ||
      (data.gallery && data.gallery.some(g => g.year === y)) ||
      (data.finances && data.finances.some(f => f.year === y))
    );
  };

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-stone-200/80 shadow-sm w-max mx-auto mb-8">
      <span className="text-gray-500 font-bold tracking-widest uppercase text-xs">
        {b('আর্কাইভ বর্ষ:', 'Viewing Archive:')}
      </span>
      <select 
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="bg-[#FAF7F2] text-brand-maroon font-bold px-4 py-1 rounded-full outline-none focus:ring-2 focus:ring-brand-maroon/30 cursor-pointer"
      >
        {YEARS.map(y => {
          const available = hasData(y);
          return (
            <option key={y} value={y} disabled={!available}>
              {toDigits(y, lang)} {!available ? '🔒' : ''}
            </option>
          );
        })}
      </select>
    </div>
  );
}
