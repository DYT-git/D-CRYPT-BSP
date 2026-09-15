import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await prisma.event.findMany();
    const members = await prisma.member.findMany();
    const notices = await prisma.notice.findMany();
    const gallery = await prisma.gallery.findMany();
    const finances = await prisma.finance.findMany();
    const settingsList = await prisma.siteSetting.findMany();

    const settings = {};
    settingsList.forEach(s => {
      settings[s.key] = s.value;
    });

    return NextResponse.json({
      events,
      members,
      notices,
      gallery,
      finances,
      settings,
    });
  } catch (error) {
    console.error("Failed to fetch data", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
