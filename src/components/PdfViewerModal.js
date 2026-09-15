'use client';
import { useState, useEffect } from 'react';
import { X, Share2, Download, ExternalLink, FileText, RefreshCw, Eye } from 'lucide-react';
import { triggerDownload } from '@/utils/download';

export default function PdfViewerModal({ isOpen, onClose, pdfUrl, title }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [useGoogleViewer, setUseGoogleViewer] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && pdfUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('viewPdf', encodeURIComponent(pdfUrl));
      url.searchParams.set('pdfTitle', encodeURIComponent(title || ''));
      setShareUrl(url.toString());
      setIframeLoading(true);
    }
  }, [pdfUrl, title]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !pdfUrl) return null;

  // Resolve absolute URL for Google Docs Viewer
  const getAbsolutePdfUrl = () => {
    if (!pdfUrl) return '';
    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) return pdfUrl;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`;
    }
    return pdfUrl;
  };

  const absolutePdfUrl = getAbsolutePdfUrl();
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absolutePdfUrl)}&embedded=true`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bansdroni Sonali Park - ${title || 'Document'}`,
          text: `Check out this document: ${title || 'Document'}`,
          url: shareUrl || window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const cleanFilename = (title || 'document').replace(/[/\\?%*:|"<>]/g, '-') + '.pdf';
    triggerDownload(pdfUrl, cleanFilename);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 z-10 border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3.5 bg-brand-maroon text-white border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-rose-200" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base truncate leading-snug">
                {title || 'ডকুমেন্ট ভিউয়ার'}
              </h2>
              <span className="text-[10px] text-rose-200/80 hidden sm:block">
                {useGoogleViewer ? 'Android / Mobile Cloud Reader' : 'Direct Browser Embed'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Toggle View Mode (Desktop/Tablets) */}
            <button
              onClick={() => {
                setUseGoogleViewer(!useGoogleViewer);
                setIframeLoading(true);
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:flex items-center gap-1 text-xs text-rose-100 hover:text-white cursor-pointer"
              title={useGoogleViewer ? 'Switch to Direct Embed' : 'Switch to Google Docs Reader'}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{useGoogleViewer ? 'সরাসরি ভিউ' : 'Google Reader'}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1 text-xs text-rose-100 hover:text-white cursor-pointer"
              title="Share Document"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">{copied ? 'Copied!' : 'শেয়ার'}</span>
            </button>

            {/* Forced Direct Download (No Redirect) */}
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white/15 bg-white/10 rounded-full transition-all text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
              title="Download PDF directly"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">ডাউনলোড</span>
            </button>

            {/* Open in new tab */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:flex text-rose-100 hover:text-white"
              title="Open raw file in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="w-px h-5 bg-white/20 mx-0.5 sm:mx-1" />

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 hover:text-white rounded-full transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Content Area */}
        <div className="flex-1 w-full bg-stone-100 relative overflow-hidden flex flex-col">
          {/* Loading Indicator */}
          {iframeLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-50/90 backdrop-blur-xs text-stone-600 gap-3">
              <RefreshCw className="w-7 h-7 text-brand-maroon animate-spin" />
              <p className="text-xs sm:text-sm font-medium text-stone-700">পিডিএফ নথি লোড হচ্ছে...</p>
              <p className="text-[11px] text-stone-400">Android ও সকল ডিভাইসের উপযোগী ভিউ প্রস্তুত হচ্ছে</p>
            </div>
          )}

          {/* Viewer Iframe: Google Docs Viewer works 100% on Android, iOS & Desktop */}
          {useGoogleViewer ? (
            <iframe
              src={googleViewerUrl}
              className="w-full flex-1 border-none bg-white relative z-10"
              title={title || 'PDF Document'}
              onLoad={() => setIframeLoading(false)}
            />
          ) : (
            <object
              data={`${pdfUrl}#toolbar=1&navpanes=0`}
              type="application/pdf"
              className="w-full flex-1 relative z-10 bg-white"
              onLoad={() => setIframeLoading(false)}
            >
              <iframe
                src={`${pdfUrl}#toolbar=1`}
                className="w-full h-full border-none"
                title={title || 'PDF Document'}
                onLoad={() => setIframeLoading(false)}
              >
                <div className="p-8 text-center">
                  <p className="text-stone-600 mb-4">এই ব্রাউজারে সরাসরি পিডিএফ প্রিভিউ সমর্থিত নয়।</p>
                  <button
                    onClick={handleDownload}
                    className="bg-brand-maroon text-white px-6 py-2.5 rounded-full font-bold shadow-md cursor-pointer"
                  >
                    ডাউনলোড করে দেখুন
                  </button>
                </div>
              </iframe>
            </object>
          )}

          {/* Quick Mobile Action Bar (Sticky at Bottom for Phones) */}
          <div className="sm:hidden px-3.5 py-2.5 bg-stone-900 text-white flex items-center justify-between gap-2 shrink-0 border-t border-white/10 z-30">
            <button
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand-maroon hover:bg-rose-700 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> ডাউনলোড করুন (PDF)
            </button>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-xl text-xs font-semibold transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" /> খুলুন
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
