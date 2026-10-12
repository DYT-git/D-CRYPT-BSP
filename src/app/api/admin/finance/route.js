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
  return { finance: [] };
}

function writeSeedData(data) {
  try {
    fs.writeFileSync(SEED_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing seed-data.json:', err);
  }
}

export async function GET() {
  try {
    let docs = [];
    try {
      docs = await prisma.finance.findMany({
        orderBy: [{ year: 'desc' }, { id: 'desc' }]
      });
      const hasClub = docs.some(d => d.title && d.title.startsWith('[Club]'));
      const hasSamiti = docs.some(d => d.title && d.title.startsWith('[Samiti]'));
      if (!hasClub || !hasSamiti) {
        const seed = readSeedData();
        const raw = seed.finances || seed.finance || [];
        if (!hasClub) {
          docs = [...docs, ...raw.filter(d => d.title && d.title.startsWith('[Club]'))];
        }
        if (!hasSamiti) {
          docs = [...docs, ...raw.filter(d => d.title && d.title.startsWith('[Samiti]'))];
        }
        docs.sort((a, b) => (b.year || 0) - (a.year || 0) || (b.id || 0) - (a.id || 0));
      }
    } catch (dbErr) {
      console.warn('Finance DB fetch error, falling back to seed-data.json:', dbErr.message);
      const seed = readSeedData();
      const raw = seed.finances || seed.finance || [];
      docs = raw.slice().sort((a, b) => (b.year || 0) - (a.year || 0) || (b.id || 0) - (a.id || 0));
    }
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Finance fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch financial documents' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const year = parseInt(data.year, 10) || new Date().getFullYear();
    const title = (data.title || '').trim();
    const url = (data.url || '').trim();

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    let newDoc = null;

    try {
      newDoc = await prisma.finance.create({
        data: {
          year,
          title,
          url,
        }
      });
    } catch (dbErr) {
      console.warn('Finance DB create error, saving to seed-data.json:', dbErr.message);
      newDoc = {
        id: Date.now(),
        year,
        title,
        url
      };
    }

    // Always sync to seed-data.json (prepend so newest is first)
    try {
      const seed = readSeedData();
      if (!Array.isArray(seed.finance) && !Array.isArray(seed.finances)) {
        seed.finance = [];
      }
      const listKey = Array.isArray(seed.finance) ? 'finance' : 'finances';
      const newSeedItem = {
        id: newDoc.id,
        year,
        title,
        url
      };
      seed[listKey].unshift(newSeedItem);
      writeSeedData(seed);
    } catch (seedErr) {
      console.warn('Failed to sync finance to seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true, document: newDoc });
  } catch (error) {
    console.error('Failed to add finance document:', error);
    return NextResponse.json({ error: 'Failed to add document: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    let id = null;
    try {
      const body = await request.json();
      id = body?.id;
    } catch (e) {
      // Body may be empty or query param based
    }

    if (!id) {
      const { searchParams } = new URL(request.url);
      id = searchParams.get('id');
    }

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const numId = parseInt(id, 10);

    try {
      await prisma.finance.delete({ where: { id: numId } });
    } catch (dbErr) {
      console.warn('Finance DB delete error:', dbErr.message);
    }

    // Sync deletion to seed-data.json
    try {
      const seed = readSeedData();
      if (Array.isArray(seed.finance)) {
        seed.finance = seed.finance.filter(f => f.id !== numId);
      }
      if (Array.isArray(seed.finances)) {
        seed.finances = seed.finances.filter(f => f.id !== numId);
      }
      writeSeedData(seed);
    } catch (seedErr) {
      console.warn('Failed to delete finance from seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete finance document:', error);
    return NextResponse.json({ error: 'Failed to delete document: ' + error.message }, { status: 500 });
  }
}
