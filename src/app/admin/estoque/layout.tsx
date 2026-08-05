import {
  StockLayoutNav,
  StockSync,
} from '@presentation/components/admin/stock';

export default function EstoqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StockSync>
      <StockLayoutNav />
      {children}
    </StockSync>
  );
}
