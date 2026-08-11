import { prisma } from '@infrastructure/database';

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
    include: {
      _count: { select: { products: true } },
    },
  });
}

export async function createCategory(input: {
  slug: string;
  label: string;
  description?: string;
}) {
  return prisma.category.create({
    data: {
      slug: input.slug,
      label: input.label,
      description: input.description ?? null,
      status: 'active',
    },
  });
}

export async function updateCategory(
  id: string,
  input: {
    label?: string;
    description?: string;
    status?: string;
    sortOrder?: number;
  },
) {
  return prisma.category.update({
    where: { id },
    data: input,
  });
}

export async function deleteCategory(id: string) {
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error(
      'Não é possível excluir categoria com produtos vinculados.',
    );
  }
  await prisma.category.delete({ where: { id } });
}
