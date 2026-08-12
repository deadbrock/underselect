import {
  OrderLayoutNav,
  OrderHydrator,
} from '@presentation/components/admin/order';

export default function PedidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrderHydrator />
      <OrderLayoutNav />
      {children}
    </>
  );
}
