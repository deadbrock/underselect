# Underselect

E-commerce premium com arquitetura limpa (Clean Architecture) e princípios SOLID.

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Shadcn UI**
- **Prisma ORM**
- **PostgreSQL**
- **Zod**
- **React Hook Form**
- **Framer Motion**

## Arquitetura

```
src/
├── domain/           # Entidades, Value Objects, interfaces de repositório
├── application/      # Use Cases, DTOs, Ports
├── infrastructure/   # Prisma, Logger, DI, Config
├── presentation/     # Components, Providers, Hooks
├── shared/           # Utilitários e tipos compartilhados
└── app/              # Next.js App Router
```

### Regras de dependência

| Camada         | Pode depender de            |
| -------------- | --------------------------- |
| Domain         | Nada (núcleo puro)          |
| Application    | Domain                      |
| Infrastructure | Domain, Application         |
| Presentation   | Application, Shared         |
| App (Next.js)  | Todas (composição na borda) |

## Setup

### Opção A — Supabase (recomendado)

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
```

No `.env.local`, preencha com as URLs do Supabase (**Project Settings → Database**):

| Variável       | Uso no Supabase                                                              |
| -------------- | ---------------------------------------------------------------------------- |
| `DATABASE_URL` | **Transaction pooler** (porta `6543`) + `?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL`   | **Direct connection** (porta `5432`)                                         |

```bash
# Gerar Prisma Client
npm run db:generate

# Aplicar schema no banco (primeira vez ou sem migrations)
npm run db:push

# Ou usar migrations (recomendado em produção)
npm run db:migrate

# Validar conexão
npm run dev
# Acesse http://localhost:3000/api/health
```

Em produção, aplique migrations com:

```bash
npm run db:migrate:deploy
```

### Opção B — PostgreSQL local (Docker)

```bash
npm install
cp .env.example .env.local
npm run docker:up
npm run db:generate
npm run dev
```

## Scripts

| Script                      | Descrição                             |
| --------------------------- | ------------------------------------- |
| `npm run dev`               | Servidor de desenvolvimento           |
| `npm run build`             | Build de produção                     |
| `npm run lint`              | ESLint                                |
| `npm run format`            | Prettier                              |
| `npm run typecheck`         | Verificação TypeScript                |
| `npm run db:generate`       | Gera o Prisma Client                  |
| `npm run db:push`           | Sincroniza schema sem migration       |
| `npm run db:migrate`        | Cria/aplica migrations (dev)          |
| `npm run db:migrate:deploy` | Aplica migrations (produção/Supabase) |
| `npm run db:studio`         | Prisma Studio                         |
| `npm run docker:up`         | Docker Compose (PostgreSQL local)     |

## Path Aliases

| Alias               | Caminho                  |
| ------------------- | ------------------------ |
| `@/*`               | `./src/*`                |
| `@domain/*`         | `./src/domain/*`         |
| `@application/*`    | `./src/application/*`    |
| `@infrastructure/*` | `./src/infrastructure/*` |
| `@presentation/*`   | `./src/presentation/*`   |
| `@shared/*`         | `./src/shared/*`         |
| "# underselect"     |
| "# underselect"     |
