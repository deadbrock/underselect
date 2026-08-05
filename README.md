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

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Subir PostgreSQL via Docker
npm run docker:up

# Gerar Prisma Client
npm run db:generate

# Desenvolvimento
npm run dev
```

## Scripts

| Script               | Descrição                   |
| -------------------- | --------------------------- |
| `npm run dev`        | Servidor de desenvolvimento |
| `npm run build`      | Build de produção           |
| `npm run lint`       | ESLint                      |
| `npm run format`     | Prettier                    |
| `npm run typecheck`  | Verificação TypeScript      |
| `npm run db:migrate` | Migrations Prisma           |
| `npm run docker:up`  | Docker Compose (PostgreSQL) |

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
