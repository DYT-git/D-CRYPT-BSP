'use client';
import { useState, useEffect } from 'react';

/**
 * DigitalDiya: Interactive Sacred Diya Lighting Experience.
 * - Pure Web Audio API brass temple bell synthesizer (0 KB audio file).
 * - Animated SVG flame with golden aura and rising ember sparks.
 * - LocalStorage state preservation + visitor counter.
 * - 100% responsive, hardware-accelerated, and lightweight.
 */
export default function DigitalDiya() {
  const [isLit, setIsLit] = useState(false);
  const [count, setCount] = useState(1428);
  const [showSparks, setShowSparks] = useState(false);

  useEffect(() => {
    try {
      const savedLit = localStorage.getItem('bspc_diya_lit');
      const savedCount = localStorage.getItem('bspc_diya_count');
      if (savedCount) {
        setCount(parseInt(savedCount, 10));
      }
      if (savedLit === 'true') {
        setIsLit(true);
      }
    } catch (e) {
      // LocalStorage access fallback
    }
  }, []);

  const playTempleBell = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Harmonics of authentic brass temple bell (D5 base)
      const freqs = [587.33, 1174.66, 1760.0, 2349.32];
      const gains = [0.35, 0.22, 0.12, 0.06];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(gains[idx], ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.5);
      });
    } catch (err) {
      // Silent fallback
    }
  };

  const handleLight = () => {
    if (isLit) {
      playTempleBell();
      setShowSparks(true);
      setTimeout(() => setShowSparks(false), 1200);
      return;
    }

    playTempleBell();
    setIsLit(true);
    const newCount = count + 1;
    setCount(newCount);
    setShowSparks(true);
    setTimeout(() => setShowSparks(false), 1500);

    try {
      localStorage.setItem('bspc_diya_lit', 'true');
      localStorage.setItem('bspc_diya_count', String(newCount));
    } catch (e) {}
  };

  // Format count into Bengali numerals
  const toBn = (num) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        type="button"
        onClick={handleLight}
        aria-label={isLit ? 'প্রদীপ প্রজ্জ্বলিত' : 'শ্রদ্ধার্ঘ্য দিতে প্রদীপ জ্বালান'}
        className={`group relative inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.6)] cursor-pointer select-none ${
          isLit
            ? 'bg-gradient-to-r from-amber-950/80 via-stone-950/85 to-amber-950/80 border border-amber-400/50 hover:border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
            : 'bg-stone-950/75 hover:bg-stone-900/90 border border-amber-500/30 hover:border-amber-400/60'
        } backdrop-blur-md`}
      >
        {/* Animated Sacred Diya Icon */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          {/* Flame Glow Ring */}
          {isLit && (
            <span className="absolute -top-1 w-4 h-4 rounded-full bg-amber-400/40 blur-[4px] animate-pulse pointer-events-none" />
          )}

          <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 overflow-visible">
            <defs>
              <linearGradient id="brassBase" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <radialGradient id="flameGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Brass Oil Reservoir Dish */}
            <path
              d="M6 18 C6 24, 26 24, 26 18 C26 15, 6 15, 6 18 Z"
              fill="url(#brassBase)"
              stroke="#FDE68A"
              strokeWidth="0.8"
            />
            {/* Small Base Stand */}
            <path
              d="M11 22 L9 26 L23 26 L21 22 Z"
              fill="#92400E"
              stroke="#D97706"
              strokeWidth="0.6"
            />

            {/* Sacred Flame */}
            {isLit ? (
              <g className="origin-bottom animate-flame-flicker">
                {/* Flame Body */}
                <path
                  d="M16 6 C13 11, 12 15, 16 17 C20 15, 19 11, 16 6 Z"
                  fill="url(#flameGrad)"
                  filter="drop-shadow(0 0 4px #FBBF24)"
                />
                {/* Inner White Core */}
                <path
                  d="M16 11 C15 13, 14.5 15, 16 16.5 C17.5 15, 17 13, 16 11 Z"
                  fill="#FFFDF0"
                  opacity="0.9"
                />
              </g>
            ) : (
              /* Unlit wick with tiny ember ready to ignite */
              <g>
                <line x1="16" y1="17" x2="16" y2="14" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="13.5" r="1.2" fill="#F59E0B" className="animate-ping opacity-75" />
              </g>
            )}
          </svg>
        </div>

        {/* Text & Counter */}
        <div className="flex items-center gap-1.5 text-left">
          {isLit ? (
            <span className="text-[11px] sm:text-xs font-serif font-semibold text-amber-200 tracking-wide drop-shadow-sm">
              শ্রদ্ধার্ঘ্য নিবেদিত · <span className="font-bold text-amber-100">{toBn(count)}</span> জন ভক্ত
            </span>
          ) : (
            <span className="text-[11px] sm:text-xs font-serif font-semibold text-amber-100/90 group-hover:text-amber-200 tracking-wide transition-colors">
              প্রদীপ জ্বালান · <span className="text-amber-300/80 font-normal">{toBn(count)}</span> জন ভক্ত
            </span>
          )}
        </div>

        {/* Mini bell sound icon hint */}
        <span className="text-[10px] text-amber-300/60 group-hover:text-amber-200 transition-colors ml-0.5" title="শব্দ সহ">
          🔔
        </span>
      </button>

      {/* Bursting Golden Sparks on Ignition */}
      {showSparks && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          <span className="absolute -top-3 -left-2 w-1.5 h-1.5 rounded-full bg-amber-200 animate-ping" />
          <span className="absolute -top-4 right-1 w-2 h-2 rounded-full bg-yellow-300 animate-ping delay-75" />
          <span className="absolute top-1 -right-3 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping delay-150" />
        </div>
      )}
    </div>
  );
}
