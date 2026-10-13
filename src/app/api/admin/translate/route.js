import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, from, to } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ translatedText: '', success: true });
    }

    const raw = text.trim();
    
    // Check if text has wing prefix like [Club], [Samiti], [Puja]
    const prefixMatch = raw.match(/^(\[(?:Club|Samiti|Samity|Puja)\]\s*)/i);
    const prefix = prefixMatch ? prefixMatch[1] : '';
    const cleanText = prefixMatch ? raw.substring(prefix.length).trim() : raw;

    if (!cleanText) {
      return NextResponse.json({ translatedText: raw, success: true });
    }

    // Auto-detect language if not explicitly provided
    const hasBengali = /[\u0980-\u09FF]/.test(cleanText);
    const sourceLang = from || (hasBengali ? 'bn' : 'en');
    const targetLang = to || (sourceLang === 'bn' ? 'en' : 'bn');

    if (sourceLang === targetLang) {
      return NextResponse.json({ translatedText: raw, sourceLang, targetLang, success: true });
    }

    // Call translation provider: MyMemory API
    const pair = `${sourceLang}|${targetLang}`;
    const endpoint = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=${pair}`;

    const res = await fetch(endpoint, {
      headers: {
        'User-Agent': 'SonaliParkCommunityPortal/2.0'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!res.ok) {
      throw new Error(`Translation API returned status ${res.status}`);
    }

    const data = await res.json();
    let translated = data.responseData?.translatedText || '';

    // Clean up any HTML entities returned by MyMemory
    translated = translated
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    // Re-attach prefix if present
    const finalResult = prefix ? `${prefix}${translated}` : translated;

    return NextResponse.json({
      success: true,
      originalText: raw,
      translatedText: finalResult,
      sourceLang,
      targetLang
    });
  } catch (err) {
    console.error('Translation error:', err);
    return NextResponse.json(
      { error: 'অনুবাদ ব্যর্থ হয়েছে: ' + err.message, success: false },
      { status: 500 }
    );
  }
}
