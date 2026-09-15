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
