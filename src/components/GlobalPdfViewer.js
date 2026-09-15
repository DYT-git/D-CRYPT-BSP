'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PdfViewerModal from './PdfViewerModal';

function PdfViewerLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const pdfUrl = searchParams.get('viewPdf');
  const pdfTitle = searchParams.get('pdfTitle') || 'Document';

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pdfUrl) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [pdfUrl]);

  const handleClose = () => {
    setIsOpen(false);
    // Remove query params to "close" the modal in the URL without reloading the page
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('viewPdf');
    newParams.delete('pdfTitle');
    const newUrl = `${pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  };

  return (
    <PdfViewerModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      pdfUrl={pdfUrl ? decodeURIComponent(pdfUrl) : ''} 
      title={pdfTitle ? decodeURIComponent(pdfTitle) : ''} 
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
