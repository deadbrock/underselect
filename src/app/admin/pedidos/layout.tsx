import { OrderLayoutNav } from '@presentation/components/admin/order';

export default function PedidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrderLayoutNav />
      {children}
    </>
  );
}
