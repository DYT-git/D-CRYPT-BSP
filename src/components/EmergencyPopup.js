'use client';
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

export default function EmergencyPopup() {
  const { settings } = useData();
  const { b, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if enabled in settings and not expired
    if (settings?.popupEnabled === 'true') {
      if (settings?.popupExpiresAt) {
        const expires = new Date(settings.popupExpiresAt).getTime();
        if (!isNaN(expires) && Date.now() > expires) {
          setIsOpen(false);
          return;
        }
      }
      // Check session storage with dynamic content signature so fresh alerts immediately trigger
      const popupKey = `bspc_seen_emergency_${settings?.popupTitle || 'default'}_${settings?.popupExpiresAt || ''}`;
      const hasSeen = sessionStorage.getItem(popupKey);
      if (!hasSeen) {
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  }, [settings]);

  const handleClose = () => {
    setIsOpen(false);
    const popupKey = `bspc_seen_emergency_${settings?.popupTitle || 'default'}_${settings?.popupExpiresAt || ''}`;
    sessionStorage.setItem(popupKey, 'true');
  };

  const isExpired = settings?.popupExpiresAt && !isNaN(new Date(settings.popupExpiresAt).getTime()) && Date.now() > new Date(settings.popupExpiresAt).getTime();

  if (!isOpen || settings?.popupEnabled !== 'true' || isExpired) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3.5 sm:p-5 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-rose-300 ring-2 ring-rose-500/20 animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 px-5 sm:px-6 py-4 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-xl animate-bounce">🚨</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {b('জরুরি সম্প্রচার', 'Urgent Alert')}
                </span>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight leading-snug">
                {b('বাঁশদ্রোণী সোনালী পার্ক বিজ্ঞপ্তি', 'Bansdroni Sonali Park Notice')}
              </h2>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            title={b('বন্ধ করুন', 'Close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-7 space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2 leading-snug font-serif">
              {t(settings.popupTitle) || b('জরুরি সার্বজনীন ঘোষণা', 'Important Announcement')}
            </h3>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {t(settings.popupMessage)}
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-3">
            <button 
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-brand-maroon hover:bg-brand-dark text-white shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{b('বুঝেছি, ধন্যবাদ', 'Understood, Dismiss')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
