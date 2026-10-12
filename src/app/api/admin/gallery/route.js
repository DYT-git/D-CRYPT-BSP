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
  return { gallery: [] };
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
    let images = [];
    try {
      images = await prisma.gallery.findMany({
        orderBy: [{ id: 'desc' }]
      });
    } catch (dbErr) {
      console.warn('Gallery DB fetch error, loading from seed-data.json:', dbErr.message);
      const seed = readSeedData();
      images = (seed.gallery || []).slice().sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // ═══ Batch Mode: data.items is an array of photos ═══
    if (Array.isArray(data.items) && data.items.length > 0) {
      const savedItems = [];
      const currentYear = new Date().getFullYear();

      for (const item of data.items) {
        const year = parseInt(item.year, 10) || currentYear;
        const title = (item.title || 'Gallery Image').trim();
        const program = (item.program || 'Durga Puja').trim();
        const category = (item.category || 'General').trim();
        const src = (item.src || '').trim();

        if (!src) continue;

        let newImage = null;
        try {
          newImage = await prisma.gallery.create({
            data: { year, title, program, category, src }
          });
        } catch (dbErr) {
          console.warn('Gallery DB batch save item fallback:', dbErr.message);
          newImage = {
            id: Date.now() + Math.floor(Math.random() * 10000),
            year,
            title,
            program,
            category,
            src
          };
        }
        savedItems.push(newImage);
      }

      // Sync batch to seed-data.json (newest first)
      try {
        const seed = readSeedData();
        if (!Array.isArray(seed.gallery)) seed.gallery = [];
        seed.gallery.unshift(...savedItems);
        writeSeedData(seed);
      } catch (seedErr) {
        console.warn('Failed to sync batch gallery to seed-data.json:', seedErr.message);
      }

      return NextResponse.json({ success: true, count: savedItems.length, images: savedItems });
    }

    // ═══ Single Mode: single photo object ═══
    const year = parseInt(data.year, 10) || new Date().getFullYear();
    const title = (data.title || 'Gallery Image').trim();
    const program = (data.program || 'Durga Puja').trim();
    const category = (data.category || 'General').trim();
    const src = (data.src || '').trim();

    if (!src) {
      return NextResponse.json({ error: 'Image source is required' }, { status: 400 });
    }

    let newImage = null;

    try {
      newImage = await prisma.gallery.create({
        data: {
          year,
          title,
          program,
          category,
          src,
        }
      });
    } catch (dbErr) {
      console.warn('Gallery DB save error, saving to seed-data.json:', dbErr.message);
      newImage = {
        id: Date.now(),
        year,
        title,
        program,
        category,
        src
      };
    }

    // Always sync to seed-data.json (newest first)
    try {
      const seed = readSeedData();
      if (!Array.isArray(seed.gallery)) seed.gallery = [];
      const newSeedItem = {
        id: newImage.id,
        year,
        title,
        program,
        category,
        src
      };
      seed.gallery.unshift(newSeedItem);
      writeSeedData(seed);
    } catch (seedErr) {
      console.warn('Failed to sync gallery to seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Gallery save error:', error);
    return NextResponse.json({ error: 'Failed to save gallery data: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }
    const numId = parseInt(id, 10);

    try {
      await prisma.gallery.delete({
        where: { id: numId }
      });
    } catch (dbErr) {
      console.warn('Gallery DB delete error:', dbErr.message);
    }

    // Sync seed-data.json
    try {
      const seed = readSeedData();
      if (Array.isArray(seed.gallery)) {
        seed.gallery = seed.gallery.filter(g => g.id !== numId);
        writeSeedData(seed);
      }
    } catch (seedErr) {
      console.warn('Failed to delete gallery image from seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gallery delete error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
