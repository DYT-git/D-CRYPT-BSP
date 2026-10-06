'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Countdown({ targetDate, variant = 'default' }) {
  const { lang, toDigits } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ days: '--', hours: '--', minutes: '--', seconds: '--' });

  useEffect(() => {
    // Fallback if targetDate is not provided
    const targetStr = targetDate || '2026-10-16T06:00:00+05:30';
    const target = new Date(targetStr);
    
    const tick = () => {
      let diff = Math.max(0, target - new Date());
      setTimeLeft({
        days: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        hours: String(Math.floor(diff / 3600000) % 24).padStart(2, '0'),
        minutes: String(Math.floor(diff / 60000) % 60).padStart(2, '0'),
        seconds: String(Math.floor(diff / 1000) % 60).padStart(2, '0')
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { val: toDigits(timeLeft.days),    label: lang === 'bn' ? 'দিন'     : 'Days'  },
    { val: toDigits(timeLeft.hours),   label: lang === 'bn' ? 'ঘণ্টা'   : 'Hours' },
    { val: toDigits(timeLeft.minutes), label: lang === 'bn' ? 'মিনিট'   : 'Mins'  },
    { val: toDigits(timeLeft.seconds), label: lang === 'bn' ? 'সেকেন্ড' : 'Secs'  },
  ];

  if (variant === 'heirloom-panjika') {
    return (
      <div className="flex items-center gap-2 sm:gap-3.5 md:gap-4.5 justify-center font-serif">
        {units.map(({ val, label }, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-3.5 md:gap-4.5">
            <div className="flex flex-col items-center justify-center min-w-[62px] sm:min-w-[76px] md:min-w-[84px] py-2 sm:py-2.5 px-2 rounded-2xl bg-gradient-to-b from-[#2C0D1B] via-[#1A0610] to-[#0F0309] border border-amber-400/40 shadow-[0_6px_20px_rgba(0,0,0,0.65),inset_0_1.5px_1px_rgba(255,255,255,0.2),inset_0_-2px_0_rgba(0,0,0,0.6)] relative overflow-hidden group/dial transition-all hover:border-amber-300 hover:-translate-y-0.5">
              {/* Glossy Top Reflection */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/12 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />
              
              <span className="text-2xl sm:text-3xl md:text-4xl font-black font-serif tabular-nums tracking-tight text-amber-200 drop-shadow-[0_2px_10px_rgba(251,191,36,0.55)] relative z-10">
                {val}
              </span>
              <span className="text-[10px] sm:text-[11px] font-serif font-bold text-rose-200/90 tracking-wide mt-0.5 relative z-10 uppercase">
                {label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-amber-400/50 text-base sm:text-xl font-serif font-black select-none -mt-3 animate-pulse">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className="flex items-center gap-1.5 sm:gap-3 justify-center text-current font-serif">
        {units.map(({ val, label }, i) => (
          <div key={i} className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base md:text-lg font-bold tabular-nums tracking-tight text-amber-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
              {val}
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-sans font-semibold text-rose-200/90 uppercase tracking-wide">
              {label}
            </span>
            {i < units.length - 1 && (
              <span className="text-amber-300/40 text-xs font-sans ml-1 sm:ml-1.5 select-none">·</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'festive-boxes') {
    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-sm sm:max-w-md mx-auto my-1">
        {units.map(({ val, label }, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl bg-gradient-to-b from-[#2A101C] via-[#1C0913] to-[#12050B] border border-amber-400/35 shadow-[0_4px_14px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.18),inset_0_-2px_0_rgba(0,0,0,0.5)] relative overflow-hidden group/tile transition-transform hover:-translate-y-0.5"
          >
            {/* Glossy Top Sheen */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />
            <span className="text-xl sm:text-2xl font-black font-serif tabular-nums tracking-tight text-amber-200 drop-shadow-[0_2px_8px_rgba(251,191,36,0.45)] relative z-10">
              {val}
            </span>
            <span className="text-[10px] sm:text-xs font-serif font-bold text-rose-200/90 tracking-wide mt-0.5 relative z-10">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 sm:gap-4 md:gap-6 justify-center text-current">
      {units.map(({ val, label }, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-3xl sm:text-4xl md:text-5xl font-black font-serif leading-none tabular-nums drop-shadow-sm">
            {val}
          </span>
          <span className="opacity-70 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-semibold">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
