const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        password: 'password123', // Keeping it simple for testing as requested
        role: 'superadmin',
      },
    });
    console.log('Created test admin user: admin / password123');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
