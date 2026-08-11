'use client';

import { Calculator, Plus, Trash2 } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import {
  Form,
  FormField,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch,
} from '@presentation/components/ui';
import { toast } from '@presentation/hooks';
import { formatCep, normalizeCep } from '@presentation/stores/cart';
import {
  createShippingRangeApi,
  deleteShippingRangeApi,
  fetchShippingConfig,
  previewShippingCalculationApi,
  saveShippingConfigApi,
  updateShippingRangeApi,
} from '@presentation/stores/admin/settings/shipping.api';
import {
  shippingConfigSchema,
  shippingPreviewSchema,
  shippingRangeSchema,
  type ShippingConfigSchema,
  type ShippingPreviewSchema,
  type ShippingRangeSchema,
} from '@presentation/stores/admin/settings/shipping.schemas';
import type {
  AdminShippingConfig,
  ShippingCalculationBreakdown,
  ShippingDistanceRange,
} from '@shared/types/shipping-config.types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export const AdminShippingSettingsSection = memo(
  function AdminShippingSettingsSection() {
    const [config, setConfig] = useState<AdminShippingConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewResult, setPreviewResult] =
      useState<ShippingCalculationBreakdown | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [editingRangeId, setEditingRangeId] = useState<string | null>(null);

    const configForm = useAppForm<ShippingConfigSchema>(shippingConfigSchema, {
      defaultValues: {
        shippingBaseFee: 0,
        shippingPerKm: 0,
        shippingMinFee: 0,
        shippingMaxFee: 0,
        freeShippingEnabled: false,
        freeShippingMinValue: 0,
        distanceCalculationEnabled: false,
        distanceRangesEnabled: false,
      },
    });

    const rangeForm = useAppForm<ShippingRangeSchema>(shippingRangeSchema, {
      defaultValues: {
        startKm: 0,
        endKm: 0,
        pricePerKm: 0,
        additionalFee: 0,
        enabled: true,
      },
    });

    const previewForm = useAppForm<ShippingPreviewSchema>(
      shippingPreviewSchema,
      {
        defaultValues: {
          destinationCep: '',
          subtotal: 0,
          couponCode: '',
        },
      },
    );

    const loadConfig = useCallback(async () => {
      setLoading(true);
      try {
        const data = await fetchShippingConfig();
        setConfig(data);
        configForm.reset({
          shippingBaseFee: data.shippingBaseFee,
          shippingPerKm: data.shippingPerKm,
          shippingMinFee: data.shippingMinFee,
          shippingMaxFee: data.shippingMaxFee,
          freeShippingEnabled: data.freeShippingEnabled,
          freeShippingMinValue: data.freeShippingMinValue,
          distanceCalculationEnabled: data.distanceCalculationEnabled,
          distanceRangesEnabled: data.distanceRangesEnabled,
        });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar as configurações de frete.',
        );
      } finally {
        setLoading(false);
      }
    }, [configForm]);

    useEffect(() => {
      void loadConfig();
    }, [loadConfig]);

    const handleSaveConfig = configForm.handleSubmit(async (values) => {
      setSaving(true);
      try {
        const updated = await saveShippingConfigApi(values);
        setConfig(updated);
        toast.success('Configurações de frete salvas.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível salvar as configurações de frete.',
        );
      } finally {
        setSaving(false);
      }
    });

    const resetRangeForm = useCallback(() => {
      setEditingRangeId(null);
      rangeForm.reset({
        startKm: 0,
        endKm: 0,
        pricePerKm: 0,
        additionalFee: 0,
        enabled: true,
      });
    }, [rangeForm]);

    const handleSaveRange = rangeForm.handleSubmit(async (values) => {
      try {
        if (editingRangeId) {
          await updateShippingRangeApi(editingRangeId, values);
          toast.success('Faixa atualizada.');
        } else {
          await createShippingRangeApi(values);
          toast.success('Faixa adicionada.');
        }
        resetRangeForm();
        await loadConfig();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível salvar a faixa.',
        );
      }
    });

    const handleEditRange = (range: ShippingDistanceRange) => {
      setEditingRangeId(range.id);
      rangeForm.reset({
        startKm: range.startKm,
        endKm: range.endKm,
        pricePerKm: range.pricePerKm,
        additionalFee: range.additionalFee,
        enabled: range.enabled,
      });
    };

    const handleDeleteRange = async (id: string) => {
      try {
        await deleteShippingRangeApi(id);
        if (editingRangeId === id) resetRangeForm();
        toast.success('Faixa removida.');
        await loadConfig();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível remover a faixa.',
        );
      }
    };

    const handleToggleRange = async (range: ShippingDistanceRange) => {
      try {
        await updateShippingRangeApi(range.id, {
          ...range,
          enabled: !range.enabled,
        });
        await loadConfig();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível alterar o status da faixa.',
        );
      }
    };

    const handlePreview = previewForm.handleSubmit(async (values) => {
      setPreviewLoading(true);
      setPreviewResult(null);
      try {
        const result = await previewShippingCalculationApi(values);
        setPreviewResult(result.breakdown);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível simular o frete.',
        );
      } finally {
        setPreviewLoading(false);
      }
    });

    const distanceEnabled = configForm.watch('distanceCalculationEnabled');
    const rangesEnabled = configForm.watch('distanceRangesEnabled');

    if (loading && !config) {
      return (
        <p className="text-muted-foreground text-sm">
          Carregando configurações de frete...
        </p>
      );
    }

    return (
      <div className="space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Frete e Entrega
            </CardTitle>
            <CardDescription>
              Defina as regras utilizadas pelo sistema para calcular o frete.
              Nenhum valor é fixo no código — tudo é configurado aqui.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              form={configForm}
              onSubmit={handleSaveConfig}
              className="space-y-8"
            >
              <FormSection
                title="Configuração geral"
                description="Taxa base, valor por KM e limites mínimo/máximo do frete."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    name="shippingBaseFee"
                    label="Taxa base"
                    description="Valor fixo aplicado em todo cálculo de frete."
                    type="number"
                    min={0}
                    step="0.01"
                  />
                  <FormInput
                    name="shippingPerKm"
                    label="Valor por KM"
                    description="Usado quando faixas de distância estão desativadas."
                    type="number"
                    min={0}
                    step="0.01"
                  />
                  <FormInput
                    name="shippingMinFee"
                    label="Frete mínimo"
                    description="Valor mínimo cobrado, mesmo se o cálculo for menor."
                    type="number"
                    min={0}
                    step="0.01"
                  />
                  <FormInput
                    name="shippingMaxFee"
                    label="Frete máximo"
                    description="Teto do frete. Use 0 para sem limite."
                    type="number"
                    min={0}
                    step="0.01"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    name="distanceCalculationEnabled"
                    label="Cálculo por distância"
                    description="Calcula frete com base na distância entre origem e destino."
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <Switch
                          id="distanceCalculationEnabled"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor="distanceCalculationEnabled"
                          className="font-normal"
                        >
                          {field.value ? 'Ativo' : 'Desativado'}
                        </Label>
                      </div>
                    )}
                  />
                  <FormField
                    name="distanceRangesEnabled"
                    label="Faixas de distância"
                    description="Substitui o valor por KM global por faixas configuráveis."
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <Switch
                          id="distanceRangesEnabled"
                          checked={field.value}
                          disabled={!distanceEnabled}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor="distanceRangesEnabled"
                          className="font-normal"
                        >
                          {field.value ? 'Ativo' : 'Desativado'}
                        </Label>
                      </div>
                    )}
                  />
                </div>
              </FormSection>

              <FormSection
                title="Frete grátis"
                description="Regra comercial aplicada no servidor com base no subtotal."
              >
                <FormField
                  name="freeShippingEnabled"
                  label="Ativar frete grátis"
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <Switch
                        id="freeShippingEnabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label
                        htmlFor="freeShippingEnabled"
                        className="font-normal"
                      >
                        {field.value ? 'Ativo' : 'Desativado'}
                      </Label>
                    </div>
                  )}
                />
                <FormInput
                  name="freeShippingMinValue"
                  label="Valor mínimo da compra (R$)"
                  description="Subtotal necessário para frete grátis automático."
                  type="number"
                  min={0}
                  step="0.01"
                />
              </FormSection>

              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar configurações de frete'}
              </Button>
            </Form>
          </CardContent>
        </Card>

        {distanceEnabled && rangesEnabled ? (
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Faixas de distância
              </CardTitle>
              <CardDescription>
                Configure intervalos de KM com valor por KM e taxa adicional.
                Faixas sobrepostas não são permitidas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form form={rangeForm} onSubmit={handleSaveRange}>
                <FormSection
                  title={editingRangeId ? 'Editar faixa' : 'Nova faixa'}
                  description="Distância inicial inclusiva, final exclusiva."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput
                      name="startKm"
                      label="Distância inicial (km)"
                      type="number"
                      min={0}
                      step="0.01"
                    />
                    <FormInput
                      name="endKm"
                      label="Distância final (km)"
                      type="number"
                      min={0}
                      step="0.01"
                    />
                    <FormInput
                      name="pricePerKm"
                      label="Valor por KM (R$)"
                      type="number"
                      min={0}
                      step="0.01"
                    />
                    <FormInput
                      name="additionalFee"
                      label="Taxa adicional (R$)"
                      type="number"
                      min={0}
                      step="0.01"
                    />
                  </div>
                  <FormField
                    name="enabled"
                    label="Faixa ativa"
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <Switch
                          id="rangeEnabled"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="rangeEnabled" className="font-normal">
                          {field.value ? 'Ativa' : 'Inativa'}
                        </Label>
                      </div>
                    )}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit">
                      <Plus className="mr-2 size-4" />
                      {editingRangeId ? 'Atualizar faixa' : 'Adicionar faixa'}
                    </Button>
                    {editingRangeId ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetRangeForm}
                      >
                        Cancelar edição
                      </Button>
                    ) : null}
                  </div>
                </FormSection>
              </Form>

              <div className="space-y-3">
                {config?.ranges.length ? (
                  config.ranges.map((range) => (
                    <div
                      key={range.id}
                      className="border-border flex flex-col gap-3 border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">
                          {range.startKm}–{range.endKm} km
                        </p>
                        <p className="text-muted-foreground">
                          {formatCurrency(range.pricePerKm)}/km
                          {range.additionalFee > 0
                            ? ` + ${formatCurrency(range.additionalFee)} adicional`
                            : ''}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {range.enabled ? 'Ativa' : 'Inativa'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditRange(range)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleRange(range)}
                        >
                          {range.enabled ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRange(range.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma faixa cadastrada. Adicione faixas para habilitar o
                    cálculo por distância.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Preview do cálculo
            </CardTitle>
            <CardDescription>
              Simule o frete com as configurações salvas no banco. Requer CEP de
              origem configurado em Origem dos envios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form form={previewForm} onSubmit={handlePreview}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  name="destinationCep"
                  label="CEP de destino"
                  inputMode="numeric"
                  placeholder="00000-000"
                />
                <FormInput
                  name="subtotal"
                  label="Valor da compra (R$)"
                  type="number"
                  min={0}
                  step="0.01"
                />
                <FormInput
                  name="couponCode"
                  label="Cupom (opcional)"
                  placeholder="Código do cupom"
                  className="sm:col-span-2"
                />
              </div>
              <Button type="submit" disabled={previewLoading} className="mt-4">
                <Calculator className="mr-2 size-4" />
                {previewLoading ? 'Calculando...' : 'Simular frete'}
              </Button>
            </Form>

            {previewResult ? (
              <div className="border-border bg-muted/20 space-y-2 border p-4 text-sm">
                {previewResult.destinationAddress ? (
                  <p>
                    <span className="text-muted-foreground">Endereço:</span>{' '}
                    {previewResult.destinationAddress.city}/
                    {previewResult.destinationAddress.state}
                  </p>
                ) : null}
                <p>
                  <span className="text-muted-foreground">Distância:</span>{' '}
                  {previewResult.distanceKm} km
                </p>
                {previewResult.appliedRange ? (
                  <p>
                    <span className="text-muted-foreground">Faixa:</span>{' '}
                    {previewResult.appliedRange.startKm}–
                    {previewResult.appliedRange.endKm} km (
                    {formatCurrency(previewResult.appliedRange.pricePerKm)}/km)
                  </p>
                ) : (
                  <p>
                    <span className="text-muted-foreground">Valor/KM:</span>{' '}
                    {formatCurrency(previewResult.perKmRate)}
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">Taxa base:</span>{' '}
                  {formatCurrency(previewResult.baseFee)}
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Frete calculado:
                  </span>{' '}
                  {formatCurrency(previewResult.calculatedFee)}
                </p>
                {previewResult.minFeeApplied ? (
                  <p className="text-muted-foreground">
                    Frete mínimo aplicado (
                    {formatCurrency(previewResult.minFee)})
                  </p>
                ) : null}
                {previewResult.maxFeeApplied ? (
                  <p className="text-muted-foreground">
                    Frete máximo aplicado (
                    {formatCurrency(previewResult.maxFee)})
                  </p>
                ) : null}
                {previewResult.freeShippingApplied ? (
                  <p className="text-muted-foreground">
                    Frete grátis (
                    {previewResult.freeShippingReason === 'coupon'
                      ? 'cupom'
                      : 'regra comercial'}
                    )
                  </p>
                ) : null}
                <p className="text-base font-medium">
                  Frete final: {formatCurrency(previewResult.finalFee)}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {config?.shippingOriginCep ? (
          <p className="text-muted-foreground text-xs">
            Origem atual: {formatCep(normalizeCep(config.shippingOriginCep))} —{' '}
            {config.shippingOriginCity}/{config.shippingOriginState}
          </p>
        ) : (
          <p className="text-destructive text-xs">
            Configure o endereço de origem na seção &quot;Origem dos
            envios&quot; para habilitar o cálculo de frete.
          </p>
        )}
      </div>
    );
  },
);
