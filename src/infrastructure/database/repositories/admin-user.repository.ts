import { prisma } from '@infrastructure/database';

export async function findAdminUserByEmail(email: string) {
  return prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
}

export async function findAdminUserById(id: string) {
  return prisma.adminUser.findUnique({
    where: { id },
  });
}

export async function updateAdminUserProfile(
  id: string,
  input: { name: string; email: string; phone?: string | null },
) {
  return prisma.adminUser.update({
    where: { id },
    data: {
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      phone: input.phone?.trim() || null,
    },
  });
}

export async function updateAdminUserPassword(
  id: string,
  passwordHash: string,
) {
  return prisma.adminUser.update({
    where: { id },
    data: { passwordHash },
  });
}

export async function updateAdminUserLastLogin(id: string) {
  return prisma.adminUser.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
}

export async function createAdminSession(input: {
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}) {
  return prisma.adminSession.create({
    data: {
      userId: input.userId,
      expiresAt: input.expiresAt,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}

export async function findValidAdminSession(sessionId: string) {
  return prisma.adminSession.findFirst({
    where: {
      id: sessionId,
      expiresAt: { gt: new Date() },
      user: { isActive: true },
    },
    include: { user: true },
  });
}

export async function deleteAdminSession(sessionId: string) {
  return prisma.adminSession.deleteMany({
    where: { id: sessionId },
  });
}

export async function deleteAllAdminSessionsForUser(userId: string) {
  return prisma.adminSession.deleteMany({
    where: { userId },
  });
}

export async function deleteExpiredAdminSessions() {
  return prisma.adminSession.deleteMany({
    where: { expiresAt: { lte: new Date() } },
  });
}
