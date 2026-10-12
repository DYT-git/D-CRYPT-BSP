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
  return { members: [] };
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
    let members = [];
    try {
      members = await prisma.member.findMany({
        orderBy: [{ id: 'asc' }]
      });
    } catch (dbErr) {
      console.warn('Member DB fetch error, falling back to seed-data.json:', dbErr.message);
      const seed = readSeedData();
      members = (seed.members || []).slice().sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    return NextResponse.json({ success: true, members });
  } catch (error) {
    console.error('Member fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const year = parseInt(data.year, 10) || new Date().getFullYear();
    const name = (data.name || '').trim();
    const role = (data.role || '').trim();
    const image = data.image ? data.image.trim() : null;

    let newMember = null;
    try {
      newMember = await prisma.member.create({
        data: {
          year,
          name,
          role,
          image,
        }
      });
    } catch (dbErr) {
      console.warn('Member DB create error, falling back to seed-data:', dbErr.message);
      newMember = {
        id: Date.now(),
        year,
        name,
        role,
        image
      };
    }

    // Sync to seed-data.json
    try {
      const seed = readSeedData();
      if (!Array.isArray(seed.members)) seed.members = [];
      seed.members.push({
        id: newMember.id,
        year,
        name,
        role,
        image
      });
      writeSeedData(seed);
    } catch (seedErr) {
      console.warn('Failed to sync new member to seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    console.error('Member save error:', error);
    return NextResponse.json({ error: 'Failed to add member: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const numId = parseInt(data.id, 10);
    const year = parseInt(data.year, 10) || new Date().getFullYear();
    const name = (data.name || '').trim();
    const role = (data.role || '').trim();
    const image = data.image !== undefined ? (data.image ? data.image.trim() : null) : undefined;

    const updateData = { year, name, role };
    if (image !== undefined) updateData.image = image;

    let updated = null;
    try {
      updated = await prisma.member.update({
        where: { id: numId },
        data: updateData
      });
    } catch (dbErr) {
      console.warn('Member DB update error:', dbErr.message);
      updated = { id: numId, ...updateData };
    }

    // Sync to seed-data.json
    try {
      const seed = readSeedData();
      if (Array.isArray(seed.members)) {
        const idx = seed.members.findIndex(m => m.id === numId);
        if (idx !== -1) {
          seed.members[idx] = { ...seed.members[idx], ...updateData };
          writeSeedData(seed);
        }
      }
    } catch (seedErr) {
      console.warn('Failed to sync member update to seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error('Member update error:', error);
    return NextResponse.json({ error: 'Failed to update member: ' + error.message }, { status: 500 });
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
      return NextResponse.json({ error: 'Member id is required' }, { status: 400 });
    }

    const numId = parseInt(id, 10);

    try {
      await prisma.member.delete({ where: { id: numId } });
    } catch (dbErr) {
      console.warn('Member DB delete error:', dbErr.message);
    }

    // Sync to seed-data.json
    try {
      const seed = readSeedData();
      if (Array.isArray(seed.members)) {
        seed.members = seed.members.filter(m => m.id !== numId);
        writeSeedData(seed);
      }
    } catch (seedErr) {
      console.warn('Failed to delete member from seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Member delete error:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
