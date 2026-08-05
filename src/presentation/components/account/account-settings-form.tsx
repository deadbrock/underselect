'use client';

import { memo } from 'react';

import {
  Button,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@presentation/components/ui';
import { Form, FormSection, useAppForm } from '@presentation/components/forms';
import { toast } from '@presentation/hooks';
import {
  settingsFormSchema,
  useAccountStore,
  type SettingsFormSchema,
} from '@presentation/stores/account';

import { AccountPageHeader } from './account-page-header';

export const AccountSettingsForm = memo(function AccountSettingsForm() {
  const settings = useAccountStore((s) => s.settings);
  const updateSettings = useAccountStore((s) => s.updateSettings);

  const form = useAppForm(settingsFormSchema, {
    defaultValues: settings,
  });

  const onSubmit = form.handleSubmit((data) => {
    updateSettings(data);
    toast.success('Configurações salvas.');
  });

  return (
    <div className="max-w-2xl space-y-8">
      <AccountPageHeader
        title="Configurações"
        description="Personalize sua experiência na UNDER SELECT."
      />

      <Form form={form} onSubmit={onSubmit}>
        <FormSection title="Aparência">
          <div className="space-y-2">
            <Label htmlFor="themePreference">Tema</Label>
            <Select
              value={form.watch('themePreference')}
              onValueChange={(value) =>
                form.setValue(
                  'themePreference',
                  value as SettingsFormSchema['themePreference'],
                )
              }
            >
              <SelectTrigger id="themePreference" className="w-full sm:w-64">
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">Sistema</SelectItem>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Integração com tema global preparada para a próxima fase.
            </p>
          </div>
        </FormSection>

        <FormSection title="Notificações">
          <SettingToggle
            id="orderNotifications"
            label="Atualizações de pedidos"
            checked={form.watch('orderNotifications')}
            onChange={(v) => form.setValue('orderNotifications', v)}
          />
          <SettingToggle
            id="promoNotifications"
            label="Notificações promocionais"
            checked={form.watch('promoNotifications')}
            onChange={(v) => form.setValue('promoNotifications', v)}
          />
          <SettingToggle
            id="newsletter"
            label="Newsletter"
            checked={form.watch('newsletter')}
            onChange={(v) => form.setValue('newsletter', v)}
          />
          <SettingToggle
            id="promotionalCommunication"
            label="Comunicação promocional"
            checked={form.watch('promotionalCommunication')}
            onChange={(v) => form.setValue('promotionalCommunication', v)}
          />
        </FormSection>

        <Button type="submit" className="min-h-11 w-full sm:w-auto">
          Salvar configurações
        </Button>
      </Form>
    </div>
  );
});

function SettingToggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}
