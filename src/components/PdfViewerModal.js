'use client';
import { useState, useEffect } from 'react';
import { X, Share2, Download, ExternalLink, FileText } from 'lucide-react';

export default function PdfViewerModal({ isOpen, onClose, pdfUrl, title }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create a shareable URL to this specific page that will auto-open the PDF
      const url = new URL(window.location.href);
      url.searchParams.set('viewPdf', encodeURIComponent(pdfUrl));
      url.searchParams.set('pdfTitle', encodeURIComponent(title));
      setShareUrl(url.toString());
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

  if (!isOpen) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bansdroni Sonali Park - ${title}`,
          text: `Check out this document: ${title}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-brand-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[90vh] md:h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-brand-maroon text-white border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="w-5 h-5 shrink-0 text-white" />
            <h2 className="font-bold text-lg truncate">{title || 'Document Viewer'}</h2>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
              title="Share Document"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Copied Link!' : 'Share'}</span>
            </button>
            <a 
              href={pdfUrl} 
              download 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </a>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noreferrer"
              className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:flex"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <div className="w-px h-6 bg-white/20 mx-1"></div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 hover:text-white rounded-full transition-colors"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 w-full bg-gray-100 relative">
          {/* iOS Safari Fallback Warning */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center sm:hidden z-0 bg-gray-50">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">Your mobile browser might not support inline PDF viewing.</p>
            <a href={pdfUrl} download className="bg-brand-maroon text-white px-6 py-3 rounded-full font-bold shadow-md">
              Download PDF Instead
            </a>
          </div>

          <object 
            data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
            type="application/pdf" 
            className="w-full h-full relative z-10"
          >
            <iframe 
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
              className="w-full h-full border-none"
              title={title}
            >
              <p>Your browser does not support PDFs. <a href={pdfUrl}>Download the PDF</a>.</p>
            </iframe>
          </object>
        </div>

      </div>
    </div>
  );
}
