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
  return { settings: [] };
}

function writeSeedData(data) {
  try {
    fs.writeFileSync(SEED_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing seed-data.json:', err);
  }
}

// Default settings if none exist in DB
const DEFAULT_SETTINGS = {
  heroHeading: 'শারদ প্রাতে মায়ের আগমন...',
  heroSubHeading: 'আনন্দ আর আলোয় সাজুক ভুবন।',
  heroTagline: '🍁 শরতের নীল আকাশ আর শিউলির গন্ধে মেতেছে বাঁশদ্রোণী... সোনালী পার্কে মা আসছেন বছর ঘুরে! ৭৪তম বর্ষের মহা উৎসবে আপনাদের সাদর আমন্ত্রণ 🙏',
  countdownDate: '2026-10-17T00:00:00+05:30',
  countdownHeading: 'মহাষ্টমী আসতে আর মাত্র',
  currentYear: '74',
  primaryColor: '#9D3535',   // Deep Rose Red
  secondaryColor: '#C9922A', // Antique Gold
  themeTitle: '"অতীতের আয়নায় আগামী"',
  themeSubtitle: '(Reflections of the Past)',
  pandalArtist: 'শিল্প নিকেতন',
  idolArtist: 'সনাতন রুদ্র পাল',
  lightingArtist: 'দাস ইলেকট্রিক',
  totalCollection: '₹ 14,50,000',
  totalExpense: '₹ 13,85,000',
  majorExpenseTitle: 'Pandal Construction',
  majorExpenseAmount: '₹ 6,00,000',

  // Emergency Flash Overlay Settings
  popupEnabled: 'false',
  popupTitle: '',
  popupMessage: '',
  popupExpiresAt: '',

  // Sonali Sangha Club Defaults
  clubHeroTitle: 'সোনালী সঙ্ঘ',
  clubHeroTagline: 'বাঁশদ্রোণী সোনালী পার্কের সংস্কৃতি, ক্রীড়া ও যুবকল্যাণের প্রাণকেন্দ্র। খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান এবং রক্তদান শিবিরের মাধ্যমে সমাজের সেবায় আমরা নিয়োজিত।',
  clubHeroImage: '/assets/club-hero-banner.jpg',
  clubTotalCollection: '₹ ৮,৫০,০০০',
  clubTotalExpense: '₹ ৭,৯৫,০০০',
  clubMajorExpenseTitle: 'ক্রীড়া টুর্নামেন্ট ও উৎসব',
  clubMajorExpenseAmount: '₹ ৩,৫০,০০০',

  // Sonali Park Unnayan Samiti Defaults
  samitiHeroTitle: 'সোনালী পার্ক',
  samitiHeroTagline: 'আমাদের পাড়ার নিরাপত্তা, পরিচ্ছন্নতা, রাস্তাঘাট ও নাগরিকদের দৈনন্দিন স্বাচ্ছন্দ্য রক্ষায় সার্বক্ষণিক নিয়োজিত রেজিস্টার্ড উন্নয়ন পরিষদ।',
  samitiHeroImage: '/assets/samiti-hero-banner.jpg',
  samitiTotalCollection: '₹ ১২,২০,০০০',
  samitiTotalExpense: '₹ ১১,৫০,০০০',
  samitiMajorExpenseTitle: 'রাস্তা সংস্কার ও জলনিকাশি',
  samitiMajorExpenseAmount: '₹ ৫,১০,০০০'
};

export async function GET() {
  try {
    const settingsMap = { ...DEFAULT_SETTINGS };

    try {
      const settings = await prisma.siteSetting.findMany();
      settings.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });
    } catch (dbErr) {
      console.warn('Settings DB fetch error, falling back to seed-data.json:', dbErr.message);
      const seed = readSeedData();
      if (Array.isArray(seed.settings)) {
        seed.settings.forEach(setting => {
          settingsMap[setting.key] = setting.value;
        });
      }
    }

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // 1. Try DB Upsert
    try {
      const operations = Object.entries(data).map(([key, value]) => {
        return prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) }
        });
      });
      await prisma.$transaction(operations);
    } catch (dbErr) {
      console.warn('Settings DB save error:', dbErr.message);
    }

    // 2. Always sync to seed-data.json
    try {
      const seed = readSeedData();
      if (!Array.isArray(seed.settings)) seed.settings = [];

      Object.entries(data).forEach(([key, value]) => {
        const existing = seed.settings.find(s => s.key === key);
        if (existing) {
          existing.value = String(value);
        } else {
          seed.settings.push({ key, value: String(value) });
        }
      });

      writeSeedData(seed);
    } catch (seedErr) {
      console.warn('Failed to sync settings to seed-data.json:', seedErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
