const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const officialMembers = [
  {
    name: "শ্রী মৃণাল কান্তি রায়",
    role: "সভাপতি",
    year: 2026,
    image: "/assets/avatars/president.svg"
  },
  {
    name: "শ্রী রাধেশ্যাম দাস",
    role: "সহঃ সভাপতি",
    year: 2026,
    image: "/assets/avatars/vice-president.svg"
  },
  {
    name: "শ্রী তপন কুমার পাল",
    role: "সম্পাদক",
    year: 2026,
    image: "/assets/avatars/secretary.svg"
  },
  {
    name: "শ্রী ঝন্টু দাস",
    role: "সহঃ সম্পাদক",
    year: 2026,
    image: "/assets/avatars/asst-secretary.svg"
  },
  {
    name: "শ্রী বান্টি হালদার",
    role: "কোষাধ্যক্ষ",
    year: 2026,
    image: "/assets/avatars/treasurer.svg"
  },
  {
    name: "শ্রী তপন হালদার",
    role: "সহঃ কোষাধ্যক্ষ",
    year: 2026,
    image: "/assets/avatars/asst-treasurer.svg"
  }
];

async function main() {
  console.log("Deleting old 2026 dummy members...");
  await prisma.member.deleteMany({
    where: { year: 2026 }
  });

  console.log("Inserting official 2026 Durga Puja committee members from banner...");
  for (const member of officialMembers) {
    const created = await prisma.member.create({
      data: member
    });
    console.log(`Created [ID ${created.id}]: ${created.role} - ${created.name}`);
  }

  const allMembers = await prisma.member.findMany({ where: { year: 2026 } });
  console.log(`Successfully synced ${allMembers.length} members for 2026:`);
  allMembers.forEach(m => console.log(`- ${m.role}: ${m.name} (${m.image})`));
}

main()
  .catch((e) => {
    console.error("Error syncing members:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
