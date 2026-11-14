# Locadora — Gestão de aluguel de equipamentos

Sistema web interno (pt-BR) para locadora de equipamentos de construção.

**Stack:** Next.js (App Router) + TypeScript + Tailwind + Firebase (Auth, Firestore, App Hosting).

## Pré-requisitos

- Node.js 20+ (recomendado 22 LTS)
- **Java 21+** (obrigatório para o emulador do Firestore)
- Conta Firebase (para produção) ou só Emulator Suite (para desenvolvimento local)
- Firebase CLI (`npx firebase` já vem via `firebase-tools`)

## Setup local (emuladores)

1. Instale dependências:

```bash
npm install --legacy-peer-deps
```

2. Copie as variáveis de ambiente:

```bash
copy .env.example .env.local
```

No Windows PowerShell, o projeto já inclui um `.env.local` de exemplo apontando para o projeto `demo-locadora` e os emuladores.

3. Em um terminal, suba Auth + Firestore:

```bash
npm run emulators
```

UI dos emuladores: http://127.0.0.1:4000

4. Em outro terminal, rode o seed (cria ADMIN + categorias):

```powershell
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
$env:FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
$env:FIREBASE_PROJECT_ID="demo-locadora"
npm run seed
```

Ou simplesmente `npm run seed` se o `.env.local` já tiver esses valores (o script carrega `.env.local`).

5. Inicie o app:

```bash
npm run dev
```

Abra http://localhost:3000

### Credenciais do seed

| Campo | Valor |
|-------|-------|
| E-mail | `admin@locadora.com` |
| Senha | `Admin@123` |
| Perfil | ADMIN |

Para criar/atualizar só o admin:

```bash
npm run create-admin
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Next.js em desenvolvimento |
| `npm run emulators` | Auth + Firestore emuladores |
| `npm run seed` | Dados iniciais |
| `npm run create-admin` | Primeiro ADMIN |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest |

## Firebase (projeto real)

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Ative **Authentication** (e-mail/senha) e **Firestore**.
3. Gere uma service account (Project settings → Service accounts) e preencha:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (mantenha `\n` escapados)
4. Preencha as variáveis `NEXT_PUBLIC_FIREBASE_*` do app web.
5. Defina `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=false` e remova os hosts de emulador.
6. Publique regras e índices:

```bash
npx firebase deploy --only firestore:rules,firestore:indexes
```

7. Crie o primeiro admin com `npm run create-admin` (contra o projeto real).

### Segurança

- Escrita sensível (locações, estoque, financeiro) **somente via Server Actions / Admin SDK**.
- `firestore.rules` nega escrita direta do cliente nas coleções sensíveis.
- Perfis vão em **custom claims** (`perfil: ADMIN | ATENDENTE`).
- **Nunca** commite `.env*`, `serviceAccountKey*.json` ou chaves privadas.

## Deploy (Firebase App Hosting)

1. Conecte o repositório GitHub ao Firebase App Hosting.
2. Configure secrets no Firebase (não no código) conforme `apphosting.yaml`.
3. Push na branch `main` dispara o deploy.

## CI

GitHub Actions (`.github/workflows/ci.yml`) roda lint, typecheck e testes em cada PR.

## Estrutura (etapa 1)

```
src/
  app/(auth)/login
  app/(app)/dashboard | agenda | locacoes | clientes | estoque | financeiro | usuarios
  components/ui | components/layout | components/auth
  lib/firebase/client.ts | admin.ts
  lib/auth/session.ts | pricing.ts | availability.ts
  server/auth/actions.ts
scripts/create-admin.ts | seed.ts
firebase.json | firestore.rules | firestore.indexes.json
```

## Roadmap do MVP

1. **Setup, auth e layout** ← você está aqui  
2. Clientes  
3. Catálogo e estoque  
4. Locações + disponibilidade/preço  
5. Agenda  
6. Financeiro  
7. Dashboard, PDF/recibo, polimento  

## Fora do escopo

NF-e, integração bancária, assinatura digital, app nativo, QR de patrimônio, GPS, multi-filial.
