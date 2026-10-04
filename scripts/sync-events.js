const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const officialEvents2026 = [
  {
    year: 2026,
    title: "মহাষষ্ঠী — কল্পরম্ভা, দেবীর বোধন ও অধিবাস",
    date: "2026-10-16",
    text: "সকাল ৮:০০ টায় দেবীর কল্পরম্ভা ও ষষ্ঠী বিহিত পূজা। সন্ধ্যা ৬:৩০ টায় দেবীর বোধন, আমন্ত্রণ ও অধিবাস। রাত ৮:০০ টায় মণ্ডপ ও প্রতিমা শুভ দ্বার উন্মোচন।"
  },
  {
    year: 2026,
    title: "মহাসপ্তমী — নবপত্রিকা স্নান ও সপ্তমী বিহিত পূজা",
    date: "2026-10-17",
    text: "ভোর ৬:৩০ টায় গঙ্গার পবিত্র জলে নবপত্রিকা (কলাবউ) স্নান ও প্রবেশ। সকাল ৮:৩০ টায় সপ্তমী বিহিত পূজা ও সকাল ১০:০০ টায় পুষ্পাঞ্জলি। রাত ৮:০০ টায় সান্ধ্য আরতি।"
  },
  {
    year: 2026,
    title: "মহাষ্টমী — অঞ্জলি, কুমারী পূজা ও সন্ধিপূজা",
    date: "2026-10-18",
    text: "সকাল ৮:৩০ টায় মহাষ্টমী বিহিত পূজা। সকাল ৯:৪৫ টায় সার্বজনীন পুষ্পাঞ্জলি। সন্ধিপূজা ও ১০৮ প্রদীপ প্রজ্জ্বলন। সকাল ১১:৩০ টায় কুমারী পূজা। রাত ৮:০০ টায় ধুনুচি আরতি।"
  },
  {
    year: 2026,
    title: "মহানবমী — নবমী বিহিত পূজা, মহাহোম ও ভোগ বিতরণ",
    date: "2026-10-19",
    text: "সকাল ৯:০০ টায় মহানবমী বিহিত পূজা ও অঞ্জলি। সকাল ১১:০০ টায় মহাহোম ও নবমী যজ্ঞ। দুপুর ১:০০ টায় সর্বস্তরের ভক্তদের মাঝে মহাভোগ বিতরণ। রাত ৮:৩০ টায় বিশেষ সাংস্কৃতিক অনুষ্ঠান।"
  },
  {
    year: 2026,
    title: "বিজয়া দশমী — দর্পণ বিসর্জন, সিঁদুর খেলা ও প্রতিমা নিরঞ্জন",
    date: "2026-10-20",
    text: "সকাল ৮:৩০ টায় দশমী বিহিত পূজা ও সমাপন। সকাল ৯:৪৫ টায় দর্পণ বিসর্জন। সকাল ১০:৩০ টা থেকে ঐতিহ্যবাহী সিঁদুর খেলা ও দেবী বরণ। বিকেল ৫:০০ টায় প্রতিমা নিরঞ্জন শোভাযাত্রা ও মিষ্টিমুখ।"
  }
];

async function main() {
  console.log("Updating 2026 events in DB starting from 16 October...");
  await prisma.event.deleteMany({
    where: { year: 2026 }
  });

  for (const ev of officialEvents2026) {
    const created = await prisma.event.create({
      data: ev
    });
    console.log(`Created Event [ID ${created.id}]: ${created.title} on ${created.date}`);
  }

  const all = await prisma.event.findMany({ where: { year: 2026 } });
  console.log(`Successfully synced ${all.length} events for 2026!`);
}

main()
  .catch((e) => {
    console.error("Error syncing events:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
