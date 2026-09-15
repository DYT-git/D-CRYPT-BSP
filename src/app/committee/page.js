'use client';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { User, ShieldCheck } from 'lucide-react';
import YearSelector from "@/components/YearSelector";

export default function CommitteePage() {
  const { data, selectedYear } = useData();
  const { lang, b, t, toDigits } = useLanguage();
  const members = data.members.filter(m => m.year === selectedYear);

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-24 sm:pt-28 pb-24 selection:bg-brand-maroon selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearSelector />
      </div>

      {/* ═══ Symmetrical 3-Tier Header ═══ */}
      <header className="max-w-3xl mx-auto text-center mt-10 sm:mt-12 mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon animate-pulse" />
          {b('নেতৃত্ব ও পরিচালনা', 'Leadership & Governance')} • {toDigits(selectedYear)}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight leading-tight">
          {b('আমাদের পরিচালনা', 'Executive')} <span className="text-brand-maroon">{b('কমিটি', 'Committee')}</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-stone-600 font-light leading-relaxed">
          {b(
            'বাঁশদ্রোণী সোনালী পার্কের সার্বিক উন্নয়ন ও ঐতিহ্যবাহী দুর্গাপূজা পরিচালনার নিবেদিতপ্রাণ সদস্যবৃন্দ।',
            'Dedicated members steering the community welfare, civic development, and historic Durga Puja at Bansdroni Sonali Park.'
          )}
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {members.length > 0 ? (
          <>
            {/* ═══ 1. EXECUTIVE LEADERSHIP (High-Impact Cards) ═══ */}
            <div className="mb-16 sm:mb-20">
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-maroon" /> {b('মূল পদাধিকারী', 'Core Office Bearers')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                  {b('শীর্ষ কার্যনির্বাহী', 'Executive')} <span className="text-brand-maroon">{b('নেতৃত্ব', 'Leadership')}</span>
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 sm:gap-8 max-w-3xl mx-auto">
                {members.filter(m => ['সভাপতি', 'সম্পাদক', 'সাধারণ সম্পাদক', 'President', 'Secretary', 'General Secretary'].includes(m.role)).map((member, i) => (
                  <div
                    key={i}
                    className="group relative bg-white rounded-3xl p-5 sm:p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-stone-200/80 hover:border-brand-maroon/30"
                  >
                    {/* Top Subtle Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/40 to-transparent" />

                    {/* Squircle Avatar Frame */}
                    <div className="w-28 h-36 sm:w-36 sm:h-44 mx-auto rounded-2xl overflow-hidden border-2 border-brand-maroon/20 bg-stone-50 shadow-inner mb-4 sm:mb-5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                      ) : (
                        <User className="w-12 h-12 sm:w-14 sm:h-14 text-stone-400" />
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-2 group-hover:text-brand-maroon transition-colors">
                      {member.name}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 rounded-full bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon font-bold text-xs uppercase tracking-widest shadow-sm">
                      {t(member.role)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ 2. GENERAL COMMITTEE (Responsive Member Grid) ═══ */}
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  ✦ {b('কমিটি সদস্যবৃন্দ', 'Committee Members')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                  {b('কমিটির অন্যান্য', 'Other Esteemed')} <span className="text-brand-maroon">{b('সদস্যবৃন্দ', 'Members')}</span>
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm mt-1">
                  {b('বিভিন্ন উপ-কমিটি ও সেবামূলক কাজের দায়িত্বপ্রাপ্ত কর্মকর্তাবৃন্দ', 'Sub-committee coordinators and dedicated community welfare executives')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {members.filter(m => !['সভাপতি', 'সম্পাদক', 'সাধারণ সম্পাদক', 'President', 'Secretary', 'General Secretary'].includes(m.role)).map((member, i) => (
                  <div
                    key={i}
                    className="group relative bg-white rounded-2xl p-3.5 sm:p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-stone-200/80 hover:border-brand-maroon/30 flex flex-col items-center justify-between"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="w-full flex flex-col items-center">
                      <div className="w-20 h-24 sm:w-24 sm:h-28 mx-auto rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                        ) : (
                          <User className="w-9 h-9 sm:w-10 sm:h-10 text-stone-400" />
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-2 mb-1 group-hover:text-brand-maroon transition-colors" title={member.name}>
                        {member.name}
                      </h3>
                    </div>

                    <span className="text-[11px] sm:text-xs text-stone-500 font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200/60 mt-2">
                      {t(member.role)}
                    </span>
                  </div>
                ))}
              </div>

              {members.filter(m => !['সভাপতি', 'সম্পাদক', 'সাধারণ সম্পাদক', 'President', 'Secretary', 'General Secretary'].includes(m.role)).length === 0 && (
                <div className="text-center text-stone-400 italic py-8">
                  {b('সাধারণ সদস্যদের তালিকা শীঘ্রই আপডেট করা হবে।', 'General member list will be updated shortly.')}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white/80 rounded-3xl border border-dashed border-stone-300 text-stone-500">
            <h3 className="text-2xl font-serif">
              {b('এই বছরের কমিটির তথ্য এখনও প্রকাশ করা হয়নি।', 'Committee list for this year has not been published yet.')}
            </h3>
          </div>
        )}
      </div>
    </main>
  );
}
