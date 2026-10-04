import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
    const settings = await prisma.siteSetting.findMany();
    const settingsMap = { ...DEFAULT_SETTINGS };
    
    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Use transaction to upsert all settings
    const operations = Object.entries(data).map(([key, value]) => {
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
