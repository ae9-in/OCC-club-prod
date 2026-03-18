# OCC Backend

Practical Express + Prisma + PostgreSQL backend for Off Campus Clubs.

## Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL / Railway
- JWT auth
- Multer uploads
- Zod validation

## Quick start

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:deploy`
- `npm run prisma:seed`
- `npm run db:check`
