/**
 * Páginas que leem o banco não devem ser pré-renderizadas no build
 * (Docker/CI sem DATABASE_URL). Renderização ocorre em runtime.
 */
export const dynamic = 'force-dynamic';
