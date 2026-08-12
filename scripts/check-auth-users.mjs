import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const admins = await prisma.adminUser.findMany({
  select: { email: true, name: true, isActive: true },
});
const customer = await prisma.customer.findUnique({
  where: { email: 'felipe.guimaraes@fgservices.com.br' },
  select: { email: true, passwordHash: true, status: true },
});

console.log('ADMINS:', admins);
console.log('CUSTOMER:', customer ? { ...customer, hasPassword: !!customer.passwordHash } : null);

await prisma.$disconnect();
