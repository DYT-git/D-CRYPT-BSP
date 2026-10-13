'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PdfViewerModal from './PdfViewerModal';

function safeDecode(val) {
  if (!val) return '';
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

function PdfViewerLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const rawPdfUrl = searchParams.get('viewPdf');
  const rawPdfTitle = searchParams.get('pdfTitle');

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (rawPdfUrl) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [rawPdfUrl]);

  const handleClose = () => {
    setIsOpen(false);
    // Remove query params to "close" the modal in the URL without reloading the page
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('viewPdf');
    newParams.delete('pdfTitle');
    const newUrl = `${pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  };

  const pdfUrl = safeDecode(rawPdfUrl);
  const title = safeDecode(rawPdfTitle) || 'Document';

  return (
    <PdfViewerModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      pdfUrl={pdfUrl} 
      title={title} 
    />
  );
}

export default function GlobalPdfViewer() {
  return (
    <Suspense fallback={null}>
      <PdfViewerLogic />
    </Suspense>
  );
}
