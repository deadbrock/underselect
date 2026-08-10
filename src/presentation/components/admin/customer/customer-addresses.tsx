'use client';

import { Trash2 } from 'lucide-react';
import { memo, useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
} from '@presentation/components/ui';
import { useCustomerStore } from '@presentation/stores/admin/customer';
import type { AccountAddress } from '@shared/types/account.types';
import { toast } from '@presentation/hooks';

export interface CustomerAddressesProps {
  customerId: string;
  addresses: AccountAddress[];
}

export const CustomerAddresses = memo(function CustomerAddresses({
  customerId,
  addresses,
}: CustomerAddressesProps) {
  const addAddress = useCustomerStore((s) => s.addAddress);
  const removeAddress = useCustomerStore((s) => s.removeAddress);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');

  const handleAdd = () => {
    if (!label.trim()) return;
    addAddress(customerId, {
      label: label.trim(),
      cep: '01310100',
      street: 'Av. Paulista',
      number: '100',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      isDefault: addresses.length === 0,
    });
    setLabel('');
    setShowForm(false);
    toast.success('Endereço adicionado (mock).');
  };

  if (addresses.length === 0 && !showForm) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Nenhum endereço cadastrado.
        </p>
        <Button
          type="button"
          variant="outline"
          className="min-h-10"
          onClick={() => setShowForm(true)}
        >
          Adicionar endereço
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-3" aria-label="Endereços">
        {addresses.map((addr) => (
          <li key={addr.id}>
            <Card className="shadow-none">
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="text-sm">
                  <p className="font-medium">
                    {addr.label}
                    {addr.isDefault && (
                      <span className="text-muted-foreground ml-2 text-xs">
                        (Principal)
                      </span>
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {addr.street}, {addr.number}
                    {addr.complement ? ` — ${addr.complement}` : ''}
                  </p>
                  <p className="text-muted-foreground">
                    {addr.neighborhood} — {addr.city}/{addr.state}
                  </p>
                  <p className="text-muted-foreground">CEP {addr.cep}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0"
                  aria-label={`Excluir ${addr.label}`}
                  onClick={() => {
                    removeAddress(customerId, addr.id);
                    toast.info('Endereço removido (mock).');
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      {showForm ? (
        <div className="space-y-2 rounded-md border p-4">
          <Label htmlFor="addr-label">Identificação do endereço</Label>
          <Input
            id="addr-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ex.: Casa, Trabalho"
          />
          <div className="flex gap-2">
            <Button type="button" className="min-h-10" onClick={handleAdd}>
              Salvar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-10"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="min-h-10"
          onClick={() => setShowForm(true)}
        >
          Adicionar endereço
        </Button>
      )}
    </div>
  );
});
