'use client';

import { memo } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@presentation/components/ui';
import type { ProductDetail } from '@shared/mocks/product-detail.types';

export interface PdpDetailsTabsProps {
  product: ProductDetail;
  className?: string;
}

const PdpDetailsTabs = memo(function PdpDetailsTabs({
  product,
  className,
}: PdpDetailsTabsProps) {
  return (
    <Tabs defaultValue="description" className={className}>
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
        <TabsTrigger value="description">Descrição</TabsTrigger>
        <TabsTrigger value="specs">Especificações</TabsTrigger>
        <TabsTrigger value="sizes">Tabela de Medidas</TabsTrigger>
        <TabsTrigger value="returns">Trocas e Devoluções</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed md:text-base">
          {product.description}
        </p>
      </TabsContent>

      <TabsContent value="specs">
        <dl className="max-w-2xl divide-y">
          {product.specifications.map((spec) => (
            <div
              key={spec.label}
              className="grid grid-cols-2 gap-4 py-3 text-sm"
            >
              <dt className="text-muted-foreground">{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </TabsContent>

      <TabsContent value="sizes">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tamanho</TableHead>
              <TableHead>Tórax</TableHead>
              <TableHead>Comprimento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.sizeChart.map((row) => (
              <TableRow key={row.size}>
                <TableCell className="font-medium">{row.size}</TableCell>
                <TableCell>{row.chest}</TableCell>
                <TableCell>{row.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="returns">
        <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed md:text-base">
          {product.returnsPolicy}
        </p>
      </TabsContent>

      <TabsContent value="faq">
        <div className="max-w-3xl space-y-6">
          {product.faq.map((item) => (
            <div key={item.question}>
              <h3 className="text-sm font-medium">{item.question}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
});

export { PdpDetailsTabs };
