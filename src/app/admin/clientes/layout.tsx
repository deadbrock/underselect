import { CustomerLayoutNav } from '@presentation/components/admin/customer';

export default function ClientesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomerLayoutNav />
      {children}
    </>
  );
}
