'use client';

import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { memo, useState } from 'react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@presentation/components/ui';
import { Form, useAppForm } from '@presentation/components/forms';
import { toast } from '@presentation/hooks';
import {
  addressFormSchema,
  useAccountStore,
  type AddressFormSchema,
} from '@presentation/stores/account';
import type { AccountAddress } from '@shared/types/account.types';

import { AccountAddressForm } from './account-address-form';
import { AccountPageHeader } from './account-page-header';

const emptyAddress: AddressFormSchema = {
  label: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  reference: '',
  isDefault: false,
};

function addressToForm(address: AccountAddress): AddressFormSchema {
  return {
    label: address.label,
    cep: address.cep,
    street: address.street,
    number: address.number,
    complement: address.complement ?? '',
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
    reference: address.reference ?? '',
    isDefault: address.isDefault,
  };
}

export const AccountAddressesManager = memo(function AccountAddressesManager() {
  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const updateAddress = useAccountStore((s) => s.updateAddress);
  const removeAddress = useAccountStore((s) => s.removeAddress);
  const setDefaultAddress = useAccountStore((s) => s.setDefaultAddress);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useAppForm(addressFormSchema, {
    defaultValues: emptyAddress,
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset(emptyAddress);
    setOpen(true);
  };

  const openEdit = (address: AccountAddress) => {
    setEditingId(address.id);
    form.reset(addressToForm(address));
    setOpen(true);
  };

  const onSubmit = form.handleSubmit((data) => {
    if (editingId) {
      updateAddress(editingId, data);
      toast.success('Endereço atualizado.');
    } else {
      addAddress(data);
      toast.success('Endereço adicionado.');
    }
    setOpen(false);
  });

  const handleRemove = (id: string) => {
    removeAddress(id);
    toast.success('Endereço removido.');
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    toast.success('Endereço principal atualizado.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AccountPageHeader
          title="Endereços"
          description="Gerencie seus endereços de entrega."
          className="mb-0"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" onClick={openCreate} className="shrink-0">
              <Plus className="mr-2 size-4" aria-hidden />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar endereço' : 'Novo endereço'}
              </DialogTitle>
            </DialogHeader>
            <Form form={form} onSubmit={onSubmit}>
              <AccountAddressForm />
              <DialogFooter className="gap-2 pt-4 sm:gap-0">
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2" aria-label="Endereços salvos">
        {addresses.map((address) => (
          <li key={address.id}>
            <Card className="shadow-none">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{address.label}</p>
                    {address.isDefault && (
                      <Badge variant="secondary" className="mt-1">
                        Principal
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar ${address.label}`}
                      onClick={() => openEdit(address)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Excluir ${address.label}`}
                      onClick={() => handleRemove(address.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <address className="text-muted-foreground space-y-0.5 text-sm not-italic">
                  <p>
                    {address.street}, {address.number}
                  </p>
                  {address.complement && <p>{address.complement}</p>}
                  <p>
                    {address.neighborhood} — {address.city}/{address.state}
                  </p>
                  <p>CEP {address.cep}</p>
                </address>
                {!address.isDefault && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <Star className="mr-2 size-4" aria-hidden />
                    Definir como principal
                  </Button>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
});
