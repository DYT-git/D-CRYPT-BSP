export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    let filename = searchParams.get('filename') || 'download';

    if (!fileUrl) {
      return new Response('Missing "url" query parameter', { status: 400 });
    }

    // Resolve URL (in case of relative path)
    const targetUrl = fileUrl.startsWith('http')
      ? fileUrl
      : new URL(fileUrl, request.nextUrl.origin).toString();

    const upstreamRes = await fetch(targetUrl);
    if (!upstreamRes.ok) {
      return new Response(`Failed to fetch source file: ${upstreamRes.statusText}`, {
        status: upstreamRes.status,
      });
    }

    const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';
    const buffer = await upstreamRes.arrayBuffer();

    // Ensure appropriate file extension if missing
    if (!filename.includes('.')) {
      if (contentType.includes('pdf')) filename += '.pdf';
      else if (contentType.includes('jpeg') || contentType.includes('jpg')) filename += '.jpg';
      else if (contentType.includes('png')) filename += '.png';
      else if (contentType.includes('webp')) filename += '.webp';
      else if (contentType.includes('svg')) filename += '.svg';
    }

    // Clean filename for HTTP header compatibility
    const safeAsciiFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeAsciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Download proxy error:', error);
    return new Response('Internal error downloading file', { status: 500 });
  }
}
