'use client';

import { Search } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

import {
  Form,
  FormField,
  FormInput,
  FormSection,
  useAppForm,
} from '@presentation/components/forms';
import { PageHeader } from '@presentation/components/layout';
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
import { normalizeCep } from '@presentation/stores/cart';
import { fetchCepLookup } from '@presentation/stores/shipping/shipping.api';
import {
  adminStoreSettingsSchema,
  useSettingsStore,
  type AdminStoreSettingsSchema,
} from '@presentation/stores/admin/settings';
import { ADMIN_MODULE_META } from '@shared/constants/admin.constants';

import { AdminShippingSettingsSection } from './admin-shipping-settings-section';
import { AdminPasswordForm } from './admin-password-form';

export const AdminSettingsPage = memo(function AdminSettingsPage() {
  const meta = ADMIN_MODULE_META.configuracoes;
  const settings = useSettingsStore((s) => s.settings);
  const settingsLoaded = useSettingsStore((s) => s.settingsLoaded);
  const settingsLoading = useSettingsStore((s) => s.settingsLoading);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const saveSettings = useSettingsStore((s) => s.saveSettings);
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isLookingUpOriginCep, setIsLookingUpOriginCep] = useState(false);

  const form = useAppForm<AdminStoreSettingsSchema>(adminStoreSettingsSchema, {
    defaultValues: settings,
  });

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settingsLoaded) {
      form.reset(settings);
    }
  }, [form, settings, settingsLoaded]);

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      await saveSettings({
        ...settings,
        ...values,
        contactPhone: values.contactPhone ?? '',
        shippingOriginComplement: values.shippingOriginComplement ?? '',
      });
      toast.success('Configurações salvas e publicadas na loja.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar as configurações.',
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleReset = useCallback(async () => {
    setIsResetting(true);
    try {
      await resetSettings();
      form.reset(useSettingsStore.getState().settings);
      toast.success('Configurações restauradas para os valores padrão.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível restaurar os padrões.',
      );
    } finally {
      setIsResetting(false);
    }
  }, [form, resetSettings]);

  const handleLookupOriginCep = useCallback(async () => {
    const cep = form.getValues('shippingOriginCep');
    const normalized = normalizeCep(cep);

    if (normalized.length !== 8) {
      toast.error('Informe um CEP válido com 8 dígitos.');
      return;
    }

    setIsLookingUpOriginCep(true);

    try {
      const result = await fetchCepLookup(normalized);
      form.setValue('shippingOriginCep', normalized, { shouldValidate: true });
      form.setValue('shippingOriginStreet', result.street, {
        shouldValidate: true,
      });
      form.setValue('shippingOriginNeighborhood', result.neighborhood, {
        shouldValidate: true,
      });
      form.setValue('shippingOriginCity', result.city, {
        shouldValidate: true,
      });
      form.setValue('shippingOriginState', result.state, {
        shouldValidate: true,
      });
      if (result.complement) {
        form.setValue('shippingOriginComplement', result.complement, {
          shouldValidate: true,
        });
      }
      toast.success('Endereço de origem preenchido.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'CEP não encontrado.',
      );
    } finally {
      setIsLookingUpOriginCep(false);
    }
  }, [form]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={meta.title}
        description="Ajuste os valores padrão da loja e do painel. As alterações são refletidas na loja pública."
      />

      {settingsLoading && !settingsLoaded ? (
        <p className="text-muted-foreground text-sm">
          Carregando configurações...
        </p>
      ) : null}

      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Loja</CardTitle>
            <CardDescription>
              Informações exibidas na vitrine e canais de contato.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormSection>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput name="storeName" label="Nome da loja" />
                <FormInput name="storeLocation" label="Cidade / localização" />
                <FormInput
                  name="contactEmail"
                  label="E-mail de contato"
                  type="email"
                />
                <FormInput
                  name="contactPhone"
                  label="WhatsApp / telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                />
                <FormInput
                  name="instagramUrl"
                  label="Instagram"
                  type="url"
                  placeholder="https://instagram.com/..."
                  className="sm:col-span-2"
                />
              </div>
            </FormSection>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Vendas e entrega
            </CardTitle>
            <CardDescription>
              Parcelamento, frete grátis e prazo informado ao cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormSection>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  name="maxInstallments"
                  label="Parcelas máximas sem juros"
                  type="number"
                  min={1}
                  max={12}
                />
                <FormInput
                  name="estimatedDelivery"
                  label="Prazo estimado de entrega"
                  placeholder="8 a 15 dias úteis"
                  className="sm:col-span-2"
                />
              </div>
            </FormSection>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Origem dos envios
            </CardTitle>
            <CardDescription>
              Endereço de onde os produtos são despachados. Usado no cálculo de
              frete para o cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormSection>
              <div className="flex gap-2">
                <FormInput
                  name="shippingOriginCep"
                  label="CEP de origem"
                  inputMode="numeric"
                  placeholder="00000-000"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-7 shrink-0"
                  onClick={handleLookupOriginCep}
                  disabled={isLookingUpOriginCep}
                >
                  <Search className="mr-2 size-4" aria-hidden />
                  {isLookingUpOriginCep ? 'Consultando...' : 'Consultar CEP'}
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  name="shippingOriginStreet"
                  label="Rua"
                  placeholder="Logradouro"
                  className="sm:col-span-2"
                />
                <FormInput name="shippingOriginNumber" label="Número" />
                <FormInput
                  name="shippingOriginComplement"
                  label="Complemento"
                  placeholder="Opcional"
                />
                <FormInput name="shippingOriginNeighborhood" label="Bairro" />
                <FormInput name="shippingOriginCity" label="Cidade" />
                <FormInput
                  name="shippingOriginState"
                  label="UF"
                  placeholder="PE"
                  maxLength={2}
                />
              </div>
            </FormSection>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Barra promocional
            </CardTitle>
            <CardDescription>
              Faixa de destaque no topo da loja virtual.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              name="promoBarEnabled"
              label="Exibir barra promocional"
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Switch
                    id="promoBarEnabled"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="promoBarEnabled" className="font-normal">
                    {field.value ? 'Ativa' : 'Desativada'}
                  </Label>
                </div>
              )}
            />
            <FormInput
              name="promoBarMessage"
              label="Mensagem da barra"
              placeholder="Frete grátis em compras acima de R$ 599..."
            />
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-medium">Painel</CardTitle>
            <CardDescription>
              Alertas internos e disponibilidade da loja.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              name="ordersAlertEmail"
              label="E-mail para alertas de pedidos"
              type="email"
            />
            <FormField
              name="maintenanceMode"
              label="Modo manutenção"
              description="Quando ativo, a loja fica indisponível para visitantes."
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Switch
                    id="maintenanceMode"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="maintenanceMode" className="font-normal">
                    {field.value ? 'Loja em manutenção' : 'Loja disponível'}
                  </Label>
                </div>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting || settingsLoading}>
            {isSubmitting ? 'Salvando...' : 'Salvar configurações'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isResetting || settingsLoading}
          >
            {isResetting ? 'Restaurando...' : 'Restaurar padrões'}
          </Button>
        </div>
      </Form>

      <AdminShippingSettingsSection />

      <Card className="max-w-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Segurança da conta
          </CardTitle>
          <CardDescription>
            Altere a senha de acesso ao painel administrativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
});
