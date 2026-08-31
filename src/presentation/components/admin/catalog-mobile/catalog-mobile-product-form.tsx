'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Spinner } from '@presentation/components/feedback';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { useClassificationStore } from '@presentation/stores/admin/classification.store';
import { useProductStore } from '@presentation/stores/admin/product';
import { ADMIN_CATALOG_MOBILE_PATH } from '@shared/constants/admin.constants';
import { PRODUCT_CLOTHING_SIZES } from '@shared/constants/product-admin.constants';
import type { AdminProduct } from '@shared/types/product-admin.types';
import { cn } from '@shared/utils/cn';

import { CatalogMobilePhotos } from './catalog-mobile-photos';
import {
  EMPTY_MOBILE_PRODUCT_FORM,
  mobileFormToProductInput,
  productToMobileForm,
  validateMobileProductForm,
  type MobileProductFormValues,
} from './mobile-product.utils';

const NONE_VALUE = '__none__';

interface MobileSelectFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  emptyMessage: string;
  options: Array<{ value: string; label: string }>;
  allowEmpty?: boolean;
  emptyLabel?: string;
  onChange: (value: string) => void;
}

const MobileSelectField = memo(function MobileSelectField({
  id,
  label,
  value,
  placeholder,
  emptyMessage,
  options,
  allowEmpty = false,
  emptyLabel = 'Nenhum',
  onChange,
}: MobileSelectFieldProps) {
  const resolvedValue = value || (allowEmpty ? NONE_VALUE : '');

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={resolvedValue || undefined}
        onValueChange={(next) => onChange(next === NONE_VALUE ? '' : next)}
      >
        <SelectTrigger id={id} className="h-11">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {allowEmpty && (
            <SelectItem value={NONE_VALUE}>{emptyLabel}</SelectItem>
          )}
          {options.length === 0 ? (
            <SelectItem value="__empty__" disabled>
              {emptyMessage}
            </SelectItem>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
});

function withCurrentOption(
  options: Array<{ value: string; label: string }>,
  current: string,
): Array<{ value: string; label: string }> {
  if (!current || options.some((option) => option.value === current)) {
    return options;
  }
  return [{ value: current, label: current }, ...options];
}

export interface CatalogMobileProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export const CatalogMobileProductForm = memo(function CatalogMobileProductForm({
  mode,
  productId,
}: CatalogMobileProductFormProps) {
  const router = useRouter();
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const categories = useClassificationStore((state) => state.categories);
  const collections = useClassificationStore((state) => state.collections);
  const teams = useClassificationStore((state) => state.teams);
  const selections = useClassificationStore((state) => state.selections);
  const loadOptions = useClassificationStore((state) => state.loadOptions);

  const [existingProduct, setExistingProduct] = useState<
    AdminProduct | undefined
  >(undefined);
  const [values, setValues] = useState<MobileProductFormValues>(
    EMPTY_MOBILE_PRODUCT_FORM,
  );
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void loadOptions(true);
  }, [loadOptions]);

  useEffect(() => {
    if (mode !== 'edit' || !productId) return;

    setIsLoading(true);
    void fetch(`/api/admin/products/${productId}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.success) {
          throw new Error(payload.error?.message ?? 'Produto não encontrado.');
        }
        return payload.data as AdminProduct;
      })
      .then((loaded) => {
        setExistingProduct(loaded);
        setValues(productToMobileForm(loaded));
      })
      .catch(() => {
        setExistingProduct(undefined);
      })
      .finally(() => setIsLoading(false));
  }, [mode, productId]);

  const updateField = useCallback(
    <K extends keyof MobileProductFormValues>(
      field: K,
      value: MobileProductFormValues[K],
    ) => {
      setValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const toggleSize = useCallback((size: string) => {
    setValues((current) => {
      const exists = current.sizes.includes(size);
      return {
        ...current,
        sizes: exists
          ? current.sizes.filter((item) => item !== size)
          : [...current.sizes, size],
      };
    });
  }, []);

  const categoryOptions = useMemo(
    () =>
      withCurrentOption(
        categories.map((item) => ({
          value: item.slug,
          label: item.label,
        })),
        values.category,
      ),
    [categories, values.category],
  );

  const collectionOptions = useMemo(
    () =>
      withCurrentOption(
        collections.map((item) => ({ value: item, label: item })),
        values.collection,
      ),
    [collections, values.collection],
  );

  const teamOptions = useMemo(
    () =>
      withCurrentOption(
        teams.map((item) => ({ value: item, label: item })),
        values.team,
      ),
    [teams, values.team],
  );

  const selectionOptions = useMemo(
    () =>
      withCurrentOption(
        selections.map((item) => ({ value: item, label: item })),
        values.selection,
      ),
    [selections, values.selection],
  );

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const error = validateMobileProductForm(values);
      if (error) {
        toast.error(error);
        return;
      }

      const category = values.category || categories[0]?.slug;
      const collection = values.collection || collections[0] || 'Geral';

      if (!category) {
        toast.error(
          'Cadastre uma categoria na aba Categorias antes de salvar.',
        );
        return;
      }

      setIsSubmitting(true);
      try {
        const input = mobileFormToProductInput(values, {
          existing: existingProduct,
          category,
          collection,
        });

        if (mode === 'create') {
          await createProduct(input);
          toast.success('Produto adicionado.');
        } else if (productId) {
          await updateProduct(productId, input);
          toast.success('Produto atualizado.');
        }

        router.push(ADMIN_CATALOG_MOBILE_PATH as Route);
      } catch (submitError) {
        toast.error(
          submitError instanceof Error
            ? submitError.message
            : 'Erro ao salvar produto.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      values,
      existingProduct,
      categories,
      collections,
      mode,
      productId,
      createProduct,
      updateProduct,
      router,
    ],
  );

  const onDelete = useCallback(async () => {
    if (!productId || mode !== 'edit') return;

    if (
      !window.confirm(
        `Excluir "${values.name || 'este produto'}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      toast.success('Produto excluído.');
      router.push(ADMIN_CATALOG_MOBILE_PATH as Route);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao excluir produto.',
      );
    } finally {
      setIsDeleting(false);
    }
  }, [deleteProduct, mode, productId, router, values.name]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16" role="status">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (mode === 'edit' && productId && !isLoading && !existingProduct) {
    return (
      <div className="space-y-4 py-8 text-center">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Button asChild variant="outline">
          <Link href={ADMIN_CATALOG_MOBILE_PATH as Route}>Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={(event) => void onSubmit(event)}>
      <div className="space-y-2">
        <Label htmlFor="mobile-product-name">Produto</Label>
        <Input
          id="mobile-product-name"
          value={values.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Nome do produto"
          className="h-11"
          required
        />
      </div>

      <CatalogMobilePhotos
        photos={values.photos}
        onChange={(photos) => updateField('photos', photos)}
      />

      <div className="space-y-2">
        <Label htmlFor="mobile-product-description">Descrição</Label>
        <Textarea
          id="mobile-product-description"
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Descreva o produto"
          required
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Vínculos do catálogo</p>
        <MobileSelectField
          id="mobile-product-category"
          label="Categoria"
          value={values.category}
          placeholder="Selecione a categoria"
          emptyMessage="Cadastre categorias na aba Categorias."
          options={categoryOptions}
          onChange={(value) => updateField('category', value)}
        />
        <MobileSelectField
          id="mobile-product-collection"
          label="Coleção"
          value={values.collection}
          placeholder="Selecione a coleção"
          emptyMessage="Cadastre coleções na aba Coleções."
          options={collectionOptions}
          onChange={(value) => updateField('collection', value)}
        />
        <MobileSelectField
          id="mobile-product-team"
          label="Time"
          value={values.team}
          placeholder="Vincular a um time"
          emptyMessage="Cadastre times na aba Times."
          options={teamOptions}
          allowEmpty
          emptyLabel="Nenhum time"
          onChange={(value) => updateField('team', value)}
        />
        <MobileSelectField
          id="mobile-product-selection"
          label="Seleção"
          value={values.selection}
          placeholder="Vincular a uma seleção"
          emptyMessage="Cadastre seleções na aba Seleções."
          options={selectionOptions}
          allowEmpty
          emptyLabel="Nenhuma seleção"
          onChange={(value) => updateField('selection', value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Tamanhos</Label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_CLOTHING_SIZES.map((size) => {
            const selected = values.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={cn(
                  'min-h-11 min-w-11 rounded-md border px-3 text-sm font-medium transition-colors',
                  selected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-foreground',
                )}
                aria-pressed={selected}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="mobile-product-quantity">Quantidade</Label>
          <Input
            id="mobile-product-quantity"
            type="number"
            min={0}
            step={1}
            value={values.quantity}
            onChange={(event) =>
              updateField('quantity', Number(event.target.value))
            }
            className="h-11"
            required
          />
          <p className="text-muted-foreground text-xs">
            Estoque de cada tamanho
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile-product-price">Valor unitário (R$)</Label>
          <Input
            id="mobile-product-price"
            type="number"
            min={0}
            step="0.01"
            value={values.unitPrice}
            onChange={(event) =>
              updateField('unitPrice', Number(event.target.value))
            }
            className="h-11"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          className="min-h-12 w-full"
          disabled={isSubmitting || isDeleting}
        >
          {isSubmitting
            ? 'Salvando...'
            : mode === 'create'
              ? 'Adicionar produto'
              : 'Salvar alterações'}
        </Button>
        {mode === 'edit' && (
          <Button
            type="button"
            variant="destructive"
            className="min-h-11 w-full"
            disabled={isSubmitting || isDeleting}
            onClick={() => void onDelete()}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir produto'}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          className="min-h-11 w-full"
          asChild
        >
          <Link href={ADMIN_CATALOG_MOBILE_PATH as Route}>Cancelar</Link>
        </Button>
      </div>
    </form>
  );
});
