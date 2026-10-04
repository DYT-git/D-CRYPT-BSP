const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updates = [
    { search: 'রবি জানা', image: '/assets/avatars/rabi-jana.jpg' },
    { search: 'নৃপেন সাহা', image: '/assets/avatars/nripen-saha.jpg' },
    { search: 'শুভজিৎ মালো', image: '/assets/avatars/subhajit-malo.jpg' },
    { search: 'অমল দাস', image: '/assets/avatars/amal-das.jpg' }
  ];

  for (const u of updates) {
    const member = await prisma.member.findFirst({
      where: { name: { contains: u.search } }
    });
    if (member) {
      const updated = await prisma.member.update({
        where: { id: member.id },
        data: { image: u.image }
      });
      console.log(`Updated ${updated.name} (ID: ${updated.id}) -> image: ${updated.image}`);
    } else {
      console.log(`Not found: ${u.search}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
