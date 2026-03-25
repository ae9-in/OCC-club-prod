# OCC Frontend

Next.js app router frontend for the OCC platform.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Axios for API access

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`

## Getting started

Install dependencies and start the dev server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The frontend is prepared for Vercel deployment with:

- `vercel.json`
- production builds via `npm run build`
- CI validation in the repo-level GitHub Actions workflow

Repo-wide CI/CD notes live in [docs/cicd.md](/D:/occ%20securd%20-3/occ%20application%203/docs/cicd.md).
