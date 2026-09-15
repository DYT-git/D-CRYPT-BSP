'use client';
import { useData } from "@/context/DataContext";
import { useState, useEffect } from "react";

export default function EmergencyPopup() {
  const { settings } = useData();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if enabled in settings
    if (settings?.popupEnabled === 'true') {
      // Check session storage so we don't annoy them on every single page navigation during the same session
      const hasSeen = sessionStorage.getItem('hasSeenPopup');
      if (!hasSeen) {
        setIsOpen(true);
      }
    }
  }, [settings]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenPopup', 'true');
  };

  if (!isOpen || settings?.popupEnabled !== 'true') return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <span className="text-2xl">🚨</span> Important Update
          </h2>
          <button onClick={handleClose} className="text-white/80 hover:text-white hover:bg-red-700 rounded-full p-1 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-6 md:p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{settings.popupTitle}</h3>
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{settings.popupMessage}</p>
          <div className="mt-8 flex justify-end">
            <button onClick={handleClose} className="bg-gray-900 text-white px-6 py-2 rounded-md font-bold hover:bg-gray-800 transition-colors">
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
