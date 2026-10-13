'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { User, ShieldCheck, Phone } from 'lucide-react';
import YearSelector from "@/components/YearSelector";
import { 
  DurgaDeviEmblemIcon, 
  ClubCrestIcon, 
  SamitiEmblemIcon, 
  FestiveWaveAccent, 
  WashiTapePin, 
  BinderHoles, 
  TornDeckleEdge 
} from '@/components/HeritageIcons';

function parseMemberRole(role) {
  if (!role) return { wing: 'Puja', cleanRole: '', phone: '' };
  let wing = 'Puja';
  let rest = role;
  if (rest.startsWith('[Club]')) { wing = 'Club'; rest = rest.replace('[Club]', '').trim(); }
  else if (rest.startsWith('[Samiti]') || rest.startsWith('[Samity]')) { wing = 'Samiti'; rest = rest.replace(/^\[(Samiti|Samity)\]/, '').trim(); }
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

function parseMemberNameDetails(rawName) {
  if (!rawName) return { mainName: '', nickname: '', englishName: '' };
  const parenMatches = [...rawName.matchAll(/\(([^)]+)\)/g)].map(m => m[1].trim());
  let nickname = '';
  let englishName = '';
  parenMatches.forEach(item => {
    if (/[a-zA-Z]/.test(item)) {
      englishName = item;
    } else {
      nickname = item;
    }
  });
  const mainName = rawName.replace(/\([^)]+\)/g, '').trim();
  return { mainName, nickname, englishName };
}

const FALLBACK_PUJA_MEMBERS = [
  { id: 1, year: 2026, name: "শ্রী মৃণাল কান্তি রায়", role: "সভাপতি", image: "/assets/avatars/president.svg" },
  { id: 2, year: 2026, name: "শ্রী রাধেশ্যাম দাস", role: "সহঃ সভাপতি", image: "/assets/avatars/vice-president.svg" },
  { id: 3, year: 2026, name: "শ্রী তপন কুমার পাল", role: "সম্পাদক", image: "/assets/avatars/tapan-kumar-pal.jpg" },
  { id: 4, year: 2026, name: "শ্রী ঝন্টু দাস", role: "সহঃ সম্পাদক", image: "/assets/avatars/jhantu-das.png" },
  { id: 5, year: 2026, name: "শ্রী বান্টি হালদার", role: "কোষাধ্যক্ষ", image: "/assets/avatars/bunty-halder.png" },
  { id: 6, year: 2026, name: "শ্রী তপন হালদার", role: "সহঃ কোষাধ্যক্ষ", image: "/assets/avatars/tapan-halder.jpg" }
];

const FALLBACK_CLUB_MEMBERS = [
  { id: 7, name: "রবি জানা (RABI JANA)", role: "[Club] সভাপতি | 7980464187", image: "/assets/avatars/rabi-jana.jpg", year: 2026 },
  { id: 8, name: "ছোটকা দাস (বাপি) (CHOTKA DAS)", role: "[Club] সহঃ সভাপতি | 8910936506", image: "/assets/avatars/vice-president.svg", year: 2026 },
  { id: 9, name: "তরুণ দেবনাথ (TARUN DEBNATH)", role: "[Club] সহঃ সভাপতি | 7890867584", image: "/assets/avatars/vice-president.svg", year: 2026 },
  { id: 10, name: "নৃপেন সাহা (NRIPEN SAHA)", role: "[Club] সম্পাদক | 8777484189", image: "/assets/avatars/nripen-saha.jpg", year: 2026 },
  { id: 11, name: "সুরজিৎ সরকার (SURAJIT SARKAR)", role: "[Club] সহঃ সম্পাদক | 8777581827", image: "/assets/avatars/asst-secretary.svg", year: 2026 },
  { id: 12, name: "অরূপ মল্লিক (ARUP MULLICK)", role: "[Club] সহঃ সম্পাদক | 8777285009", image: "/assets/avatars/asst-secretary.svg", year: 2026 },
  { id: 13, name: "শুভজিৎ মালো (সনু) (SUBHAJIT MALO)", role: "[Club] কোষাধ্যক্ষ | 9123727257", image: "/assets/avatars/subhajit-malo.jpg", year: 2026 },
  { id: 14, name: "অভিষেক চৌধুরী (শিবা) (AVISEK CHOUDHURY)", role: "[Club] সহঃ কোষাধ্যক্ষ | 8013337014", image: "/assets/avatars/asst-treasurer.svg", year: 2026 },
  { id: 15, name: "রবি গোস্বামী (RAVI GOSWAMI)", role: "[Club] সহঃ কোষাধ্যক্ষ | 8240672206", image: "/assets/avatars/asst-treasurer.svg", year: 2026 },
  { id: 16, name: "অমল দাস (বাবাই) (AMAL DAS)", role: "[Club] ক্রীড়া সম্পাদক | 8777368136", image: "/assets/avatars/amal-das.jpg", year: 2026 },
  { id: 17, name: "আকাশ জানা (AKASH JANA)", role: "[Club] সহঃ ক্রীড়া সম্পাদক | 6289640300", image: "/assets/avatars/sports-secretary.svg", year: 2026 },
  { id: 18, name: "অতনু দত্ত (টুটু) (ATANU DUTTA)", role: "[Club] সহঃ ক্রীড়া সম্পাদক | 9339748034", image: "/assets/avatars/sports-secretary.svg", year: 2026 },
  { id: 19, name: "পিংকি কুণ্ডু (PINKI KUNDU)", role: "[Club] সাংস্কৃতিক সম্পাদক | 9874674901", image: "/assets/avatars/cultural-female.svg", year: 2026 },
  { id: 20, name: "স্নেহা ঘোষ (SNEHA GHOSH)", role: "[Club] সাংস্কৃতিক সম্পাদক | 6289860007", image: "/assets/avatars/cultural-female.svg", year: 2026 },
  { id: 21, name: "তরুণ দেবনাথ (TARUN DEBNATH)", role: "[Club] সাংস্কৃতিক সম্পাদক | 7890867584", image: "/assets/avatars/cultural-secretary.svg", year: 2026 },
  { id: 22, name: "দেবাশীষ দেওয়ান (DEBASISH DEWAN)", role: "[Club] সহযোগী সদস্য", image: "/assets/avatars/club-member.svg", year: 2026 },
  { id: 23, name: "সঞ্জয় মণ্ডল (বাবাই) (SANJOY MONDAL)", role: "[Club] সহযোগী সদস্য", image: "/assets/avatars/club-member.svg", year: 2026 }
];

const FALLBACK_SAMITI_MEMBERS = [
  { id: 30, name: "শতদল রায় (SATADAL ROY)", role: "[Samiti] সভাপতি | 9830379574", image: "/assets/avatars/president.svg", year: 2026 },
  { id: 31, name: "সঞ্জয় ঘোষ (SANJOY GHOSH)", role: "[Samiti] সহ-সভাপতি | 9088533055", image: "/assets/avatars/vice-president.svg", year: 2026 },
  { id: 32, name: "সৈকত সাহা (SAIKAT SAHA)", role: "[Samiti] সাধারণ সম্পাদক | 9831065856", image: "/assets/avatars/secretary.svg", year: 2026 },
  { id: 33, name: "অনির্বাণ সাহা (ANIRBAN SAHA)", role: "[Samiti] সহ-সম্পাদক | 9163197141", image: "/assets/avatars/asst-secretary.svg", year: 2026 },
  { id: 34, name: "বিকাশ গুপ্ত (VIKASH GUPTA)", role: "[Samiti] কোষাধ্যক্ষ | 9874222446", image: "/assets/avatars/treasurer.svg", year: 2026 },
  { id: 35, name: "রবি শাহ (RAVI SHAH)", role: "[Samiti] সহ-কোষাধ্যক্ষ | 8910458272", image: "/assets/avatars/asst-treasurer.svg", year: 2026 },
  { id: 36, name: "পরেশ দেবনাথ (PARESH DEBNATH)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 6290269691", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 37, name: "পঙ্কজ সাহা (PANKAJ SAHA)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 9830371671", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 38, name: "সুকুমার মণ্ডল (SUKUMAR MONDAL)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 7439866492", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 39, name: "অরূপ শিকদার (ARUP SIKDER)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 8100563504", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 40, name: "সাহেব হালদার (SAHEB HALDER)", role: "[Samiti] অফিস ও সম্পত্তি ব্যবস্থাপনা | 9748872221", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 41, name: "কাকলী দে (KAKOLI DEY)", role: "[Samiti] সমস্যা ও সমাধান বিভাগ | 8697852566", image: "/assets/avatars/cultural-female.svg", year: 2026 },
  { id: 42, name: "রবি গোস্বামী (RABI GOSWAMI)", role: "[Samiti] সমস্যা ও সমাধান বিভাগ | 8240672206", image: "/assets/avatars/samiti-member.svg", year: 2026 },
  { id: 43, name: "সুরজিৎ সরকার (SUROJIT SARKAR)", role: "[Samiti] উন্নয়ন পরিষদ সদস্য | 8777581827", image: "/assets/avatars/samiti-member.svg", year: 2026 }
];

function CommitteeContent() {
  const { data, selectedYear } = useData();
  const { lang, b, t, tRole, tName, tNickname, toDigits } = useLanguage();
  const searchParams = useSearchParams();

  const initialWing = useMemo(() => {
    const w = searchParams?.get('wing');
    if (!w) return 'Puja';
    const lower = w.toLowerCase();
    if (lower === 'club') return 'Club';
    if (lower === 'samiti' || lower === 'samity') return 'Samiti';
    return 'Puja';
  }, [searchParams]);

  const [activeWing, setActiveWing] = useState(initialWing);

  useEffect(() => {
    if (initialWing) {
      setActiveWing(initialWing);
    }
  }, [initialWing]);

  const allYearMembers = useMemo(() => {
    return (data.members || [])
      .filter(m => m.year === selectedYear)
      .sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [data.members, selectedYear]);

  const filteredMembers = useMemo(() => {
    const list = allYearMembers.filter(m => {
      const parsed = parseMemberRole(m.role);
      return parsed.wing === activeWing;
    });

    if (list.length > 0) return [...list].sort((a, b) => (a.id || 0) - (b.id || 0));

    // Resilient fallback so committee tabs are never blank during initial load
    if (activeWing === 'Puja') return FALLBACK_PUJA_MEMBERS;
    if (activeWing === 'Club') return FALLBACK_CLUB_MEMBERS;
    if (activeWing === 'Samiti') return FALLBACK_SAMITI_MEMBERS;
    return [];
  }, [allYearMembers, activeWing]);

  const isLeader = (roleStr) => {
    const r = roleStr.toLowerCase();
    // Departmental and associate members belong to the sub-committee / general section
    if (
      r.includes('ক্রীড়া') || r.includes('sports') ||
      r.includes('সাংস্কৃতিক') || r.includes('cultural') ||
      r.includes('সহযোগী') || r.includes('associate') ||
      r.includes('পরিকাঠামো') || r.includes('পরিচ্ছন্নতা') || r.includes('প্রবীণ')
    ) {
      return false;
    }
    return r.includes('সভাপতি') || r.includes('president') ||
           r.includes('সম্পাদক') || r.includes('secretary') ||
           r.includes('কোষাধ্যক্ষ') || r.includes('treasurer');
  };

  const leaders = filteredMembers.filter(m => isLeader(parseMemberRole(m.role).cleanRole));
  const generalMembers = filteredMembers.filter(m => !isLeader(parseMemberRole(m.role).cleanRole));

  return (
    <main className="bg-[#FAF7F2] min-h-screen pt-28 sm:pt-32 pb-24 selection:bg-brand-maroon selection:text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearSelector />
      </div>

      {/* ═══ Clean Editorial Header (Minimal & Spacious) ═══ */}
      <header className="max-w-3xl mx-auto text-center mt-6 sm:mt-8 mb-8 sm:mb-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-2 tracking-tight leading-tight">
          {b('পরিচালনা পরিষদ ও', 'Executive Council &')} <span className="text-brand-maroon">{b('কমিটি সদস্যবৃন্দ', 'Committee Members')}</span>
        </h1>
        <div className="flex justify-center mt-3">
          <FestiveWaveAccent className="w-16 h-2 text-amber-500/80" />
        </div>
      </header>

      {/* ═══ 3-Pillar Wing Tabs (Three Options Only) ═══ */}
      <div className="flex items-center justify-center gap-2 mb-12 sm:mb-16 flex-wrap px-4">
        <button
          onClick={() => setActiveWing('Puja')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeWing === 'Puja'
              ? 'bg-rose-700 text-white shadow-md scale-105'
              : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-rose-50 hover:text-rose-700'
          }`}
        >
          <DurgaDeviEmblemIcon className={`w-3.5 h-3.5 ${activeWing === 'Puja' ? 'text-white' : 'text-rose-700'}`} />
          <span>{b('শারদীয়া দুর্গোৎসব', 'Durga Puja')}</span>
        </button>
        <button
          onClick={() => setActiveWing('Club')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeWing === 'Club'
              ? 'bg-amber-600 text-white shadow-md scale-105'
              : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-amber-50 hover:text-amber-700'
          }`}
        >
          <ClubCrestIcon className={`w-3.5 h-3.5 ${activeWing === 'Club' ? 'text-white' : 'text-amber-600'}`} />
          <span>{b('সোনালী সঙ্ঘ ক্লাব', 'Sonali Club')}</span>
        </button>
        <button
          onClick={() => setActiveWing('Samiti')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeWing === 'Samiti'
              ? 'bg-emerald-700 text-white shadow-md scale-105'
              : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          <SamitiEmblemIcon className={`w-3.5 h-3.5 ${activeWing === 'Samiti' ? 'text-white' : 'text-emerald-700'}`} />
          <span>{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredMembers.length > 0 ? (
          <>
            {/* ═══ 1. EXECUTIVE LEADERSHIP (High-Impact Cards) ═══ */}
            {leaders.length > 0 && (
              <div className="mb-16 sm:mb-20">
                <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon" />
                    <span>{b('কর্মকর্তা পরিষদ', 'Core Board')}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
                    {b('মূল কার্যনির্বাহী', 'Core Executive')} <span className="text-brand-maroon">{b('নেতৃত্ব', 'Leadership')}</span>
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto pt-4">
                  {leaders.map((member, i) => {
                    const parsed = parseMemberRole(member.role);
                    const nameDetails = parseMemberNameDetails(member.name);
                    const isClubMember = parsed.wing === 'Club';
                    return (
                      <div
                        key={i}
                        className="group relative bg-[#FFFDF9] rounded-3xl pt-8 pb-6 px-5 sm:px-7 text-center shadow-[0_6px_20px_rgba(28,13,19,0.04)] hover:shadow-[0_16px_32px_rgba(159,18,57,0.1)] hover:-translate-y-1.5 transition-all duration-300 border border-[#E5DAC8] flex flex-col justify-between"
                      >
                        {/* Top Pinned Washi Tape with Officer Portfolio */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                          <WashiTapePin 
                            text={tRole(parsed.cleanRole)} 
                            variant={isClubMember ? 'amber' : (parsed.wing === 'Samiti' ? 'emerald' : 'rose')} 
                          />
                        </div>

                        {/* Top Subtle Highlight */}
                        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                          isClubMember 
                            ? 'from-transparent via-amber-500/60 to-transparent' 
                            : 'from-transparent via-brand-maroon/40 to-transparent'
                        }`} />

                        <div>
                          {/* Responsive Portrait Avatar Frame (Adaptive 4:5 Ratio) */}
                          <div className={`relative w-full max-w-[200px] sm:max-w-[220px] aspect-[4/5] mx-auto rounded-2xl overflow-hidden border-2 bg-stone-50 shadow-sm mb-4 flex items-center justify-center transition-all duration-300 ${
                            isClubMember ? 'border-amber-200/80 group-hover:border-amber-400' : 'border-[#E5DAC8] group-hover:border-brand-maroon/40'
                          }`}>
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={lang === 'en' ? tName(member.name) : nameDetails.mainName}
                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <User className="w-16 h-16 text-stone-300" />
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-1 group-hover:text-brand-maroon transition-colors leading-snug">
                            {lang === 'en' ? tName(member.name) : nameDetails.mainName}
                          </h3>

                          {/* Decorative Wave Accent */}
                          <div className="flex justify-center my-1.5">
                            <FestiveWaveAccent className="w-12 h-1.5 text-amber-500/70" />
                          </div>

                          {/* Nickname & Sub-language Transliteration */}
                          <div className="flex items-center justify-center gap-1.5 mb-2 flex-wrap">
                            {nameDetails.nickname && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                                {b('ডাকনাম:', 'Nickname:')} “{lang === 'en' ? tNickname(nameDetails.nickname) : nameDetails.nickname}”
                              </span>
                            )}
                            {lang === 'bn' && nameDetails.englishName && (
                              <span className="text-[11px] font-mono text-stone-500 font-semibold uppercase tracking-wider">
                                {nameDetails.englishName}
                              </span>
                            )}
                            {lang === 'en' && (
                              <span className="text-[11px] font-serif text-stone-500 font-semibold tracking-wide">
                                {nameDetails.mainName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Role & Wing Badges */}
                        <div className="flex flex-col items-center gap-1.5 mt-2">
                          <div className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm ${
                            isClubMember 
                              ? 'bg-amber-50 border border-amber-200 text-amber-900' 
                              : 'bg-brand-maroon/10 border border-brand-maroon/20 text-brand-maroon'
                          }`}>
                            {isClubMember && <ClubCrestIcon className="w-3.5 h-3.5 text-amber-700" />}
                            <span>{tRole(parsed.cleanRole)}</span>
                          </div>

                          {/* Clickable Phone Number */}
                          {parsed.phone && (
                            <a
                              href={`tel:+91${parsed.phone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 hover:border-emerald-300 text-xs font-mono font-bold transition-all shadow-2xs mt-0.5 group/phone cursor-pointer"
                              title={b('সরাসরি ফোন করুন', 'Call Directly')}
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover/phone:scale-110 transition-transform" />
                              <span>+91 {parsed.phone}</span>
                            </a>
                          )}

                          {/* Term details */}
                          {isClubMember && (
                            <span className="text-[10px] font-bold text-stone-400 tracking-wider uppercase mt-0.5">
                              {b('কার্যকাল: ২০২৬–২০২৮', 'Term: 2026–2028')}
                            </span>
                          )}

                          {parsed.wing === 'Samiti' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <SamitiEmblemIcon className="w-3 h-3 text-emerald-700" />
                              <span>{b('উন্নয়ন সমিতি', 'Unnayan Samiti')}</span>
                            </span>
                          )}
                          {parsed.wing === 'Puja' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <DurgaDeviEmblemIcon className="w-3 h-3 text-rose-700" />
                              <span>{b('শারদীয়া দুর্গোৎসব', 'Durga Puja')}</span>
                            </span>
                          )}
                        </div>

                        {/* Deckle bottom edge */}
                        <div className="-mx-5 sm:-mx-7 -mb-6 mt-3 opacity-80">
                          <TornDeckleEdge className="w-full text-stone-200/90 h-2 block" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══ 2. GENERAL COMMITTEE (Responsive Member Grid) ═══ */}
            {generalMembers.length > 0 && (
              <div>
                <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-stone-800 bg-[#FFFDF9] shadow-[2px_2px_0px_0px_rgba(28,13,19,0.9)] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-stone-900 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon" />
                    <span>{b('পরিচালনা সদস্য', 'Council Members')}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-stone-900 tracking-tight leading-snug">
                    {b('সম্মানীয় সদস্য ও', 'Distinguished Members &')} <span className="text-brand-maroon">{b('উপদেষ্টামণ্ডলী', 'Advisors')}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {generalMembers.map((member, i) => {
                    const parsed = parseMemberRole(member.role);
                    const nameDetails = parseMemberNameDetails(member.name);
                    const isClubMember = parsed.wing === 'Club';
                    return (
                      <div
                        key={i}
                        className="group relative bg-white rounded-2xl p-3.5 sm:p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-stone-200/80 hover:border-brand-maroon/30 flex flex-col items-center justify-between"
                      >
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-maroon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-full flex flex-col items-center">
                          <div className="relative w-full max-w-[180px] sm:max-w-[200px] aspect-[4/5] mx-auto rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center mb-2.5 sm:mb-3 transition-all duration-300">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={lang === 'en' ? tName(member.name) : nameDetails.mainName}
                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <User className="w-10 h-10 text-stone-300" />
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-2 mb-0.5 group-hover:text-brand-maroon transition-colors" title={lang === 'en' ? tName(member.name) : nameDetails.mainName}>
                            {lang === 'en' ? tName(member.name) : nameDetails.mainName}
                          </h3>
                          {nameDetails.nickname && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-1">
                              “{lang === 'en' ? tNickname(nameDetails.nickname) : nameDetails.nickname}”
                            </span>
                          )}
                          {lang === 'bn' && nameDetails.englishName && (
                            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block mb-1">
                              {nameDetails.englishName}
                            </span>
                          )}
                          {lang === 'en' && (
                            <span className="text-[10px] font-serif text-stone-400 tracking-wider block mb-1">
                              {nameDetails.mainName}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-center gap-1 mt-2">
                          <span className="text-[11px] sm:text-xs text-stone-600 font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200/60">
                            {tRole(parsed.cleanRole)}
                          </span>
                          {parsed.phone && (
                            <a
                              href={`tel:+91${parsed.phone}`}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 hover:border-emerald-300 text-[11px] font-mono font-bold transition-all shadow-2xs mt-0.5 cursor-pointer"
                              title={b('সরাসরি ফোন করুন', 'Call Directly')}
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>+91 {parsed.phone}</span>
                            </a>
                          )}
                          {isClubMember && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70">
                              <ClubCrestIcon className="w-2.5 h-2.5 text-amber-700" />
                              <span>{b('ক্লাব', 'Club')} • {toDigits('২০২৬-২৮')}</span>
                            </span>
                          )}
                          {parsed.wing === 'Samiti' && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70">
                              <SamitiEmblemIcon className="w-2.5 h-2.5 text-emerald-700" />
                              <span>{b('সমিতি', 'Samiti')}</span>
                            </span>
                          )}
                          {parsed.wing === 'Puja' && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/70">
                              <DurgaDeviEmblemIcon className="w-2.5 h-2.5 text-rose-700" />
                              <span>{b('পূজা', 'Puja')}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white/80 rounded-3xl border border-dashed border-stone-300 text-stone-500">
            <h3 className="text-xl sm:text-2xl font-serif">
              {b('এই শাখার কোনো সদস্য তথ্য এখনও প্রকাশ করা হয়নি।', 'No members published for this category yet.')}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              {b('অন্যান্য শাখা নির্বাচন করুন অথবা অ্যাডমিন প্যানেল থেকে সদস্য যুক্ত করুন।', 'Please switch tabs or add members via admin panel.')}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CommitteePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-serif text-stone-600">লোড হচ্ছে...</div>}>
      <CommitteeContent />
    </Suspense>
  );
}
