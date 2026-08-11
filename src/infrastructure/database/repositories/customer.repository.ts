import { prisma } from '@infrastructure/database';

export async function findOrCreateCustomer(input: {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
}) {
  const normalizedCpf = input.cpf.replace(/\D/g, '');
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = await prisma.customer.findUnique({
    where: { cpf: normalizedCpf },
  });

  if (existing) {
    return prisma.customer.update({
      where: { id: existing.id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: normalizedEmail,
        phone: input.phone,
      },
    });
  }

  return prisma.customer.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: normalizedEmail,
      cpf: normalizedCpf,
      phone: input.phone,
    },
  });
}

export async function countCustomerOrders(customerId: string) {
  return prisma.order.count({ where: { customerId } });
}

export async function getCustomerByCpf(cpf: string) {
  return prisma.customer.findUnique({
    where: { cpf: cpf.replace(/\D/g, '') },
  });
}
