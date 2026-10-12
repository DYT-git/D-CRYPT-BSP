import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SEED_PATH = path.join(process.cwd(), 'prisma', 'seed-data.json');

function readSeedData() {
  try {
    if (fs.existsSync(SEED_PATH)) {
      return JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading seed-data.json:', err);
  }
  return { notices: [] };
}

function writeSeedData(data) {
  try {
    fs.writeFileSync(SEED_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing seed-data.json:', err);
  }
}

// Helper to extract subtitle from text if stored with marker
function parseNoticeSubtitle(item) {
  let subtitle = item.subtitle || '';
  let text = item.text || '';
  const match = text.match(/^\[\[SUBTITLE:(.*?)\]\]\n?/s);
  if (match) {
    subtitle = match[1].trim();
    text = text.replace(/^\[\[SUBTITLE:.*?\]\]\n?/s, '').trim();
  }
  return {
    ...item,
    subtitle,
    text
  };
}

function encodeNoticeText(text = '', subtitle = '') {
  if (subtitle && subtitle.trim()) {
    return `[[SUBTITLE:${subtitle.trim()}]]\n${text.trim()}`;
  }
  return text.trim();
}

export async function GET() {
  try {
    let notices = [];
    try {
      notices = await prisma.notice.findMany({
        orderBy: { id: 'desc' }
      });
    } catch (dbErr) {
      console.warn('DB fetch failed, falling back to seed-data.json:', dbErr.message);
      const seed = readSeedData();
      notices = (seed.notices || []).slice().sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    const parsedNotices = notices.map(parseNoticeSubtitle);
    return NextResponse.json(parsedNotices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const year = parseInt(data.year, 10) || new Date().getFullYear();
    const title = (data.title || '').trim();
    const subtitle = (data.subtitle || '').trim();
    const text = (data.text || '').trim();
    const encodedText = encodeNoticeText(text, subtitle);
    const isUrgent = Boolean(data.isUrgent);
    const pdfUrl = data.pdfUrl ? data.pdfUrl.trim() : null;
    const dateStr = data.date || new Date().toISOString().split('T')[0];

    let createdNotice = null;

    try {
      createdNotice = await prisma.notice.create({
        data: {
          year,
          title,
          text: encodedText,
          date: dateStr,
          isUrgent,
          pdfUrl,
        }
      });
    } catch (dbErr) {
      console.warn('DB create failed, creating in seed-data.json:', dbErr.message);
      createdNotice = {
        id: Date.now(),
        year,
        title,
        subtitle,
        text,
        date: dateStr,
        isUrgent,
        pdfUrl
      };
    }

    // Always sync to seed-data.json
    try {
      const seed = readSeedData();
      if (!Array.isArray(seed.notices)) seed.notices = [];
      const newSeedItem = {
        id: createdNotice.id,
        year,
        title,
        subtitle,
        text,
        date: dateStr,
        isUrgent,
        pdfUrl
      };
      seed.notices.unshift(newSeedItem);
      writeSeedData(seed);
    } catch (seedErr) {
      console.warn('Failed to sync notice to seed-data.json:', seedErr.message);
    }

    const returnItem = parseNoticeSubtitle({
      ...createdNotice,
      subtitle
    });

    return NextResponse.json({ success: true, notice: returnItem });
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json({ error: 'Failed to create notice: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const id = parseInt(data.id, 10);
    const title = data.title !== undefined ? data.title.trim() : undefined;
    const subtitle = data.subtitle !== undefined ? data.subtitle.trim() : '';
    const text = data.text !== undefined ? data.text.trim() : undefined;
    const encodedText = text !== undefined ? encodeNoticeText(text, subtitle) : undefined;
    const year = data.year ? parseInt(data.year, 10) : undefined;
    const isUrgent = data.isUrgent !== undefined ? Boolean(data.isUrgent) : undefined;
    const pdfUrl = data.pdfUrl !== undefined ? (data.pdfUrl ? data.pdfUrl.trim() : null) : undefined;

    let updated = null;

    try {
      updated = await prisma.notice.update({
        where: { id },
        data: {
          title,
          text: encodedText,
          year,
          isUrgent,
          pdfUrl,
        }
      });
    } catch (dbErr) {
      console.warn('DB update failed, updating in seed-data.json:', dbErr.message);
    }

    // Sync to seed-data.json
    try {
      const seed = readSeedData();
      if (Array.isArray(seed.notices)) {
        const idx = seed.notices.findIndex(n => n.id === id);
        if (idx !== -1) {
          seed.notices[idx] = {
            ...seed.notices[idx],
            ...(title !== undefined && { title }),
            ...(subtitle !== undefined && { subtitle }),
            ...(text !== undefined && { text }),
            ...(year !== undefined && { year }),
            ...(isUrgent !== undefined && { isUrgent }),
            ...(pdfUrl !== undefined && { pdfUrl }),
          };
          writeSeedData(seed);
          if (!updated) updated = seed.notices[idx];
        }
      }
    } catch (seedErr) {
      console.warn('Failed to sync notice update to seed-data.json:', seedErr.message);
    }

    const returnItem = parseNoticeSubtitle({
      ...(updated || data),
      subtitle
    });

    return NextResponse.json({ success: true, notice: returnItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notice: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const numId = parseInt(id, 10);

    try {
      await prisma.notice.delete({ where: { id: numId } });
    } catch (dbErr) {
      console.warn('DB delete notice failed:', dbErr.message);
    }

    // Sync seed-data.json
    try {
      const seed = readSeedData();
      if (Array.isArray(seed.notices)) {
        seed.notices = seed.notices.filter(n => n.id !== numId);
        writeSeedData(seed);
      }
    } catch (seedErr) {
      console.warn('Failed to delete notice from seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
  }
}
