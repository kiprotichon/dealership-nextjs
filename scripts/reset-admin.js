const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.log('Usage: node scripts/reset-admin.js <email> <password>');
  process.exit(1);
}

(async () => {
  const prisma = new PrismaClient();
  const e = email.trim().toLowerCase();
  const hash = await bcrypt.hash(password, 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: e },
    update: { passwordHash: hash },
    create: { email: e, passwordHash: hash }
  });
  console.log('Admin ready:', admin.email);
  const all = await prisma.adminUser.findMany({ select: { email: true } });
  console.log('All admin emails in this database:', all.map(a => a.email));
  await prisma.$disconnect();
})();
