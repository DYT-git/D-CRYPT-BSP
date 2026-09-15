const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_DATA = {
  events: [
    { year: 2026, title: "মহাষষ্ঠী — বোধন ও উদ্বোধন", date: "2026-10-17", text: "দেবীর বোধন, আমন্ত্রণ, অধিবাস ও পুজো উদ্বোধন।" },
    { year: 2026, title: "মহাসপ্তমী — নবপত্রিকা স্থাপন", date: "2026-10-18", text: "সকালে নবপত্রিকা স্নান, স্থাপন ও সপ্তমী বিহিত পূজা।" },
    { year: 2026, title: "মহাষ্টমী — কুমারী পূজা ও সন্ধিপূজা", date: "2026-10-19", text: "অষ্টমী বিহিত পূজা, পুষ্পাঞ্জলি এবং বিশেষ সন্ধিপূজা।" },
    { year: 2026, title: "মহানবমী — মহানবমী বিহিত পূজা", date: "2026-10-20", text: "নবমী পূজা, যজ্ঞ ও সন্ধ্যায় বিশেষ আরতি।" },
    { year: 2026, title: "বিজয়া দশমী — প্রতিমা নিরঞ্জন", date: "2026-10-21", text: "দশমী বিহিত পূজা, দর্পণ বিসর্জন, সিঁদুর খেলা এবং প্রতিমা ভাসান।" }
  ],
  members: [
    { year: 2026, name: "Sample President", role: "সভাপতি" },
    { year: 2026, name: "Sample Secretary", role: "সম্পাদক" },
    { year: 2026, name: "Sample Treasurer", role: "কোষাধ্যক্ষ" },
    { year: 2026, name: "Sample Member 1", role: "সদস্য" },
    { year: 2026, name: "Sample Member 2", role: "সদস্য" }
  ],
  notices: [
    { year: 2026, title: "দুর্গাপূজা ২০২৬ — প্রোগ্রাম শীঘ্রই প্রকাশিত হবে", text: "এটি নমুনা নোটিশ। অফিসিয়াল সময়সূচি Admin থেকে যোগ করুন।", date: "2026-08-25" },
    { year: 2026, title: "স্বাগতম — Bansdroni Sonali Park", text: "দুর্গাপূজা ২০২৬, পাড়ার অনুষ্ঠান, সামাজিক কার্যক্রম ও গুরুত্বপূর্ণ খবর এক জায়গায়।", date: "2026-08-30" }
  ],
  gallery: [
    { year: 2026, title: "২০২৬ মণ্ডপ সজ্জা", program: "Durga Puja", category: "Idol & Pandal", src: "/assets/gallery/sample-pandal.svg" },
    { year: 2026, title: "২০২৬ দুর্গা প্রতিমা", program: "Durga Puja", category: "Idol & Pandal", src: "/assets/gallery/sample-durga-pratima.svg" },
    { year: 2025, title: "২০২৫ সিঁদুর খেলা", program: "Durga Puja", category: "Sindur Khela", src: "/assets/gallery/sample-dhak.svg" },
    { year: 2025, title: "২০২৫ অষ্টমীর অঞ্জলি", program: "Durga Puja", category: "Rituals & Anjali", src: "/assets/hero.svg" },
    { year: 2026, title: "রক্তদান শিবির", program: "Social Work", category: "General", src: "/assets/gallery/sample-pandal.svg" },
    { year: 2025, title: "ফুটবল টুর্নামেন্ট", program: "Annual Sports", category: "General", src: "/assets/gallery/sample-dhak.svg" }
  ],
  finances: [
    { year: 2026, title: "Sample Durga Puja Budget 2026", url: "/docs/sample-puja-programme-2026.pdf" }
  ]
};

async function main() {
  console.log("Resetting Database...");
  await prisma.event.deleteMany();
  await prisma.member.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.finance.deleteMany();

  console.log("Seeding Database...");
  
  for (const event of DEFAULT_DATA.events) await prisma.event.create({ data: event });
  for (const member of DEFAULT_DATA.members) await prisma.member.create({ data: member });
  for (const notice of DEFAULT_DATA.notices) await prisma.notice.create({ data: notice });
  for (const item of DEFAULT_DATA.gallery) await prisma.gallery.create({ data: item });
  for (const fin of DEFAULT_DATA.finances) await prisma.finance.create({ data: fin });

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
