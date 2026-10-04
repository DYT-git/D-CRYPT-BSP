import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { id: 'asc' } });
    const members = await prisma.member.findMany({ orderBy: { id: 'asc' } });
    const notices = await prisma.notice.findMany({ orderBy: { id: 'desc' } });
    const gallery = await prisma.gallery.findMany({ orderBy: { id: 'desc' } });
    const finances = await prisma.finance.findMany({ orderBy: { id: 'desc' } });
    const settingsList = await prisma.siteSetting.findMany();

    const settings = {};
    settingsList.forEach(s => {
      settings[s.key] = s.value;
    });

    let allMembers = members;
    try {
      const hasClub = allMembers.some(m => m.role && m.role.includes('[Club]'));
      const hasSamiti = allMembers.some(m => m.role && m.role.includes('[Samiti]'));
      if (!hasClub || !hasSamiti) {
        const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json');
        if (fs.existsSync(seedPath)) {
          const seedContent = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
          if (!hasClub) {
            const seedClub = (seedContent.members || []).filter(m => m.role && m.role.includes('[Club]'));
            allMembers = [...allMembers, ...seedClub];
          }
          if (!hasSamiti) {
            const seedSamiti = (seedContent.members || []).filter(m => m.role && m.role.includes('[Samiti]'));
            allMembers = [...allMembers, ...seedSamiti];
          }
        }
      }
    } catch (e) {
      console.warn("Could not merge seed members:", e);
    }

    // Always guarantee sequential order by member ID
    allMembers.sort((a, b) => (a.id || 0) - (b.id || 0));

    return NextResponse.json({
      events,
      members: allMembers,
      notices,
      gallery,
      finances,
      settings,
    });
  } catch (error) {
    console.warn("DB connection error in api/data, loading seed-data fallback:", error.message);
    try {
      const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json');
      if (fs.existsSync(seedPath)) {
        const seedContent = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        const settings = {};
        if (Array.isArray(seedContent.settings)) {
          seedContent.settings.forEach(s => {
            settings[s.key] = s.value;
          });
        }
        return NextResponse.json({
          events: seedContent.events || [],
          members: seedContent.members || [],
          notices: seedContent.notices || [],
          gallery: seedContent.gallery || [],
          finances: seedContent.finances || [],
          settings,
        });
      }
    } catch (fallbackErr) {
      console.error("Fallback error:", fallbackErr);
    }
    return NextResponse.json({ events: [], members: [], notices: [], gallery: [], finances: [], settings: {} });
  }
}
