import { prisma } from '@infrastructure/database';

export async function findCustomerByEmail(email: string) {
  return prisma.customer.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
}

export async function findCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
  });
}

export async function updateCustomerPassword(id: string, passwordHash: string) {
  return prisma.customer.update({
    where: { id },
    data: { passwordHash },
  });
}

export async function updateCustomerLastLogin(id: string) {
  return prisma.customer.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
}

export async function createCustomerSession(input: {
  customerId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}) {
  return prisma.customerSession.create({
    data: {
      customerId: input.customerId,
      expiresAt: input.expiresAt,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}

export async function findValidCustomerSession(sessionId: string) {
  return prisma.customerSession.findFirst({
    where: {
      id: sessionId,
      expiresAt: { gt: new Date() },
      customer: { status: 'active' },
    },
    include: { customer: true },
  });
}

export async function deleteCustomerSession(sessionId: string) {
  return prisma.customerSession.deleteMany({
    where: { id: sessionId },
  });
}

export async function deleteAllCustomerSessions(customerId: string) {
  return prisma.customerSession.deleteMany({
    where: { customerId },
  });
}

export async function deleteExpiredCustomerSessions() {
  return prisma.customerSession.deleteMany({
    where: { expiresAt: { lte: new Date() } },
  });
}

export async function upsertCustomerWithPassword(input: {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  passwordHash: string;
}) {
  const email = input.email.toLowerCase().trim();
  const cpf = input.cpf.replace(/\D/g, '');

  const existing = await prisma.customer.findUnique({ where: { email } });

  if (existing) {
    return prisma.customer.update({
      where: { id: existing.id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        passwordHash: input.passwordHash,
        status: 'active',
      },
    });
  }

  return prisma.customer.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      cpf,
      phone: input.phone,
      passwordHash: input.passwordHash,
      status: 'active',
    },
  });
}
