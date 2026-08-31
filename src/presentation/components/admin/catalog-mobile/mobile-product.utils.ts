import {
  createEmptyProductDefaults,
  formValuesToProductInput,
  generateSku,
  productToFormValues,
  slugify,
} from '@presentation/stores/admin/product';
import type {
  AdminProduct,
  AdminProductInput,
} from '@shared/types/product-admin.types';

export interface MobileProductFormValues {
  name: string;
  description: string;
  photos: string[];
  sizes: string[];
  quantity: number;
  unitPrice: number;
  category: string;
  collection: string;
  team: string;
  selection: string;
}

export const EMPTY_MOBILE_PRODUCT_FORM: MobileProductFormValues = {
  name: '',
  description: '',
  photos: [],
  sizes: [],
  quantity: 0,
  unitPrice: 0,
  category: '',
  collection: '',
  team: '',
  selection: '',
};

const DESCRIPTION_PAD = 'Produto cadastrado na versão mobile UNDER SELECT.';

function ensureMinText(value: string, min: number): string {
  const trimmed = value.trim();
  if (trimmed.length >= min) return trimmed;
  const padded = `${trimmed} ${DESCRIPTION_PAD}`.trim();
  if (padded.length >= min) return padded;
  return `${padded} ${DESCRIPTION_PAD}`.trim();
}

export function productToMobileForm(
  product: AdminProduct,
): MobileProductFormValues {
  const photos = [
    product.imageUrl,
    ...product.gallery.map((image) => image.url),
  ].filter((url, index, list) => Boolean(url) && list.indexOf(url) === index);

  const sizes =
    product.sizes.length > 0
      ? product.sizes
      : product.variations
          .map((variation) => variation.size?.trim().toUpperCase() ?? '')
          .filter(Boolean);

  const quantity =
    product.variations[0]?.stock ??
    (sizes.length > 0
      ? Math.round(product.stockQuantity / sizes.length)
      : product.stockQuantity);

  return {
    name: product.name,
    description: product.fullDescription || product.shortDescription,
    photos,
    sizes,
    quantity,
    unitPrice: product.price,
    category: product.category ?? '',
    collection: product.collection ?? '',
    team: product.team ?? '',
    selection: product.selection ?? '',
  };
}

export function mobileFormToProductInput(
  values: MobileProductFormValues,
  options: {
    existing?: AdminProduct;
    category: string;
    collection: string;
  },
): AdminProductInput {
  const name = values.name.trim();
  const description = values.description.trim();
  const fullDescription = ensureMinText(description, 20);
  const shortDescription = ensureMinText(description, 10).slice(0, 160);
  const slug = options.existing?.slug || slugify(name);
  const sku = options.existing?.sku || generateSku();
  const price = Number(values.unitPrice) || 0;
  const quantity = Math.max(0, Math.floor(Number(values.quantity) || 0));
  const sizes = values.sizes
    .map((size) => size.trim().toUpperCase())
    .filter(Boolean);
  const photos = values.photos.filter(Boolean);
  const cover = photos[0] ?? options.existing?.imageUrl ?? '';

  const base = options.existing
    ? formValuesToProductInput(productToFormValues(options.existing))
    : {
        ...createEmptyProductDefaults(),
        category: values.category || options.category,
        collection: values.collection || options.collection,
        model: 'Padrão',
        status: 'active' as const,
      };

  const variations = sizes.map((size, index) => {
    const existingVariation = options.existing?.variations.find(
      (variation) => variation.size?.trim().toUpperCase() === size,
    );

    return {
      id: existingVariation?.id ?? `var-${Date.now()}-${index}`,
      size,
      color: existingVariation?.color ?? 'Principal',
      model: existingVariation?.model ?? base.model ?? 'Padrão',
      sku: existingVariation?.sku || `${sku}-${size}`,
      price,
      stock: quantity,
      minStock: existingVariation?.minStock ?? 5,
      imageUrl: existingVariation?.imageUrl,
    };
  });

  return {
    ...base,
    name,
    slug,
    sku,
    model: base.model?.trim() || 'Padrão',
    brand: base.brand?.trim() || 'UNDER SELECT',
    season: base.season?.trim() || '2024/25',
    category: values.category || options.category,
    collection: values.collection.trim() || options.collection,
    team: values.team.trim() || undefined,
    selection: values.selection.trim() || undefined,
    shortDescription,
    fullDescription,
    price,
    compareAtPrice: undefined,
    onSale: false,
    inStock: quantity > 0,
    stockQuantity: quantity * sizes.length,
    sizes,
    imageUrl: cover,
    imageAlt: base.imageAlt?.trim() ? base.imageAlt : name,
    variations,
    gallery: photos.map((url, index) => ({
      id:
        options.existing?.gallery?.[index]?.id ?? `gal-${Date.now()}-${index}`,
      url,
      alt: name,
      isCover: index === 0,
      order: index,
    })),
    seo: {
      ...base.seo,
      slug: base.seo.slug || slug,
      metaTitle: base.seo.metaTitle || `${name} | UNDER SELECT`,
      metaDescription: base.seo.metaDescription || shortDescription,
      ogTitle: base.seo.ogTitle || name,
      ogDescription: base.seo.ogDescription || shortDescription,
      ogImage: base.seo.ogImage || cover,
    },
  };
}

export function validateMobileProductForm(
  values: MobileProductFormValues,
): string | null {
  if (values.name.trim().length < 3) {
    return 'Informe o nome do produto (mínimo 3 caracteres).';
  }
  if (values.description.trim().length < 3) {
    return 'Informe a descrição do produto.';
  }
  if (values.photos.length === 0) {
    return 'Envie ao menos uma foto do produto.';
  }
  if (values.sizes.length === 0) {
    return 'Selecione ao menos um tamanho.';
  }
  if (!Number.isFinite(values.quantity) || values.quantity < 0) {
    return 'Informe a quantidade em estoque.';
  }
  if (!Number.isFinite(values.unitPrice) || values.unitPrice <= 0) {
    return 'Informe o valor unitário.';
  }
  if (!values.category.trim()) {
    return 'Selecione uma categoria.';
  }
  if (!values.collection.trim()) {
    return 'Selecione uma coleção.';
  }
  return null;
}
