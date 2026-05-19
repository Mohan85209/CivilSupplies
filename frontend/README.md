# Civil Supplies Frontend (Next.js 14)

Next.js 14 + Tailwind + shadcn/ui frontend for the Civil Supplies monorepo.

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local: set NEXT_PUBLIC_API_URL to the running backend (default http://localhost:8000)

npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Tech
- Next.js 14 App Router, TypeScript strict mode
- Tailwind CSS with brand palette (navy `#0F2C5C`, orange `#F58220`)
- shadcn/ui components (Button, Input, Textarea, Select, Card, Dialog, Tabs, Table, Badge, Sonner)
- react-hook-form + zod for forms
- Centralized `lib/api.ts` fetcher; types in `lib/types.ts` mirror Pydantic schemas

## Structure
```
frontend/
├── app/                  routes (App Router)
├── components/           shared layout + shadcn ui
├── lib/                  api client, types, utils
├── public/
└── tailwind.config.ts
```
