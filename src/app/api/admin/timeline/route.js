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
  return { events: [] };
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
    let events = [];
    try {
      events = await prisma.event.findMany({
        orderBy: [{ date: 'asc' }]
      });
    } catch (dbErr) {
      console.warn('Timeline DB fetch error, falling back to seed-data.json:', dbErr.message);
      const seed = readSeedData();
      events = (seed.events || []).slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Timeline fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const year = parseInt(data.year, 10) || 2026;
    const title = (data.title || '').trim();
    const date = (data.date || '').trim();
    const text = (data.text || '').trim();

    let newEvent = null;
    try {
      newEvent = await prisma.event.create({
        data: { year, title, date, text }
      });
    } catch (dbErr) {
      console.warn('Timeline DB create error, falling back to seed-data:', dbErr.message);
      newEvent = { id: Date.now(), year, title, date, text };
    }

    // Sync to seed-data.json
    try {
      const seed = readSeedData();
      if (!Array.isArray(seed.events)) seed.events = [];
      seed.events.push(newEvent);
      writeSeedData(seed);
    } catch (seedErr) {
      console.warn('Failed to sync event to seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Timeline create error:', error);
    return NextResponse.json({ error: 'Failed to create event: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const numId = parseInt(data.id, 10);
    const year = parseInt(data.year, 10) || 2026;
    const title = (data.title || '').trim();
    const date = (data.date || '').trim();
    const text = (data.text || '').trim();

    const updateData = { year, title, date, text };
    let updated = null;

    try {
      updated = await prisma.event.update({
        where: { id: numId },
        data: updateData
      });
    } catch (dbErr) {
      console.warn('Timeline DB update error:', dbErr.message);
      updated = { id: numId, ...updateData };
    }

    // Sync to seed-data.json
    try {
      const seed = readSeedData();
      if (Array.isArray(seed.events)) {
        const idx = seed.events.findIndex(e => e.id === numId);
        if (idx !== -1) {
          seed.events[idx] = { ...seed.events[idx], ...updateData };
          writeSeedData(seed);
        }
      }
    } catch (seedErr) {
      console.warn('Failed to sync event update to seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error('Timeline update error:', error);
    return NextResponse.json({ error: 'Failed to update event: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    let id = null;
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');

    if (queryId) {
      id = queryId;
    } else {
      try {
        const body = await request.json();
        id = body.id;
      } catch (jsonErr) {}
    }

    if (!id) {
      return NextResponse.json({ error: 'Event id is required' }, { status: 400 });
    }

    const numId = parseInt(id, 10);

    try {
      await prisma.event.delete({ where: { id: numId } });
    } catch (dbErr) {
      console.warn('Timeline DB delete error:', dbErr.message);
    }

    // Sync to seed-data.json
    try {
      const seed = readSeedData();
      if (Array.isArray(seed.events)) {
        seed.events = seed.events.filter(e => e.id !== numId);
        writeSeedData(seed);
      }
    } catch (seedErr) {
      console.warn('Failed to delete event from seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Timeline delete error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
