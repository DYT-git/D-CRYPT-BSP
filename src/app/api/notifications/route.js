import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SEED_PATH = path.join(process.cwd(), 'prisma', 'seed-data.json');

// Helper to read fallback seed-data.json safely
function readSeedData() {
  try {
    if (fs.existsSync(SEED_PATH)) {
      return JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading seed-data.json:', err);
  }
  return { settings: [], notices: [], gallery: [], events: [] };
}

// Helper to write to seed-data.json safely
function writeSeedData(data) {
  try {
    fs.writeFileSync(SEED_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing seed-data.json:', err);
  }
}

// Parse wing from title or program
function detectWing(title = '', program = '') {
  if (title.startsWith('[Club]') || program === 'Club & Sports') return 'club';
  if (title.startsWith('[Samiti]') || program === 'Unnayan Samiti') return 'samiti';
  return 'puja';
}

function cleanTitle(title = '') {
  return title.replace(/^\[(Club|Samiti|Puja)\]\s*/i, '').trim();
}

export async function GET() {
  try {
    let customAnnouncements = [];
    let notices = [];
    let gallery = [];
    let events = [];

    // 1. Try fetching from database
    try {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: 'admin_announcements' }
      });
      if (setting && setting.value) {
        customAnnouncements = JSON.parse(setting.value);
      }
      notices = await prisma.notice.findMany({ take: 10, orderBy: { id: 'desc' } });
      gallery = await prisma.gallery.findMany({ take: 6, orderBy: { id: 'desc' } });
      events = await prisma.event.findMany({ take: 5, orderBy: { id: 'desc' } });
    } catch (dbErr) {
      // Fallback to seed-data.json
      const seed = readSeedData();
      const annSetting = (seed.settings || []).find(s => s.key === 'admin_announcements');
      if (annSetting && annSetting.value) {
        try {
          customAnnouncements = JSON.parse(annSetting.value);
        } catch {}
      }
      notices = (seed.notices || []).slice(0, 10).reverse();
      gallery = (seed.gallery || []).slice(-6).reverse();
      events = (seed.events || []).slice(0, 5);
    }

    // 2. Synthesize all notifications
    const allNotifications = [];

    // A. Custom Admin Announcements
    if (Array.isArray(customAnnouncements)) {
      customAnnouncements.forEach(item => {
        allNotifications.push({
          id: `ann-${item.id}`,
          type: item.type || 'announcement',
          wing: item.wing || 'universal',
          title: item.title,
          message: item.message,
          link: item.link || null,
          isUrgent: !!item.isUrgent,
          createdAt: item.createdAt || new Date().toISOString(),
          isCustom: true
        });
      });
    }

    // B. Notices Synthesized Notifications
    notices.forEach(n => {
      const wing = detectWing(n.title);
      const cleaned = cleanTitle(n.title);
      let targetLink = '/#notices';
      if (wing === 'club') targetLink = '/club#club-notices';
      if (wing === 'samiti') targetLink = '/samiti#samiti-notices';

      allNotifications.push({
        id: `notice-${n.id}`,
        type: 'notice',
        wing,
        title: cleaned,
        message: n.text ? (n.text.length > 90 ? n.text.slice(0, 90) + '...' : n.text) : '',
        link: targetLink,
        isUrgent: !!n.isUrgent,
        createdAt: n.date ? `${n.date}T10:00:00.000Z` : new Date().toISOString(),
        isCustom: false
      });
    });

    // C. Recent Gallery Synthesized Notifications
    gallery.slice(0, 4).forEach((g, idx) => {
      const wing = detectWing('', g.program);
      let targetLink = '/gallery';
      if (wing === 'club') targetLink = '/club#club-gallery';
      if (wing === 'samiti') targetLink = '/samiti#samiti-gallery';

      // Use photo createdAt or stable past timestamp
      const itemDate = g.createdAt 
        ? new Date(g.createdAt).toISOString() 
        : new Date(Date.now() - 1000 * 60 * 60 * (idx + 2)).toISOString();

      allNotifications.push({
        id: `gallery-${g.id}`,
        type: 'photo',
        wing,
        title: `নতুন ছবি: ${g.title || 'গ্যালারি ফটো'}`,
        message: `${g.program || 'উৎসব'} বিভাগের নতুন ছবি যুক্ত হয়েছে।`,
        link: targetLink,
        isUrgent: false,
        createdAt: itemDate,
        image: g.src,
        isCustom: false
      });
    });

    // Sort: Urgent items first, then by date descending
    allNotifications.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      count: allNotifications.length,
      notifications: allNotifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ success: false, notifications: [] }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, message, wing = 'universal', type = 'announcement', isUrgent = false, link = '' } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const newAnnouncement = {
      id: Date.now(),
      title: title.trim(),
      message: message.trim(),
      wing: wing || 'universal', // 'universal' | 'puja' | 'club' | 'samiti'
      type: type || 'announcement',
      isUrgent: !!isUrgent,
      link: link ? link.trim() : null,
      createdAt: new Date().toISOString()
    };

    // 1. Try DB update
    let currentAnnouncements = [];
    try {
      const existing = await prisma.siteSetting.findUnique({
        where: { key: 'admin_announcements' }
      });
      if (existing && existing.value) {
        currentAnnouncements = JSON.parse(existing.value);
      }
      currentAnnouncements.unshift(newAnnouncement);

      await prisma.siteSetting.upsert({
        where: { key: 'admin_announcements' },
        update: { value: JSON.stringify(currentAnnouncements) },
        create: { key: 'admin_announcements', value: JSON.stringify(currentAnnouncements) }
      });
    } catch (dbErr) {
      console.warn('DB error, saving announcement to seed-data fallback:', dbErr.message);
      const seed = readSeedData();
      if (!Array.isArray(seed.settings)) seed.settings = [];
      const idx = seed.settings.findIndex(s => s.key === 'admin_announcements');
      if (idx !== -1) {
        try {
          currentAnnouncements = JSON.parse(seed.settings[idx].value);
        } catch {
          currentAnnouncements = [];
        }
        currentAnnouncements.unshift(newAnnouncement);
        seed.settings[idx].value = JSON.stringify(currentAnnouncements);
      } else {
        currentAnnouncements = [newAnnouncement];
        seed.settings.push({ key: 'admin_announcements', value: JSON.stringify(currentAnnouncements) });
      }
      writeSeedData(seed);
    }

    return NextResponse.json({ success: true, announcement: newAnnouncement });
  } catch (error) {
    console.error('Error posting announcement:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const cleanId = id.replace(/^ann-/, '');
    const numId = parseInt(cleanId, 10);

    // Try DB
    try {
      const existing = await prisma.siteSetting.findUnique({
        where: { key: 'admin_announcements' }
      });
      if (existing && existing.value) {
        const list = JSON.parse(existing.value);
        const filtered = list.filter(item => item.id !== numId);
        await prisma.siteSetting.update({
          where: { key: 'admin_announcements' },
          data: { value: JSON.stringify(filtered) }
        });
      }
    } catch (dbErr) {
      const seed = readSeedData();
      if (Array.isArray(seed.settings)) {
        const idx = seed.settings.findIndex(s => s.key === 'admin_announcements');
        if (idx !== -1) {
          try {
            const list = JSON.parse(seed.settings[idx].value);
            const filtered = list.filter(item => item.id !== numId);
            seed.settings[idx].value = JSON.stringify(filtered);
            writeSeedData(seed);
          } catch {}
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
