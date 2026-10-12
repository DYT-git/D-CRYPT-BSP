import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function parseNotice(item) {
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

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { id: 'asc' } });
    const members = await prisma.member.findMany({ orderBy: { id: 'asc' } });
    const rawNotices = await prisma.notice.findMany({ orderBy: [{ date: 'desc' }, { id: 'desc' }] });
    const gallery = await prisma.gallery.findMany({ orderBy: [{ year: 'desc' }, { id: 'desc' }] });
    const finances = await prisma.finance.findMany({ orderBy: [{ year: 'desc' }, { id: 'desc' }] });
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

    let allFinances = finances;
    try {
      const hasClubFin = allFinances.some(f => f.title && f.title.startsWith('[Club]'));
      const hasSamitiFin = allFinances.some(f => f.title && f.title.startsWith('[Samiti]'));
      if (!hasClubFin || !hasSamitiFin) {
        const seedPath = path.join(process.cwd(), 'prisma', 'seed-data.json');
        if (fs.existsSync(seedPath)) {
          const seedContent = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
          const seedFinances = seedContent.finances || seedContent.finance || [];
          if (!hasClubFin) {
            const seedClub = seedFinances.filter(f => f.title && f.title.startsWith('[Club]'));
            allFinances = [...allFinances, ...seedClub];
          }
          if (!hasSamitiFin) {
            const seedSamiti = seedFinances.filter(f => f.title && f.title.startsWith('[Samiti]'));
            allFinances = [...allFinances, ...seedSamiti];
          }
        }
      }
    } catch (e) {
      console.warn("Could not merge seed finances:", e);
    }

    allFinances.sort((a, b) => (b.year || 0) - (a.year || 0) || (b.id || 0) - (a.id || 0));

    const notices = rawNotices.map(parseNotice);

    return NextResponse.json({
      events,
      members: allMembers,
      notices,
      gallery,
      finances: allFinances,
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
        const parsedNotices = (seedContent.notices || [])
          .map(parseNotice)
          .sort((a, b) => (b.id || 0) - (a.id || 0));

        const sortedGallery = (seedContent.gallery || [])
          .slice()
          .sort((a, b) => (b.year || 0) - (a.year || 0) || (b.id || 0) - (a.id || 0));

        const rawFinances = seedContent.finances || seedContent.finance || [];
        const sortedFinances = rawFinances
          .slice()
          .sort((a, b) => (b.year || 0) - (a.year || 0) || (b.id || 0) - (a.id || 0));

        return NextResponse.json({
          events: seedContent.events || [],
          members: seedContent.members || [],
          notices: parsedNotices,
          gallery: sortedGallery,
          finances: sortedFinances,
          settings,
        });
      }
    } catch (fallbackErr) {
      console.error("Fallback error:", fallbackErr);
    }
    return NextResponse.json({ events: [], members: [], notices: [], gallery: [], finances: [], settings: {} });
  }
}
