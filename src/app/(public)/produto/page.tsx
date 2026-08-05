import { redirect } from 'next/navigation';
import type { Route } from 'next';

export default function ProdutoIndexPage() {
  redirect('/categoria' as Route);
}
