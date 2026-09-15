/**
 * Triggers a native file download on any device (Android, iOS, PC, Mac)
 * without redirecting or opening the media in a new browser tab.
 */
export async function triggerDownload(url, filename = 'download') {
  if (!url || typeof window === 'undefined') return;

  // Clean filename
  const cleanName = filename || url.split('/').pop()?.split('?')[0] || 'file';

  // 1. Try direct client-side Blob download (instant, stays on page, zero server bandwidth)
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (response.ok) {
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
      return;
    }
  } catch (err) {
    console.warn('Direct blob download failed, falling back to download proxy:', err);
  }

  // 2. Fallback to same-origin download proxy (forces Content-Disposition: attachment with zero redirect)
  const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(cleanName)}`;
  const link = document.createElement('a');
  link.href = proxyUrl;
  link.download = cleanName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
